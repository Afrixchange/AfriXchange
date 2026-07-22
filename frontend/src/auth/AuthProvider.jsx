import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Realtime state
  const [latestTxUpdate, setLatestTxUpdate] = useState(null)
  const [latestWalletUpdate, setLatestWalletUpdate] = useState(null)
  const realtimeSubs = useRef([])

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        if (session?.user) {
          fetchProfile(session.user.id)
          subscribeRealtime(session.user.id)
        } else {
          setProfile(null)
          unsubscribeRealtime()
        }
      }
    )

    return () => {
      subscription.unsubscribe()
      unsubscribeRealtime()
    }
  }, [])

  // ─── Realtime Subscriptions ───────────────────────────────────
  function subscribeRealtime(userId) {
    // Clean up existing subscriptions
    unsubscribeRealtime()

    // Subscribe to transactions changes
    const txChannel = supabase
      .channel('public:transactions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setLatestTxUpdate(payload)
        }
      )
      .subscribe()

    // Subscribe to wallets changes
    const walletChannel = supabase
      .channel('public:wallets')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wallets',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setLatestWalletUpdate(payload)
          // Also update profile wallet info if it's a balance change
          if (payload.new && profile) {
            setProfile(prev => prev ? {
              ...prev,
              _walletUpdate: payload.new,
              _walletUpdatedAt: Date.now(),
            } : prev)
          }
        }
      )
      .subscribe()

    realtimeSubs.current = [txChannel, walletChannel]
  }

  function unsubscribeRealtime() {
    realtimeSubs.current.forEach(channel => {
      supabase.removeChannel(channel)
    })
    realtimeSubs.current = []
  }

  async function fetchProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (!error && data) {
      setProfile(data)
    }
  }

  async function signUp(email, password, fullName, phone, username) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone, username }
      }
    })

    if (!error && data.user) {
      // Create profile in the profiles table
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: fullName,
        username: username || null,
        phone,
        avatar_url: null,
        kyc_status: 'not_started',
        kyc_tier: 0
      })
    }

    return { data, error }
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setUser(null)
      setSession(null)
      setProfile(null)
    }
    return { error }
  }

  async function sendOtp(email) {
    const { data, error } = await supabase.auth.signInWithOtp({ email })
    return { data, error }
  }

  async function verifyOtp(email, token) {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email'
    })
    return { data, error }
  }

  async function resetPassword(email) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    return { data, error }
  }

  async function updateProfile(updates) {
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (error) throw error

    // Update local profile state immediately
    setProfile(prev => ({ ...prev, ...data }))
    return data
  }

  async function uploadAvatar(file) {
    if (!user) throw new Error('Not authenticated')

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}_${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('profile-photos')
      .upload(filePath, file, { upsert: true })

    if (uploadError) throw uploadError

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(filePath)

    // Update profile with avatar URL
    await updateProfile({ avatar_url: publicUrl })

    return publicUrl
  }

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    sendOtp,
    verifyOtp,
    resetPassword,
    updateProfile,
    uploadAvatar,
    refreshProfile: () => user && fetchProfile(user.id)
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}


import { createClient } from '@supabase/supabase-js'
import { AppError } from '@afrixchange/common'

/**
 * Identity & Access Module
 *
 * Wraps Supabase Auth with app-specific logic:
 * - Sign up / login
 * - Session management
 * - Profile creation/lookup
 */

export function createIdentityService(supabaseUrl, supabaseServiceKey) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  async function signUp({ email, password, phone, fullName }) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      phone,
      user_metadata: { full_name: fullName, phone },
      email_confirm: true,
    })
    if (error) throw new AppError(error.message, 400, 'AUTH_ERROR')
    return data.user
  }

  async function getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (error) throw new AppError('Profile not found', 404, 'NOT_FOUND')
    return data
  }

  async function updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    if (error) throw new AppError(error.message, 400, 'PROFILE_UPDATE_ERROR')
    return data
  }

  async function setTransactionPin(userId, pinHash) {
    return updateProfile(userId, { transaction_pin_hash: pinHash })
  }

  async function verifySession(accessToken) {
    const { data, error } = await supabase.auth.getUser(accessToken)
    if (error || !data?.user) {
      throw new AppError('Invalid or expired session', 401, 'UNAUTHORIZED')
    }
    return data.user
  }

  return {
    signUp,
    getProfile,
    updateProfile,
    setTransactionPin,
    verifySession,
  }
}


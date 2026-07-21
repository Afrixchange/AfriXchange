import { useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../auth/useAuth'

export function useKycStatus() {
  const { user, profile, refreshProfile } = useAuth()

  useEffect(() => {
    if (!user) return

    const subscription = supabase
      .channel(`profile-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`,
        },
        () => {
          refreshProfile()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user, refreshProfile])

  return {
    kycStatus: profile?.kyc_status ?? 'not_started',
    kycTier: profile?.kyc_tier ?? 0,
    isApproved: profile?.kyc_status === 'approved',
    isPending: profile?.kyc_status === 'pending',
    isRejected: profile?.kyc_status === 'rejected',
  }
}

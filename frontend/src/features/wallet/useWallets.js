import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../auth/useAuth'

export function useWallets() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['wallets', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .order('currency', { ascending: true })

      if (error) throw error

      // Ensure all 3 wallets exist
      const currencies = ['NGN', 'USD', 'USDT']
      const walletMap = {}
      data.forEach(w => { walletMap[w.currency] = w })

      return currencies.map(c => walletMap[c] || {
        currency: c,
        balance: 0,
        user_id: user.id
      })
    },
    enabled: !!user
  })
}


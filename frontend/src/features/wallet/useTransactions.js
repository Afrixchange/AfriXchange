import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../auth/useAuth'

export function useTransactions(limit = 20) {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['transactions', user?.id, limit],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    },
    enabled: !!user,
    refetchInterval: 10000 // Poll every 10s for status updates
  })
}


import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';

export function useConversionRate(from, to) {
  return useQuery({
    queryKey: ['conversion-rate', from, to],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-conversion-rate', {
        body: { from, to },
      });
      if (error) throw error;
      return data;
    },
    enabled: !!from && !!to,
    staleTime: 30_000, // 30 seconds
  });
}

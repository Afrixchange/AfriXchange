import { useMutation } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';

export function useDeposit() {
  return useMutation({
    mutationFn: async ({ amount, currency }) => {
      const { data, error } = await supabase.functions.invoke('initiate-deposit', {
        body: { amount, currency },
      });
      if (error) throw error;
      return data;
    },
  });
}

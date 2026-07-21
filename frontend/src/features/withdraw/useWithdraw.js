import { useMutation } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';

export function useWithdraw() {
  return useMutation({
    mutationFn: async ({ amount, currency, pin, bankDetails }) => {
      const { data, error } = await supabase.functions.invoke('initiate-withdrawal', {
        body: { amount, currency, pin, bank_details: bankDetails },
      });
      if (error) throw error;
      return data;
    },
  });
}

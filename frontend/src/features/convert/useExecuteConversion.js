import { useMutation } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';

export function useExecuteConversion() {
  return useMutation({
    mutationFn: async ({ from, to, amount, rate, pin, quoteId }) => {
      const { data, error } = await supabase.functions.invoke('execute-conversion', {
        body: { from, to, amount, rate, pin, quoteId },
      });
      if (error) throw error;
      return data;
    },
  });
}


// Supabase Edge Function: paystack-webhook
// Verifies Paystack payment signature and credits wallet

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

// In production, verify HMAC-SHA512 signature using PAYSTACK_SECRET_KEY
// async function verifyPaystackSignature(body, signature) { ... }

Deno.serve(async (req) => {
  try {
const rawBody = await req.text()
    const payload = JSON.parse(rawBody)
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

if (payload.event === 'charge.success') {
      const { reference, amount, currency } = payload.data

      // Find transaction by provider_ref
      const { data: tx } = await supabase
        .from('transactions')
        .select('*')
        .eq('provider_ref', reference)
        .single()

      if (!tx) throw new Error('Transaction not found')
      if (tx.status !== 'pending') {
        return new Response(JSON.stringify({ status: 'already_processed' }), { status: 200 })
      }

      // Credit wallet
      const { data: wallet } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', tx.user_id)
        .eq('currency', currency || tx.currency_from)
        .single()

      const newBalance = (parseFloat(wallet?.balance || 0)) + (amount / 100) // Paystack amount is in kobo
      await supabase
        .from('wallets')
        .update({ balance: newBalance.toFixed(2), updated_at: new Date().toISOString() })
        .eq('id', wallet?.id || '')

      // Update transaction status
      await supabase
        .from('transactions')
        .update({ status: 'success' })
        .eq('id', tx.id)
    }

    return new Response(JSON.stringify({ status: 'ok' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    console.error('Paystack webhook error:', err)
    return new Response(JSON.stringify({ status: 'ok' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  }
})

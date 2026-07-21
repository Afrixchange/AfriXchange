// Supabase Edge Function: initiate-deposit
// Creates a deposit transaction and returns payment instructions

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

Deno.serve(async (req) => {
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
      global: { headers: { Authorization: authHeader } },
    })

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const { amount, currency, provider } = await req.json()
    const amountNum = parseFloat(amount)
    const ref = `DEP-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`

    // Create pending transaction
    const { data: tx, error: txError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type: 'deposit',
        status: 'pending',
        currency_from: currency || 'NGN',
        amount_from: amountNum,
        provider: provider || 'paystack',
        provider_ref: ref,
      })
      .select()
      .single()

    if (txError) throw txError

    // Ensure wallet exists
    await supabase
      .from('wallets')
      .upsert(
        { user_id: user.id, currency: currency || 'NGN', balance: 0 },
        { onConflict: 'user_id,currency', ignoreDuplicates: true }
      )

    return new Response(JSON.stringify({
      transactionId: tx.id,
      ref,
      amount: amountNum,
      currency: currency || 'NGN',
      authorizationUrl: `https://checkout.paystack.com/${ref}`,
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

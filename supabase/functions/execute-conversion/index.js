// Supabase Edge Function: execute-conversion
// Re-validates rate, debits source wallet, credits destination wallet atomically

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

// Mock rates for validation — must match get-conversion-rate
const MOCK_RATES = {
  'NGN-USD': 0.00066,
  'USD-NGN': 1515,
  'NGN-USDT': 0.00066,
  'USDT-NGN': 1515,
  'USD-USDT': 1,
  'USDT-USD': 1,
  'NGN-KES': 0.019,
  'KES-NGN': 52.5,
}

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

    const body = await req.json()
    const { from, to, amount, rate, pin } = body

    // Verify KYC is approved
    const { data: profile } = await supabase
      .from('profiles')
      .select('kyc_status, transaction_pin_hash')
      .eq('id', user.id)
      .single()

    if (!profile || profile.kyc_status !== 'approved') {
      return new Response(JSON.stringify({
        error: 'KYC verification required. Please complete identity verification before converting.',
        kycRequired: true,
      }), { status: 403 })
    }

    // Validate rate matches expected rate for the pair
    const pair = `${from}-${to}`
    const expectedRate = MOCK_RATES[pair]
    if (!expectedRate) {
      return new Response(JSON.stringify({ error: `Unsupported pair: ${pair}` }), { status: 400 })
    }
    if (parseFloat(rate) !== expectedRate) {
      return new Response(JSON.stringify({ error: 'Rate has changed. Please fetch a new rate.' }), { status: 400 })
    }

    if (!profile?.transaction_pin_hash) {
      return new Response(JSON.stringify({ error: 'Transaction PIN not set' }), { status: 400 })
    }
    if (!pin || pin.length < 4) {
      return new Response(JSON.stringify({ error: 'Invalid PIN' }), { status: 400 })
    }

    const amountNum = parseFloat(amount)
    const convertedAmount = (amountNum * parseFloat(rate)).toFixed(2)

    // Check source wallet balance
    const { data: fromWallet } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .eq('currency', from)
      .single()

    if (!fromWallet || parseFloat(fromWallet.balance) < amountNum) {
      return new Response(JSON.stringify({ error: `Insufficient ${from} balance` }), { status: 400 })
    }

    // Create pending transaction first for compliance check
    const ref = `CNV-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`
    const { data: tx, error: txError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type: 'conversion',
        status: 'pending',
        currency_from: from,
        currency_to: to,
        amount_from: amountNum,
        amount_to: parseFloat(convertedAmount),
        rate: parseFloat(rate),
        provider_ref: ref,
      })
      .select()
      .single()

    if (txError) throw txError

    // Run compliance check before processing conversion
    const complianceCheckUrl = `${supabaseUrl}/functions/v1/compliance-check`
    const complianceResult = await fetch(complianceCheckUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({
        transaction_id: tx.id,
        user_id: user.id,
        type: 'convert',
        amount: amountNum,
      }),
    }).then(r => r.json())

    if (complianceResult.passed === false) {
      return new Response(JSON.stringify({
        transactionId: tx.id,
        ref,
        fromCurrency: from,
        toCurrency: to,
        amount: amountNum,
        held: true,
        reason: complianceResult.reason || 'Transaction flagged for compliance review',
        heldTransactionUrl: `/transaction/held/${tx.id}`,
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // Compliance passed — update transaction to success and process wallets
    await supabase
      .from('transactions')
      .update({ status: 'success' })
      .eq('id', tx.id)

    // Debit source wallet
    const newFromBalance = parseFloat(fromWallet.balance) - amountNum
    await supabase
      .from('wallets')
      .update({ balance: newFromBalance.toFixed(2), updated_at: new Date().toISOString() })
      .eq('id', fromWallet.id)

    // Credit or create destination wallet
    const { data: toWallet } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .eq('currency', to)
      .single()

    if (toWallet) {
      const newToBalance = parseFloat(toWallet.balance) + parseFloat(convertedAmount)
      await supabase
        .from('wallets')
        .update({ balance: newToBalance.toFixed(2), updated_at: new Date().toISOString() })
        .eq('id', toWallet.id)
    } else {
      await supabase
        .from('wallets')
        .insert({
          user_id: user.id,
          currency: to,
          balance: parseFloat(convertedAmount),
        })
    }

    return new Response(JSON.stringify({
      transactionId: tx.id,
      ref,
      fromCurrency: from,
      toCurrency: to,
      amount: amountNum,
      convertedAmount: parseFloat(convertedAmount),
      rate: parseFloat(rate),
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


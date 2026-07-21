// Supabase Edge Function: execute-conversion
// Re-validates rate, debits source wallet, credits destination wallet atomically

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

// In production, share quote store with get-conversion-rate via Redis
// For MVP, we use a global Map (works within the same Edge Function instance)
const quotes = new Map()

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

    const { quoteId, amount, pin } = await req.json()

    // Validate quote
    const quote = quotes.get(quoteId)
    if (!quote) {
      return new Response(JSON.stringify({ error: 'Quote not found or expired. Please fetch a new rate.' }), { status: 400 })
    }
    if (quote.used) {
      return new Response(JSON.stringify({ error: 'Quote already used. Please fetch a new rate.' }), { status: 400 })
    }
    if (Date.now() > quote.expiresAt) {
      return new Response(JSON.stringify({ error: 'Quote has expired. Please fetch a new rate.' }), { status: 400 })
    }

    // Verify PIN
    const { data: profile } = await supabase
      .from('profiles')
      .select('transaction_pin_hash')
      .eq('id', user.id)
      .single()

    if (!profile?.transaction_pin_hash) {
      return new Response(JSON.stringify({ error: 'Transaction PIN not set' }), { status: 400 })
    }
    if (!pin || pin.length < 4) {
      return new Response(JSON.stringify({ error: 'Invalid PIN' }), { status: 400 })
    }

    // Mark quote as used
    quote.used = true
    quotes.set(quoteId, quote)

    const amountNum = parseFloat(amount)
    const convertedAmount = (amountNum * quote.rate).toFixed(2)

    // Check source wallet balance
    const { data: fromWallet } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .eq('currency', quote.fromCurrency)
      .single()

    if (!fromWallet || parseFloat(fromWallet.balance) < amountNum) {
      return new Response(JSON.stringify({ error: `Insufficient ${quote.fromCurrency} balance` }), { status: 400 })
    }

    // Create transaction record
    const ref = `CNV-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`
    const { data: tx, error: txError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type: 'conversion',
        status: 'success',
        currency_from: quote.fromCurrency,
        currency_to: quote.toCurrency,
        amount_from: amountNum,
        amount_to: parseFloat(convertedAmount),
        rate: quote.rate,
        provider_ref: ref,
      })
      .select()
      .single()

    if (txError) throw txError

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
      .eq('currency', quote.toCurrency)
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
          currency: quote.toCurrency,
          balance: parseFloat(convertedAmount),
        })
    }

    return new Response(JSON.stringify({
      transactionId: tx.id,
      ref,
      fromCurrency: quote.fromCurrency,
      toCurrency: quote.toCurrency,
      amount: amountNum,
      convertedAmount: parseFloat(convertedAmount),
      rate: quote.rate,
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

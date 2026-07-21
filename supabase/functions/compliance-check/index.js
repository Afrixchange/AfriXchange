// Supabase Edge Function: compliance-check
// Runs rule checks on new transactions, flags suspicious ones

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const TIER_LIMITS = {
  0: { deposit: 0, withdraw: 0, convert: 0, daily: 0 },       // Unverified
  1: { deposit: 500000, withdraw: 300000, convert: 200000, daily: 1000000 },  // Basic
  2: { deposit: 5000000, withdraw: 3000000, convert: 2000000, daily: 10000000 }, // Verified
  3: { deposit: 50000000, withdraw: 20000000, convert: 10000000, daily: 100000000 }, // Enhanced
}

Deno.serve(async (req) => {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { transaction_id, user_id, type, amount } = await req.json()

    // Get user's KYC tier
    const { data: profile } = await supabase
      .from('profiles')
      .select('kyc_tier')
      .eq('id', user_id)
      .single()

    if (!profile) {
      return new Response(JSON.stringify({ error: 'Profile not found' }), { status: 404 })
    }

    const tier = profile.kyc_tier || 0
    const limits = TIER_LIMITS[tier] || TIER_LIMITS[0]
    const amountNum = parseFloat(amount)

    // Check per-transaction limit
    const txLimit = limits[type]
    if (txLimit === 0) {
      // Flag: tier not allowed to perform this transaction type
      await createFlag(supabase, transaction_id, `${type} not allowed for tier ${tier}`)
      return new Response(JSON.stringify({ passed: false, reason: 'Transaction type not allowed for your tier' }), { status: 200 })
    }

    if (amountNum > txLimit) {
      await createFlag(supabase, transaction_id, `Amount ${amountNum} exceeds tier ${tier} limit of ${txLimit}`)
      return new Response(JSON.stringify({ passed: false, reason: `Amount exceeds your tier limit of ${txLimit}` }), { status: 200 })
    }

    // Check daily velocity
    const today = new Date().toISOString().split('T')[0]
    const { data: todayTxs } = await supabase
      .from('transactions')
      .select('amount_from')
      .eq('user_id', user_id)
      .gte('created_at', today)
      .in('status', ['success', 'pending'])

    const dailyTotal = (todayTxs || []).reduce((sum, t) => sum + parseFloat(t.amount_from || 0), 0)

    if (dailyTotal + amountNum > limits.daily) {
      await createFlag(supabase, transaction_id, `Daily velocity limit ${limits.daily} exceeded`)
      return new Response(JSON.stringify({ passed: false, reason: `Daily transaction limit of ${limits.daily} exceeded` }), { status: 200 })
    }

    return new Response(JSON.stringify({ passed: true, tier }), {
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

async function createFlag(supabase, transactionId, reason) {
  await supabase
    .from('compliance_flags')
    .insert({ transaction_id: transactionId, reason, resolved: false })

  await supabase
    .from('transactions')
    .update({ status: 'held', held_reason: reason })
    .eq('id', transactionId)
}

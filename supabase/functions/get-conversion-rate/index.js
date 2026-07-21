// Supabase Edge Function: get-conversion-rate
// Fetches live FX rate from provider and returns a short-lived quote

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

// In-memory quote store (in production, use Redis)
const quotes = new Map()

// Mock rates — replace with external rate provider in production
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

    const { from, to } = await req.json()
    const pair = `${from}-${to}`
    const rate = MOCK_RATES[pair]

    if (!rate) {
      return new Response(JSON.stringify({ error: `Unsupported pair: ${pair}` }), { status: 400 })
    }

    // Generate quote with 60s expiry
    const quoteId = `QTE-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`
    const expiresAt = Date.now() + 60000

    quotes.set(quoteId, {
      fromCurrency: from,
      toCurrency: to,
      rate,
      expiresAt,
      used: false,
    })

    // Clean up expired quotes periodically
    setTimeout(() => quotes.delete(quoteId), 120000)

    return new Response(JSON.stringify({
      quoteId,
      fromCurrency: from,
      toCurrency: to,
      rate,
      expiresAt,
      expiresIn: 60,
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

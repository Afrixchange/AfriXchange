// Supabase Edge Function: kyc-webhook
// Receives async verification result from KYC provider (Smile Identity / Youverify)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

Deno.serve(async (req) => {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { verification_id, status, rejection_reason, tier } = await req.json()

    // Get verification record
    const { data: verification, error: fetchError } = await supabase
      .from('kyc_verifications')
      .select('*')
      .eq('id', verification_id)
      .single()

    if (fetchError) throw new Error('Verification not found')

    if (status === 'approved') {
      await supabase
        .from('kyc_verifications')
        .update({ status: 'approved', reviewed_at: new Date().toISOString() })
        .eq('id', verification_id)

      await supabase
        .from('profiles')
        .update({ kyc_status: 'approved', kyc_tier: tier || 1 })
        .eq('id', verification.user_id)
    } else {
      await supabase
        .from('kyc_verifications')
        .update({ status: 'rejected', rejection_reason, reviewed_at: new Date().toISOString() })
        .eq('id', verification_id)

      await supabase
        .from('profiles')
        .update({ kyc_status: 'rejected' })
        .eq('id', verification.user_id)
    }

    return new Response(JSON.stringify({ success: true }), {
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

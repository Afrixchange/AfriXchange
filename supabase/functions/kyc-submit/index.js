// Supabase Edge Function: kyc-submit
// Receives KYC documents, stores files, creates verification record

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

    const { nin, bvn, selfie_url, id_document_url } = await req.json()

    // Create verification record
    const { data, error } = await supabase
      .from('kyc_verifications')
      .insert({
        user_id: user.id,
        nin,
        bvn,
        selfie_url,
        id_document_url,
        status: 'pending',
      })
      .select()
      .single()

    if (error) throw error

    // Update profile status
    await supabase
      .from('profiles')
      .update({ kyc_status: 'pending' })
      .eq('id', user.id)

    return new Response(JSON.stringify(data), {
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

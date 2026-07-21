import { createClient } from '@supabase/supabase-js'
import { KYC_STATUS, KYC_TIERS, AppError } from '@afrixchange/common'

/**
 * KYC / Verification Module
 *
 * Handles KYC submission, storage uploads, status tracking,
 * and integration with verification providers.
 */

export function createKycService(supabaseUrl, supabaseServiceKey) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  async function submitKyc({ userId, nin, bvn, selfieUrl, idDocumentUrl }) {
    // Check existing verification
    const { data: existing } = await supabase
      .from('kyc_verifications')
      .select('id, status')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (existing && existing.status === 'pending') {
      throw new AppError('KYC submission already pending review', 409, 'KYC_ALREADY_PENDING')
    }

    const { data, error } = await supabase
      .from('kyc_verifications')
      .insert({
        user_id: userId,
        nin,
        bvn,
        selfie_url: selfieUrl,
        id_document_url: idDocumentUrl,
        status: 'pending',
      })
      .select()
      .single()

    if (error) throw new AppError(error.message, 400, 'KYC_SUBMIT_ERROR')

    // Update profile status
    await supabase
      .from('profiles')
      .update({ kyc_status: 'pending' })
      .eq('id', userId)

    return data
  }

  async function approveKyc(verificationId, tier = KYC_TIERS.BASIC) {
    const { data: verification, error: fetchError } = await supabase
      .from('kyc_verifications')
      .select('*')
      .eq('id', verificationId)
      .single()

    if (fetchError) throw new AppError('Verification not found', 404, 'NOT_FOUND')

    const { error: verifError } = await supabase
      .from('kyc_verifications')
      .update({
        status: 'approved',
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', verificationId)

    if (verifError) throw new AppError(verifError.message, 400, 'KYC_APPROVE_ERROR')

    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        kyc_status: 'approved',
        kyc_tier: tier,
      })
      .eq('id', verification.user_id)

    if (profileError) throw new AppError(profileError.message, 400, 'PROFILE_UPDATE_ERROR')

    return { userId: verification.user_id, tier }
  }

  async function rejectKyc(verificationId, reason) {
    const { data: verification, error: fetchError } = await supabase
      .from('kyc_verifications')
      .select('*')
      .eq('id', verificationId)
      .single()

    if (fetchError) throw new AppError('Verification not found', 404, 'NOT_FOUND')

    await supabase
      .from('kyc_verifications')
      .update({
        status: 'rejected',
        rejection_reason: reason,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', verificationId)

    await supabase
      .from('profiles')
      .update({ kyc_status: 'rejected' })
      .eq('id', verification.user_id)

    return { userId: verification.user_id }
  }

  async function getKycStatus(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('kyc_status, kyc_tier')
      .eq('id', userId)
      .single()

    if (error) throw new AppError('Profile not found', 404, 'NOT_FOUND')
    return data
  }

  return {
    submitKyc,
    approveKyc,
    rejectKyc,
    getKycStatus,
  }
}


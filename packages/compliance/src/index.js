import { createClient } from '@supabase/supabase-js'
import { KYC_TIERS, TX_STATUS, AppError } from '@afrixchange/common'

/**
 * Compliance Engine Module
 *
 * Runs rule checks on transactions and manages compliance holds.
 * Rules are configured per tier and can be updated without code changes.
 */

// Default compliance rules — configurable via admin console
const DEFAULT_RULES = {
  maxDepositPerTx: {
    [KYC_TIERS.UNVERIFIED]: 0, // Cannot deposit
    [KYC_TIERS.BASIC]: 500_000, // NGN 500K
    [KYC_TIERS.VERIFIED]: 5_000_000, // NGN 5M
    [KYC_TIERS.ENHANCED]: 50_000_000, // NGN 50M
  },
  maxWithdrawalPerTx: {
    [KYC_TIERS.UNVERIFIED]: 0,
    [KYC_TIERS.BASIC]: 300_000,
    [KYC_TIERS.VERIFIED]: 3_000_000,
    [KYC_TIERS.ENHANCED]: 20_000_000,
  },
  maxConversionPerTx: {
    [KYC_TIERS.UNVERIFIED]: 0,
    [KYC_TIERS.BASIC]: 200_000,
    [KYC_TIERS.VERIFIED]: 2_000_000,
    [KYC_TIERS.ENHANCED]: 10_000_000,
  },
  dailyVelocityLimit: {
    [KYC_TIERS.UNVERIFIED]: 0,
    [KYC_TIERS.BASIC]: 1_000_000,
    [KYC_TIERS.VERIFIED]: 10_000_000,
    [KYC_TIERS.ENHANCED]: 100_000_000,
  },
}

export function createComplianceService(supabaseUrl, supabaseServiceKey) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Rules store — in production, load from DB/admin config
  let rules = { ...DEFAULT_RULES }

  // ─── Check transaction against rules ───────────────────────────
  async function checkTransaction(userId, type, amount) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('kyc_tier')
      .eq('id', userId)
      .single()

    if (!profile) throw new AppError('Profile not found', 404, 'NOT_FOUND')

    const tier = profile.kyc_tier || KYC_TIERS.UNVERIFIED
    const amountNum = parseFloat(amount)

    // Determine threshold based on transaction type
    let threshold
    switch (type) {
      case 'deposit':
        threshold = rules.maxDepositPerTx[tier]
        break
      case 'withdraw':
        threshold = rules.maxWithdrawalPerTx[tier]
        break
      case 'conversion':
        threshold = rules.maxConversionPerTx[tier]
        break
      default:
        threshold = 0
    }

    if (amountNum > threshold) {
      return {
        passed: false,
        reason: `Amount ${amountNum} exceeds tier ${tier} limit of ${threshold}`,
        threshold,
        tier,
      }
    }

    // Check daily velocity
    const today = new Date().toISOString().split('T')[0]
    const { data: todayTxs } = await supabase
      .from('transactions')
      .select('amount_from')
      .eq('user_id', userId)
      .gte('created_at', today)
      .in('status', [TX_STATUS.SUCCESS, TX_STATUS.PENDING])

    const dailyTotal = (todayTxs || []).reduce(
      (sum, t) => sum + parseFloat(t.amount_from || 0),
      0
    )

    if (dailyTotal + amountNum > rules.dailyVelocityLimit[tier]) {
      return {
        passed: false,
        reason: `Daily velocity limit of ${rules.dailyVelocityLimit[tier]} exceeded`,
        threshold: rules.dailyVelocityLimit[tier],
        tier,
        dailyTotal,
      }
    }

    return { passed: true, tier }
  }

  // ─── Create compliance flag ────────────────────────────────────
  async function createFlag(transactionId, reason) {
    const { data, error } = await supabase
      .from('compliance_flags')
      .insert({
        transaction_id: transactionId,
        reason,
        resolved: false,
      })
      .select()
      .single()

    if (error) throw new AppError(error.message, 400, 'FLAG_CREATE_ERROR')

    // Update transaction status to held
    await supabase
      .from('transactions')
      .update({ status: TX_STATUS.HELD, held_reason: reason })
      .eq('id', transactionId)

    return data
  }

  // ─── Resolve compliance flag ───────────────────────────────────
  async function resolveFlag(flagId, resolution) {
    const { data, error } = await supabase
      .from('compliance_flags')
      .update({ resolved: true })
      .eq('id', flagId)
      .select()
      .single()

    if (error) throw new AppError(error.message, 400, 'FLAG_RESOLVE_ERROR')

    // If approved, update transaction to success
    if (resolution === 'approve') {
      await supabase
        .from('transactions')
        .update({ status: TX_STATUS.SUCCESS, held_reason: null })
        .eq('id', data.transaction_id)
    } else {
      await supabase
        .from('transactions')
        .update({ status: TX_STATUS.FAILED })
        .eq('id', data.transaction_id)
    }

    return data
  }

  // ─── Get flags for a transaction ───────────────────────────────
  async function getFlags(transactionId) {
    const { data, error } = await supabase
      .from('compliance_flags')
      .select('*')
      .eq('transaction_id', transactionId)
      .order('created_at', { ascending: false })

    if (error) throw new AppError(error.message, 400, 'FLAG_QUERY_ERROR')
    return data
  }

  // ─── Update rules (admin) ──────────────────────────────────────
  function updateRules(newRules) {
    rules = { ...rules, ...newRules }
    return rules
  }

  return {
    checkTransaction,
    createFlag,
    resolveFlag,
    getFlags,
    updateRules,
  }
}

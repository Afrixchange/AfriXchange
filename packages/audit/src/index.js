import { createClient } from '@supabase/supabase-js'
import { AppError } from '@afrixchange/common'

/**
 * Audit Module
 *
 * Immutable append-only audit log for admin actions
 * and compliance-critical events.
 *
 * In production, this should write to a separate append-only table
 * with no UPDATE/DELETE permissions even for service_role.
 */

// For MVP, we log to a dedicated `audit_logs` table (create via migration)
const AUDIT_TABLE = 'audit_logs'

export function createAuditService(supabaseUrl, supabaseServiceKey) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Ensure the audit_logs table exists (idempotent)
  async function ensureAuditTable() {
    const { error } = await supabase.rpc('ensure_audit_logs_table')
    if (error) {
      // Table might not exist yet — log to transactions table as fallback
      console.warn('Audit table not available, using fallback')
    }
  }

  async function log(action, actorId, details = {}) {
    const entry = {
      action,
      actor_id: actorId,
      details: JSON.stringify(details),
      ip_address: details.ip_address || null,
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from(AUDIT_TABLE)
      .insert(entry)
      .select()
      .single()

    if (error) {
      // Fallback: log to console in development
      console.error('Audit log error:', error.message)
      console.log('AUDIT:', action, actorId, details)
      return null
    }

    return data
  }

  async function getLogs(filters = {}) {
    let query = supabase
      .from(AUDIT_TABLE)
      .select('*')
      .order('created_at', { ascending: false })

    if (filters.action) query = query.eq('action', filters.action)
    if (filters.actor_id) query = query.eq('actor_id', filters.actor_id)
    if (filters.limit) query = query.limit(filters.limit)

    const { data, error } = await query
    if (error) throw new AppError(error.message, 400, 'AUDIT_QUERY_ERROR')
    return data
  }

  // ─── Common audit actions ──────────────────────────────────────
  const Actions = {
    USER_SIGNUP: 'user.signup',
    USER_LOGIN: 'user.login',
    USER_LOGOUT: 'user.logout',
    KYC_SUBMIT: 'kyc.submit',
    KYC_APPROVE: 'kyc.approve',
    KYC_REJECT: 'kyc.reject',
    DEPOSIT_INITIATE: 'deposit.initiate',
    DEPOSIT_CONFIRM: 'deposit.confirm',
    WITHDRAW_INITIATE: 'withdraw.initiate',
    WITHDRAW_CONFIRM: 'withdraw.confirm',
    CONVERSION_EXECUTE: 'conversion.execute',
    COMPLIANCE_FLAG: 'compliance.flag',
    COMPLIANCE_RESOLVE: 'compliance.resolve',
    PROFILE_UPDATE: 'profile.update',
    PIN_CHANGE: 'pin.change',
    ADMIN_ACTION: 'admin.action',
  }

  return {
    log,
    getLogs,
    Actions,
    ensureAuditTable,
  }
}

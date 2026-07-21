import { createClient } from '@supabase/supabase-js'
import { TX_STATUS, AppError, generateRef } from '@afrixchange/common'

/**
 * Ledger Module
 *
 * Append-only transaction ledger.
 * All money movement is recorded permanently — no updates or deletes.
 */

export function createLedgerService(supabaseUrl, supabaseServiceKey) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  async function recordTransaction({
    userId,
    type,
    currencyFrom,
    currencyTo,
    amountFrom,
    amountTo,
    rate,
    provider,
    providerRef,
    status = TX_STATUS.PENDING,
  }) {
    const ref = providerRef || generateRef(type.toUpperCase())

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        type,
        status,
        currency_from: currencyFrom,
        currency_to: currencyTo,
        amount_from: amountFrom,
        amount_to: amountTo,
        rate,
        provider,
        provider_ref: ref,
      })
      .select()
      .single()

    if (error) throw new AppError(error.message, 400, 'LEDGER_RECORD_ERROR')
    return data
  }

  async function updateTransactionStatus(transactionId, status, extra = {}) {
    const updates = { status, ...extra }

    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', transactionId)
      .select()
      .single()

    if (error) throw new AppError(error.message, 400, 'LEDGER_UPDATE_ERROR')
    return data
  }

  async function getTransactions(userId, filters = {}) {
    let query = supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (filters.type) query = query.eq('type', filters.type)
    if (filters.status) query = query.eq('status', filters.status)
    if (filters.limit) query = query.limit(filters.limit)

    const { data, error } = await query
    if (error) throw new AppError(error.message, 400, 'LEDGER_QUERY_ERROR')
    return data
  }

  async function getTransactionById(transactionId) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single()

    if (error) throw new AppError('Transaction not found', 404, 'NOT_FOUND')
    return data
  }

  return {
    recordTransaction,
    updateTransactionStatus,
    getTransactions,
    getTransactionById,
  }
}


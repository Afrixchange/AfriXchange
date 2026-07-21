import { createClient } from '@supabase/supabase-js'
import { TX_TYPES, TX_STATUS, PROVIDERS, AppError, generateRef, parseAmount } from '@afrixchange/common'
import { createLedgerService } from '@afrixchange/ledger'
import { createWalletService } from '@afrixchange/wallet'

/**
 * Payments Module
 *
 * Handles deposit and withdrawal operations via payment providers.
 * - Paystack for card/bank deposits (NGN)
 * - M-Pesa (Daraja) for KES deposits/withdrawals
 * - Bank transfers
 */

export function createPaymentService(supabaseUrl, supabaseServiceKey) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const ledger = createLedgerService(supabaseUrl, supabaseServiceKey)
  const wallet = createWalletService(supabaseUrl, supabaseServiceKey)

  // ─── Helper: verify transaction PIN ────────────────────────────
  async function verifyPin(userId, pin) {
    const { data, error } = await supabase
      .from('profiles')
      .select('transaction_pin_hash')
      .eq('id', userId)
      .single()

    if (error || !data?.transaction_pin_hash) {
      throw new AppError('Transaction PIN not set', 400, 'PIN_NOT_SET')
    }

    // In production, compare hash. For MVP we accept any 4-digit PIN.
    if (!pin || pin.length < 4) {
      throw new AppError('Invalid transaction PIN', 400, 'INVALID_PIN')
    }

    return true
  }

  // ─── Initiate Deposit ──────────────────────────────────────────
  async function initiateDeposit({ userId, amount, currency, provider }) {
    const amountNum = parseAmount(amount)
    const ref = generateRef('DEP')

    // Record pending transaction
    const tx = await ledger.recordTransaction({
      userId,
      type: TX_TYPES.DEPOSIT,
      currencyFrom: currency,
      amountFrom: amountNum,
      provider: provider || PROVIDERS.PAYSTACK,
      providerRef: ref,
      status: TX_STATUS.PENDING,
    })

    // For Paystack — return payment URL
    if (provider === PROVIDERS.PAYSTACK) {
      return {
        transactionId: tx.id,
        ref,
        authorizationUrl: `https://checkout.paystack.com/${ref}`, // Mock URL — replace with actual Paystack integration
        amount: amountNum,
        currency,
      }
    }

    // For bank transfer — return account details
    if (provider === PROVIDERS.BANK_TRANSFER) {
      return {
        transactionId: tx.id,
        ref,
        bankDetails: {
          bank: 'Access Bank',
          accountName: 'AfriXchange Ltd',
          accountNumber: '1234567890',
        },
        amount: amountNum,
        currency,
      }
    }

    throw new AppError('Unsupported payment provider', 400, 'INVALID_PROVIDER')
  }

  // ─── Confirm Deposit (called by webhook) ───────────────────────
  async function confirmDeposit(providerRef, status = TX_STATUS.SUCCESS) {
    const { data: tx, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('provider_ref', providerRef)
      .single()

    if (error) throw new AppError('Transaction not found', 404, 'NOT_FOUND')
    if (tx.status !== TX_STATUS.PENDING) return tx // Already processed

    if (status === TX_STATUS.SUCCESS) {
      await wallet.creditWallet(tx.user_id, tx.currency_from, tx.amount_from, tx.id)
    } else {
      await ledger.updateTransactionStatus(tx.id, TX_STATUS.FAILED)
    }

    return tx
  }

  // ─── Initiate Withdrawal ───────────────────────────────────────
  async function initiateWithdrawal({ userId, amount, currency, pin, bankDetails }) {
    await verifyPin(userId, pin)
    const amountNum = parseAmount(amount)

    // Record pending transaction
    const tx = await ledger.recordTransaction({
      userId,
      type: TX_TYPES.WITHDRAW,
      currencyFrom: currency,
      amountFrom: amountNum,
      provider: PROVIDERS.BANK_TRANSFER,
      status: TX_STATUS.PENDING,
    })

    // Debit wallet immediately
    await wallet.debitWallet(userId, currency, amountNum, tx.id)

    return {
      transactionId: tx.id,
      ref: tx.provider_ref,
      amount: amountNum,
      currency,
      bankDetails,
      estimatedSettlement: '1-3 business days',
    }
  }

  return {
    initiateDeposit,
    confirmDeposit,
    initiateWithdrawal,
  }
}

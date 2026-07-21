import { createClient } from '@supabase/supabase-js'
import { TX_STATUS, FIAT_CURRENCIES, AppError, formatAmount, parseAmount } from '@afrixchange/common'
import { createLedgerService } from '@afrixchange/ledger'

/**
 * Wallet Module
 *
 * Manages wallet balances per currency.
 * All balance-changing operations go through the ledger for auditability.
 */

export function createWalletService(supabaseUrl, supabaseServiceKey) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const ledger = createLedgerService(supabaseUrl, supabaseServiceKey)

  async function ensureWallet(userId, currency) {
    // Upsert — create wallet if it doesn't exist
    const { data, error } = await supabase
      .from('wallets')
      .upsert({ user_id: userId, currency, balance: 0 }, { onConflict: 'user_id,currency', ignoreDuplicates: true })
      .select()
      .single()

    if (error) throw new AppError(error.message, 400, 'WALLET_CREATE_ERROR')
    return data
  }

  async function getWallets(userId) {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)

    if (error) throw new AppError(error.message, 400, 'WALLET_QUERY_ERROR')

    // Ensure default wallets exist
    const currencies = [...FIAT_CURRENCIES, 'USDT']
    for (const currency of currencies) {
      if (!data.find((w) => w.currency === currency)) {
        data.push(await ensureWallet(userId, currency))
      }
    }

    return data
  }

  async function getWallet(userId, currency) {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .eq('currency', currency)
      .single()

    if (error) return ensureWallet(userId, currency)
    return data
  }

  async function creditWallet(userId, currency, amount, transactionId) {
    const amountNum = parseAmount(amount)
    const wallet = await getWallet(userId, currency)

    const newBalance = Number(wallet.balance) + amountNum

    const { data, error } = await supabase
      .from('wallets')
      .update({ balance: formatAmount(newBalance, currency), updated_at: new Date().toISOString() })
      .eq('id', wallet.id)
      .select()
      .single()

    if (error) throw new AppError(error.message, 400, 'WALLET_CREDIT_ERROR')

    await ledger.updateTransactionStatus(transactionId, TX_STATUS.SUCCESS)

    return data
  }

  async function debitWallet(userId, currency, amount, transactionId) {
    const amountNum = parseAmount(amount)
    const wallet = await getWallet(userId, currency)

    if (Number(wallet.balance) < amountNum) {
      throw new AppError('Insufficient balance', 400, 'INSUFFICIENT_BALANCE')
    }

    const newBalance = Number(wallet.balance) - amountNum

    const { data, error } = await supabase
      .from('wallets')
      .update({ balance: formatAmount(newBalance, currency), updated_at: new Date().toISOString() })
      .eq('id', wallet.id)
      .select()
      .single()

    if (error) throw new AppError(error.message, 400, 'WALLET_DEBIT_ERROR')

    await ledger.updateTransactionStatus(transactionId, TX_STATUS.SUCCESS)

    return data
  }

  async function transferBetweenWallets(userId, fromCurrency, toCurrency, amount, rate, transactionId) {
    const amountNum = parseAmount(amount)
    const convertedAmount = formatAmount(amountNum * rate, toCurrency)

    // Debit source wallet
    const fromWallet = await getWallet(userId, fromCurrency)
    if (Number(fromWallet.balance) < amountNum) {
      throw new AppError(`Insufficient ${fromCurrency} balance`, 400, 'INSUFFICIENT_BALANCE')
    }

    const newFromBalance = Number(fromWallet.balance) - amountNum
    await supabase
      .from('wallets')
      .update({ balance: formatAmount(newFromBalance, fromCurrency), updated_at: new Date().toISOString() })
      .eq('id', fromWallet.id)

    // Credit destination wallet
    const toWallet = await getWallet(userId, toCurrency)
    const newToBalance = Number(toWallet.balance) + parseFloat(convertedAmount)
    await supabase
      .from('wallets')
      .update({ balance: formatAmount(newToBalance, toCurrency), updated_at: new Date().toISOString() })
      .eq('id', toWallet.id)

    await ledger.updateTransactionStatus(transactionId, TX_STATUS.SUCCESS)

    return { fromWallet, toWallet, convertedAmount }
  }

  return {
    getWallets,
    getWallet,
    creditWallet,
    debitWallet,
    transferBetweenWallets,
    ensureWallet,
  }
}


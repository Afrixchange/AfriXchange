import { createClient } from '@supabase/supabase-js'
import { TX_TYPES, AppError, generateRef, parseAmount, formatAmount } from '@afrixchange/common'
import { createLedgerService } from '@afrixchange/ledger'
import { createWalletService } from '@afrixchange/wallet'

/**
 * FX Conversion Module
 *
 * Handles real-time rate quotes, quote locking with expiry,
 * and conversion execution with atomic debit/credit.
 */

// In-memory rate cache — in production, use Redis
const quoteCache = new Map()

export function createConversionService(supabaseUrl, supabaseServiceKey) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const ledger = createLedgerService(supabaseUrl, supabaseServiceKey)
  const wallet = createWalletService(supabaseUrl, supabaseServiceKey)

  // ─── Get Live Rate ─────────────────────────────────────────────
  async function getRate(fromCurrency, toCurrency) {
    // In production: fetch from a rate provider API (e.g., Binance, Fixer)
    // For MVP: return mock rates
    const mockRates = {
      'NGN-USD': 0.00066,
      'USD-NGN': 1515,
      'NGN-USDT': 0.00066,
      'USDT-NGN': 1515,
      'USD-USDT': 1,
      'USDT-USD': 1,
      'NGN-KES': 0.019,
      'KES-NGN': 52.5,
    }

    const pair = `${fromCurrency}-${toCurrency}`
    const rate = mockRates[pair]

    if (!rate) {
      throw new AppError(`Unsupported currency pair: ${pair}`, 400, 'UNSUPPORTED_PAIR')
    }

    // Generate a quote ID with expiry
    const quoteId = generateRef('QTE')
    const expiresAt = Date.now() + 60_000 // 60 second quote lock

    quoteCache.set(quoteId, {
      fromCurrency,
      toCurrency,
      rate,
      expiresAt,
      used: false,
    })

    return {
      quoteId,
      fromCurrency,
      toCurrency,
      rate,
      expiresAt,
      expiresIn: 60,
    }
  }

  // ─── Execute Conversion ────────────────────────────────────────
  async function executeConversion({ userId, quoteId, amount, pin }) {
    // Validate quote
    const quote = quoteCache.get(quoteId)
    if (!quote) {
      throw new AppError('Quote not found or expired', 400, 'INVALID_QUOTE')
    }
    if (quote.used) {
      throw new AppError('Quote already used', 400, 'QUOTE_USED')
    }
    if (Date.now() > quote.expiresAt) {
      throw new AppError('Quote has expired', 400, 'QUOTE_EXPIRED')
    }

    // Verify PIN
    const { data: profile } = await supabase
      .from('profiles')
      .select('transaction_pin_hash')
      .eq('id', userId)
      .single()

    if (!profile?.transaction_pin_hash) {
      throw new AppError('Transaction PIN not set', 400, 'PIN_NOT_SET')
    }
    if (!pin || pin.length < 4) {
      throw new AppError('Invalid transaction PIN', 400, 'INVALID_PIN')
    }

    // Mark quote as used
    quote.used = true
    quoteCache.set(quoteId, quote)

    const amountNum = parseAmount(amount)
    const convertedAmount = formatAmount(amountNum * quote.rate, quote.toCurrency)

    // Record transaction
    const tx = await ledger.recordTransaction({
      userId,
      type: TX_TYPES.CONVERSION,
      currencyFrom: quote.fromCurrency,
      currencyTo: quote.toCurrency,
      amountFrom: amountNum,
      amountTo: parseFloat(convertedAmount),
      rate: quote.rate,
      status: 'pending',
    })

    // Execute transfer
    await wallet.transferBetweenWallets(
      userId,
      quote.fromCurrency,
      quote.toCurrency,
      amountNum,
      quote.rate,
      tx.id
    )

    return {
      transactionId: tx.id,
      ref: tx.provider_ref,
      fromCurrency: quote.fromCurrency,
      toCurrency: quote.toCurrency,
      amount: amountNum,
      convertedAmount: parseFloat(convertedAmount),
      rate: quote.rate,
    }
  }

  return {
    getRate,
    executeConversion,
  }
}

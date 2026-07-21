// Shared constants, types, errors, and utilities for AfriXchange

// ─── Currency types ───────────────────────────────────────────────
export const CURRENCIES = {
  NGN: { code: 'NGN', name: 'Nigerian Naira', decimals: 2 },
  USD: { code: 'USD', name: 'US Dollar', decimals: 2 },
  USDT: { code: 'USDT', name: 'Tether', decimals: 2 },
  KES: { code: 'KES', name: 'Kenyan Shilling', decimals: 2 },
}

export const FIAT_CURRENCIES = ['NGN', 'KES', 'USD']
export const CRYPTO_CURRENCIES = ['USDT']

// ─── KYC statuses ─────────────────────────────────────────────────
export const KYC_STATUS = {
  NOT_STARTED: 'not_started',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
}

export const KYC_TIERS = {
  UNVERIFIED: 0,
  BASIC: 1,
  VERIFIED: 2,
  ENHANCED: 3,
}

// ─── Transaction types & statuses ─────────────────────────────────
export const TX_TYPES = {
  DEPOSIT: 'deposit',
  WITHDRAW: 'withdraw',
  CONVERSION: 'conversion',
}

export const TX_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  HELD: 'held',
}

// ─── Providers ─────────────────────────────────────────────────────
export const PROVIDERS = {
  PAYSTACK: 'paystack',
  BANK_TRANSFER: 'bank_transfer',
  M_PESA: 'mpesa',
}

// ─── Error types ──────────────────────────────────────────────────
export class AppError extends Error {
  constructor(message, statusCode = 400, code = 'BAD_REQUEST') {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.name = 'AppError'
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND')
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED')
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN')
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, 422, 'VALIDATION_ERROR')
  }
}

// ─── Helpers ──────────────────────────────────────────────────────
export function generateRef(prefix = 'TXN') {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${ts}${rand}`
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function maskString(str, visible = 4) {
  if (!str) return ''
  if (str.length <= visible) return str
  return '*'.repeat(str.length - visible) + str.slice(-visible)
}

export function formatAmount(amount, currency = 'NGN') {
  const curr = CURRENCIES[currency] || CURRENCIES.NGN
  return Number(amount).toFixed(curr.decimals)
}

export function parseAmount(amount) {
  const parsed = parseFloat(amount)
  if (isNaN(parsed) || parsed <= 0) {
    throw new ValidationError('Invalid amount')
  }
  return parsed
}


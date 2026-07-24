import express from 'express'
import path from 'path'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { createIdentityService } from '@afrixchange/identity'
import { createKycService } from '@afrixchange/kyc'
import { createWalletService } from '@afrixchange/wallet'
import { createLedgerService } from '@afrixchange/ledger'
import { createPaymentService } from '@afrixchange/payments'
import { createConversionService } from '@afrixchange/fx-conversion'
import { createAuditService } from '@afrixchange/audit'

// ─── Config ─────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT || '3001', 10)
const SUPABASE_URL = process.env.SUPABASE_URL || 'http://localhost:54321'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'service-role-key'

// ─── Resolve frontend build path ─────────────────────────────────
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const frontendDist = path.resolve(__dirname, '../../../frontend/dist')

// ─── Initialize services ────────────────────────────────────────
const identityService = createIdentityService(SUPABASE_URL, SUPABASE_SERVICE_KEY)
const kycService = createKycService(SUPABASE_URL, SUPABASE_SERVICE_KEY)
const walletService = createWalletService(SUPABASE_URL, SUPABASE_SERVICE_KEY)
const ledgerService = createLedgerService(SUPABASE_URL, SUPABASE_SERVICE_KEY)
const paymentService = createPaymentService(SUPABASE_URL, SUPABASE_SERVICE_KEY)
const conversionService = createConversionService(SUPABASE_URL, SUPABASE_SERVICE_KEY)
const auditService = createAuditService(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// ─── Express app ────────────────────────────────────────────────
const app = express()
app.use(cors())
app.use(express.json())

// Serve frontend static files (built Vite output)
app.use(express.static(frontendDist))

// ─── Auth middleware ─────────────────────────────────────────────
async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization token' })
  }

  try {
    const token = authHeader.split(' ')[1]
    const user = await identityService.verifySession(token)
    req.user = user
    next()
  } catch (err) {
    res.status(401).json({ error: err.message || 'Invalid token' })
  }
}

// ─── KYC check middleware ────────────────────────────────────────
async function requireKyc(req, res, next) {
  try {
    const profile = await identityService.getProfile(req.user.id)
    if (!profile || profile.kyc_status !== 'approved') {
      return res.status(403).json({
        error: 'KYC verification required. Please complete identity verification first.',
        kycStatus: profile?.kyc_status || 'not_started',
      })
    }
    next()
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to verify KYC status' })
  }
}

// ─── KYC Routes ─────────────────────────────────────────────────
app.post('/api/kyc/submit', authenticate, async (req, res) => {
  try {
    const result = await kycService.submitKyc({
      userId: req.user.id,
      ...req.body,
    })
    await auditService.log(auditService.Actions.KYC_SUBMIT, req.user.id, { verificationId: result.id })
    res.json(result)
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
})

app.get('/api/kyc/status', authenticate, async (req, res) => {
  try {
    const status = await kycService.getKycStatus(req.user.id)
    res.json(status)
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
})

// ─── Wallet Routes ──────────────────────────────────────────────
app.get('/api/wallets', authenticate, async (req, res) => {
  try {
    const wallets = await walletService.getWallets(req.user.id)
    res.json(wallets)
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
})

app.get('/api/wallets/:currency', authenticate, async (req, res) => {
  try {
    const wallet = await walletService.getWallet(req.user.id, req.params.currency.toUpperCase())
    res.json(wallet)
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
})

// ─── Transaction Routes ─────────────────────────────────────────
app.get('/api/transactions', authenticate, async (req, res) => {
  try {
    const { type, status, limit } = req.query
    const txs = await ledgerService.getTransactions(req.user.id, { type, status, limit: limit ? parseInt(limit) : undefined })
    res.json(txs)
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
})

app.get('/api/transactions/:id', authenticate, async (req, res) => {
  try {
    const tx = await ledgerService.getTransactionById(req.params.id)
    if (tx.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    res.json(tx)
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
})

// ─── Deposit Routes ─────────────────────────────────────────────
app.post('/api/deposit/initiate', authenticate, requireKyc, async (req, res) => {
  try {
    const { amount, currency, provider } = req.body
    const result = await paymentService.initiateDeposit({
      userId: req.user.id,
      amount,
      currency,
      provider,
    })
    await auditService.log(auditService.Actions.DEPOSIT_INITIATE, req.user.id, { transactionId: result.transactionId })
    res.json(result)
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
})

app.post('/api/deposit/webhook', async (req, res) => {
  // Paystack/M-Pesa webhook endpoint — no auth (verify signature in production)
  try {
    const { event, data } = req.body
    if (event === 'charge.success') {
      await paymentService.confirmDeposit(data.reference, 'success')
    }
    res.status(200).send('OK')
  } catch (err) {
    console.error('Webhook error:', err)
    res.status(200).send('OK') // Always return 200 to provider
  }
})

// ─── Withdrawal Routes ──────────────────────────────────────────
app.post('/api/withdraw/initiate', authenticate, requireKyc, async (req, res) => {
  try {
    const { amount, currency, pin, bankDetails } = req.body
    const result = await paymentService.initiateWithdrawal({
      userId: req.user.id,
      amount,
      currency,
      pin,
      bankDetails,
    })
    await auditService.log(auditService.Actions.WITHDRAW_INITIATE, req.user.id, { transactionId: result.transactionId })
    res.json(result)
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
})

// ─── Conversion Routes ──────────────────────────────────────────
app.post('/api/conversion/rate', authenticate, requireKyc, async (req, res) => {
  try {
    const { from, to } = req.body
    const rate = await conversionService.getRate(from.toUpperCase(), to.toUpperCase())
    res.json(rate)
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
})

app.post('/api/conversion/execute', authenticate, requireKyc, async (req, res) => {
  try {
    const { quoteId, amount, pin } = req.body
    const result = await conversionService.executeConversion({
      userId: req.user.id,
      quoteId,
      amount,
      pin,
    })
    await auditService.log(auditService.Actions.CONVERSION_EXECUTE, req.user.id, { transactionId: result.transactionId })
    res.json(result)
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
})

// ─── Profile Routes ─────────────────────────────────────────────
app.get('/api/profile', authenticate, async (req, res) => {
  try {
    const profile = await identityService.getProfile(req.user.id)
    res.json(profile)
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
})

app.put('/api/profile', authenticate, async (req, res) => {
  try {
    const profile = await identityService.updateProfile(req.user.id, req.body)
    await auditService.log(auditService.Actions.PROFILE_UPDATE, req.user.id)
    res.json(profile)
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
})

// ─── Health Check ───────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0', timestamp: new Date().toISOString() })
})

// ─── SPA fallback — serve index.html for any non-API route ──────
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'))
})

// ─── Start server ───────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`AfriXchange API server running on http://localhost:${PORT}`)
  console.log(`Supabase URL: ${SUPABASE_URL}`)
})


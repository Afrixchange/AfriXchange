import { createClient } from '@supabase/supabase-js'
import { AppError } from '@afrixchange/common'

/**
 * Notification Service
 *
 * Abstraction for sending push, SMS, and email notifications.
 * MVP implementation logs to the database and console.
 * In production, integrate with a provider like SendGrid, Twilio, or Firebase.
 */

export function createNotificationService(supabaseUrl, supabaseServiceKey) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // ─── Send email notification ───────────────────────────────────
  async function sendEmail({ to, subject, body }) {
    // MVP: Log to console
    console.log(`[EMAIL] To: ${to}, Subject: ${subject}`)

    // In production, integrate with SendGrid / AWS SES / Resend
    // For now, log to a notifications table for auditability
    try {
      await supabase.from('notifications').insert({
        user_id: null,
        type: 'email',
        channel: 'email',
        title: subject,
        body,
        status: 'sent',
      })
    } catch (e) {
      console.warn('Failed to log notification:', e.message)
    }

    return { sent: true, channel: 'email' }
  }

  // ─── Send SMS notification ─────────────────────────────────────
  async function sendSms({ to, message }) {
    console.log(`[SMS] To: ${to}, Message: ${message.substring(0, 50)}...`)

    // In production, integrate with Twilio / Africa's Talking
    return { sent: true, channel: 'sms' }
  }

// ─── Push notification ─────────────────────────────────────────
  async function sendPush({ userId, title, body: pushBody }) {
    console.log(`[PUSH] User: ${userId}, Title: ${title}, Body: ${pushBody}`)

    // In production, integrate with Firebase Cloud Messaging
    return { sent: true, channel: 'push' }
  }

  // ─── Template notifications ────────────────────────────────────
  const Templates = {
    KYC_SUBMITTED: async (user) => ({
      email: { to: user.email, subject: 'KYC Submitted', body: 'Your documents are being reviewed.' },
      sms: { to: user.phone, message: 'KYC received. We\'ll notify you once verified.' },
    }),
    KYC_APPROVED: async (user) => ({
      email: { to: user.email, subject: 'KYC Approved', body: 'Your identity has been verified. You can now transact.' },
      push: { userId: user.id, title: 'KYC Approved', body: 'Start trading now!' },
    }),
    KYC_REJECTED: async (user, reason) => ({
      email: { to: user.email, subject: 'KYC Rejected', body: `Reason: ${reason}. Please resubmit.` },
    }),
    DEPOSIT_CONFIRMED: async (user, amount, currency) => ({
      email: { to: user.email, subject: 'Deposit Confirmed', body: `${amount} ${currency} added to your wallet.` },
      push: { userId: user.id, title: 'Deposit Received', body: `${amount} ${currency} credited.` },
    }),
    WITHDRAWAL_PROCESSED: async (user, amount, currency) => ({
      email: { to: user.email, subject: 'Withdrawal Processed', body: `${amount} ${currency} sent to your bank.` },
    }),
    TRANSACTION_HELD: async (user, reason) => ({
      email: { to: user.email, subject: 'Transaction Held', body: `Your transaction has been held: ${reason}` },
      push: { userId: user.id, title: 'Transaction Held', body: 'Pending review.' },
    }),
  }

  async function sendTemplate(templateName, user, context = {}) {
    const templateFn = Templates[templateName]
    if (!templateFn) {
      throw new AppError(`Unknown notification template: ${templateName}`, 400, 'INVALID_TEMPLATE')
    }

    const messages = await templateFn(user, context)

    const results = []
    for (const [channel, message] of Object.entries(messages)) {
      if (channel === 'email') results.push(await sendEmail(message))
      if (channel === 'sms') results.push(await sendSms(message))
      if (channel === 'push') results.push(await sendPush(message))
    }

    return results
  }

  return {
    sendEmail,
    sendSms,
    sendPush,
    sendTemplate,
    Templates,
  }
}

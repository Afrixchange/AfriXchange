# AfriXchange

**Engineering analysis companion:** AfriXchange Engineering Analysis & Technical Design Companion (July 2026)

AfriXchange is a regulated crypto brokerage targeting Kenya, built around a single fiat on/off-ramp corridor (KES via **M-Pesa (Daraja)** and **bank transfer**, with Airtel Money optional) and Kenya-only regulatory scope.

This README is written for a business audience: it explains what we’re building, why compliance is central, and what the MVP includes vs. what is explicitly out of scope.

---

## What we are building (MVP)

A mobile-first product where users can:

- **Create an account** (email and/or phone) and secure access with **2-factor login**.
- **Verify identity (KYC)** using national ID + KRA PIN + document capture and liveness/selfie checks.
- **Hold wallet balances** only after verification is complete.
- **Move value** via fiat rails (deposit/withdraw via M-Pesa and bank transfer).
- **Convert / trade** using a controlled, auditable conversion engine.
- Experience **transparent compliance holds** when transactions cross configurable thresholds.

Business users (Compliance Officers/Admins/Support Agents) use an **admin console** to review edge cases, manage settings, and generate regulatory reports.

---

## Why compliance is not optional in the product

In AfriXchange, compliance is part of the transaction workflow—not an after-the-fact reporting layer.

Key compliance concepts in the MVP:

- **Verification gate:** wallets cannot be activated before KYC is complete.
- **Transaction thresholds:** transactions above a configured threshold can be **held** pending review.
- **Asset listing approvals:** only approved assets are available for trading/conversion.
- **Immutable audit trail:** admin decisions and key actions are recorded in an append-only audit log.

---

## Core system modules (business explanation)

### 1) Identity & Access

- Signup + secure login
- Account lockout after repeated failed attempts
- Two-factor authentication (SMS OTP and/or authenticator-based TOTP)

### 2) KYC / Verification

- Capture national ID + KRA PIN + ID photos and a liveness selfie
- Automated document-to-selfie matching via a KYC vendor
- Manual review queue for borderline/failed matches
- Tier assignment (e.g., Basic / Verified / Enhanced) with transaction limits

### 3) Wallet & Custody (funds management)

- Wallet balances and transaction history
- Performance-friendly balance reads backed by an append-only ledger
- Custody model is an important regulatory/security design decision (MVP defaults to a custodial approach, pending required sign-off)

### 4) Conversion Engine (rates, quotes, and records)

- Real-time KES conversion quotes
- Quote locking with an expiry window
- Fees calculated based on user tier and quote context
- Permanent conversion records for auditing

### 5) Payments (Fiat rails)

- **M-Pesa (Daraja)** STK Push deposits/withdrawal flows
- Banking partner rails
- **Reconciliation** runs daily to match provider settlements with internal ledger records

### 6) Compliance Engine

- Holds transactions above configurable thresholds
- Applies rules to assets and transactions
- Produces regulator-facing reporting based on the same data users transact with

### 7) Admin & Ops Console

- Compliance Officers review KYC and held transactions
- Support Agents perform limited user lookups and case escalation
- Admins manage settings, asset approvals, and report generation
- Append-only audit logging for immutable admin actions

---

## Key user flows (how it works)

### New user onboarding

1. User signs up and creates an account.
2. User submits KYC documents and a selfie.
3. System verifies automatically or routes to manual review.
4. After approval, the user’s wallet becomes available.

### Deposit via M-Pesa

1. User selects deposit and confirms a linked payment method.
2. System initiates an STK Push prompt.
3. After callback confirmation, the system credits the wallet.
4. If a compliance threshold is crossed, funds may be placed in a **held** state.

### Convert to KES

1. User requests a quote.
2. System returns a locked quote and fee details.
3. User confirms within the quote window.
4. System executes conversion and records it permanently.

### Resolve compliance holds

1. A transaction triggers a compliance rule.
2. Compliance Engine creates a hold.
3. Compliance Officer reviews in the admin console and decides: approve/reject/escalate.
4. Decisions are recorded in the immutable audit log.

---

## MVP non-functional goals (business impact)

- **Speed:** target responses in under 2 seconds (95% of the time)
- **Reliability:** 99.5% uptime (excluding planned maintenance)
- **Security:** encryption in transit and at rest; secure handling of keys and PII
- **Scalability:** designed for ~10x traffic headroom without major rebuild
- **Accessibility:** mobile-friendly UX and baseline accessibility practices

---

## Explicit out-of-scope items (what we are not building in this MVP)

The MVP excludes (among others):

- Lending/borrowing (margin, credit lines, crypto lending)
- Multi-country expansion and non-KES/cross-currency scope
- Staking and stablecoin issuance
- Business accounts (KYB) beyond the Kenya retail scope

---

## Glossary (quick reference)

- **KYC:** identity verification required before financial services
- **Daraja / M-Pesa:** Safaricom integration for mobile money rails
- **Ledger:** append-only record of transactions used as source of truth
- **Compliance hold:** funds state pending review when rules require it
- **Audit log:** immutable record of admin actions and decisions

---

## Proposed System Architecture (high-level)

Below is the proposed architecture for the AfriXchange Kenya MVP, using a **modular-monolith first** approach (clear module boundaries, fewer operational risks during early compliance + integrations).

### Architecture style: modular-monolith first

- **Why:** tighter transactional integrity for ledger + compliance holds, simpler operations for a regulated MVP, and faster compliance-correct iteration.
- **How:** modules are separated by **packages/schemas** with clear interfaces—so later extraction into microservices remains possible without redesign.

### Modules and responsibilities

| Module | Owns | Key responsibilities |
|---|---|---|
| Identity & Access | Auth, sessions, MFA, lockout | Signup/login, 2FA, account lockout, password reset |
| KYC / Verification | KYC capture + vendor matching | Document capture, automated selfie-ID match, manual review routing, tiering |
| Wallet & Custody | Wallet balances + history | Wallet creation gate (post-verification), balances (available/held), custody ops |
| Conversion Engine | FX quotes + execution | Live rate sourcing, quote locking, fee calculation, conversion records |
| Payments (Fiat Rails) | Deposits/withdrawals | M-Pesa (Daraja) STK Push, bank rails, reconciliation |
| Compliance Engine | Rules + holds + reporting | Threshold-based holds, asset listing approval, regulator reporting data |
| Admin & Ops Console | Human workflows | KYC review cases, held-transaction decisions, settings, report generation |
| Notification Service | User comms | Account + transaction events (push/SMS/email) |

### “Various files” (recommended repo layout)

Suggested top-level structure so each module can evolve with minimal coupling:

```text
afrixchange/
  apps/
    web-admin/                # Admin console (Compliance Officer / Support Agent)
    mobile/                   # Mobile app (iOS/Android)
    api/                      # Backend API (modular-monolith host)
  packages/
    identity/                # Auth, MFA, sessions
    kyc/                      # KYC submissions + vendor integration + review queue
    wallet/                   # Wallet lifecycle + custody abstractions
    ledger/                   # Append-only ledger domain
    fx-conversion/            # Quotes, fees, conversions
    payments/                 # M-Pesa + banking providers + reconciliation
    compliance/               # Threshold rules, compliance holds, reporting exports
    audit/                    # Immutable audit log domain
    notifications/            # Event-driven notifications
    common/                   # shared utilities, error types, config
  infrastructure/
    db-migrations/
    terraform/                # region-parameterized deployment
    docker/
  scripts/
    reconciliation/           # daily reconciliation job runner
    report-export/           # regulator report generation job
    data-retention/          # retention/anonymization jobs
  docs/
    architecture/
    security/
    compliance/
```

### Cross-cutting data design (what makes the system “regulator-correct”)

- **Ledger is append-only** (no UPDATE/DELETE for ledger entries).
- **Compliance holds** move funds between wallet states (**available** → **held**) but preserve full history.
- **Admin audit log is append-only** and immutable.

---

## Reference

This README is built from the **AfriXchange Engineering Analysis & Technical Design Companion** (July 2026) and reflects engineering design decisions aligned to the Kenya MVP scope and compliance requirements.



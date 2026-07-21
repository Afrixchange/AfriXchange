import { createBrowserRouter, Navigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import Welcome from '../pages/Welcome'
import SignUp from '../pages/SignUp'
import Login from '../pages/Login'
import OtpVerify from '../pages/OtpVerify'
import ForgotPassword from '../pages/ForgotPassword'
import Home from '../pages/Home'
import WalletDetail from '../pages/WalletDetail'
import TransactionHistory from '../pages/TransactionHistory'
import Deposit from '../pages/Deposit'
import DepositReceipt from '../pages/DepositReceipt'
import Withdraw from '../pages/Withdraw'
import WithdrawReceipt from '../pages/WithdrawReceipt'
import Convert from '../pages/Convert'
import ConvertSummary from '../pages/ConvertSummary'
import ConvertReceipt from '../pages/ConvertReceipt'
import TransactionHeld from '../pages/TransactionHeld'
import KycStart from '../pages/kyc/KycStart'
import IdCapture from '../pages/kyc/IdCapture'
import SelfieCapture from '../pages/kyc/SelfieCapture'
import VerificationPending from '../pages/kyc/VerificationPending'
import VerificationRejected from '../pages/kyc/VerificationRejected'
import Profile from '../pages/Profile'
import Help from '../pages/Help'

function ProtectedRoute({ children, requireKyc = false }) {
  const { session, profile } = useAuth()

  if (!session) {
    return <Navigate to="/login" replace />
  }

  // Redirect to KYC if not approved (and route requires it)
  if (requireKyc && profile && profile.kyc_status !== 'approved') {
    if (profile.kyc_status === 'not_started') return <Navigate to="/kyc/start" replace />
    if (profile.kyc_status === 'pending') return <Navigate to="/kyc/pending" replace />
    if (profile.kyc_status === 'rejected') return <Navigate to="/kyc/rejected" replace />
  }

  return children
}

function GuestRoute({ children }) {
  const { session } = useAuth()

  if (session) {
    return <Navigate to="/home" replace />
  }

  return children
}

export { ProtectedRoute, GuestRoute }

export const router = createBrowserRouter([
  // Public / Guest routes
  {
    path: '/',
    element: <GuestRoute><Welcome /></GuestRoute>
  },
  {
    path: '/signup',
    element: <GuestRoute><SignUp /></GuestRoute>
  },
  {
    path: '/login',
    element: <GuestRoute><Login /></GuestRoute>
  },
  {
    path: '/verify-otp',
    element: <GuestRoute><OtpVerify /></GuestRoute>
  },
  {
    path: '/forgot-password',
    element: <GuestRoute><ForgotPassword /></GuestRoute>
  },
  {
    path: '/reset-password',
    element: <GuestRoute><ForgotPassword /></GuestRoute>
  },

  // KYC routes (auth required, but KYC not yet approved)
  {
    path: '/kyc/start',
    element: <ProtectedRoute><KycStart /></ProtectedRoute>
  },
  {
    path: '/kyc/id-capture',
    element: <ProtectedRoute><IdCapture /></ProtectedRoute>
  },
  {
    path: '/kyc/selfie-capture',
    element: <ProtectedRoute><SelfieCapture /></ProtectedRoute>
  },
  {
    path: '/kyc/pending',
    element: <ProtectedRoute><VerificationPending /></ProtectedRoute>
  },
  {
    path: '/kyc/rejected',
    element: <ProtectedRoute><VerificationRejected /></ProtectedRoute>
  },

  // Protected routes (auth + KYC approved)
  {
    path: '/home',
    element: <ProtectedRoute requireKyc><Home /></ProtectedRoute>
  },
  {
    path: '/wallet/:currency',
    element: <ProtectedRoute requireKyc><WalletDetail /></ProtectedRoute>
  },
  {
    path: '/transactions',
    element: <ProtectedRoute requireKyc><TransactionHistory /></ProtectedRoute>
  },
  {
    path: '/deposit',
    element: <ProtectedRoute requireKyc><Deposit /></ProtectedRoute>
  },
  {
    path: '/deposit/receipt/:id',
    element: <ProtectedRoute requireKyc><DepositReceipt /></ProtectedRoute>
  },
  {
    path: '/withdraw',
    element: <ProtectedRoute requireKyc><Withdraw /></ProtectedRoute>
  },
  {
    path: '/withdraw/receipt/:id',
    element: <ProtectedRoute requireKyc><WithdrawReceipt /></ProtectedRoute>
  },
  {
    path: '/convert',
    element: <ProtectedRoute requireKyc><Convert /></ProtectedRoute>
  },
  {
    path: '/convert/summary',
    element: <ProtectedRoute requireKyc><ConvertSummary /></ProtectedRoute>
  },
  {
    path: '/convert/receipt/:id',
    element: <ProtectedRoute requireKyc><ConvertReceipt /></ProtectedRoute>
  },
  {
    path: '/transaction/held/:id',
    element: <ProtectedRoute requireKyc><TransactionHeld /></ProtectedRoute>
  },
  {
    path: '/profile',
    element: <ProtectedRoute><Profile /></ProtectedRoute>
  },
  {
    path: '/help',
    element: <Help />
  }
])


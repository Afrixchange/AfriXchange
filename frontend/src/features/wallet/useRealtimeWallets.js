import { useEffect, useRef, useCallback, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

/**
 * useRealtimeWallets
 *
 * Subscribes to realtime UPDATE (and optionally INSERT) on the wallets table
 * for a given user. Calls the `onChange` callback whenever a wallet balance changes.
 *
 * @param {string} userId - The authenticated user's UUID
 * @param {function} onChange - Callback receiving (payload) where payload.new is the updated wallet
 * @returns {object} { unsubscribe }
 */
export function useRealtimeWallets(userId, onChange) {
  const subscriptionRef = useRef(null)

  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel('public:wallets')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'wallets',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (onChange) {
            onChange(payload)
          }
        }
      )
      .subscribe()

    subscriptionRef.current = channel

    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current)
        subscriptionRef.current = null
      }
    }
  }, [userId, onChange])
}

/**
 * useRealtimeBalance
 *
 * A simpler hook that tracks the latest wallet balance update for a specific currency.
 *
 * @param {string} userId - The authenticated user's UUID
 * @param {string} currency - Optional currency filter (e.g. 'NGN', 'USD')
 * @returns {object} { walletUpdate, lastEvent }
 */
export function useRealtimeBalance(userId, currency) {
  const [walletUpdate, setWalletUpdate] = useState(null)
  const [lastEvent, setLastEvent] = useState(null)

  const handleChange = useCallback((payload) => {
    if (currency && payload.new?.currency !== currency) return
    setWalletUpdate(payload.new)
    setLastEvent(payload.eventType)
  }, [currency])

  useRealtimeWallets(userId, handleChange)

  return { walletUpdate, lastEvent }
}


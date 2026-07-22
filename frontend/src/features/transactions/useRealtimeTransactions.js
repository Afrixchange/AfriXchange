import { useEffect, useRef, useCallback, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

/**
 * useRealtimeTransactions
 *
 * Subscribes to realtime INSERT/UPDATE/DELETE on the transactions table
 * for a given user. Calls the `onChange` callback whenever a change occurs.
 *
 * @param {string} userId - The authenticated user's UUID
 * @param {function} onChange - Callback receiving (payload) where payload.new is the new/updated row
 * @returns {object} { unsubscribe }
 */
export function useRealtimeTransactions(userId, onChange) {
  const subscriptionRef = useRef(null)

  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel('public:transactions')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'transactions',
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
 * useRealtimeTransactionStatus
 *
 * A simpler hook that just tracks the latest transaction status update.
 * Useful for receipt pages that need to know when a pending tx goes to success/failed.
 *
 * @param {string} userId - The authenticated user's UUID
 * @param {string} transactionId - Optional specific transaction ID to track
 * @returns {object} { latestUpdate, lastEvent }
 */
export function useRealtimeTransactionStatus(userId, transactionId) {
  const [latestUpdate, setLatestUpdate] = useState(null)
  const [lastEvent, setLastEvent] = useState(null)

  const handleChange = useCallback((payload) => {
    if (transactionId && payload.new?.id !== transactionId) return
    setLatestUpdate(payload.new)
    setLastEvent(payload.eventType)
  }, [transactionId])

  useRealtimeTransactions(userId, handleChange)

  return { latestUpdate, lastEvent }
}




import { useState, useCallback } from "react"
import { useDispatch } from "react-redux"
import { nanoid } from "@reduxjs/toolkit"

interface OptimisticAction<T> {
  type: string
  payload: T
}

export function useOptimisticUpdates<T>() {
  const dispatch = useDispatch()
  const [pendingActions, setPendingActions] = useState<Record<string, any>>({})

  const performOptimisticUpdate = useCallback(
    async (
      optimisticAction: OptimisticAction<T>,
      apiCall: () => Promise<any>,
      successAction?: (result: any) => OptimisticAction<any>,
      rollbackAction?: OptimisticAction<any>,
    ) => {
      const actionId = nanoid()

      // Dispatch optimistic action
      dispatch(optimisticAction)

      // Track pending action
      setPendingActions((prev) => ({
        ...prev,
        [actionId]: { optimisticAction, rollbackAction },
      }))

      try {
        // Perform actual API call
        const result = await apiCall()

        // Dispatch success action if provided
        if (successAction) {
          dispatch(successAction(result))
        }

        // Remove from pending actions
        setPendingActions((prev) => {
          const newPending = { ...prev }
          delete newPending[actionId]
          return newPending
        })

        return result
      } catch (error) {
        // If API call fails, rollback the optimistic update
        if (rollbackAction) {
          dispatch(rollbackAction)
        }

        // Remove from pending actions
        setPendingActions((prev) => {
          const newPending = { ...prev }
          delete newPending[actionId]
          return newPending
        })

        throw error
      }
    },
    [dispatch],
  )

  return { performOptimisticUpdate, pendingActions }
}

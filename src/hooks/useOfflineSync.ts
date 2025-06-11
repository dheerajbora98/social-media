

import { useState, useEffect, useCallback } from "react"
import NetInfo from "@react-native-community/netinfo"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useDispatch } from "react-redux"
import { setOfflineStatus } from "../store/slices/uiSlice"

interface PendingAction {
  id: string
  type: string
  payload: any
  apiCall: () => Promise<any>
  timestamp: number
}

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(true)
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([])
  const dispatch = useDispatch()

  // Monitor network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = state.isConnected !== null ? state.isConnected : false
      setIsOnline(online)
      dispatch(setOfflineStatus(!online))
    })

    // Load pending actions from storage
    const loadPendingActions = async () => {
      try {
        const storedActions = await AsyncStorage.getItem("pendingActions")
        if (storedActions) {
          setPendingActions(JSON.parse(storedActions))
        }
      } catch (error) {
        console.error("Failed to load pending actions:", error)
      }
    }

    loadPendingActions()

    return () => {
      unsubscribe()
    }
  }, [dispatch])

  // Save pending actions to storage whenever they change
  useEffect(() => {
    const savePendingActions = async () => {
      try {
        await AsyncStorage.setItem("pendingActions", JSON.stringify(pendingActions))
      } catch (error) {
        console.error("Failed to save pending actions:", error)
      }
    }

    savePendingActions()
  }, [pendingActions])

  // Add a new action to the queue
  const queueAction = useCallback((action: Omit<PendingAction, "timestamp">) => {
    const newAction = {
      ...action,
      timestamp: Date.now(),
    }

    setPendingActions((prev) => [...prev, newAction])
    return newAction.id
  }, [])

  // Process pending actions when online
  useEffect(() => {
    if (isOnline && pendingActions.length > 0) {
      const processPendingActions = async () => {
        const actionsToProcess = [...pendingActions]

        for (const action of actionsToProcess) {
          try {
            await action.apiCall()
            setPendingActions((prev) => prev.filter((a) => a.id !== action.id))
          } catch (error) {
            console.error(`Failed to process action ${action.id}:`, error)
            // Keep the action in the queue to retry later
          }
        }
      }

      processPendingActions()
    }
  }, [isOnline, pendingActions])

  // Remove an action from the queue
  const removeAction = useCallback((id: string) => {
    setPendingActions((prev) => prev.filter((action) => action.id !== id))
  }, [])

  return {
    isOnline,
    pendingActions,
    queueAction,
    removeAction,
  }
}

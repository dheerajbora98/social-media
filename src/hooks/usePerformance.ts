

import { useRef, useEffect, useCallback } from "react"
import { InteractionManager } from "react-native"

interface PerformanceMetrics {
  renderTime: number
  interactionTime: number
  memoryUsage: number | null
}

export function usePerformance(componentName: string) {
  const startTime = useRef(Date.now())
  const metrics = useRef<PerformanceMetrics>({
    renderTime: 0,
    interactionTime: 0,
    memoryUsage: null,
  })

  // Measure initial render time
  useEffect(() => {
    const endTime = Date.now()
    metrics.current.renderTime = endTime - startTime.current

    // Measure time until interactions are complete
    const interactionPromise = InteractionManager.runAfterInteractions(() => {
      metrics.current.interactionTime = Date.now() - startTime.current

      // Log performance metrics
      console.log(`[Performance] ${componentName}:`, {
        renderTime: `${metrics.current.renderTime}ms`,
        interactionTime: `${metrics.current.interactionTime}ms`,
        memoryUsage: metrics.current.memoryUsage ? `${Math.round(metrics.current.memoryUsage / 1024 / 1024)}MB` : "N/A",
      })
    })

    return () => {
      interactionPromise.cancel()
    }
  }, [componentName])

  // Measure memory usage if available
  useEffect(() => {
    if (global.performance && global.performance.memory) {
      metrics.current.memoryUsage = global.performance.memory.usedJSHeapSize
    }
  }, [])

  // Function to manually measure a specific operation
  const measureOperation = useCallback(
    (operationName: string, operation: () => void) => {
      const start = Date.now()
      operation()
      const duration = Date.now() - start

      console.log(`[Performance] ${componentName} - ${operationName}: ${duration}ms`)
      return duration
    },
    [componentName],
  )

  // Function to measure an async operation
  const measureAsyncOperation = useCallback(
    async (operationName: string, operation: () => Promise<any>) => {
      const start = Date.now()
      const result = await operation()
      const duration = Date.now() - start

      console.log(`[Performance] ${componentName} - ${operationName}: ${duration}ms`)
      return { result, duration }
    },
    [componentName],
  )

  return {
    metrics: metrics.current,
    measureOperation,
    measureAsyncOperation,
  }
}

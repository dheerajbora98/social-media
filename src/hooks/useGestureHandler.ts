

import { useRef } from "react"
import { Animated, PanResponder, type GestureResponderEvent, type PanResponderGestureState } from "react-native"
import * as Haptics from "expo-haptics"

type GestureDirection = "left" | "right" | "up" | "down"

interface GestureHandlerOptions {
  onSwipe?: (direction: GestureDirection) => void
  onLongPress?: () => void
  onPinch?: (scale: number) => void
  swipeThreshold?: number
  longPressDelay?: number
  enableHaptics?: boolean
}

export function useGestureHandler({
  onSwipe,
  onLongPress,
  onPinch,
  swipeThreshold = 50,
  longPressDelay = 500,
  enableHaptics = true,
}: GestureHandlerOptions = {}) {
  const pan = useRef(new Animated.ValueXY()).current
  const scale = useRef(new Animated.Value(1)).current
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null)
  const initialDistance = useRef<number | null>(null)

  const triggerHapticFeedback = () => {
    if (enableHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
  }

  const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e: GestureResponderEvent) => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        })
        pan.setValue({ x: 0, y: 0 })

        // Set up long press timer
        if (onLongPress) {
          longPressTimeout.current = setTimeout(() => {
            onLongPress()
            triggerHapticFeedback()
          }, longPressDelay)
        }

        // Reset initial distance for pinch
        initialDistance.current = null
      },
      onPanResponderMove: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        // Clear long press timeout on move
        if (longPressTimeout.current) {
          clearTimeout(longPressTimeout.current)
          longPressTimeout.current = null
        }

        // Handle pan gesture
        Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false })(e, gestureState)

        // Handle pinch gesture if we have multiple touches
        if (onPinch && e.nativeEvent.touches.length >= 2) {
          const touch1 = e.nativeEvent.touches[0]
          const touch2 = e.nativeEvent.touches[1]

          const currentDistance = getDistance(touch1.pageX, touch1.pageY, touch2.pageX, touch2.pageY)

          if (initialDistance.current === null) {
            initialDistance.current = currentDistance
          } else {
            const newScale = currentDistance / initialDistance.current
            scale.setValue(newScale)
            onPinch(newScale)
          }
        }
      },
      onPanResponderRelease: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        // Clear long press timeout
        if (longPressTimeout.current) {
          clearTimeout(longPressTimeout.current)
          longPressTimeout.current = null
        }

        // Handle swipe gestures
        if (onSwipe) {
          const { dx, dy } = gestureState

          if (Math.abs(dx) > swipeThreshold) {
            const direction = dx > 0 ? "right" : "left"
            onSwipe(direction)
            triggerHapticFeedback()
          } else if (Math.abs(dy) > swipeThreshold) {
            const direction = dy > 0 ? "down" : "up"
            onSwipe(direction)
            triggerHapticFeedback()
          }
        }

        // Reset pan and scale
        pan.flattenOffset()
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start()

        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: false,
        }).start()
      },
    }),
  ).current

  return {
    pan,
    scale,
    panResponder,
  }
}

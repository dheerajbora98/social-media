

import type React from "react"
import { useEffect } from "react"
import { Animated, type ViewStyle } from "react-native"
import { useAnimatedValue } from "../../hooks/useAnimatedValue"

interface PulseViewProps {
  children: React.ReactNode
  duration?: number
  minScale?: number
  maxScale?: number
  style?: ViewStyle
}

export const PulseView: React.FC<PulseViewProps> = ({
  children,
  duration = 1000,
  minScale = 0.95,
  maxScale = 1.05,
  style,
}) => {
  const pulseAnim = useAnimatedValue(minScale)

  useEffect(() => {
    const pulse = () => {
      pulseAnim.animate({ toValue: maxScale, duration: duration / 2 }).start(() => {
        pulseAnim.animate({ toValue: minScale, duration: duration / 2 }).start(pulse)
      })
    }
    pulse()
  }, [pulseAnim, duration, minScale, maxScale])

  return <Animated.View style={[{ transform: [{ scale: pulseAnim.value }] }, style]}>{children}</Animated.View>
}

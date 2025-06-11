

import type React from "react"
import { useEffect } from "react"
import { Animated, type ViewStyle } from "react-native"
import { useAnimatedValue } from "../../hooks/useAnimatedValue"

interface ScaleInViewProps {
  children: React.ReactNode
  duration?: number
  delay?: number
  initialScale?: number
  style?: ViewStyle
}

export const ScaleInView: React.FC<ScaleInViewProps> = ({
  children,
  duration = 500,
  delay = 0,
  initialScale = 0,
  style,
}) => {
  const scaleAnim = useAnimatedValue(initialScale)

  useEffect(() => {
    scaleAnim.animate({ toValue: 1, duration, delay }).start()
  }, [scaleAnim, duration, delay])

  return <Animated.View style={[{ transform: [{ scale: scaleAnim.value }] }, style]}>{children}</Animated.View>
}

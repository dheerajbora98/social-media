

import type React from "react"
import { useEffect } from "react"
import { Animated, type ViewStyle } from "react-native"
import { useAnimatedValue } from "../../hooks/useAnimatedValue"

interface FadeInViewProps {
  children: React.ReactNode
  duration?: number
  delay?: number
  style?: ViewStyle
}

export const FadeInView: React.FC<FadeInViewProps> = ({ children, duration = 500, delay = 0, style }) => {
  const fadeAnim = useAnimatedValue(0)

  useEffect(() => {
    fadeAnim.animate({ toValue: 1, duration, delay }).start()
  }, [fadeAnim, duration, delay])

  return <Animated.View style={[{ opacity: fadeAnim.value }, style]}>{children}</Animated.View>
}

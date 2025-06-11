

import type React from "react"
import { useEffect } from "react"
import { Animated, type ViewStyle } from "react-native"
import { useAnimatedValue } from "../../hooks/useAnimatedValue"

interface SlideInViewProps {
  children: React.ReactNode
  direction?: "left" | "right" | "up" | "down"
  duration?: number
  delay?: number
  distance?: number
  style?: ViewStyle
}

export const SlideInView: React.FC<SlideInViewProps> = ({
  children,
  direction = "up",
  duration = 500,
  delay = 0,
  distance = 50,
  style,
}) => {
  const slideAnim = useAnimatedValue(distance)

  useEffect(() => {
    slideAnim.animate({ toValue: 0, duration, delay }).start()
  }, [slideAnim, duration, delay])

  const getTransform = () => {
    switch (direction) {
      case "left":
        return [{ translateX: slideAnim.value }]
      case "right":
        return [{ translateX: slideAnim.value.interpolate({ inputRange: [0, distance], outputRange: [0, -distance] }) }]
      case "up":
        return [{ translateY: slideAnim.value }]
      case "down":
        return [{ translateY: slideAnim.value.interpolate({ inputRange: [0, distance], outputRange: [0, -distance] }) }]
      default:
        return [{ translateY: slideAnim.value }]
    }
  }

  return <Animated.View style={[{ transform: getTransform() }, style]}>{children}</Animated.View>
}

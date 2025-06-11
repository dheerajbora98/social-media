

import { useRef } from "react"
import { Animated, Easing } from "react-native"

interface AnimationConfig {
  toValue: number
  duration?: number
  easing?: (value: number) => number
  delay?: number
  useNativeDriver?: boolean
}

export function useAnimatedValue(initialValue = 0) {
  const animatedValue = useRef(new Animated.Value(initialValue)).current

  const animate = (config: AnimationConfig) => {
    return Animated.timing(animatedValue, {
      toValue: config.toValue,
      duration: config.duration || 300,
      easing: config.easing || Easing.ease,
      delay: config.delay || 0,
      useNativeDriver: config.useNativeDriver !== undefined ? config.useNativeDriver : true,
    })
  }

  const spring = (config: AnimationConfig & { friction?: number; tension?: number }) => {
    return Animated.spring(animatedValue, {
      toValue: config.toValue,
      friction: config.friction || 7,
      tension: config.tension || 40,
      useNativeDriver: config.useNativeDriver !== undefined ? config.useNativeDriver : true,
    })
  }

  const sequence = (animations: Animated.CompositeAnimation[]) => {
    return Animated.sequence(animations)
  }

  const parallel = (animations: Animated.CompositeAnimation[]) => {
    return Animated.parallel(animations)
  }

  const loop = (animation: Animated.CompositeAnimation, config?: Animated.LoopAnimationConfig) => {
    return Animated.loop(animation, config)
  }

  const interpolate = (config: Animated.InterpolationConfigType) => {
    return animatedValue.interpolate(config)
  }

  const reset = () => {
    animatedValue.setValue(initialValue)
  }

  return {
    value: animatedValue,
    animate,
    spring,
    sequence,
    parallel,
    loop,
    interpolate,
    reset,
  }
}

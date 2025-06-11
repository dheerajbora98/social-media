

import type React from "react"
import { useState } from "react"
import { View, Modal, TouchableOpacity, StyleSheet, Dimensions, PanResponder, Animated } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../context/ThemeContext"

const { width, height } = Dimensions.get("window")

interface ImageViewerProps {
  images: string[]
  initialIndex?: number
  visible: boolean
  onClose: () => void
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ images, initialIndex = 0, visible, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [scale] = useState(new Animated.Value(1))
  const [translateX] = useState(new Animated.Value(0))
  const [translateY] = useState(new Animated.Value(0))
  const { theme } = useTheme()

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      scale.setOffset(scale._value)
      translateX.setOffset(translateX._value)
      translateY.setOffset(translateY._value)
    },
    onPanResponderMove: (evt, gestureState) => {
      if (evt.nativeEvent.touches.length === 2) {
        // Pinch to zoom
        const touch1 = evt.nativeEvent.touches[0]
        const touch2 = evt.nativeEvent.touches[1]
        const distance = Math.sqrt(Math.pow(touch2.pageX - touch1.pageX, 2) + Math.pow(touch2.pageY - touch1.pageY, 2))
        // Implement zoom logic here
      } else {
        // Pan
        Animated.event([null, { dx: translateX, dy: translateY }], { useNativeDriver: false })(evt, gestureState)
      }
    },
    onPanResponderRelease: () => {
      scale.flattenOffset()
      translateX.flattenOffset()
      translateY.flattenOffset()

      // Reset if zoomed out too much
      if (scale._value < 1) {
        Animated.spring(scale, { toValue: 1, useNativeDriver: false }).start()
      }

      // Reset position if panned too far
      Animated.spring(translateX, { toValue: 0, useNativeDriver: false }).start()
      Animated.spring(translateY, { toValue: 0, useNativeDriver: false }).start()
    },
  })

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const styles = StyleSheet.create({
    modal: {
      flex: 1,
      backgroundColor: "black",
    },
    header: {
      position: "absolute",
      top: 50,
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: theme.spacing.l,
      zIndex: 1,
    },
    closeButton: {
      padding: theme.spacing.s,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      borderRadius: 20,
    },
    counter: {
      color: "white",
      fontSize: theme.typography.fontSize.m,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.s,
      borderRadius: theme.borderRadius.m,
    },
    imageContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      width: width,
      height: height,
    },
    navigationContainer: {
      position: "absolute",
      bottom: 50,
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.l,
    },
    navButton: {
      padding: theme.spacing.m,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      borderRadius: 25,
    },
    disabledButton: {
      opacity: 0.3,
    },
  })

  return (
    <Modal visible={visible} animationType="fade" statusBarHidden>
      <View style={styles.modal}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.counter}>
            {currentIndex + 1} / {images.length}
          </Text>
        </View>

        <View style={styles.imageContainer} {...panResponder.panHandlers}>
          <Animated.Image
            source={{ uri: images[currentIndex] }}
            style={[
              styles.image,
              {
                transform: [{ scale }, { translateX }, { translateY }],
              },
            ]}
            resizeMode="contain"
          />
        </View>

        {images.length > 1 && (
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              style={[styles.navButton, currentIndex === 0 && styles.disabledButton]}
              onPress={handlePrevious}
              disabled={currentIndex === 0}
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navButton, currentIndex === images.length - 1 && styles.disabledButton]}
              onPress={handleNext}
              disabled={currentIndex === images.length - 1}
            >
              <Ionicons name="chevron-forward" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  )
}

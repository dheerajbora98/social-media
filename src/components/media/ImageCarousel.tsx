

import type React from "react"
import { useState } from "react"
import { View, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native"
import { useTheme } from "../../context/ThemeContext"

const { width } = Dimensions.get("window")

interface ImageCarouselProps {
  images: string[]
  height?: number
  onImagePress?: (index: number) => void
  showIndicators?: boolean
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  height = 200,
  onImagePress,
  showIndicators = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { theme } = useTheme()

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x
    const index = Math.round(contentOffset / width)
    setCurrentIndex(index)
  }

  const styles = StyleSheet.create({
    container: {
      height,
    },
    scrollView: {
      height,
    },
    imageContainer: {
      width,
      height,
    },
    image: {
      width: "100%",
      height: "100%",
    },
    indicatorContainer: {
      position: "absolute",
      bottom: theme.spacing.m,
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    indicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      marginHorizontal: 4,
    },
    activeIndicator: {
      backgroundColor: "white",
      width: 20,
    },
  })

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {images.map((image, index) => (
          <TouchableOpacity
            key={index}
            style={styles.imageContainer}
            onPress={() => onImagePress?.(index)}
            activeOpacity={0.9}
          >
            <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {showIndicators && images.length > 1 && (
        <View style={styles.indicatorContainer}>
          {images.map((_, index) => (
            <View key={index} style={[styles.indicator, index === currentIndex && styles.activeIndicator]} />
          ))}
        </View>
      )}
    </View>
  )
}

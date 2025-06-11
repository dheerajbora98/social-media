

import { useState, useRef } from "react"
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Animated, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../context/ThemeContext"
import { useAnimatedValue } from "../../hooks/useAnimatedValue"

const { width, height } = Dimensions.get("window")

const onboardingData = [
  {
    id: 1,
    title: "Connect with Friends",
    subtitle: "Stay connected with your friends and family through our social platform",
    image: "/placeholder.svg?height=300&width=300",
    color: "#5E60CE",
  },
  {
    id: 2,
    title: "Share Your Moments",
    subtitle: "Share your favorite moments and memories with beautiful posts and stories",
    image: "/placeholder.svg?height=300&width=300",
    color: "#7400B8",
  },
  {
    id: 3,
    title: "Discover Content",
    subtitle: "Explore trending content and discover new interests tailored just for you",
    image: "/placeholder.svg?height=300&width=300",
    color: "#9D4EDD",
  },
]

const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const navigation = useNavigation<any>()
  const { theme } = useTheme()
  const scrollX = useRef(new Animated.Value(0)).current
  const flatListRef = useRef<any>(null)

  const fadeAnim = useAnimatedValue(0)
  const slideAnim = useAnimatedValue(50)

  // Animate in on mount
  useState(() => {
    fadeAnim.animate({ toValue: 1, duration: 1000 }).start()
    slideAnim.animate({ toValue: 0, duration: 1000 }).start()
  })

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true })
    } else {
      navigation.navigate("Login")
    }
  }

  const handleSkip = () => {
    navigation.navigate("Login")
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1
      setCurrentIndex(prevIndex)
      flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true })
    }
  }

  const renderOnboardingItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <View style={[styles.slide, { backgroundColor: item.color }]}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
      </View>
    )
  }

  const renderPagination = () => {
    return (
      <View style={styles.pagination}>
        {onboardingData.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width]
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 20, 8],
            extrapolate: "clamp",
          })
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          })

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                },
              ]}
            />
          )
        })}
      </View>
    )
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    slide: {
      width,
      height,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: theme.spacing.xl,
    },
    imageContainer: {
      flex: 0.6,
      alignItems: "center",
      justifyContent: "center",
    },
    image: {
      width: 300,
      height: 300,
    },
    textContainer: {
      flex: 0.4,
      alignItems: "center",
      paddingHorizontal: theme.spacing.l,
    },
    title: {
      fontSize: theme.typography.fontSize.xxl,
      fontWeight: "bold",
      color: "#FFFFFF",
      textAlign: "center",
      marginBottom: theme.spacing.m,
    },
    subtitle: {
      fontSize: theme.typography.fontSize.m,
      color: "#FFFFFF",
      textAlign: "center",
      opacity: 0.8,
      lineHeight: 24,
    },
    bottomContainer: {
      position: "absolute",
      bottom: 50,
      left: 0,
      right: 0,
      paddingHorizontal: theme.spacing.xl,
    },
    pagination: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.xl,
    },
    dot: {
      height: 8,
      borderRadius: 4,
      backgroundColor: "#FFFFFF",
      marginHorizontal: 4,
    },
    navigationContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    skipButton: {
      padding: theme.spacing.m,
    },
    skipText: {
      color: "#FFFFFF",
      fontSize: theme.typography.fontSize.m,
      opacity: 0.7,
    },
    navigationButtons: {
      flexDirection: "row",
      alignItems: "center",
    },
    navButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      alignItems: "center",
      justifyContent: "center",
      marginLeft: theme.spacing.m,
    },
    nextButton: {
      backgroundColor: "#FFFFFF",
    },
  })

  return (
    <SafeAreaView style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderOnboardingItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width)
          setCurrentIndex(index)
        }}
        style={{ opacity: fadeAnim.value }}
      />

      <Animated.View style={[styles.bottomContainer, { transform: [{ translateY: slideAnim.value }] }]}>
        {renderPagination()}
        <View style={styles.navigationContainer}>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>

          <View style={styles.navigationButtons}>
            {currentIndex > 0 && (
              <TouchableOpacity style={styles.navButton} onPress={handlePrevious}>
                <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[styles.navButton, styles.nextButton]} onPress={handleNext}>
              <Ionicons
                name={currentIndex === onboardingData.length - 1 ? "checkmark" : "chevron-forward"}
                size={24}
                color={onboardingData[currentIndex].color}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  )
}

export default OnboardingScreen

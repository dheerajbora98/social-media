

import type React from "react"

import { ScrollView, TouchableOpacity, Text, StyleSheet, Animated } from "react-native"
import { useTheme } from "../../context/ThemeContext"
import { useAnimatedValue } from "../../hooks/useAnimatedValue"

interface FilterTab {
  key: string
  label: string
}

interface FilterTabsProps {
  filters: FilterTab[]
  currentFilter: string
  onFilterChange: (filter: string) => void
}

export const FilterTabs: React.FC<FilterTabsProps> = ({ filters, currentFilter, onFilterChange }) => {
  const { theme } = useTheme()
  const slideAnim = useAnimatedValue(0)

  const handleFilterPress = (filter: string) => {
    onFilterChange(filter)
    slideAnim.animate({ toValue: 1, duration: 200 }).start(() => {
      slideAnim.animate({ toValue: 0, duration: 200 }).start()
    })
  }

  const styles = StyleSheet.create({
    container: {
      paddingVertical: theme.spacing.m,
    },
    tab: {
      paddingHorizontal: theme.spacing.l,
      paddingVertical: theme.spacing.s,
      marginRight: theme.spacing.m,
      borderRadius: theme.borderRadius.l,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    activeTab: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    tabText: {
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.text,
      fontWeight: "500",
    },
    activeTabText: {
      color: "#FFFFFF",
      fontWeight: "600",
    },
  })

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={{ paddingRight: theme.spacing.l }}
    >
      {filters.map((filter) => (
        <Animated.View
          key={filter.key}
          style={{
            transform: [
              {
                scale: slideAnim.value.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.95],
                }),
              },
            ],
          }}
        >
          <TouchableOpacity
            style={[styles.tab, currentFilter === filter.key && styles.activeTab]}
            onPress={() => handleFilterPress(filter.key)}
          >
            <Text style={[styles.tabText, currentFilter === filter.key && styles.activeTabText]}>{filter.label}</Text>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </ScrollView>
  )
}



import { useState } from "react"

import type React from "react"

import { View, StyleSheet, Animated } from "react-native"
import { useTheme } from "../../context/ThemeContext"
import { useAnimatedValue } from "../../hooks/useAnimatedValue"

interface SkeletonLoaderProps {
  type: "post" | "user" | "comment"
  count?: number
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type, count = 1 }) => {
  const { theme } = useTheme()
  const pulseAnim = useAnimatedValue(0.3)

  useState(() => {
    const pulse = () => {
      pulseAnim.animate({ toValue: 1, duration: 1000 }).start(() => {
        pulseAnim.animate({ toValue: 0.3, duration: 1000 }).start(pulse)
      })
    }
    pulse()
  })

  const renderPostSkeleton = () => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Animated.View style={[styles.avatar, { opacity: pulseAnim.value }]} />
        <View style={styles.userInfo}>
          <Animated.View style={[styles.nameLine, { opacity: pulseAnim.value }]} />
          <Animated.View style={[styles.handleLine, { opacity: pulseAnim.value }]} />
        </View>
      </View>
      <Animated.View style={[styles.titleLine, { opacity: pulseAnim.value }]} />
      <Animated.View style={[styles.bodyLine1, { opacity: pulseAnim.value }]} />
      <Animated.View style={[styles.bodyLine2, { opacity: pulseAnim.value }]} />
      <View style={styles.actions}>
        <Animated.View style={[styles.actionButton, { opacity: pulseAnim.value }]} />
        <Animated.View style={[styles.actionButton, { opacity: pulseAnim.value }]} />
        <Animated.View style={[styles.actionButton, { opacity: pulseAnim.value }]} />
      </View>
    </View>
  )

  const renderUserSkeleton = () => (
    <View style={styles.userContainer}>
      <Animated.View style={[styles.avatar, { opacity: pulseAnim.value }]} />
      <View style={styles.userInfo}>
        <Animated.View style={[styles.nameLine, { opacity: pulseAnim.value }]} />
        <Animated.View style={[styles.handleLine, { opacity: pulseAnim.value }]} />
      </View>
    </View>
  )

  const renderCommentSkeleton = () => (
    <View style={styles.commentContainer}>
      <Animated.View style={[styles.smallAvatar, { opacity: pulseAnim.value }]} />
      <View style={styles.commentContent}>
        <Animated.View style={[styles.commentLine1, { opacity: pulseAnim.value }]} />
        <Animated.View style={[styles.commentLine2, { opacity: pulseAnim.value }]} />
      </View>
    </View>
  )

  const renderSkeleton = () => {
    switch (type) {
      case "post":
        return renderPostSkeleton()
      case "user":
        return renderUserSkeleton()
      case "comment":
        return renderCommentSkeleton()
      default:
        return renderPostSkeleton()
    }
  }

  const styles = StyleSheet.create({
    postContainer: {
      backgroundColor: theme.colors.card,
      marginHorizontal: theme.spacing.m,
      marginVertical: theme.spacing.s,
      borderRadius: theme.borderRadius.l,
      padding: theme.spacing.m,
    },
    postHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.m,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.border,
      marginRight: theme.spacing.m,
    },
    smallAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.border,
      marginRight: theme.spacing.m,
    },
    userInfo: {
      flex: 1,
    },
    nameLine: {
      height: 16,
      backgroundColor: theme.colors.border,
      borderRadius: 8,
      marginBottom: theme.spacing.xs,
      width: "60%",
    },
    handleLine: {
      height: 12,
      backgroundColor: theme.colors.border,
      borderRadius: 6,
      width: "40%",
    },
    titleLine: {
      height: 18,
      backgroundColor: theme.colors.border,
      borderRadius: 9,
      marginBottom: theme.spacing.s,
      width: "80%",
    },
    bodyLine1: {
      height: 14,
      backgroundColor: theme.colors.border,
      borderRadius: 7,
      marginBottom: theme.spacing.xs,
      width: "100%",
    },
    bodyLine2: {
      height: 14,
      backgroundColor: theme.colors.border,
      borderRadius: 7,
      marginBottom: theme.spacing.m,
      width: "70%",
    },
    actions: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingTop: theme.spacing.m,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    actionButton: {
      height: 20,
      width: 60,
      backgroundColor: theme.colors.border,
      borderRadius: 10,
    },
    userContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: theme.spacing.m,
      backgroundColor: theme.colors.card,
      marginHorizontal: theme.spacing.m,
      marginVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.m,
    },
    commentContainer: {
      flexDirection: "row",
      padding: theme.spacing.m,
      backgroundColor: theme.colors.card,
      marginVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.m,
    },
    commentContent: {
      flex: 1,
    },
    commentLine1: {
      height: 12,
      backgroundColor: theme.colors.border,
      borderRadius: 6,
      marginBottom: theme.spacing.xs,
      width: "90%",
    },
    commentLine2: {
      height: 12,
      backgroundColor: theme.colors.border,
      borderRadius: 6,
      width: "60%",
    },
  })

  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <View key={index}>{renderSkeleton()}</View>
      ))}
    </>
  )
}

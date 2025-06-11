

import type React from "react"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../context/ThemeContext"
import { useAnimatedValue } from "../../hooks/useAnimatedValue"
import { useGestureHandler } from "../../hooks/useGestureHandler"
import * as Haptics from "expo-haptics"

interface PostCardProps {
  post: {
    id: number
    userId: number
    title: string
    body: string
    user?: {
      name: string
      username: string
      avatar?: string
    }
    likes?: number
    comments?: number
    isLiked?: boolean
    createdAt?: string
  }
  onLike: () => void
  onComment: () => void
  onShare: () => void
  onUserPress: () => void
}

export const PostCard: React.FC<PostCardProps> = ({ post, onLike, onComment, onShare, onUserPress }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked || false)
  const [likesCount, setLikesCount] = useState(post.likes || 0)
  const { theme } = useTheme()

  const likeAnim = useAnimatedValue(1)
  const cardAnim = useAnimatedValue(1)

  const { panResponder } = useGestureHandler({
    onSwipe: (direction) => {
      if (direction === "right") {
        handleLike()
      } else if (direction === "left") {
        onShare()
      }
    },
    onLongPress: () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      // Show quick actions
    },
  })

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1))

    // Animate like button
    likeAnim
      .sequence([likeAnim.animate({ toValue: 1.3, duration: 150 }), likeAnim.animate({ toValue: 1, duration: 150 })])
      .start()

    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

    onLike()
  }

  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return "Just now"
    // Simple time ago implementation
    return "2h ago"
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,
      marginHorizontal: theme.spacing.m,
      marginVertical: theme.spacing.s,
      borderRadius: theme.borderRadius.l,
      padding: theme.spacing.m,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.m,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginRight: theme.spacing.m,
    },
    avatarText: {
      color: "#FFFFFF",
      fontSize: theme.typography.fontSize.m,
      fontWeight: "600",
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: theme.typography.fontSize.m,
      fontWeight: "600",
      color: theme.colors.text,
    },
    userHandle: {
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.muted,
    },
    timeAgo: {
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.muted,
    },
    content: {
      marginBottom: theme.spacing.m,
    },
    title: {
      fontSize: theme.typography.fontSize.m,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: theme.spacing.s,
      lineHeight: 22,
    },
    body: {
      fontSize: theme.typography.fontSize.m,
      color: theme.colors.text,
      lineHeight: 20,
    },
    actions: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingTop: theme.spacing.m,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: theme.spacing.s,
      borderRadius: theme.borderRadius.m,
    },
    actionText: {
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.muted,
      marginLeft: theme.spacing.xs,
    },
    likedText: {
      color: theme.colors.error,
    },
    moreButton: {
      padding: theme.spacing.s,
    },
  })

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        {
          transform: [{ scale: cardAnim.value }],
        },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onUserPress}>
          <View style={styles.avatar}>
            {post.user?.avatar ? (
              <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
            ) : (
              <Text style={styles.avatarText}>{post.user?.name?.charAt(0) || "U"}</Text>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.userInfo} onPress={onUserPress}>
          <Text style={styles.userName}>{post.user?.name || `User ${post.userId}`}</Text>
          <Text style={styles.userHandle}>@{post.user?.username || `user${post.userId}`}</Text>
        </TouchableOpacity>

        <Text style={styles.timeAgo}>{formatTimeAgo(post.createdAt)}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {post.title}
        </Text>
        <Text style={styles.body} numberOfLines={4}>
          {post.body}
        </Text>
      </View>

      <View style={styles.actions}>
        <Animated.View style={{ transform: [{ scale: likeAnim.value }] }}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={20}
              color={isLiked ? theme.colors.error : theme.colors.muted}
            />
            <Text style={[styles.actionText, isLiked && styles.likedText]}>{likesCount}</Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity style={styles.actionButton} onPress={onComment}>
          <Ionicons name="chatbubble-outline" size={20} color={theme.colors.muted} />
          <Text style={styles.actionText}>{post.comments || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onShare}>
          <Ionicons name="share-outline" size={20} color={theme.colors.muted} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={20} color={theme.colors.muted} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  )
}

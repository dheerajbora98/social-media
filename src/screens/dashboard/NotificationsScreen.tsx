

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../context/ThemeContext"
import { SkeletonLoader } from "../../components/ui/SkeletonLoader"

interface Notification {
  id: string
  type: "like" | "comment" | "follow" | "mention" | "post"
  title: string
  message: string
  timestamp: string
  read: boolean
  user: {
    id: number
    name: string
    avatar?: string
  }
  actionData?: {
    postId?: number
    userId?: number
  }
}

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  const navigation = useNavigation<any>()
  const { theme } = useTheme()

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockNotifications: Notification[] = [
        {
          id: "1",
          type: "like",
          title: "New Like",
          message: "John Doe liked your post",
          timestamp: "2 minutes ago",
          read: false,
          user: { id: 1, name: "John Doe" },
          actionData: { postId: 123 },
        },
        {
          id: "2",
          type: "comment",
          title: "New Comment",
          message: "Jane Smith commented on your post: 'Great content!'",
          timestamp: "5 minutes ago",
          read: false,
          user: { id: 2, name: "Jane Smith" },
          actionData: { postId: 123 },
        },
        {
          id: "3",
          type: "follow",
          title: "New Follower",
          message: "Mike Johnson started following you",
          timestamp: "1 hour ago",
          read: true,
          user: { id: 3, name: "Mike Johnson" },
          actionData: { userId: 3 },
        },
        {
          id: "4",
          type: "mention",
          title: "You were mentioned",
          message: "Sarah Wilson mentioned you in a post",
          timestamp: "2 hours ago",
          read: true,
          user: { id: 4, name: "Sarah Wilson" },
          actionData: { postId: 456 },
        },
        {
          id: "5",
          type: "post",
          title: "New Post",
          message: "Alex Brown shared a new post",
          timestamp: "3 hours ago",
          read: true,
          user: { id: 5, name: "Alex Brown" },
          actionData: { postId: 789 },
        },
      ]

      setNotifications(mockNotifications)
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchNotifications()
  }

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === notificationId ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const handleNotificationPress = (notification: Notification) => {
    markAsRead(notification.id)

    switch (notification.type) {
      case "like":
      case "comment":
      case "mention":
        if (notification.actionData?.postId) {
          navigation.navigate("PostDetail", { postId: notification.actionData.postId })
        }
        break
      case "follow":
        if (notification.actionData?.userId) {
          navigation.navigate("UserProfile", { userId: notification.actionData.userId })
        }
        break
      case "post":
        if (notification.actionData?.postId) {
          navigation.navigate("PostDetail", { postId: notification.actionData.postId })
        }
        break
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return { name: "heart", color: theme.colors.error }
      case "comment":
        return { name: "chatbubble", color: theme.colors.info }
      case "follow":
        return { name: "person-add", color: theme.colors.success }
      case "mention":
        return { name: "at", color: theme.colors.warning }
      case "post":
        return { name: "document-text", color: theme.colors.primary }
      default:
        return { name: "notifications", color: theme.colors.muted }
    }
  }

  const filteredNotifications = notifications.filter((notification) => (filter === "all" ? true : !notification.read))

  const unreadCount = notifications.filter((n) => !n.read).length

  const renderNotification = ({ item }: { item: Notification }) => {
    const icon = getNotificationIcon(item.type)

    return (
      <TouchableOpacity
        style={[styles.notificationItem, !item.read && styles.unreadNotification]}
        onPress={() => handleNotificationPress(item)}
      >
        <View style={styles.notificationLeft}>
          <View style={styles.userAvatar}>
            {item.user.avatar ? (
              <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
            ) : (
              <Text style={styles.avatarText}>{item.user.name.charAt(0)}</Text>
            )}
          </View>
          <View style={[styles.iconContainer, { backgroundColor: icon.color + "20" }]}>
            <Ionicons name={icon.name as any} size={16} color={icon.color} />
          </View>
        </View>

        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationMessage} numberOfLines={2}>
            {item.message}
          </Text>
          <Text style={styles.notificationTime}>{item.timestamp}</Text>
        </View>

        {!item.read && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    )
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: theme.spacing.l,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    backButton: {
      marginRight: theme.spacing.m,
    },
    headerTitle: {
      fontSize: theme.typography.fontSize.l,
      fontWeight: "600",
      color: theme.colors.text,
    },
    markAllButton: {
      padding: theme.spacing.s,
    },
    markAllText: {
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    filterContainer: {
      flexDirection: "row",
      padding: theme.spacing.l,
      gap: theme.spacing.m,
    },
    filterButton: {
      paddingHorizontal: theme.spacing.l,
      paddingVertical: theme.spacing.s,
      borderRadius: theme.borderRadius.l,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.card,
    },
    activeFilterButton: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    filterButtonText: {
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.text,
      fontWeight: "500",
    },
    activeFilterButtonText: {
      color: "#FFFFFF",
      fontWeight: "600",
    },
    notificationItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: theme.spacing.l,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.background,
    },
    unreadNotification: {
      backgroundColor: theme.colors.primary + "05",
    },
    notificationLeft: {
      position: "relative",
      marginRight: theme.spacing.m,
    },
    userAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    avatarText: {
      color: "#FFFFFF",
      fontSize: theme.typography.fontSize.m,
      fontWeight: "600",
    },
    iconContainer: {
      position: "absolute",
      bottom: -4,
      right: -4,
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: theme.colors.background,
    },
    notificationContent: {
      flex: 1,
    },
    notificationTitle: {
      fontSize: theme.typography.fontSize.m,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    notificationMessage: {
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.text,
      lineHeight: 18,
      marginBottom: theme.spacing.xs,
    },
    notificationTime: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.muted,
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.primary,
      marginLeft: theme.spacing.s,
    },
    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: theme.spacing.xl,
    },
    emptyIcon: {
      marginBottom: theme.spacing.l,
    },
    emptyTitle: {
      fontSize: theme.typography.fontSize.l,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: theme.spacing.s,
    },
    emptySubtitle: {
      fontSize: theme.typography.fontSize.m,
      color: theme.colors.muted,
      textAlign: "center",
      lineHeight: 22,
    },
  })

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Notifications</Text>
          </View>
        </View>
        <SkeletonLoader type="user" count={5} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications {unreadCount > 0 && `(${unreadCount})`}</Text>
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === "all" && styles.activeFilterButton]}
          onPress={() => setFilter("all")}
        >
          <Text style={[styles.filterButtonText, filter === "all" && styles.activeFilterButtonText]}>
            All ({notifications.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === "unread" && styles.activeFilterButton]}
          onPress={() => setFilter("unread")}
        >
          <Text style={[styles.filterButtonText, filter === "unread" && styles.activeFilterButtonText]}>
            Unread ({unreadCount})
          </Text>
        </TouchableOpacity>
      </View>

      {filteredNotifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-outline" size={64} color={theme.colors.muted} style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>{filter === "unread" ? "No unread notifications" : "No notifications"}</Text>
          <Text style={styles.emptySubtitle}>
            {filter === "unread"
              ? "You're all caught up! Check back later for new notifications."
              : "When you get notifications, they'll show up here."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  )
}

export default NotificationsScreen

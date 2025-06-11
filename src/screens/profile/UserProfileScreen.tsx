

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
  Alert,
  Dimensions,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useDispatch } from "react-redux"
import { useTheme } from "../../context/ThemeContext"
import { PostCard } from "../../components/ui/PostCard"
import { SkeletonLoader } from "../../components/ui/SkeletonLoader"
import { Button } from "../../components/ui/Button"
import { jsonPlaceholderApi } from "../../services/api"

const { width } = Dimensions.get("window")

const UserProfileScreen = () => {
  const [user, setUser] = useState<any>(null)
  const [userPosts, setUserPosts] = useState([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<"posts" | "media">("posts")

  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const dispatch = useDispatch()
  const { theme } = useTheme()

  const { userId } = route.params

  useEffect(() => {
    fetchUserProfile()
  }, [userId])

  const fetchUserProfile = async () => {
    try {
      setLoading(true)

      // Fetch user details
      const userResponse = await jsonPlaceholderApi.get(`/users/${userId}`)
      const postsResponse = await jsonPlaceholderApi.get(`/users/${userId}/posts`)

      const userData = {
        ...userResponse.data,
        followers: Math.floor(Math.random() * 1000) + 100,
        following: Math.floor(Math.random() * 500) + 50,
        bio: "Digital creator and technology enthusiast. Sharing insights about life, work, and everything in between.",
        isVerified: Math.random() > 0.7,
        joinDate: "Joined March 2022",
      }

      const postsData = postsResponse.data.map((post: any) => ({
        ...post,
        user: userData,
        likes: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 20),
        isLiked: Math.random() > 0.5,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      }))

      setUser(userData)
      setUserPosts(postsData)
      setIsFollowing(Math.random() > 0.5)
    } catch (error) {
      console.error("Failed to fetch user profile:", error)
      Alert.alert("Error", "Failed to load user profile")
      navigation.goBack()
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchUserProfile()
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    // Simulate API call
    console.log(isFollowing ? "Unfollowed" : "Followed", user.name)
  }

  const handleMessage = () => {
    navigation.navigate("Chat", { userId: user.id, userName: user.name })
  }

  const handleBlock = () => {
    Alert.alert("Block User", `Are you sure you want to block ${user.name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Block",
        style: "destructive",
        onPress: () => {
          setIsBlocked(true)
          console.log("Blocked user:", user.name)
        },
      },
    ])
  }

  const handleReport = () => {
    Alert.alert("Report User", "Why are you reporting this user?", [
      { text: "Cancel", style: "cancel" },
      { text: "Spam", onPress: () => console.log("Reported for spam") },
      { text: "Inappropriate Content", onPress: () => console.log("Reported for inappropriate content") },
      { text: "Harassment", onPress: () => console.log("Reported for harassment") },
    ])
  }

  const renderProfileHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.profileImageContainer}>
        <View style={styles.profileImage}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <Text style={styles.avatarText}>{user?.name?.charAt(0) || "U"}</Text>
          )}
        </View>
        {user?.isVerified && (
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark" size={12} color="#FFFFFF" />
          </View>
        )}
      </View>

      <View style={styles.profileInfo}>
        <View style={styles.nameContainer}>
          <Text style={styles.profileName}>{user?.name}</Text>
          <TouchableOpacity onPress={() => navigation.navigate("MoreOptions")}>
            <Ionicons name="ellipsis-horizontal" size={20} color={theme.colors.muted} />
          </TouchableOpacity>
        </View>
        <Text style={styles.profileUsername}>@{user?.username}</Text>
        <Text style={styles.profileBio}>{user?.bio}</Text>
        <Text style={styles.joinDate}>{user?.joinDate}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userPosts.length}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <TouchableOpacity style={styles.statItem}>
          <Text style={styles.statNumber}>{user?.followers}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statItem}>
          <Text style={styles.statNumber}>{user?.following}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionButtons}>
        <Button
          title={isFollowing ? "Following" : "Follow"}
          onPress={handleFollow}
          variant={isFollowing ? "outline" : "primary"}
          style={styles.followButton}
        />
        <TouchableOpacity style={styles.messageButton} onPress={handleMessage}>
          <Ionicons name="chatbubble-outline" size={20} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => {
            Alert.alert("More Options", "Choose an action", [
              { text: "Cancel", style: "cancel" },
              { text: "Block", style: "destructive", onPress: handleBlock },
              { text: "Report", style: "destructive", onPress: handleReport },
            ])
          }}
        >
          <Ionicons name="ellipsis-horizontal" size={20} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {[
        { key: "posts", label: "Posts", icon: "grid-outline" },
        { key: "media", label: "Media", icon: "images-outline" },
      ].map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, activeTab === tab.key && styles.activeTab]}
          onPress={() => setActiveTab(tab.key as any)}
        >
          <Ionicons
            name={tab.icon as any}
            size={20}
            color={activeTab === tab.key ? theme.colors.primary : theme.colors.muted}
          />
          <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>{tab.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )

  const renderContent = () => {
    if (isBlocked) {
      return (
        <View style={styles.blockedState}>
          <Ionicons name="ban" size={64} color={theme.colors.muted} />
          <Text style={styles.blockedTitle}>User Blocked</Text>
          <Text style={styles.blockedSubtitle}>
            You have blocked this user. You won't see their posts or be able to interact with them.
          </Text>
        </View>
      )
    }

    switch (activeTab) {
      case "posts":
        return userPosts.length > 0 ? (
          <FlatList
            data={userPosts}
            renderItem={({ item }) => (
              <PostCard
                post={item}
                onLike={() => console.log("Like", item.id)}
                onComment={() => navigation.navigate("PostDetail", { postId: item.id })}
                onShare={() => console.log("Share", item.id)}
                onUserPress={() => {}}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color={theme.colors.muted} />
            <Text style={styles.emptyStateTitle}>No posts yet</Text>
            <Text style={styles.emptyStateSubtitle}>{user?.name} hasn't shared any posts yet</Text>
          </View>
        )
      case "media":
        return (
          <View style={styles.mediaGrid}>
            {Array.from({ length: 9 }, (_, index) => (
              <TouchableOpacity key={index} style={styles.mediaItem}>
                <Image
                  source={{ uri: `/placeholder.svg?height=120&width=120&text=Photo${index + 1}` }}
                  style={styles.mediaImage}
                />
              </TouchableOpacity>
            ))}
          </View>
        )
      default:
        return null
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      padding: theme.spacing.l,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      marginRight: theme.spacing.m,
    },
    headerTitle: {
      fontSize: theme.typography.fontSize.l,
      fontWeight: "600",
      color: theme.colors.text,
    },
    profileHeader: {
      padding: theme.spacing.l,
    },
    profileImageContainer: {
      position: "relative",
      alignSelf: "center",
      marginBottom: theme.spacing.m,
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    avatarText: {
      color: "#FFFFFF",
      fontSize: theme.typography.fontSize.xxl,
      fontWeight: "600",
    },
    verifiedBadge: {
      position: "absolute",
      bottom: 5,
      right: 5,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.colors.success,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: theme.colors.background,
    },
    profileInfo: {
      alignItems: "center",
      marginBottom: theme.spacing.l,
    },
    nameContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.s,
      marginBottom: theme.spacing.xs,
    },
    profileName: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    profileUsername: {
      fontSize: theme.typography.fontSize.m,
      color: theme.colors.muted,
      marginBottom: theme.spacing.m,
    },
    profileBio: {
      fontSize: theme.typography.fontSize.m,
      color: theme.colors.text,
      textAlign: "center",
      lineHeight: 22,
      paddingHorizontal: theme.spacing.l,
      marginBottom: theme.spacing.s,
    },
    joinDate: {
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.muted,
    },
    statsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: theme.spacing.l,
    },
    statItem: {
      alignItems: "center",
      marginHorizontal: theme.spacing.xl,
    },
    statNumber: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    statLabel: {
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.muted,
    },
    actionButtons: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.m,
    },
    followButton: {
      flex: 1,
    },
    messageButton: {
      padding: theme.spacing.m,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.m,
    },
    moreButton: {
      padding: theme.spacing.m,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.m,
    },
    tabBar: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    tab: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.spacing.m,
      gap: theme.spacing.s,
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: theme.colors.primary,
    },
    tabText: {
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.muted,
      fontWeight: "500",
    },
    activeTabText: {
      color: theme.colors.primary,
      fontWeight: "600",
    },
    mediaGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      padding: 2,
    },
    mediaItem: {
      width: (width - 6) / 3,
      height: (width - 6) / 3,
      margin: 1,
    },
    mediaImage: {
      width: "100%",
      height: "100%",
    },
    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: theme.spacing.xl,
    },
    emptyStateTitle: {
      fontSize: theme.typography.fontSize.l,
      fontWeight: "600",
      color: theme.colors.text,
      marginTop: theme.spacing.l,
      marginBottom: theme.spacing.s,
    },
    emptyStateSubtitle: {
      fontSize: theme.typography.fontSize.m,
      color: theme.colors.muted,
      textAlign: "center",
    },
    blockedState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: theme.spacing.xl,
    },
    blockedTitle: {
      fontSize: theme.typography.fontSize.l,
      fontWeight: "600",
      color: theme.colors.text,
      marginTop: theme.spacing.l,
      marginBottom: theme.spacing.s,
    },
    blockedSubtitle: {
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
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <SkeletonLoader type="user" count={1} />
        <SkeletonLoader type="post" count={3} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{user?.name}</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {renderProfileHeader()}
        {renderTabBar()}
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  )
}

export default UserProfileScreen



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
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useDispatch } from "react-redux"
import { useTheme } from "../../context/ThemeContext"
import { useAuth } from "../../context/AuthContext"
import { PostCard } from "../../components/ui/PostCard"
import { SkeletonLoader } from "../../components/ui/SkeletonLoader"
import { Button } from "../../components/ui/Button"

const { width } = Dimensions.get("window")

const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState<"posts" | "media" | "likes">("posts")
  const [userStats, setUserStats] = useState({
    posts: 0,
    followers: 0,
    following: 0,
  })
  const [userPosts, setUserPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const navigation = useNavigation<any>()
  const dispatch = useDispatch()
  const { theme } = useTheme()
  const { authState, signOut } = useAuth()

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      setLoading(true)

      // Simulate API calls
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setUserStats({
        posts: 42,
        followers: 1234,
        following: 567,
      })

      // Mock user posts
      const mockPosts = Array.from({ length: 10 }, (_, index) => ({
        id: index + 1,
        userId: authState.user?.id || 1,
        title: `My post #${index + 1}`,
        body: `This is the content of my post number ${index + 1}. It contains some interesting thoughts and ideas.`,
        user: authState.user,
        likes: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 20),
        isLiked: Math.random() > 0.5,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      }))

      setUserPosts(mockPosts as any)
    } catch (error) {
      console.error("Failed to fetch user data:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchUserData()
  }

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: signOut },
    ])
  }

  const handleEditProfile = () => {
    navigation.navigate("ProfileSetup")
  }

  const renderProfileHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.profileImageContainer}>
        <View style={styles.profileImage}>
          {authState.user?.avatar ? (
            <Image source={{ uri: authState.user.avatar }} style={styles.avatar} />
          ) : (
            <Text style={styles.avatarText}>{authState.user?.name?.charAt(0) || "U"}</Text>
          )}
        </View>
        <TouchableOpacity style={styles.editImageButton}>
          <Ionicons name="camera" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>{authState.user?.name || "User Name"}</Text>
        <Text style={styles.profileUsername}>
          @{authState.user?.username || authState.user?.email?.split("@")[0] || "username"}
        </Text>
        <Text style={styles.profileBio}>
          Digital creator sharing life moments and inspiring others. Love technology, travel, and good coffee ☕
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <TouchableOpacity style={styles.statItem}>
          <Text style={styles.statNumber}>{userStats.posts}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statItem} onPress={() => navigation.navigate("Followers")}>
          <Text style={styles.statNumber}>{userStats.followers}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statItem} onPress={() => navigation.navigate("Following")}>
          <Text style={styles.statNumber}>{userStats.following}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionButtons}>
        <Button title="Edit Profile" onPress={handleEditProfile} variant="outline" style={styles.editButton} />
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate("Settings")}>
          <Ionicons name="menu" size={20} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {[
        { key: "posts", label: "Posts", icon: "grid-outline" },
        { key: "media", label: "Media", icon: "images-outline" },
        { key: "likes", label: "Likes", icon: "heart-outline" },
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
    switch (activeTab) {
      case "posts":
        return (
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
        )
      case "media":
        return (
          <View style={styles.mediaGrid}>
            {Array.from({ length: 12 }, (_, index) => (
              <TouchableOpacity key={index} style={styles.mediaItem}>
                <Image
                  source={{ uri: `/placeholder.svg?height=120&width=120&text=Photo${index + 1}` }}
                  style={styles.mediaImage}
                />
              </TouchableOpacity>
            ))}
          </View>
        )
      case "likes":
        return (
          <View style={styles.emptyState}>
            <Ionicons name="heart-outline" size={64} color={theme.colors.muted} />
            <Text style={styles.emptyStateTitle}>No liked posts yet</Text>
            <Text style={styles.emptyStateSubtitle}>Posts you like will appear here</Text>
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
      justifyContent: "space-between",
      padding: theme.spacing.l,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: {
      fontSize: theme.typography.fontSize.l,
      fontWeight: "600",
      color: theme.colors.text,
    },
    signOutButton: {
      padding: theme.spacing.s,
    },
    profileHeader: {
      padding: theme.spacing.l,
      alignItems: "center",
    },
    profileImageContainer: {
      position: "relative",
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
    editImageButton: {
      position: "absolute",
      bottom: 0,
      right: 0,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 3,
      borderColor: theme.colors.background,
    },
    profileInfo: {
      alignItems: "center",
      marginBottom: theme.spacing.l,
    },
    profileName: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
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
    },
    statsContainer: {
      flexDirection: "row",
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
    editButton: {
      flex: 1,
    },
    menuButton: {
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
  })

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
        <SkeletonLoader type="user" count={1} />
        <SkeletonLoader type="post" count={3} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
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

export default ProfileScreen

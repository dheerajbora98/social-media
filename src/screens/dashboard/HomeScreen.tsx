

import { useState, useCallback } from "react"
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useDispatch, useSelector } from "react-redux"
import { useTheme } from "../../context/ThemeContext"
import { useAuth } from "../../context/AuthContext"
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll"
import { useOptimisticUpdates } from "../../hooks/useOptimisticUpdates"
import { useGestureHandler } from "../../hooks/useGestureHandler"
import { PostCard } from "../../components/ui/PostCard"
import { FilterTabs } from "../../components/ui/FilterTabs"
import { SkeletonLoader } from "../../components/ui/SkeletonLoader"
import { setCurrentFilter } from "../../store/slices/uiSlice"
import { jsonPlaceholderApi } from "../../services/api"
import type { RootState } from "../../store"

const HomeScreen = () => {
  const [refreshing, setRefreshing] = useState(false)
  const navigation = useNavigation<any>()
  const dispatch = useDispatch()
  const { theme } = useTheme()
  const { authState } = useAuth()

  const { posts, status } = useSelector((state: RootState) => state.posts)
  const { currentFilter } = useSelector((state: RootState) => state.ui)
  const { performOptimisticUpdate } = useOptimisticUpdates()

  const fetchPostsData = useCallback(async (page: number) => {
    try {
      const response = await jsonPlaceholderApi.get(`/posts?_page=${page}&_limit=10`)
      return {
        data: response.data,
        hasMore: response.data.length === 10,
      }
    } catch (error) {
      throw new Error("Failed to fetch posts")
    }
  }, [])

  const {
    data: infinitePosts,
    isLoading,
    isRefreshing,
    handleLoadMore,
    handleRefresh,
    hasMore,
  } = useInfiniteScroll({
    fetchData: fetchPostsData,
    initialPage: 1,
  })

  const { panResponder } = useGestureHandler({
    onSwipe: (direction) => {
      if (direction === "left") {
        // Navigate to explore
        navigation.navigate("Explore")
      } else if (direction === "right") {
        // Open drawer or navigate back
        console.log("Swipe right detected")
      }
    },
    onLongPress: () => {
      Alert.alert("Quick Actions", "What would you like to do?", [
        { text: "Create Post", onPress: () => navigation.navigate("Create") },
        { text: "Search", onPress: () => navigation.navigate("Explore") },
        { text: "Cancel", style: "cancel" },
      ])
    },
  })

  const handleLikePost = async (postId: number) => {
    await performOptimisticUpdate({ type: "posts/optimisticLikePost", payload: { postId } }, async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return { success: true }
    })
  }

  const handleFilterChange = (filter: string) => {
    dispatch(setCurrentFilter(filter as any))
  }

  const renderPost = ({ item, index }: { item: any; index: number }) => (
    <PostCard
      post={item}
      onLike={() => handleLikePost(item.id)}
      onComment={() => navigation.navigate("PostDetail", { postId: item.id })}
      onShare={() => console.log("Share post", item.id)}
      onUserPress={() => navigation.navigate("UserProfile", { userId: item.userId })}
    />
  )

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <TouchableOpacity style={styles.avatarButton} onPress={() => navigation.navigate("Profile")}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{authState.user?.name?.charAt(0) || "U"}</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Social Feed</Text>

        <TouchableOpacity style={styles.notificationButton} onPress={() => navigation.navigate("Notifications")}>
          <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <FilterTabs
        currentFilter={currentFilter}
        onFilterChange={handleFilterChange}
        filters={[
          { key: "all", label: "All" },
          { key: "friends", label: "Friends" },
          { key: "trending", label: "Trending" },
          { key: "recent", label: "Recent" },
        ]}
      />
    </View>
  )

  const renderFooter = () => {
    if (!isLoading || infinitePosts.length === 0) return null
    return <SkeletonLoader type="post" count={2} />
  }

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="newspaper-outline" size={64} color={theme.colors.muted} />
      <Text style={styles.emptyTitle}>No posts yet</Text>
      <Text style={styles.emptySubtitle}>Follow some users or create your first post to get started</Text>
      <TouchableOpacity style={styles.createPostButton} onPress={() => navigation.navigate("Create")}>
        <Text style={styles.createPostText}>Create Post</Text>
      </TouchableOpacity>
    </View>
  )

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.background,
      paddingTop: theme.spacing.m,
      paddingHorizontal: theme.spacing.l,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTop: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing.m,
    },
    avatarButton: {
      padding: theme.spacing.xs,
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: {
      color: "#FFFFFF",
      fontSize: theme.typography.fontSize.m,
      fontWeight: "600",
    },
    headerTitle: {
      fontSize: theme.typography.fontSize.l,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    notificationButton: {
      position: "relative",
      padding: theme.spacing.xs,
    },
    notificationBadge: {
      position: "absolute",
      top: 0,
      right: 0,
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: theme.colors.error,
      alignItems: "center",
      justifyContent: "center",
    },
    badgeText: {
      color: "#FFFFFF",
      fontSize: 10,
      fontWeight: "600",
    },
    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.xxl,
    },
    emptyTitle: {
      fontSize: theme.typography.fontSize.l,
      fontWeight: "600",
      color: theme.colors.text,
      marginTop: theme.spacing.l,
      marginBottom: theme.spacing.s,
    },
    emptySubtitle: {
      fontSize: theme.typography.fontSize.m,
      color: theme.colors.muted,
      textAlign: "center",
      lineHeight: 22,
      marginBottom: theme.spacing.xl,
    },
    createPostButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.m,
      borderRadius: theme.borderRadius.l,
    },
    createPostText: {
      color: "#FFFFFF",
      fontSize: theme.typography.fontSize.m,
      fontWeight: "600",
    },
  })

  return (
    <SafeAreaView style={styles.container}>
      <View {...panResponder.panHandlers} style={styles.container}>
        <FlatList
          data={infinitePosts}
          renderItem={renderPost}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={!isLoading ? renderEmpty : null}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={5}
          getItemLayout={(data, index) => ({
            length: 200, // Approximate height of post card
            offset: 200 * index,
            index,
          })}
        />
      </View>
    </SafeAreaView>
  )
}

export default HomeScreen

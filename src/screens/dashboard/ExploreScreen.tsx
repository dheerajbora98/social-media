

import { useState, useCallback } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView, RefreshControl } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useDispatch, useSelector } from "react-redux"
import { useTheme } from "../../context/ThemeContext"
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll"
import { PostCard } from "../../components/ui/PostCard"
import { SkeletonLoader } from "../../components/ui/SkeletonLoader"
import { setSearchQuery, addRecentSearch } from "../../store/slices/uiSlice"
import { dummyJsonApi } from "../../services/api"
import type { RootState } from "../../store"

const ExploreScreen = () => {
  const [activeTab, setActiveTab] = useState("trending")
  const [searchFocused, setSearchFocused] = useState(false)
  const navigation = useNavigation<any>()
  const dispatch = useDispatch()
  const { theme } = useTheme()

  const { searchQuery, recentSearches } = useSelector((state: RootState) => state.ui)

  const trendingTopics = [
    { id: 1, name: "#Technology", posts: 1234 },
    { id: 2, name: "#Travel", posts: 856 },
    { id: 3, name: "#Food", posts: 642 },
    { id: 4, name: "#Photography", posts: 523 },
    { id: 5, name: "#Fitness", posts: 412 },
  ]

  const suggestedUsers = [
    { id: 1, name: "John Doe", username: "johndoe", followers: 1234, avatar: "/placeholder.svg?height=50&width=50" },
    { id: 2, name: "Jane Smith", username: "janesmith", followers: 856, avatar: "/placeholder.svg?height=50&width=50" },
    { id: 3, name: "Mike Johnson", username: "mikej", followers: 642, avatar: "/placeholder.svg?height=50&width=50" },
  ]

  const fetchSearchResults = useCallback(
    async (page: number) => {
      try {
        if (!searchQuery.trim()) {
          const response = await dummyJsonApi.get(`/posts?limit=10&skip=${(page - 1) * 10}`)
          return {
            data: response.data.posts,
            hasMore: response.data.posts.length === 10,
          }
        }

        const response = await dummyJsonApi.get(`/posts/search?q=${searchQuery}&limit=10&skip=${(page - 1) * 10}`)
        return {
          data: response.data.posts,
          hasMore: response.data.posts.length === 10,
        }
      } catch (error) {
        throw new Error("Failed to fetch search results")
      }
    },
    [searchQuery],
  )

  const {
    data: searchResults,
    isLoading,
    isRefreshing,
    handleLoadMore,
    handleRefresh,
  } = useInfiniteScroll({
    fetchData: fetchSearchResults,
    initialPage: 1,
  })

  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query))
    if (query.trim()) {
      dispatch(addRecentSearch(query))
    }
  }

  const handleRecentSearchPress = (query: string) => {
    dispatch(setSearchQuery(query))
    setSearchFocused(false)
  }

  const handleTrendingTopicPress = (topic: string) => {
    dispatch(setSearchQuery(topic))
    setSearchFocused(false)
  }

  const renderSearchSuggestions = () => (
    <View style={styles.suggestionsContainer}>
      {recentSearches.length > 0 && (
        <View style={styles.suggestionSection}>
          <Text style={styles.suggestionTitle}>Recent Searches</Text>
          {recentSearches.slice(0, 5).map((search, index) => (
            <TouchableOpacity key={index} style={styles.suggestionItem} onPress={() => handleRecentSearchPress(search)}>
              <Ionicons name="time-outline" size={16} color={theme.colors.muted} />
              <Text style={styles.suggestionText}>{search}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.suggestionSection}>
        <Text style={styles.suggestionTitle}>Trending Topics</Text>
        {trendingTopics.slice(0, 5).map((topic) => (
          <TouchableOpacity
            key={topic.id}
            style={styles.suggestionItem}
            onPress={() => handleTrendingTopicPress(topic.name)}
          >
            <Ionicons name="trending-up" size={16} color={theme.colors.primary} />
            <Text style={styles.suggestionText}>{topic.name}</Text>
            <Text style={styles.postCount}>{topic.posts} posts</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )

  const renderTrendingTab = () => (
    <ScrollView style={styles.tabContent} refreshControl={<RefreshControl refreshing={false} onRefresh={() => {}} />}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trending Topics</Text>
        {trendingTopics.map((topic) => (
          <TouchableOpacity
            key={topic.id}
            style={styles.trendingItem}
            onPress={() => handleTrendingTopicPress(topic.name)}
          >
            <View style={styles.trendingInfo}>
              <Text style={styles.trendingName}>{topic.name}</Text>
              <Text style={styles.trendingPosts}>{topic.posts} posts</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.muted} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suggested Users</Text>
        {suggestedUsers.map((user) => (
          <TouchableOpacity
            key={user.id}
            style={styles.userItem}
            onPress={() => navigation.navigate("UserProfile", { userId: user.id })}
          >
            <View style={styles.userAvatar}>
              <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userHandle}>@{user.username}</Text>
              <Text style={styles.userFollowers}>{user.followers} followers</Text>
            </View>
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )

  const renderSearchResults = () => (
    <FlatList
      data={searchResults}
      renderItem={({ item }) => (
        <PostCard
          post={item}
          onLike={() => console.log("Like", item.id)}
          onComment={() => navigation.navigate("PostDetail", { postId: item.id })}
          onShare={() => console.log("Share", item.id)}
          onUserPress={() => navigation.navigate("UserProfile", { userId: item.userId })}
        />
      )}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
      ListFooterComponent={isLoading ? <SkeletonLoader type="post" count={2} /> : null}
      showsVerticalScrollIndicator={false}
    />
  )

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: theme.spacing.l,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.l,
      paddingHorizontal: theme.spacing.m,
      marginBottom: theme.spacing.m,
    },
    searchIcon: {
      marginRight: theme.spacing.s,
    },
    searchInput: {
      flex: 1,
      paddingVertical: theme.spacing.m,
      fontSize: theme.typography.fontSize.m,
      color: theme.colors.text,
    },
    clearButton: {
      padding: theme.spacing.s,
    },
    tabContainer: {
      flexDirection: "row",
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.m,
      padding: 4,
    },
    tab: {
      flex: 1,
      paddingVertical: theme.spacing.s,
      alignItems: "center",
      borderRadius: theme.borderRadius.s,
    },
    activeTab: {
      backgroundColor: theme.colors.primary,
    },
    tabText: {
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.muted,
      fontWeight: "500",
    },
    activeTabText: {
      color: "#FFFFFF",
      fontWeight: "600",
    },
    suggestionsContainer: {
      flex: 1,
      padding: theme.spacing.l,
    },
    suggestionSection: {
      marginBottom: theme.spacing.xl,
    },
    suggestionTitle: {
      fontSize: theme.typography.fontSize.m,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: theme.spacing.m,
    },
    suggestionItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.spacing.m,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    suggestionText: {
      flex: 1,
      fontSize: theme.typography.fontSize.m,
      color: theme.colors.text,
      marginLeft: theme.spacing.m,
    },
    postCount: {
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.muted,
    },
    tabContent: {
      flex: 1,
    },
    section: {
      padding: theme.spacing.l,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.l,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: theme.spacing.m,
    },
    trendingItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: theme.spacing.m,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    trendingInfo: {
      flex: 1,
    },
    trendingName: {
      fontSize: theme.typography.fontSize.m,
      fontWeight: "600",
      color: theme.colors.primary,
      marginBottom: theme.spacing.xs,
    },
    trendingPosts: {
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.muted,
    },
    userItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.spacing.m,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    userAvatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginRight: theme.spacing.m,
    },
    avatarText: {
      color: "#FFFFFF",
      fontSize: theme.typography.fontSize.l,
      fontWeight: "600",
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: theme.typography.fontSize.m,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    userHandle: {
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.muted,
      marginBottom: theme.spacing.xs,
    },
    userFollowers: {
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.muted,
    },
    followButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.l,
      paddingVertical: theme.spacing.s,
      borderRadius: theme.borderRadius.m,
    },
    followButtonText: {
      color: "#FFFFFF",
      fontSize: theme.typography.fontSize.s,
      fontWeight: "600",
    },
  })

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={theme.colors.muted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search posts, users, topics..."
            placeholderTextColor={theme.colors.muted}
            value={searchQuery}
            onChangeText={handleSearch}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={() => handleSearch("")}>
              <Ionicons name="close-circle" size={20} color={theme.colors.muted} />
            </TouchableOpacity>
          )}
        </View>

        {!searchFocused && !searchQuery && (
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "trending" && styles.activeTab]}
              onPress={() => setActiveTab("trending")}
            >
              <Text style={[styles.tabText, activeTab === "trending" && styles.activeTabText]}>Trending</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "people" && styles.activeTab]}
              onPress={() => setActiveTab("people")}
            >
              <Text style={[styles.tabText, activeTab === "people" && styles.activeTabText]}>People</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {searchFocused && !searchQuery ? renderSearchSuggestions() : null}
      {searchQuery ? renderSearchResults() : renderTrendingTab()}
    </SafeAreaView>
  )
}

export default ExploreScreen

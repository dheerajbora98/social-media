

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../context/ThemeContext"
import { LineChart } from "../../components/charts/LineChart"
import { BarChart } from "../../components/charts/BarChart"
import { PieChart } from "../../components/charts/PieChart"
import { SkeletonLoader } from "../../components/ui/SkeletonLoader"

const { width } = Dimensions.get("window")

interface AnalyticsData {
  overview: {
    totalPosts: number
    totalLikes: number
    totalComments: number
    totalShares: number
    followers: number
    following: number
    profileViews: number
    engagement: number
  }
  chartData: {
    engagement: {
      labels: string[]
      datasets: Array<{ data: number[] }>
    }
    followers: {
      labels: string[]
      datasets: Array<{ data: number[] }>
    }
    postPerformance: Array<{
      name: string
      population: number
      color: string
    }>
  }
  topPosts: Array<{
    id: number
    title: string
    likes: number
    comments: number
    shares: number
    views: number
  }>
}

const AnalyticsScreen = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState<"7d" | "30d" | "90d">("30d")
  const [activeChart, setActiveChart] = useState<"engagement" | "followers" | "posts">("engagement")

  const navigation = useNavigation<any>()
  const { theme } = useTheme()

  useEffect(() => {
    fetchAnalyticsData()
  }, [selectedPeriod])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const mockData: AnalyticsData = {
        overview: {
          totalPosts: 42,
          totalLikes: 1234,
          totalComments: 567,
          totalShares: 89,
          followers: 2345,
          following: 678,
          profileViews: 3456,
          engagement: 8.5,
        },
        chartData: {
          engagement: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [{ data: [20, 45, 28, 80, 99, 43, 65] }],
          },
          followers: {
            labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
            datasets: [{ data: [50, 75, 100, 125] }],
          },
          postPerformance: [
            { name: "Likes", population: 45, color: "#FF6B6B" },
            { name: "Comments", population: 30, color: "#4ECDC4" },
            { name: "Shares", population: 15, color: "#45B7D1" },
            { name: "Saves", population: 10, color: "#96CEB4" },
          ],
        },
        topPosts: [
          {
            id: 1,
            title: "My amazing sunset photo",
            likes: 234,
            comments: 45,
            shares: 12,
            views: 1234,
          },
          {
            id: 2,
            title: "Thoughts on technology trends",
            likes: 189,
            comments: 67,
            shares: 23,
            views: 987,
          },
          {
            id: 3,
            title: "Weekend adventure recap",
            likes: 156,
            comments: 34,
            shares: 8,
            views: 756,
          },
        ],
      }

      setAnalyticsData(mockData)
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchAnalyticsData()
  }

  const renderOverviewCard = (title: string, value: string | number, icon: string, change?: string) => (
    <View style={styles.overviewCard}>
      <View style={styles.cardHeader}>
        <View style={[styles.cardIcon, { backgroundColor: theme.colors.primary + "20" }]}>
          <Ionicons name={icon as any} size={20} color={theme.colors.primary} />
        </View>
        {change && (
          <View style={[styles.changeIndicator, { backgroundColor: theme.colors.success + "20" }]}>
            <Ionicons name="trending-up" size={12} color={theme.colors.success} />
            <Text style={[styles.changeText, { color: theme.colors.success }]}>{change}</Text>
          </View>
        )}
      </View>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
  )

  const renderPeriodSelector = () => (
    <View style={styles.periodSelector}>
      {[
        { key: "7d", label: "7 Days" },
        { key: "30d", label: "30 Days" },
        { key: "90d", label: "90 Days" },
      ].map((period) => (
        <TouchableOpacity
          key={period.key}
          style={[styles.periodButton, selectedPeriod === period.key && styles.activePeriodButton]}
          onPress={() => setSelectedPeriod(period.key as any)}
        >
          <Text style={[styles.periodButtonText, selectedPeriod === period.key && styles.activePeriodButtonText]}>
            {period.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )

  const renderChartSelector = () => (
    <View style={styles.chartSelector}>
      {[
        { key: "engagement", label: "Engagement", icon: "heart-outline" },
        { key: "followers", label: "Followers", icon: "people-outline" },
        { key: "posts", label: "Posts", icon: "bar-chart-outline" },
      ].map((chart) => (
        <TouchableOpacity
          key={chart.key}
          style={[styles.chartButton, activeChart === chart.key && styles.activeChartButton]}
          onPress={() => setActiveChart(chart.key as any)}
        >
          <Ionicons
            name={chart.icon as any}
            size={16}
            color={activeChart === chart.key ? "#FFFFFF" : theme.colors.muted}
          />
          <Text style={[styles.chartButtonText, activeChart === chart.key && styles.activeChartButtonText]}>
            {chart.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )

  const renderChart = () => {
    if (!analyticsData) return null

    switch (activeChart) {
      case "engagement":
        return <LineChart data={analyticsData.chartData.engagement} width={width - 32} height={220} />
      case "followers":
        return <BarChart data={analyticsData.chartData.followers} width={width - 32} height={220} />
      case "posts":
        return <PieChart data={analyticsData.chartData.postPerformance} width={width - 32} height={220} />
      default:
        return null
    }
  }

  const renderTopPosts = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Top Performing Posts</Text>
      {analyticsData?.topPosts.map((post, index) => (
        <TouchableOpacity
          key={post.id}
          style={styles.postItem}
          onPress={() => navigation.navigate("PostDetail", { postId: post.id })}
        >
          <View style={styles.postRank}>
            <Text style={styles.rankNumber}>{index + 1}</Text>
          </View>
          <View style={styles.postInfo}>
            <Text style={styles.postTitle} numberOfLines={1}>
              {post.title}
            </Text>
            <View style={styles.postStats}>
              <View style={styles.postStat}>
                <Ionicons name="heart" size={12} color={theme.colors.error} />
                <Text style={styles.postStatText}>{post.likes}</Text>
              </View>
              <View style={styles.postStat}>
                <Ionicons name="chatbubble" size={12} color={theme.colors.info} />
                <Text style={styles.postStatText}>{post.comments}</Text>
              </View>
              <View style={styles.postStat}>
                <Ionicons name="share" size={12} color={theme.colors.success} />
                <Text style={styles.postStatText}>{post.shares}</Text>
              </View>
              <View style={styles.postStat}>
                <Ionicons name="eye" size={12} color={theme.colors.muted} />
                <Text style={styles.postStatText}>{post.views}</Text>
              </View>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color={theme.colors.muted} />
        </TouchableOpacity>
      ))}
    </View>
  )

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
    content: {
      flex: 1,
    },
    overviewGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      padding: theme.spacing.m,
      gap: theme.spacing.m,
    },
    overviewCard: {
      width: (width - theme.spacing.m * 3) / 2,
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.l,
      padding: theme.spacing.m,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing.s,
    },
    cardIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    changeIndicator: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.s,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.s,
      gap: 2,
    },
    changeText: {
      fontSize: theme.typography.fontSize.xs,
      fontWeight: "600",
    },
    cardValue: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    cardTitle: {
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.muted,
    },
    section: {
      margin: theme.spacing.m,
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.l,
      padding: theme.spacing.l,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.l,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: theme.spacing.l,
    },
    periodSelector: {
      flexDirection: "row",
      marginBottom: theme.spacing.m,
      gap: theme.spacing.s,
    },
    periodButton: {
      flex: 1,
      paddingVertical: theme.spacing.s,
      paddingHorizontal: theme.spacing.m,
      borderRadius: theme.borderRadius.m,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
    },
    activePeriodButton: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    periodButtonText: {
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.text,
      fontWeight: "500",
    },
    activePeriodButtonText: {
      color: "#FFFFFF",
      fontWeight: "600",
    },
    chartSelector: {
      flexDirection: "row",
      marginBottom: theme.spacing.l,
      gap: theme.spacing.s,
    },
    chartButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.spacing.s,
      paddingHorizontal: theme.spacing.m,
      borderRadius: theme.borderRadius.m,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: theme.spacing.s,
    },
    activeChartButton: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    chartButtonText: {
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.text,
      fontWeight: "500",
    },
    activeChartButtonText: {
      color: "#FFFFFF",
      fontWeight: "600",
    },
    postItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.spacing.m,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    postRank: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginRight: theme.spacing.m,
    },
    rankNumber: {
      fontSize: theme.typography.fontSize.s,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    postInfo: {
      flex: 1,
    },
    postTitle: {
      fontSize: theme.typography.fontSize.m,
      fontWeight: "500",
      color: theme.colors.text,
      marginBottom: theme.spacing.s,
    },
    postStats: {
      flexDirection: "row",
      gap: theme.spacing.m,
    },
    postStat: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    postStatText: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.muted,
    },
  })

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Analytics</Text>
        </View>
        <SkeletonLoader type="post" count={4} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        <View style={styles.overviewGrid}>
          {renderOverviewCard("Posts", analyticsData?.overview.totalPosts || 0, "document-text-outline", "+12%")}
          {renderOverviewCard("Likes", analyticsData?.overview.totalLikes || 0, "heart-outline", "+8%")}
          {renderOverviewCard("Comments", analyticsData?.overview.totalComments || 0, "chatbubble-outline", "+15%")}
          {renderOverviewCard("Shares", analyticsData?.overview.totalShares || 0, "share-outline", "+5%")}
          {renderOverviewCard("Followers", analyticsData?.overview.followers || 0, "people-outline", "+3%")}
          {renderOverviewCard("Profile Views", analyticsData?.overview.profileViews || 0, "eye-outline", "+22%")}
          {renderOverviewCard(
            "Engagement",
            `${analyticsData?.overview.engagement || 0}%`,
            "trending-up-outline",
            "+1.2%",
          )}
          {renderOverviewCard("Following", analyticsData?.overview.following || 0, "person-add-outline")}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Charts</Text>
          {renderPeriodSelector()}
          {renderChartSelector()}
          {renderChart()}
        </View>

        {renderTopPosts()}
      </ScrollView>
    </SafeAreaView>
  )
}

export default AnalyticsScreen



import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useDispatch, useSelector } from "react-redux"
import { useTheme } from "../../context/ThemeContext"
import { useAuth } from "../../context/AuthContext"
import { PostCard } from "../../components/ui/PostCard"
import { SkeletonLoader } from "../../components/ui/SkeletonLoader"
import { fetchCommentsByPostId, addComment } from "../../store/slices/commentsSlice"
import { jsonPlaceholderApi } from "../../services/api"
import type { RootState } from "../../store"

const PostDetailScreen = () => {
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const dispatch = useDispatch()
  const { theme } = useTheme()
  const { authState } = useAuth()

  const { postId } = route.params
  const comments = useSelector((state: RootState) => state.comments.byPostId[postId] || [])

  useEffect(() => {
    fetchPostDetails()
    fetchComments()
  }, [postId])

  const fetchPostDetails = async () => {
    try {
      const response = await jsonPlaceholderApi.get(`/posts/${postId}`)
      const userResponse = await jsonPlaceholderApi.get(`/users/${response.data.userId}`)

      setPost({
        ...response.data,
        user: userResponse.data,
        likes: Math.floor(Math.random() * 100),
        isLiked: false,
        comments: comments.length,
      })
    } catch (error) {
      Alert.alert("Error", "Failed to load post details")
      navigation.goBack()
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = () => {
    dispatch(fetchCommentsByPostId(postId) as any)
  }

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return

    try {
      setIsSubmittingComment(true)

      const newComment = {
        postId,
        name: "New Comment",
        email: authState.user?.email || "user@example.com",
        body: commentText.trim(),
      }

      await dispatch(addComment(newComment) as any)
      setCommentText("")
    } catch (error) {
      Alert.alert("Error", "Failed to post comment")
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const renderComment = ({ item }: { item: any }) => (
    <View style={styles.commentItem}>
      <View style={styles.commentAvatar}>
        <Text style={styles.commentAvatarText}>{item.email.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentAuthor}>{item.name}</Text>
          <Text style={styles.commentTime}>2h ago</Text>
        </View>
        <Text style={styles.commentText}>{item.body}</Text>
        <View style={styles.commentActions}>
          <TouchableOpacity style={styles.commentAction}>
            <Ionicons name="heart-outline" size={16} color={theme.colors.muted} />
            <Text style={styles.commentActionText}>Like</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.commentAction}>
            <Ionicons name="chatbubble-outline" size={16} color={theme.colors.muted} />
            <Text style={styles.commentActionText}>Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    commentsSection: {
      padding: theme.spacing.l,
    },
    commentsTitle: {
      fontSize: theme.typography.fontSize.l,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: theme.spacing.m,
    },
    commentItem: {
      flexDirection: "row",
      marginBottom: theme.spacing.l,
    },
    commentAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginRight: theme.spacing.m,
    },
    commentAvatarText: {
      color: "#FFFFFF",
      fontSize: theme.typography.fontSize.s,
      fontWeight: "600",
    },
    commentContent: {
      flex: 1,
    },
    commentHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.xs,
    },
    commentAuthor: {
      fontSize: theme.typography.fontSize.s,
      fontWeight: "600",
      color: theme.colors.text,
      marginRight: theme.spacing.s,
    },
    commentTime: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.muted,
    },
    commentText: {
      fontSize: theme.typography.fontSize.m,
      color: theme.colors.text,
      lineHeight: 20,
      marginBottom: theme.spacing.s,
    },
    commentActions: {
      flexDirection: "row",
    },
    commentAction: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: theme.spacing.l,
    },
    commentActionText: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.muted,
      marginLeft: theme.spacing.xs,
    },
    commentInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: theme.spacing.l,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      backgroundColor: theme.colors.background,
    },
    commentInputAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginRight: theme.spacing.m,
    },
    commentInputAvatarText: {
      color: "#FFFFFF",
      fontSize: theme.typography.fontSize.s,
      fontWeight: "600",
    },
    commentInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.l,
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.s,
      fontSize: theme.typography.fontSize.m,
      color: theme.colors.text,
      backgroundColor: theme.colors.card,
      marginRight: theme.spacing.m,
    },
    sendButton: {
      padding: theme.spacing.s,
    },
    emptyComments: {
      alignItems: "center",
      padding: theme.spacing.xl,
    },
    emptyCommentsText: {
      fontSize: theme.typography.fontSize.m,
      color: theme.colors.muted,
      textAlign: "center",
    },
  })

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post</Text>
        </View>
        <SkeletonLoader type="post" count={1} />
        <SkeletonLoader type="comment" count={3} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {post && (
            <PostCard
              post={post}
              onLike={() => console.log("Like post")}
              onComment={() => console.log("Comment")}
              onShare={() => console.log("Share")}
              onUserPress={() => navigation.navigate("UserProfile", { userId: post.userId })}
            />
          )}

          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>Comments ({comments.length})</Text>

            {comments.length === 0 ? (
              <View style={styles.emptyComments}>
                <Ionicons name="chatbubble-outline" size={48} color={theme.colors.muted} />
                <Text style={styles.emptyCommentsText}>No comments yet.{"\n"}Be the first to share your thoughts!</Text>
              </View>
            ) : (
              <FlatList
                data={comments}
                renderItem={renderComment}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
              />
            )}
          </View>
        </ScrollView>

        <View style={styles.commentInputContainer}>
          <View style={styles.commentInputAvatar}>
            <Text style={styles.commentInputAvatarText}>{authState.user?.name?.charAt(0) || "U"}</Text>
          </View>
          <TextInput
            style={styles.commentInput}
            placeholder="Write a comment..."
            placeholderTextColor={theme.colors.muted}
            value={commentText}
            onChangeText={setCommentText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSubmitComment}
            disabled={!commentText.trim() || isSubmittingComment}
          >
            <Ionicons
              name="send"
              size={20}
              color={commentText.trim() && !isSubmittingComment ? theme.colors.primary : theme.colors.muted}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default PostDetailScreen

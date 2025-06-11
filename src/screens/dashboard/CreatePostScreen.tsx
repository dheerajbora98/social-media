

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { useDispatch } from "react-redux"
import { useTheme } from "../../context/ThemeContext"
import { useAuth } from "../../context/AuthContext"
import { Button } from "../../components/ui/Button"
import { addNewPost } from "../../store/slices/postsSlice"

const CreatePostScreen = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [postData, setPostData] = useState({
    content: "",
    images: [] as string[],
    location: "",
    tags: [] as string[],
    privacy: "public" as "public" | "friends" | "private",
    allowComments: true,
    allowSharing: true,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [tagInput, setTagInput] = useState("")

  const navigation = useNavigation<any>()
  const dispatch = useDispatch()
  const { theme } = useTheme()
  const { authState } = useAuth()

  const steps = [
    { title: "Write Post", subtitle: "Share what's on your mind" },
    { title: "Add Media", subtitle: "Add photos or videos" },
    { title: "Add Details", subtitle: "Location, tags, and settings" },
    { title: "Review", subtitle: "Review your post before sharing" },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handlePublish()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handlePublish = async () => {
    if (!postData.content.trim()) {
      Alert.alert("Error", "Please write something for your post")
      return
    }

    try {
      setIsLoading(true)

      const newPost = {
        title: postData.content.substring(0, 50) + (postData.content.length > 50 ? "..." : ""),
        body: postData.content,
        userId: authState.user?.id || 1,
      }

      await dispatch(addNewPost(newPost) as any)

      Alert.alert("Success", "Your post has been published!", [
        { text: "OK", onPress: () => navigation.navigate("Home") },
      ])
    } catch (error) {
      Alert.alert("Error", "Failed to publish post. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant camera roll permissions to upload photos.")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    })

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => asset.uri)
      setPostData((prev) => ({ ...prev, images: [...prev.images, ...newImages] }))
    }
  }

  const removeImage = (index: number) => {
    setPostData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const addTag = () => {
    if (tagInput.trim() && !postData.tags.includes(tagInput.trim())) {
      setPostData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setPostData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{authState.user?.name?.charAt(0) || "U"}</Text>
              </View>
              <Text style={styles.userName}>{authState.user?.name || "User"}</Text>
            </View>

            <TextInput
              style={styles.contentInput}
              placeholder="What's happening?"
              placeholderTextColor={theme.colors.muted}
              value={postData.content}
              onChangeText={(text) => setPostData((prev) => ({ ...prev, content: text }))}
              multiline
              maxLength={500}
              textAlignVertical="top"
            />

            <View style={styles.charCount}>
              <Text style={styles.charCountText}>{postData.content.length}/500</Text>
            </View>
          </View>
        )

      case 1:
        return (
          <View style={styles.stepContent}>
            <TouchableOpacity style={styles.addMediaButton} onPress={pickImages}>
              <Ionicons name="camera" size={32} color={theme.colors.primary} />
              <Text style={styles.addMediaText}>Add Photos</Text>
              <Text style={styles.addMediaSubtext}>Tap to select photos from your gallery</Text>
            </TouchableOpacity>

            {postData.images.length > 0 && (
              <ScrollView horizontal style={styles.imagePreview} showsHorizontalScrollIndicator={false}>
                {postData.images.map((image, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image source={{ uri: image }} style={styles.previewImage} />
                    <TouchableOpacity style={styles.removeImageButton} onPress={() => removeImage(index)}>
                      <Ionicons name="close-circle" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        )

      case 2:
        return (
          <View style={styles.stepContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Location (Optional)</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="location-outline" size={20} color={theme.colors.muted} />
                <TextInput
                  style={styles.input}
                  placeholder="Add location"
                  placeholderTextColor={theme.colors.muted}
                  value={postData.location}
                  onChangeText={(text) => setPostData((prev) => ({ ...prev, location: text }))}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tags</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="pricetag-outline" size={20} color={theme.colors.muted} />
                <TextInput
                  style={styles.input}
                  placeholder="Add tags"
                  placeholderTextColor={theme.colors.muted}
                  value={tagInput}
                  onChangeText={setTagInput}
                  onSubmitEditing={addTag}
                  returnKeyType="done"
                />
                <TouchableOpacity onPress={addTag}>
                  <Ionicons name="add-circle" size={20} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>

              {postData.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {postData.tags.map((tag) => (
                    <TouchableOpacity key={tag} style={styles.tag} onPress={() => removeTag(tag)}>
                      <Text style={styles.tagText}>#{tag}</Text>
                      <Ionicons name="close" size={16} color={theme.colors.primary} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Privacy</Text>
              <View style={styles.privacyOptions}>
                {[
                  { key: "public", label: "Public", icon: "globe-outline" },
                  { key: "friends", label: "Friends", icon: "people-outline" },
                  { key: "private", label: "Only Me", icon: "lock-closed-outline" },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[styles.privacyOption, postData.privacy === option.key && styles.selectedPrivacyOption]}
                    onPress={() => setPostData((prev) => ({ ...prev, privacy: option.key as any }))}
                  >
                    <Ionicons
                      name={option.icon as any}
                      size={20}
                      color={postData.privacy === option.key ? "#FFFFFF" : theme.colors.muted}
                    />
                    <Text
                      style={[
                        styles.privacyOptionText,
                        postData.privacy === option.key && styles.selectedPrivacyOptionText,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )

      case 3:
        return (
          <View style={styles.stepContent}>
            <View style={styles.reviewSection}>
              <Text style={styles.reviewTitle}>Review Your Post</Text>

              <View style={styles.postPreview}>
                <View style={styles.userInfo}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{authState.user?.name?.charAt(0) || "U"}</Text>
                  </View>
                  <Text style={styles.userName}>{authState.user?.name || "User"}</Text>
                </View>

                <Text style={styles.previewContent}>{postData.content}</Text>

                {postData.images.length > 0 && (
                  <ScrollView horizontal style={styles.previewImages} showsHorizontalScrollIndicator={false}>
                    {postData.images.map((image, index) => (
                      <Image key={index} source={{ uri: image }} style={styles.previewImageSmall} />
                    ))}
                  </ScrollView>
                )}

                {postData.location && (
                  <View style={styles.previewDetail}>
                    <Ionicons name="location" size={16} color={theme.colors.muted} />
                    <Text style={styles.previewDetailText}>{postData.location}</Text>
                  </View>
                )}

                {postData.tags.length > 0 && (
                  <View style={styles.previewTags}>
                    {postData.tags.map((tag) => (
                      <Text key={tag} style={styles.previewTag}>
                        #{tag}
                      </Text>
                    ))}
                  </View>
                )}

                <View style={styles.previewDetail}>
                  <Ionicons name="globe" size={16} color={theme.colors.muted} />
                  <Text style={styles.previewDetailText}>
                    {postData.privacy === "public" ? "Public" : postData.privacy === "friends" ? "Friends" : "Only Me"}
                  </Text>
                </View>
              </View>
            </View>
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
    stepIndicator: {
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.muted,
    },
    content: {
      flex: 1,
    },
    stepContent: {
      flex: 1,
      padding: theme.spacing.l,
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.l,
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
    userName: {
      fontSize: theme.typography.fontSize.m,
      fontWeight: "600",
      color: theme.colors.text,
    },
    contentInput: {
      flex: 1,
      fontSize: theme.typography.fontSize.m,
      color: theme.colors.text,
      textAlignVertical: "top",
      minHeight: 200,
    },
    charCount: {
      alignItems: "flex-end",
      marginTop: theme.spacing.m,
    },
    charCountText: {
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.muted,
    },
    addMediaButton: {
      alignItems: "center",
      justifyContent: "center",
      padding: theme.spacing.xl,
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderStyle: "dashed",
      borderRadius: theme.borderRadius.l,
      marginBottom: theme.spacing.l,
    },
    addMediaText: {
      fontSize: theme.typography.fontSize.m,
      fontWeight: "600",
      color: theme.colors.text,
      marginTop: theme.spacing.m,
    },
    addMediaSubtext: {
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.muted,
      marginTop: theme.spacing.s,
    },
    imagePreview: {
      marginTop: theme.spacing.m,
    },
    imageContainer: {
      position: "relative",
      marginRight: theme.spacing.m,
    },
    previewImage: {
      width: 100,
      height: 100,
      borderRadius: theme.borderRadius.m,
    },
    removeImageButton: {
      position: "absolute",
      top: -8,
      right: -8,
      backgroundColor: theme.colors.error,
      borderRadius: 12,
    },
    inputGroup: {
      marginBottom: theme.spacing.l,
    },
    inputLabel: {
      fontSize: theme.typography.fontSize.m,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: theme.spacing.s,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.m,
      paddingHorizontal: theme.spacing.m,
      backgroundColor: theme.colors.card,
    },
    input: {
      flex: 1,
      paddingVertical: theme.spacing.m,
      fontSize: theme.typography.fontSize.m,
      color: theme.colors.text,
      marginLeft: theme.spacing.s,
    },
    tagsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: theme.spacing.m,
      gap: theme.spacing.s,
    },
    tag: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.primary + "20",
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.s,
      borderRadius: theme.borderRadius.l,
    },
    tagText: {
      color: theme.colors.primary,
      fontSize: theme.typography.fontSize.s,
      marginRight: theme.spacing.s,
    },
    privacyOptions: {
      flexDirection: "row",
      gap: theme.spacing.m,
    },
    privacyOption: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: theme.spacing.m,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.m,
      backgroundColor: theme.colors.card,
    },
    selectedPrivacyOption: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    privacyOptionText: {
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.text,
      marginLeft: theme.spacing.s,
    },
    selectedPrivacyOptionText: {
      color: "#FFFFFF",
    },
    reviewSection: {
      flex: 1,
    },
    reviewTitle: {
      fontSize: theme.typography.fontSize.l,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: theme.spacing.l,
    },
    postPreview: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.l,
      padding: theme.spacing.l,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    previewContent: {
      fontSize: theme.typography.fontSize.m,
      color: theme.colors.text,
      lineHeight: 22,
      marginBottom: theme.spacing.m,
    },
    previewImages: {
      marginBottom: theme.spacing.m,
    },
    previewImageSmall: {
      width: 60,
      height: 60,
      borderRadius: theme.borderRadius.s,
      marginRight: theme.spacing.s,
    },
    previewDetail: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.s,
    },
    previewDetailText: {
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.muted,
      marginLeft: theme.spacing.s,
    },
    previewTags: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: theme.spacing.s,
    },
    previewTag: {
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.primary,
      marginRight: theme.spacing.s,
    },
    footer: {
      flexDirection: "row",
      padding: theme.spacing.l,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      gap: theme.spacing.m,
    },
    backButtonStyle: {
      flex: 1,
    },
    nextButtonStyle: {
      flex: 2,
    },
  })

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{steps[currentStep].title}</Text>
          </View>
          <Text style={styles.stepIndicator}>
            {currentStep + 1}/{steps.length}
          </Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderStepContent()}
        </ScrollView>

        <View style={styles.footer}>
          {currentStep > 0 && (
            <Button title="Back" onPress={handlePrevious} variant="outline" style={styles.backButtonStyle} />
          )}
          <Button
            title={currentStep === steps.length - 1 ? "Publish" : "Next"}
            onPress={handleNext}
            loading={isLoading}
            style={styles.nextButtonStyle}
            disabled={currentStep === 0 && !postData.content.trim()}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default CreatePostScreen

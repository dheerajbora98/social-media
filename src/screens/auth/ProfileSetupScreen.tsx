

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, Image, Animated } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { useTheme } from "../../context/ThemeContext"
import { Button } from "../../components/ui/Button"
import { useAnimatedValue } from "../../hooks/useAnimatedValue"

const ProfileSetupScreen = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [profileData, setProfileData] = useState({
    avatar: null as string | null,
    bio: "",
    interests: [] as string[],
    location: "",
    website: "",
    isPublic: true,
  })
  const [isLoading, setIsLoading] = useState(false)

  const navigation = useNavigation<any>()
  const { theme } = useTheme()
  const progressAnim = useAnimatedValue(0)
  const fadeAnim = useAnimatedValue(0)

  const steps = [
    { title: "Profile Photo", subtitle: "Add a profile picture to help others recognize you" },
    { title: "About You", subtitle: "Tell us a bit about yourself" },
    { title: "Interests", subtitle: "What are you interested in?" },
    { title: "Privacy", subtitle: "Choose your privacy settings" },
  ]

  const interestOptions = [
    "Technology",
    "Travel",
    "Food",
    "Sports",
    "Music",
    "Art",
    "Photography",
    "Fashion",
    "Gaming",
    "Books",
    "Movies",
    "Fitness",
    "Nature",
    "Business",
  ]

  useState(() => {
    fadeAnim.animate({ toValue: 1, duration: 800 }).start()
    updateProgress()
  })

  const updateProgress = () => {
    const progress = (currentStep + 1) / steps.length
    progressAnim.animate({ toValue: progress, duration: 300 }).start()
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      updateProgress()
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      updateProgress()
    }
  }

  const handleComplete = async () => {
    try {
      setIsLoading(true)
      // Simulate API call to save profile
      await new Promise((resolve) => setTimeout(resolve, 2000))

      Alert.alert("Profile Setup Complete!", "Welcome to the social dashboard", [
        { text: "Continue", onPress: () => navigation.navigate("Main") },
      ])
    } catch (error) {
      Alert.alert("Error", "Failed to save profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant camera roll permissions to upload a photo.")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.canceled) {
      setProfileData((prev) => ({ ...prev, avatar: result.assets[0].uri }))
    }
  }

  const toggleInterest = (interest: string) => {
    setProfileData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
              {profileData.avatar ? (
                <Image source={{ uri: profileData.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="camera" size={40} color={theme.colors.muted} />
                </View>
              )}
              <View style={styles.cameraIcon}>
                <Ionicons name="camera" size={20} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
            <Text style={styles.stepDescription}>Choose a profile picture that represents you</Text>
          </View>
        )

      case 1:
        return (
          <View style={styles.stepContent}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[styles.textArea, { height: 100 }]}
                placeholder="Tell us about yourself..."
                placeholderTextColor={theme.colors.muted}
                value={profileData.bio}
                onChangeText={(text) => setProfileData((prev) => ({ ...prev, bio: text }))}
                multiline
                maxLength={150}
              />
              <Text style={styles.charCount}>{profileData.bio.length}/150</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                placeholder="Where are you from?"
                placeholderTextColor={theme.colors.muted}
                value={profileData.location}
                onChangeText={(text) => setProfileData((prev) => ({ ...prev, location: text }))}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Website (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="https://yourwebsite.com"
                placeholderTextColor={theme.colors.muted}
                value={profileData.website}
                onChangeText={(text) => setProfileData((prev) => ({ ...prev, website: text }))}
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>
          </View>
        )

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepDescription}>Select your interests to personalize your feed</Text>
            <View style={styles.interestsContainer}>
              {interestOptions.map((interest) => (
                <TouchableOpacity
                  key={interest}
                  style={[styles.interestChip, profileData.interests.includes(interest) && styles.interestChipSelected]}
                  onPress={() => toggleInterest(interest)}
                >
                  <Text
                    style={[
                      styles.interestText,
                      profileData.interests.includes(interest) && styles.interestTextSelected,
                    ]}
                  >
                    {interest}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )

      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepDescription}>Choose who can see your profile and posts</Text>
            <TouchableOpacity
              style={styles.privacyOption}
              onPress={() => setProfileData((prev) => ({ ...prev, isPublic: true }))}
            >
              <View style={styles.radioContainer}>
                <View style={[styles.radio, profileData.isPublic && styles.radioSelected]}>
                  {profileData.isPublic && <View style={styles.radioDot} />}
                </View>
                <View style={styles.privacyTextContainer}>
                  <Text style={styles.privacyTitle}>Public Profile</Text>
                  <Text style={styles.privacyDescription}>Anyone can see your profile and posts</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.privacyOption}
              onPress={() => setProfileData((prev) => ({ ...prev, isPublic: false }))}
            >
              <View style={styles.radioContainer}>
                <View style={[styles.radio, !profileData.isPublic && styles.radioSelected]}>
                  {!profileData.isPublic && <View style={styles.radioDot} />}
                </View>
                <View style={styles.privacyTextContainer}>
                  <Text style={styles.privacyTitle}>Private Profile</Text>
                  <Text style={styles.privacyDescription}>Only approved followers can see your posts</Text>
                </View>
              </View>
            </TouchableOpacity>
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
      padding: theme.spacing.l,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTop: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing.m,
    },
    backButton: {
      padding: theme.spacing.s,
    },
    stepCounter: {
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.muted,
    },
    progressBar: {
      height: 4,
      backgroundColor: theme.colors.border,
      borderRadius: 2,
      marginBottom: theme.spacing.m,
    },
    progressFill: {
      height: "100%",
      backgroundColor: theme.colors.primary,
      borderRadius: 2,
    },
    stepTitle: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    stepSubtitle: {
      fontSize: theme.typography.fontSize.m,
      color: theme.colors.muted,
    },
    content: {
      flex: 1,
      padding: theme.spacing.l,
    },
    stepContent: {
      flex: 1,
      alignItems: "center",
    },
    avatarContainer: {
      position: "relative",
      marginBottom: theme.spacing.xl,
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
    },
    avatarPlaceholder: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: theme.colors.card,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderStyle: "dashed",
    },
    cameraIcon: {
      position: "absolute",
      bottom: 0,
      right: 0,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    stepDescription: {
      fontSize: theme.typography.fontSize.m,
      color: theme.colors.muted,
      textAlign: "center",
      marginBottom: theme.spacing.l,
    },
    inputContainer: {
      width: "100%",
      marginBottom: theme.spacing.m,
    },
    label: {
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      fontWeight: "500",
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.m,
      padding: theme.spacing.m,
      fontSize: theme.typography.fontSize.m,
      color: theme.colors.text,
      backgroundColor: theme.colors.card,
    },
    textArea: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.m,
      padding: theme.spacing.m,
      fontSize: theme.typography.fontSize.m,
      color: theme.colors.text,
      backgroundColor: theme.colors.card,
      textAlignVertical: "top",
    },
    charCount: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.muted,
      textAlign: "right",
      marginTop: theme.spacing.xs,
    },
    interestsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.s,
      width: "100%",
    },
    interestChip: {
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.s,
      borderRadius: theme.borderRadius.l,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.card,
    },
    interestChipSelected: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    interestText: {
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.text,
    },
    interestTextSelected: {
      color: "#FFFFFF",
    },
    privacyOption: {
      width: "100%",
      padding: theme.spacing.m,
      borderRadius: theme.borderRadius.m,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: theme.spacing.m,
    },
    radioContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    radio: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: theme.colors.border,
      marginRight: theme.spacing.m,
      alignItems: "center",
      justifyContent: "center",
    },
    radioSelected: {
      borderColor: theme.colors.primary,
    },
    radioDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: theme.colors.primary,
    },
    privacyTextContainer: {
      flex: 1,
    },
    privacyTitle: {
      fontSize: theme.typography.fontSize.m,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    privacyDescription: {
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.muted,
    },
    footer: {
      padding: theme.spacing.l,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    buttonContainer: {
      flexDirection: "row",
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
      <Animated.View style={[{ flex: 1 }, { opacity: fadeAnim.value }]}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            {currentStep > 0 && (
              <TouchableOpacity style={styles.backButton} onPress={handlePrevious}>
                <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            )}
            <Text style={styles.stepCounter}>
              {currentStep + 1} of {steps.length}
            </Text>
          </View>

          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.value.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>

          <Text style={styles.stepTitle}>{steps[currentStep].title}</Text>
          <Text style={styles.stepSubtitle}>{steps[currentStep].subtitle}</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderStepContent()}
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.buttonContainer}>
            {currentStep > 0 && (
              <Button title="Back" onPress={handlePrevious} variant="outline" style={styles.backButtonStyle} />
            )}
            <Button
              title={currentStep === steps.length - 1 ? "Complete Setup" : "Next"}
              onPress={handleNext}
              loading={isLoading}
              style={styles.nextButtonStyle}
            />
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  )
}

export default ProfileSetupScreen

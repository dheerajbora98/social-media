

import type React from "react"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Share } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../context/ThemeContext"
import { useAuth } from "../../context/AuthContext"

const SettingsScreen = () => {
  const [settings, setSettings] = useState({
    notifications: {
      push: true,
      email: false,
      likes: true,
      comments: true,
      follows: true,
      mentions: true,
    },
    privacy: {
      privateAccount: false,
      showOnlineStatus: true,
      allowTagging: true,
      showReadReceipts: true,
    },
    preferences: {
      darkMode: false,
      autoPlayVideos: true,
      highQualityUploads: false,
      saveDataMode: false,
    },
  })

  const navigation = useNavigation<any>()
  const { theme, toggleTheme, isDarkMode } = useTheme()
  const { signOut } = useAuth()

  const updateSetting = (category: string, key: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }))
  }

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: signOut },
    ])
  }

  const handleDeleteAccount = () => {
    Alert.alert("Delete Account", "This action cannot be undone. All your data will be permanently deleted.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          Alert.alert("Account Deleted", "Your account has been deleted.")
          signOut()
        },
      },
    ])
  }

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: "Check out this amazing social media app!",
        url: "https://example.com/app",
      })
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  const renderSettingItem = (
    title: string,
    subtitle: string,
    value: boolean,
    onValueChange: (value: boolean) => void,
    icon: string,
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, { backgroundColor: theme.colors.primary + "20" }]}>
          <Ionicons name={icon as any} size={20} color={theme.colors.primary} />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.colors.border, true: theme.colors.primary + "50" }}
        thumbColor={value ? theme.colors.primary : theme.colors.muted}
      />
    </View>
  )

  const renderNavigationItem = (
    title: string,
    subtitle: string,
    onPress: () => void,
    icon: string,
    showChevron = true,
    danger = false,
  ) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View
          style={[
            styles.settingIcon,
            { backgroundColor: danger ? theme.colors.error + "20" : theme.colors.primary + "20" },
          ]}
        >
          <Ionicons name={icon as any} size={20} color={danger ? theme.colors.error : theme.colors.primary} />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, danger && { color: theme.colors.error }]}>{title}</Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
      </View>
      {showChevron && <Ionicons name="chevron-forward" size={20} color={theme.colors.muted} />}
    </TouchableOpacity>
  )

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
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
    section: {
      marginBottom: theme.spacing.l,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.m,
      fontWeight: "600",
      color: theme.colors.text,
      paddingHorizontal: theme.spacing.l,
      paddingVertical: theme.spacing.m,
      backgroundColor: theme.colors.card,
    },
    sectionContent: {
      backgroundColor: theme.colors.card,
    },
    settingItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: theme.spacing.l,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    settingLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    settingIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      marginRight: theme.spacing.m,
    },
    settingText: {
      flex: 1,
    },
    settingTitle: {
      fontSize: theme.typography.fontSize.m,
      fontWeight: "500",
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    settingSubtitle: {
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.muted,
      lineHeight: 18,
    },
    version: {
      padding: theme.spacing.l,
      alignItems: "center",
    },
    versionText: {
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.muted,
    },
  })

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderSection(
          "Account",
          <>
            {renderNavigationItem(
              "Edit Profile",
              "Update your profile information",
              () => navigation.navigate("ProfileSetup"),
              "person-outline",
            )}
            {renderNavigationItem(
              "Privacy & Security",
              "Manage your privacy settings",
              () => navigation.navigate("Privacy"),
              "shield-outline",
            )}
            {renderNavigationItem(
              "Blocked Users",
              "Manage blocked accounts",
              () => navigation.navigate("BlockedUsers"),
              "ban-outline",
            )}
          </>,
        )}

        {renderSection(
          "Notifications",
          <>
            {renderSettingItem(
              "Push Notifications",
              "Receive notifications on your device",
              settings.notifications.push,
              (value) => updateSetting("notifications", "push", value),
              "notifications-outline",
            )}
            {renderSettingItem(
              "Email Notifications",
              "Receive notifications via email",
              settings.notifications.email,
              (value) => updateSetting("notifications", "email", value),
              "mail-outline",
            )}
            {renderSettingItem(
              "Likes",
              "Get notified when someone likes your posts",
              settings.notifications.likes,
              (value) => updateSetting("notifications", "likes", value),
              "heart-outline",
            )}
            {renderSettingItem(
              "Comments",
              "Get notified about new comments",
              settings.notifications.comments,
              (value) => updateSetting("notifications", "comments", value),
              "chatbubble-outline",
            )}
            {renderSettingItem(
              "New Followers",
              "Get notified about new followers",
              settings.notifications.follows,
              (value) => updateSetting("notifications", "follows", value),
              "person-add-outline",
            )}
          </>,
        )}

        {renderSection(
          "Privacy",
          <>
            {renderSettingItem(
              "Private Account",
              "Only approved followers can see your posts",
              settings.privacy.privateAccount,
              (value) => updateSetting("privacy", "privateAccount", value),
              "lock-closed-outline",
            )}
            {renderSettingItem(
              "Show Online Status",
              "Let others see when you're online",
              settings.privacy.showOnlineStatus,
              (value) => updateSetting("privacy", "showOnlineStatus", value),
              "radio-button-on-outline",
            )}
            {renderSettingItem(
              "Allow Tagging",
              "Let others tag you in their posts",
              settings.privacy.allowTagging,
              (value) => updateSetting("privacy", "allowTagging", value),
              "pricetag-outline",
            )}
          </>,
        )}

        {renderSection(
          "Preferences",
          <>
            {renderSettingItem(
              "Dark Mode",
              "Use dark theme throughout the app",
              isDarkMode,
              toggleTheme,
              "moon-outline",
            )}
            {renderSettingItem(
              "Auto-play Videos",
              "Automatically play videos in feed",
              settings.preferences.autoPlayVideos,
              (value) => updateSetting("preferences", "autoPlayVideos", value),
              "play-outline",
            )}
            {renderSettingItem(
              "High Quality Uploads",
              "Upload photos and videos in high quality",
              settings.preferences.highQualityUploads,
              (value) => updateSetting("preferences", "highQualityUploads", value),
              "image-outline",
            )}
            {renderSettingItem(
              "Data Saver Mode",
              "Reduce data usage",
              settings.preferences.saveDataMode,
              (value) => updateSetting("preferences", "saveDataMode", value),
              "cellular-outline",
            )}
          </>,
        )}

        {renderSection(
          "Support",
          <>
            {renderNavigationItem(
              "Help Center",
              "Get help and support",
              () => navigation.navigate("Help"),
              "help-circle-outline",
            )}
            {renderNavigationItem(
              "Contact Us",
              "Send feedback or report issues",
              () => navigation.navigate("Contact"),
              "mail-outline",
            )}
            {renderNavigationItem(
              "Terms of Service",
              "Read our terms and conditions",
              () => navigation.navigate("Terms"),
              "document-text-outline",
            )}
            {renderNavigationItem(
              "Privacy Policy",
              "Read our privacy policy",
              () => navigation.navigate("PrivacyPolicy"),
              "shield-checkmark-outline",
            )}
          </>,
        )}

        {renderSection(
          "About",
          <>
            {renderNavigationItem("Share App", "Invite friends to join", handleShareApp, "share-outline")}
            {renderNavigationItem(
              "Rate App",
              "Rate us on the app store",
              () => console.log("Rate app"),
              "star-outline",
            )}
            {renderNavigationItem(
              "What's New",
              "See the latest updates",
              () => navigation.navigate("WhatsNew"),
              "sparkles-outline",
            )}
          </>,
        )}

        {renderSection(
          "Account Actions",
          <>
            {renderNavigationItem(
              "Sign Out",
              "Sign out of your account",
              handleSignOut,
              "log-out-outline",
              false,
              true,
            )}
            {renderNavigationItem(
              "Delete Account",
              "Permanently delete your account",
              handleDeleteAccount,
              "trash-outline",
              false,
              true,
            )}
          </>,
        )}

        <View style={styles.version}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SettingsScreen

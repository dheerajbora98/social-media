

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext"
import { Button } from "../../components/ui/Button"
import { useAnimatedValue } from "../../hooks/useAnimatedValue"

const RegisterScreen = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)

  const navigation = useNavigation<any>()
  const { signUp } = useAuth()
  const { theme } = useTheme()

  const fadeAnim = useAnimatedValue(0)
  const slideAnim = useAnimatedValue(50)

  // Animate in on mount
  useState(() => {
    fadeAnim.animate({ toValue: 1, duration: 800 }).start()
    slideAnim.animate({ toValue: 0, duration: 800 }).start()
  })

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    const { firstName, lastName, email, password, confirmPassword } = formData

    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert("Error", "Please enter your first and last name")
      return false
    }

    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address")
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address")
      return false
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long")
      return false
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match")
      return false
    }

    if (!acceptTerms) {
      Alert.alert("Error", "Please accept the terms and conditions")
      return false
    }

    return true
  }

  const handleRegister = async () => {
    if (!validateForm()) return

    try {
      setIsLoading(true)
      await signUp({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      })
      // Navigation will be handled by the auth context
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message || "Failed to create account")
    } finally {
      setIsLoading(false)
    }
  }

  const navigateToLogin = () => {
    navigation.navigate("Login")
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: "center",
      padding: theme.spacing.l,
    },
    animatedContainer: {
      opacity: fadeAnim.value,
      transform: [{ translateY: slideAnim.value }],
    },
    title: {
      fontSize: theme.typography.fontSize.xxl,
      fontWeight: "bold",
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: theme.spacing.s,
    },
    subtitle: {
      fontSize: theme.typography.fontSize.m,
      color: theme.colors.muted,
      textAlign: "center",
      marginBottom: theme.spacing.xl,
    },
    row: {
      flexDirection: "row",
      gap: theme.spacing.m,
    },
    inputContainer: {
      flex: 1,
      marginBottom: theme.spacing.m,
    },
    fullInputContainer: {
      marginBottom: theme.spacing.m,
    },
    label: {
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      fontWeight: "500",
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.m,
      backgroundColor: theme.colors.card,
    },
    input: {
      flex: 1,
      padding: theme.spacing.m,
      fontSize: theme.typography.fontSize.m,
      color: theme.colors.text,
    },
    eyeIcon: {
      padding: theme.spacing.m,
    },
    termsContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.l,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderRadius: 4,
      marginRight: theme.spacing.s,
      alignItems: "center",
      justifyContent: "center",
    },
    checkboxChecked: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    termsText: {
      flex: 1,
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.muted,
    },
    termsLink: {
      color: theme.colors.primary,
      textDecorationLine: "underline",
    },
    registerButton: {
      marginBottom: theme.spacing.xl,
    },
    loginContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    loginText: {
      color: theme.colors.muted,
      fontSize: theme.typography.fontSize.s,
    },
    loginLink: {
      color: theme.colors.primary,
      fontSize: theme.typography.fontSize.s,
      fontWeight: "600",
      marginLeft: theme.spacing.xs,
    },
  })

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.animatedContainer]}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join our social community today</Text>

            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>First Name</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="First name"
                    placeholderTextColor={theme.colors.muted}
                    value={formData.firstName}
                    onChangeText={(value) => updateFormData("firstName", value)}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Last Name</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Last name"
                    placeholderTextColor={theme.colors.muted}
                    value={formData.lastName}
                    onChangeText={(value) => updateFormData("lastName", value)}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
              </View>
            </View>

            <View style={styles.fullInputContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.colors.muted}
                  value={formData.email}
                  onChangeText={(value) => updateFormData("email", value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.fullInputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Create a password"
                  placeholderTextColor={theme.colors.muted}
                  value={formData.password}
                  onChangeText={(value) => updateFormData("password", value)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color={theme.colors.muted} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.fullInputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm your password"
                  placeholderTextColor={theme.colors.muted}
                  value={formData.confirmPassword}
                  onChangeText={(value) => updateFormData("confirmPassword", value)}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={20} color={theme.colors.muted} />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.termsContainer} onPress={() => setAcceptTerms(!acceptTerms)}>
              <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
                {acceptTerms && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
              </View>
              <Text style={styles.termsText}>
                I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>

            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={isLoading}
              style={styles.registerButton}
              fullWidth
            />

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <TouchableOpacity onPress={navigateToLogin}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default RegisterScreen

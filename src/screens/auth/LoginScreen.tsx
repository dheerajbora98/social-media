

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

const LoginScreen = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isBiometricLoading, setIsBiometricLoading] = useState(false)

  const navigation = useNavigation<any>()
  const { signIn, authenticateWithBiometrics } = useAuth()
  const { theme } = useTheme()

  const fadeAnim = useAnimatedValue(0)
  const slideAnim = useAnimatedValue(50)

  // Animate in on mount
  useState(() => {
    fadeAnim.animate({ toValue: 1, duration: 800 }).start()
    slideAnim.animate({ toValue: 0, duration: 800 }).start()
  })

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password")
      return
    }

    try {
      setIsLoading(true)
      await signIn(email, password)
      // Navigation will be handled by the auth context
    } catch (error: any) {
      Alert.alert("Login Failed", error.message || "Invalid credentials")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBiometricLogin = async () => {
    try {
      setIsBiometricLoading(true)
      const success = await authenticateWithBiometrics()

      if (success) {
        // In a real app, you'd retrieve stored credentials or token
        // For demo purposes, we'll use dummy credentials
        await signIn("eve.holt@reqres.in", "cityslicka")
      } else {
        Alert.alert("Authentication Failed", "Biometric authentication was not successful")
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Biometric authentication failed")
    } finally {
      setIsBiometricLoading(false)
    }
  }

  const navigateToRegister = () => {
    navigation.navigate("Register")
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
    inputContainer: {
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
    forgotPassword: {
      alignSelf: "flex-end",
      marginBottom: theme.spacing.l,
    },
    forgotPasswordText: {
      color: theme.colors.primary,
      fontSize: theme.typography.fontSize.s,
    },
    loginButton: {
      marginBottom: theme.spacing.m,
    },
    biometricButton: {
      marginBottom: theme.spacing.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    biometricButtonText: {
      color: theme.colors.text,
    },
    divider: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: theme.spacing.l,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.border,
    },
    dividerText: {
      marginHorizontal: theme.spacing.m,
      color: theme.colors.muted,
      fontSize: theme.typography.fontSize.s,
    },
    registerContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    registerText: {
      color: theme.colors.muted,
      fontSize: theme.typography.fontSize.s,
    },
    registerLink: {
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
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue to your social dashboard</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.colors.muted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={theme.colors.muted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color={theme.colors.muted} />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button title="Sign In" onPress={handleLogin} loading={isLoading} style={styles.loginButton} fullWidth />

            <Button
              title="Sign in with Biometrics"
              onPress={handleBiometricLogin}
              variant="outline"
              loading={isBiometricLoading}
              style={styles.biometricButton}
              textStyle={styles.biometricButtonText}
              icon={<Ionicons name="finger-print" size={20} color={theme.colors.text} />}
              fullWidth
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account?</Text>
              <TouchableOpacity onPress={navigateToRegister}>
                <Text style={styles.registerLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default LoginScreen



import { createContext, useState, useContext, type ReactNode, useEffect } from "react"
import * as SecureStore from "expo-secure-store"
import * as LocalAuthentication from "expo-local-authentication"
import { api } from "../services/api"

type User = {
  id: number
  name: string
  email: string
  username: string
  avatar?: string
}

type AuthState = {
  token: string | null
  refreshToken: string | null
  user: User | null
  isLoading: boolean
}

type AuthContextType = {
  authState: AuthState
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signUp: (userData: any) => Promise<void>
  authenticateWithBiometrics: () => Promise<boolean>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType>({
  authState: { token: null, refreshToken: null, user: null, isLoading: true },
  signIn: async () => {},
  signOut: async () => {},
  signUp: async () => {},
  authenticateWithBiometrics: async () => false,
  isAuthenticated: false,
})

export const useAuth = () => useContext(AuthContext)

type AuthProviderProps = {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    refreshToken: null,
    user: null,
    isLoading: true,
  })

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("token")
        const refreshToken = await SecureStore.getItemAsync("refreshToken")
        const userString = await SecureStore.getItemAsync("user")

        if (token && userString) {
          const user = JSON.parse(userString)
          setAuthState({
            token,
            refreshToken,
            user,
            isLoading: false,
          })
        } else {
          setAuthState((prev) => ({ ...prev, isLoading: false }))
        }
      } catch (error) {
        console.error("Failed to load auth state:", error)
        setAuthState((prev) => ({ ...prev, isLoading: false }))
      }
    }

    loadToken()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post("https://reqres.in/api/login", { email, password })
      const { token, refreshToken, user } = response.data

      await SecureStore.setItemAsync("token", token)
      await SecureStore.setItemAsync("refreshToken", refreshToken || "")
      await SecureStore.setItemAsync("user", JSON.stringify(user) || '')

      setAuthState({
        token,
        refreshToken,
        user,
        isLoading: false,
      })
    } catch (error) {
      console.error("Sign in error:", error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync("token")
      await SecureStore.deleteItemAsync("refreshToken")
      await SecureStore.deleteItemAsync("user")

      setAuthState({
        token: null,
        refreshToken: null,
        user: null,
        isLoading: false,
      })
    } catch (error) {
      console.error("Sign out error:", error)
      throw error
    }
  }

  const signUp = async (userData: any) => {
    try {
      const response = await api.post("/register", userData)
      const { token, refreshToken, user } = response.data

      await SecureStore.setItemAsync("token", token)
      await SecureStore.setItemAsync("refreshToken", refreshToken || "")
      await SecureStore.setItemAsync("user", JSON.stringify(user))

      setAuthState({
        token,
        refreshToken,
        user,
        isLoading: false,
      })
    } catch (error) {
      console.error("Sign up error:", error)
      throw error
    }
  }

  const authenticateWithBiometrics = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync()
      if (!hasHardware) {
        return false
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync()
      if (!isEnrolled) {
        return false
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to continue",
        fallbackLabel: "Use passcode",
      })

      return result.success
    } catch (error) {
      console.error("Biometric authentication error:", error)
      return false
    }
  }

  return (
    <AuthContext.Provider
      value={{
        authState,
        signIn,
        signOut,
        signUp,
        authenticateWithBiometrics,
        isAuthenticated: !!authState.token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

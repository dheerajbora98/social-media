

import type React from "react"
import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, type TextInputProps } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../context/ThemeContext"

interface FormInputProps extends TextInputProps {
  label?: string
  error?: string
  required?: boolean
  showPasswordToggle?: boolean
  leftIcon?: string
  rightIcon?: string
  onRightIconPress?: () => void
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  required,
  showPasswordToggle,
  leftIcon,
  rightIcon,
  onRightIconPress,
  secureTextEntry,
  style,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const { theme } = useTheme()

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  const styles = StyleSheet.create({
    container: {
      marginBottom: theme.spacing.m,
    },
    labelContainer: {
      flexDirection: "row",
      marginBottom: theme.spacing.xs,
    },
    label: {
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.text,
      fontWeight: "500",
    },
    required: {
      color: theme.colors.error,
      marginLeft: 2,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: error ? theme.colors.error : isFocused ? theme.colors.primary : theme.colors.border,
      borderRadius: theme.borderRadius.m,
      backgroundColor: theme.colors.card,
    },
    leftIconContainer: {
      paddingLeft: theme.spacing.m,
    },
    input: {
      flex: 1,
      padding: theme.spacing.m,
      fontSize: theme.typography.fontSize.m,
      color: theme.colors.text,
    },
    rightIconContainer: {
      paddingRight: theme.spacing.m,
    },
    errorText: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.error,
      marginTop: theme.spacing.xs,
    },
  })

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.required}>*</Text>}
        </View>
      )}

      <View style={styles.inputContainer}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            <Ionicons name={leftIcon as any} size={20} color={theme.colors.muted} />
          </View>
        )}

        <TextInput
          style={[styles.input, style]}
          secureTextEntry={showPasswordToggle ? !isPasswordVisible : secureTextEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={theme.colors.muted}
          {...props}
        />

        {showPasswordToggle && (
          <TouchableOpacity style={styles.rightIconContainer} onPress={togglePasswordVisibility}>
            <Ionicons name={isPasswordVisible ? "eye-off" : "eye"} size={20} color={theme.colors.muted} />
          </TouchableOpacity>
        )}

        {rightIcon && !showPasswordToggle && (
          <TouchableOpacity style={styles.rightIconContainer} onPress={onRightIconPress}>
            <Ionicons name={rightIcon as any} size={20} color={theme.colors.muted} />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

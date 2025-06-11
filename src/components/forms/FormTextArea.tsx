

import type React from "react"
import { useState } from "react"
import { View, Text, TextInput, StyleSheet, type TextInputProps } from "react-native"
import { useTheme } from "../../context/ThemeContext"

interface FormTextAreaProps extends TextInputProps {
  label?: string
  error?: string
  required?: boolean
  maxLength?: number
  showCharCount?: boolean
}

export const FormTextArea: React.FC<FormTextAreaProps> = ({
  label,
  error,
  required,
  maxLength,
  showCharCount = true,
  value,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const { theme } = useTheme()

  const charCount = value?.length || 0

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
      borderWidth: 1,
      borderColor: error ? theme.colors.error : isFocused ? theme.colors.primary : theme.colors.border,
      borderRadius: theme.borderRadius.m,
      backgroundColor: theme.colors.card,
    },
    input: {
      padding: theme.spacing.m,
      fontSize: theme.typography.fontSize.m,
      color: theme.colors.text,
      textAlignVertical: "top",
      minHeight: 100,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: theme.spacing.xs,
    },
    errorText: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.error,
    },
    charCount: {
      fontSize: theme.typography.fontSize.xs,
      color: maxLength && charCount > maxLength ? theme.colors.error : theme.colors.muted,
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
        <TextInput
          style={[styles.input, style]}
          multiline
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={theme.colors.muted}
          value={value}
          maxLength={maxLength}
          {...props}
        />
      </View>

      <View style={styles.footer}>
        {error ? <Text style={styles.errorText}>{error}</Text> : <View />}
        {showCharCount && maxLength && (
          <Text style={styles.charCount}>
            {charCount}/{maxLength}
          </Text>
        )}
      </View>
    </View>
  )
}



import type React from "react"
import { TouchableOpacity, Text, ActivityIndicator, type ViewStyle, type TextStyle } from "react-native"
import { useTheme } from "../../context/ThemeContext"

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "small" | "medium" | "large"
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
  style?: ViewStyle
  textStyle?: TextStyle
  fullWidth?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const { theme } = useTheme()

  const getButtonStyles = (): ViewStyle => {
    let buttonStyle: ViewStyle = {
      borderRadius: theme.borderRadius.m,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      opacity: disabled ? 0.6 : 1,
    }

    // Size styles
    switch (size) {
      case "small":
        buttonStyle = {
          ...buttonStyle,
          paddingVertical: theme.spacing.xs,
          paddingHorizontal: theme.spacing.m,
        }
        break
      case "large":
        buttonStyle = {
          ...buttonStyle,
          paddingVertical: theme.spacing.m,
          paddingHorizontal: theme.spacing.xl,
        }
        break
      default: // medium
        buttonStyle = {
          ...buttonStyle,
          paddingVertical: theme.spacing.s,
          paddingHorizontal: theme.spacing.l,
        }
    }

    // Variant styles
    switch (variant) {
      case "secondary":
        buttonStyle = {
          ...buttonStyle,
          backgroundColor: theme.colors.secondary,
        }
        break
      case "outline":
        buttonStyle = {
          ...buttonStyle,
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: theme.colors.primary,
        }
        break
      case "ghost":
        buttonStyle = {
          ...buttonStyle,
          backgroundColor: "transparent",
        }
        break
      default: // primary
        buttonStyle = {
          ...buttonStyle,
          backgroundColor: theme.colors.primary,
        }
    }

    if (fullWidth) {
      buttonStyle.width = "100%"
    }

    return buttonStyle
  }

  const getTextStyles = (): TextStyle => {
    let textStyles: TextStyle = {
      fontWeight: "600",
      fontSize: theme.typography.fontSize.m,
    }

    // Size styles
    switch (size) {
      case "small":
        textStyles = {
          ...textStyles,
          fontSize: theme.typography.fontSize.s,
        }
        break
      case "large":
        textStyles = {
          ...textStyles,
          fontSize: theme.typography.fontSize.l,
        }
        break
    }

    // Variant styles
    switch (variant) {
      case "outline":
      case "ghost":
        textStyles = {
          ...textStyles,
          color: theme.colors.primary,
        }
        break
      default: // primary, secondary
        textStyles = {
          ...textStyles,
          color: "#FFFFFF",
        }
    }

    return textStyles
  }

  return (
    <TouchableOpacity
      style={[getButtonStyles(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "outline" || variant === "ghost" ? theme.colors.primary : "#FFFFFF"}
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={[getTextStyles(), icon ? { marginLeft: theme.spacing.s } : {}, textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  )
}



import type React from "react"
import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../context/ThemeContext"

interface SelectOption {
  label: string
  value: string
}

interface FormSelectProps {
  label?: string
  error?: string
  required?: boolean
  placeholder?: string
  options: SelectOption[]
  value?: string
  onSelect: (value: string) => void
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  error,
  required,
  placeholder = "Select an option",
  options,
  value,
  onSelect,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const { theme } = useTheme()

  const selectedOption = options.find((option) => option.value === value)

  const handleSelect = (selectedValue: string) => {
    onSelect(selectedValue)
    setIsModalVisible(false)
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
    selectContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: error ? theme.colors.error : theme.colors.border,
      borderRadius: theme.borderRadius.m,
      backgroundColor: theme.colors.card,
      padding: theme.spacing.m,
    },
    selectText: {
      fontSize: theme.typography.fontSize.m,
      color: selectedOption ? theme.colors.text : theme.colors.muted,
    },
    errorText: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.error,
      marginTop: theme.spacing.xs,
    },
    modal: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.l,
      padding: theme.spacing.l,
      width: "80%",
      maxHeight: "60%",
    },
    modalTitle: {
      fontSize: theme.typography.fontSize.l,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: theme.spacing.m,
      textAlign: "center",
    },
    optionItem: {
      padding: theme.spacing.m,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    optionText: {
      fontSize: theme.typography.fontSize.m,
      color: theme.colors.text,
    },
    selectedOption: {
      backgroundColor: theme.colors.primary + "20",
    },
    selectedOptionText: {
      color: theme.colors.primary,
      fontWeight: "600",
    },
    closeButton: {
      marginTop: theme.spacing.m,
      padding: theme.spacing.m,
      backgroundColor: theme.colors.border,
      borderRadius: theme.borderRadius.m,
      alignItems: "center",
    },
    closeButtonText: {
      color: theme.colors.text,
      fontWeight: "600",
    },
  })

  const renderOption = ({ item }: { item: SelectOption }) => (
    <TouchableOpacity
      style={[styles.optionItem, item.value === value && styles.selectedOption]}
      onPress={() => handleSelect(item.value)}
    >
      <Text style={[styles.optionText, item.value === value && styles.selectedOptionText]}>{item.label}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.required}>*</Text>}
        </View>
      )}

      <TouchableOpacity style={styles.selectContainer} onPress={() => setIsModalVisible(true)}>
        <Text style={styles.selectText}>{selectedOption?.label || placeholder}</Text>
        <Ionicons name="chevron-down" size={20} color={theme.colors.muted} />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{label || "Select Option"}</Text>
            <FlatList
              data={options}
              renderItem={renderOption}
              keyExtractor={(item) => item.value}
              showsVerticalScrollIndicator={false}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

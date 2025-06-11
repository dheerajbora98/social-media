interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
}

interface ValidationSchema {
  [key: string]: ValidationRule
}

export const validationSchemas = {
  login: {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      required: true,
      minLength: 6,
    },
  },

  register: {
    firstName: {
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    lastName: {
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      required: true,
      minLength: 8,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    },
    confirmPassword: {
      required: true,
      custom: (value: string, formData: any) => {
        return value === formData.password || "Passwords do not match"
      },
    },
  },

  post: {
    content: {
      required: true,
      minLength: 1,
      maxLength: 500,
    },
    tags: {
      custom: (value: string[]) => {
        return value.length <= 10 || "Maximum 10 tags allowed"
      },
    },
  },

  profile: {
    bio: {
      maxLength: 150,
    },
    website: {
      pattern: /^https?:\/\/.+/,
    },
  },
}

export function validateField(value: any, rule: ValidationRule, formData?: any): string | null {
  if (rule.required && (!value || (typeof value === "string" && !value.trim()))) {
    return "This field is required"
  }

  if (value && typeof value === "string") {
    if (rule.minLength && value.length < rule.minLength) {
      return `Minimum ${rule.minLength} characters required`
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      return `Maximum ${rule.maxLength} characters allowed`
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      return "Invalid format"
    }
  }

  if (rule.custom) {
    const result = rule.custom(value, formData)
    if (typeof result === "string") {
      return result
    }
    if (!result) {
      return "Invalid value"
    }
  }

  return null
}

export function validateForm(formData: any, schema: ValidationSchema): Record<string, string> {
  const errors: Record<string, string> = {}

  for (const [field, rule] of Object.entries(schema)) {
    const error = validateField(formData[field], rule, formData)
    if (error) {
      errors[field] = error
    }
  }

  return errors
}

export interface Theme {
  colors: {
    primary: string
    secondary: string
    background: string
    card: string
    text: string
    border: string
    notification: string
    error: string
    success: string
    warning: string
    info: string
    muted: string
  }
  spacing: {
    xs: number
    s: number
    m: number
    l: number
    xl: number
    xxl: number
  }
  borderRadius: {
    s: number
    m: number
    l: number
    xl: number
  }
  typography: {
    fontFamily: {
      regular: string
      medium: string
      bold: string
    }
    fontSize: {
      xs: number
      s: number
      m: number
      l: number
      xl: number
      xxl: number
    }
  }
}

export const lightTheme: Theme = {
  colors: {
    primary: "#5E60CE",
    secondary: "#7400B8",
    background: "#FFFFFF",
    card: "#F9F9F9",
    text: "#1A1A1A",
    border: "#E0E0E0",
    notification: "#FF4D4F",
    error: "#FF4D4F",
    success: "#52C41A",
    warning: "#FAAD14",
    info: "#1890FF",
    muted: "#8C8C8C",
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    s: 4,
    m: 8,
    l: 16,
    xl: 24,
  },
  typography: {
    fontFamily: {
      regular: "System",
      medium: "System",
      bold: "System",
    },
    fontSize: {
      xs: 12,
      s: 14,
      m: 16,
      l: 18,
      xl: 20,
      xxl: 24,
    },
  },
}

export const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: "#6A64F1",
    secondary: "#9D4EDD",
    background: "#121212",
    card: "#1E1E1E",
    text: "#FFFFFF",
    border: "#333333",
    muted: "#999999",
  },
}

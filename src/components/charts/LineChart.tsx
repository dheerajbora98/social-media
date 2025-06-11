

import type React from "react"
import { View, Dimensions, StyleSheet } from "react-native"
import { LineChart as RNLineChart } from "react-native-chart-kit"
import { useTheme } from "../../context/ThemeContext"

interface LineChartProps {
  data: {
    labels: string[]
    datasets: Array<{
      data: number[]
      color?: (opacity: number) => string
      strokeWidth?: number
    }>
  }
  width?: number
  height?: number
  chartConfig?: any
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  width = Dimensions.get("window").width - 32,
  height = 220,
  chartConfig,
}) => {
  const { theme } = useTheme()

  const defaultChartConfig = {
    backgroundColor: theme.colors.card,
    backgroundGradientFrom: theme.colors.card,
    backgroundGradientTo: theme.colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(94, 96, 206, ${opacity})`,
    labelColor: (opacity = 1) => theme.colors.text,
    style: {
      borderRadius: theme.borderRadius.m,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: theme.colors.primary,
    },
  }

  return (
    <View style={styles.container}>
      <RNLineChart
        data={data}
        width={width}
        height={height}
        chartConfig={chartConfig || defaultChartConfig}
        bezier
        style={styles.chart}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
})

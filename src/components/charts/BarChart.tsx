

import type React from "react"
import { View, Dimensions, StyleSheet } from "react-native"
import { BarChart as RNBarChart } from "react-native-chart-kit"
import { useTheme } from "../../context/ThemeContext"

interface BarChartProps {
  data: {
    labels: string[]
    datasets: Array<{
      data: number[]
    }>
  }
  width?: number
  height?: number
  chartConfig?: any
}

export const BarChart: React.FC<BarChartProps> = ({
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
    color: (opacity = 1) => `rgba(116, 0, 184, ${opacity})`,
    labelColor: (opacity = 1) => theme.colors.text,
    style: {
      borderRadius: theme.borderRadius.m,
    },
  }

  return (
    <View style={styles.container}>
      <RNBarChart
        data={data}
        width={width}
        height={height}
        chartConfig={chartConfig || defaultChartConfig}
        style={styles.chart}
        yAxisLabel=""
        yAxisSuffix=""
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

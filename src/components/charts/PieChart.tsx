

import type React from "react"
import { View, Dimensions, StyleSheet } from "react-native"
import { PieChart as RNPieChart } from "react-native-chart-kit"
import { useTheme } from "../../context/ThemeContext"

interface PieChartData {
  name: string
  population: number
  color: string
  legendFontColor?: string
  legendFontSize?: number
}

interface PieChartProps {
  data: PieChartData[]
  width?: number
  height?: number
  chartConfig?: any
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  width = Dimensions.get("window").width - 32,
  height = 220,
  chartConfig,
}) => {
  const { theme } = useTheme()

  const defaultChartConfig = {
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  }

  const processedData = data.map((item) => ({
    ...item,
    legendFontColor: item.legendFontColor || theme.colors.text,
    legendFontSize: item.legendFontSize || 12,
  }))

  return (
    <View style={styles.container}>
      <RNPieChart
        data={processedData}
        width={width}
        height={height}
        chartConfig={chartConfig || defaultChartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
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

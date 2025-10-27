<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import type { SensorData, BehaviorData } from '@/types/api'
import { colorConfig } from '@/config/colors'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface Props {
  data: (SensorData | BehaviorData)[]
  fieldKey: string
  fieldLabel: string
}

const props = defineProps<Props>()

// Compute chart data
const chartData = computed<ChartData<'line'>>(() => {
  const labels = props.data.map((row) => {
    const date = new Date(row.c_time)
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  })

  const values = props.data.map((row) => {
    const rowData = row as unknown as Record<string, unknown>
    const value = rowData[props.fieldKey]
    return value !== null && value !== undefined ? parseFloat(String(value)) : null
  })

  return {
    labels,
    datasets: [
      {
        label: props.fieldLabel,
        data: values,
        borderColor: colorConfig.primary,
        backgroundColor: `${colorConfig.primary}33`,
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  }
})

// Chart options
const chartOptions = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
    },
    tooltip: {
      mode: 'index',
      intersect: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      },
    },
    x: {
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      },
    },
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false,
  },
}))
</script>

<template>
  <div class="line-chart">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.line-chart {
  width: 100%;
  height: 300px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>

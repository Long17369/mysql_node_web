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
  type ChartDataset,
  type Point,
  Filler,
} from 'chart.js'
import type { Data, FieldMapper } from '@/types/api'
import { colorConfig } from '@/config/colors'

// Chart.js 组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

// 组件 Props
interface Props {
  mapper: FieldMapper[]
  data: Data[]
}

const props = defineProps<Props>()

// 图表数据
const chartData = computed<ChartData<'line'>>(() => {
  const labels = props.data.map((row) => {
    const date = new Date(row.c_time)
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  })

  const datasets: ChartDataset<'line', (number | Point | null)[]>[] = []
  Object.entries(props.mapper).forEach((value) => {
    const key = parseInt(value[0])
    const map = value[1]
    const data = {
      label: map.f_name,
      data: props.data.map((row) => {
        const rowData = row as unknown as Record<string, unknown>
        const value = rowData[map.db_name]
        return value !== null && value !== undefined ? parseFloat(String(value)) : null
      }),
      borderColor: colorConfig.primary[key],
      backgroundColor: `${colorConfig.primary[key]}33`,
      tension: 0.4,
      fill: true,
      pointRadius: 4,
      pointHoverRadius: 6,
    }
    datasets.push(data)
  })

  return {
    labels,
    datasets: datasets,
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
  height: 300px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>

<template>
  <div class="line-chart">
    <LineChart :data="chartData" :options="chartOptions" />
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType, computed } from 'vue'
import { Line as LineChart } from 'vue-chartjs'
import type { ChartData } from '../types'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default defineComponent({
  name: 'LineChartComponent',
  components: {
    LineChart,
  },
  props: {
    data: {
      type: Object as PropType<ChartData>,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const getColor = (index: number, alpha = 1) => {
      const colors = [
        `rgba(75, 192, 192, ${alpha})`,
        `rgba(255, 99, 132, ${alpha})`,
        `rgba(54, 162, 235, ${alpha})`,
        `rgba(255, 206, 86, ${alpha})`,
        `rgba(153, 102, 255, ${alpha})`,
        `rgba(255, 159, 64, ${alpha})`,
      ]
      return colors[index % colors.length]
    }

    const chartData = computed(() => ({
      labels: props.data.labels,
      datasets: props.data.datasets.map((dataset, index) => ({
        label: dataset.label,
        data: dataset.data,
        borderColor: dataset.borderColor || getColor(index),
        backgroundColor: dataset.backgroundColor || getColor(index, 0.2),
        tension: 0.3,
      })),
    }))

    const chartOptions = computed(() => ({
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: !!props.title,
          text: props.title,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    }))

    return {
      chartData,
      chartOptions,
    }
  },
})
</script>

<style scoped>
.line-chart {
  position: relative;
  height: 400px;
  width: 100%;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>

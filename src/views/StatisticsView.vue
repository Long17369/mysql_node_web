<template>
  <div class="statistics-view">
    <div class="header">
      <h1>统计数据</h1>
      <button @click="loadData" class="refresh-btn">刷新数据</button>
    </div>

    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="charts-container">
      <div class="chart-wrapper">
        <LineChart :data="salesData" title="每日销售额趋势" />
      </div>
      
      <div class="chart-wrapper">
        <LineChart :data="ordersData" title="每日订单数量" />
      </div>
      
      <div class="chart-wrapper">
        <LineChart :data="usersData" title="用户增长趋势" />
      </div>
      
      <div class="stats-cards">
        <div class="stat-card">
          <h3>总用户数</h3>
          <p class="stat-value">{{ totalUsers }}</p>
        </div>
        <div class="stat-card">
          <h3>总订单数</h3>
          <p class="stat-value">{{ totalOrders }}</p>
        </div>
        <div class="stat-card">
          <h3>总销售额</h3>
          <p class="stat-value">¥{{ totalSales.toLocaleString() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import LineChart from '../components/LineChart.vue'
import api from '../services/api'
import type { ChartData } from '../types'

export default defineComponent({
  name: 'StatisticsView',
  components: {
    LineChart,
  },
  setup() {
    const loading = ref(false)
    const error = ref<string | undefined>(undefined)

    const salesData = ref<ChartData>({
      labels: [],
      datasets: []
    })

    const ordersData = ref<ChartData>({
      labels: [],
      datasets: []
    })

    const usersData = ref<ChartData>({
      labels: [],
      datasets: []
    })

    const totalUsers = ref(0)
    const totalOrders = ref(0)
    const totalSales = ref(0)

    const loadData = async () => {
      loading.value = true
      error.value = undefined
      try {
        const data = await api.getStatistics()
        
        // Process data for charts - data is now properly typed
        salesData.value = data.salesData
        ordersData.value = data.ordersData
        usersData.value = data.usersData
        totalUsers.value = data.totalUsers
        totalOrders.value = data.totalOrders
        totalSales.value = data.totalSales
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : '加载数据失败'
        console.warn('API unavailable, using mock data:', errorMessage)
        
        // Mock data for demonstration when API is not available
        const days = ['10-20', '10-21', '10-22', '10-23', '10-24', '10-25', '10-26']
        
        salesData.value = {
          labels: days,
          datasets: [{
            label: '销售额',
            data: [15000, 18000, 12000, 22000, 19000, 25000, 28000],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
          }]
        }

        ordersData.value = {
          labels: days,
          datasets: [{
            label: '订单数量',
            data: [45, 52, 38, 65, 58, 72, 80],
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
          }]
        }

        usersData.value = {
          labels: days,
          datasets: [{
            label: '新增用户',
            data: [5, 8, 12, 15, 10, 18, 22],
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
          }]
        }

        totalUsers.value = 1247
        totalOrders.value = 3856
        totalSales.value = 458392
        
        error.value = '⚠️ API不可用，显示示例数据'
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      loadData()
    })

    return {
      loading,
      error,
      salesData,
      ordersData,
      usersData,
      totalUsers,
      totalOrders,
      totalSales,
      loadData,
    }
  },
})
</script>

<style scoped>
.statistics-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

h1 {
  font-size: 2em;
  color: #2c3e50;
  margin: 0;
}

.refresh-btn {
  padding: 10px 20px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1em;
  transition: background 0.3s ease;
}

.refresh-btn:hover {
  background: #45a049;
}

.loading,
.error {
  padding: 40px;
  text-align: center;
  color: #666;
}

.error {
  color: #d32f2f;
}

.charts-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.chart-wrapper {
  width: 100%;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.stat-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-card h3 {
  font-size: 1em;
  color: #7f8c8d;
  margin: 0 0 15px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-value {
  font-size: 2.5em;
  font-weight: bold;
  color: #2c3e50;
  margin: 0;
}
</style>

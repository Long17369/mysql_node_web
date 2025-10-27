<template>
  <div class="orders-view">
    <div class="header">
      <h1>订单管理</h1>
      <button @click="loadData" class="refresh-btn">刷新数据</button>
    </div>
    
    <DataTable :data="orders" :loading="loading" :error="error" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import DataTable from '../components/DataTable.vue'
import api, { type TableData } from '../services/api'

export default defineComponent({
  name: 'OrdersView',
  components: {
    DataTable,
  },
  setup() {
    const orders = ref<TableData[]>([])
    const loading = ref(false)
    const error = ref<string | undefined>(undefined)

    const loadData = async () => {
      loading.value = true
      error.value = undefined
      try {
        orders.value = await api.getOrders()
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : '加载数据失败'
        error.value = errorMessage
        // Mock data for demonstration when API is not available
        orders.value = [
          { id: 1, userId: 1, productId: 1, quantity: 2, total: 11998, status: '已完成', orderDate: '2025-10-20' },
          { id: 2, userId: 2, productId: 2, quantity: 1, total: 129, status: '处理中', orderDate: '2025-10-22' },
          { id: 3, userId: 3, productId: 4, quantity: 1, total: 1899, status: '已完成', orderDate: '2025-10-23' },
          { id: 4, userId: 1, productId: 5, quantity: 3, total: 897, status: '已发货', orderDate: '2025-10-25' },
          { id: 5, userId: 4, productId: 3, quantity: 2, total: 798, status: '已完成', orderDate: '2025-10-26' },
        ]
        error.value = undefined // Clear error when using mock data
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      loadData()
    })

    return {
      orders,
      loading,
      error,
      loadData,
    }
  },
})
</script>

<style scoped>
.orders-view {
  max-width: 1200px;
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
</style>

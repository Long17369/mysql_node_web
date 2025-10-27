<template>
  <div class="products-view">
    <div class="header">
      <h1>产品管理</h1>
      <button @click="loadData" class="refresh-btn">刷新数据</button>
    </div>
    
    <DataTable :data="products" :loading="loading" :error="error" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import DataTable from '../components/DataTable.vue'
import api, { type TableData } from '../services/api'

export default defineComponent({
  name: 'ProductsView',
  components: {
    DataTable,
  },
  setup() {
    const products = ref<TableData[]>([])
    const loading = ref(false)
    const error = ref<string | undefined>(undefined)

    const loadData = async () => {
      loading.value = true
      error.value = undefined
      try {
        products.value = await api.getProducts()
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : '加载数据失败'
        error.value = errorMessage
        // Mock data for demonstration when API is not available
        products.value = [
          { id: 1, name: '笔记本电脑', price: 5999, stock: 50, category: '电子产品' },
          { id: 2, name: '无线鼠标', price: 129, stock: 200, category: '电子产品' },
          { id: 3, name: '机械键盘', price: 399, stock: 80, category: '电子产品' },
          { id: 4, name: '显示器', price: 1899, stock: 30, category: '电子产品' },
          { id: 5, name: '耳机', price: 299, stock: 120, category: '音频设备' },
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
      products,
      loading,
      error,
      loadData,
    }
  },
})
</script>

<style scoped>
.products-view {
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

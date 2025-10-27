<template>
  <div class="users-view">
    <div class="header">
      <h1>用户管理</h1>
      <button @click="loadData" class="refresh-btn">刷新数据</button>
    </div>
    
    <DataTable :data="users" :loading="loading" :error="error" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import DataTable from '../components/DataTable.vue'
import api from '../services/api'
import type { TableData } from '../types'

export default defineComponent({
  name: 'UsersView',
  components: {
    DataTable,
  },
  setup() {
    const users = ref<TableData[]>([])
    const loading = ref(false)
    const error = ref<string | undefined>(undefined)

    const loadData = async () => {
      loading.value = true
      error.value = undefined
      try {
        users.value = await api.getUsers()
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : '加载数据失败'
        console.warn('API unavailable, using mock data:', errorMessage)
        // Mock data for demonstration when API is not available
        users.value = [
          { id: 1, name: '张三', email: 'zhang@example.com', age: 28, role: 'admin' },
          { id: 2, name: '李四', email: 'li@example.com', age: 32, role: 'user' },
          { id: 3, name: '王五', email: 'wang@example.com', age: 25, role: 'user' },
          { id: 4, name: '赵六', email: 'zhao@example.com', age: 35, role: 'moderator' },
        ]
        error.value = '⚠️ API不可用，显示示例数据'
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      loadData()
    })

    return {
      users,
      loading,
      error,
      loadData,
    }
  },
})
</script>

<style scoped>
.users-view {
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

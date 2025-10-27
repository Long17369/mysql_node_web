<template>
  <div class="data-table">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error" :class="{ 'warning': error.includes('⚠️') }">{{ error }}</div>
    <div v-else>
      <table>
        <thead>
          <tr>
            <th v-for="column in columns" :key="column">{{ formatHeader(column) }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in data" :key="index">
            <td v-for="column in columns" :key="column">{{ row[column] }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="data.length === 0" class="no-data">暂无数据</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { TableData } from '../types'

export default defineComponent({
  name: 'DataTable',
  props: {
    data: {
      type: Array as PropType<TableData[]>,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: undefined,
    },
  },
  computed: {
    columns(): string[] {
      if (this.data.length === 0) return []
      return Object.keys(this.data[0])
    },
  },
  methods: {
    formatHeader(column: string): string {
      // Convert camelCase or snake_case to readable format
      return column
        .replace(/([A-Z])/g, ' $1')
        .replace(/_/g, ' ')
        .replace(/^./, (str) => str.toUpperCase())
        .trim()
    },
  },
})
</script>

<style scoped>
.data-table {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

thead {
  background: #4CAF50;
  color: white;
}

th,
td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85em;
  letter-spacing: 0.5px;
}

tbody tr:hover {
  background-color: #f5f5f5;
}

tbody tr:last-child td {
  border-bottom: none;
}

.loading,
.error,
.no-data {
  padding: 40px;
  text-align: center;
  color: #666;
}

.error {
  color: #d32f2f;
}

.warning {
  color: #f57c00;
  background: #fff3e0;
  padding: 12px;
  border-radius: 4px;
  border-left: 4px solid #f57c00;
}
</style>

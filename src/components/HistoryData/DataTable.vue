<script setup lang="ts">
import type { Data } from '@/types/api'
import { colorConfig } from '@/config/colors'

// 组件 Props
interface Props {
  headers: { key: string; label: string }[]
  sortField: string
  sortDesc: boolean
  data: Data[]
  sortBy: (arg0: string) => void
  getCellValue: (row: Data, key: string) => void
}

defineProps<Props>()
</script>

<template>
  <div class="data-table">
    <table>
      <thead>
        <tr>
          <th
            v-for="header in headers"
            :key="header.key"
            @click="sortBy(header.key)"
            :class="{ sortable: true, active: sortField === header.key }"
          >
            {{ header.label }}
            <span v-if="sortField === header.key" class="sort-icon">
              {{ sortDesc ? '▼' : '▲' }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in data"
          :key="row.id"
          :class="{ even: index % 2 === 0, odd: index % 2 === 1 }"
        >
          <td v-for="header in headers" :key="header.key">
            {{ getCellValue(row, header.key) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="css" scoped>
.data-table {
  overflow: overlay;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th {
  background: v-bind('colorConfig.tableHeaderBg');
  padding: 12px 8px;
  text-align: center;
  font-weight: 600;
  border-bottom: 2px solid v-bind('colorConfig.tableBorder');
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  position: relative;
}

th.sortable:hover {
  background: #ebebeb;
}

th.active {
  background: #e3f2fd;
  color: #1976d2;
}

.sort-icon {
  font-size: 10px;
  margin-left: 4px;
  position: absolute;
  z-index: 1;
}

td {
  text-align: center;
  padding: 10px 8px;
  border-bottom: 1px solid #eee;
}

tbody tr.even {
  background: v-bind('colorConfig.tableRowEven');
}

tbody tr.odd {
  background: v-bind('colorConfig.tableRowOdd');
}

tbody tr:hover {
  background: v-bind('colorConfig.tableRowHover');
}
</style>

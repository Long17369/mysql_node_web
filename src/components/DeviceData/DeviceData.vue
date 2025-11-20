<script setup lang="ts">
import { colorConfig } from '@/config/colors'
import { getDevice } from '@/services/api'
import type { Device } from '@/types/api'
import { ref, onMounted } from 'vue'

// 组件 Props
interface Props {
  title: string
}

defineProps<Props>()

// 表头接口
interface Header {
  key: string
  label: string
}

const data = ref<Device[]>([])
const headers = ref<Header[]>([])

headers.value = [
  { key: 'device_name', label: '设备名称' },
  { key: 'number', label: '设备编号' },
  { key: 'remarks', label: '备注' },
  { key: 'c_time', label: '创建时间' },
]

// 格式化日期
function formatDate(dateString: string | null) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('zh-CN')
}

// 获取单元格值
function getCellValue(row: Device, key: string) {
  const rowRecord = row as unknown as Record<string, unknown>
  const value = rowRecord[key]
  if (key === 'c_time') {
    return formatDate(value as string | null)
  }
  return value ?? '-'
}

// 修改数据
function modifyData(id: number, index: number) {
  console.log(`Modify data with ID: ${id} at index: ${index}`)
}

// 删除数据
function deleteData(id: number, index: number) {
  console.log(`Delete data with ID: ${id} at index: ${index}`)
}

onMounted(async () => {
  data.value = await getDevice()
})
</script>

<template>
  <div class="deviceData">
    <h2>{{ title }}</h2>
    <div class="data">
      <table>
        <thead>
          <tr>
            <th v-for="value in headers" :key="value.key">{{ value.label }}</th>
            <th>操作</th>
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
            <td>
              <span class="modify" @click="() => modifyData(row.id, index)">修改</span>
              <span class="delete" @click="() => deleteData(row.id, index)">删除</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.modify {
  color: #1976d2;
  cursor: pointer;
  margin-right: 10px;
}

.delete {
  color: #d32f2f;
  cursor: pointer;
}

.deviceData {
  padding: 20px;
  background: #fff;
  height: calc(100vh - 40px);
}

.deviceData > h2 {
  margin: 0 0 2% 0;
  color: #333;
}

.data {
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

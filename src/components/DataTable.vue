<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type {
  FieldMapper,
  SensorData,
  BehaviorData,
  SensorDevice,
  BehaviorDevice,
} from '@/types/api'
import { colorConfig } from '@/config/colors'
import LineChart from './LineChart.vue'

interface Props {
  title: string
  fetchMapper: () => Promise<FieldMapper[]>
  fetchData: (params: {
    limit: number
    offset: number
    order_table: string
    desc: boolean
    where: object
  }) => Promise<(SensorData | BehaviorData)[]>
  fetchDevice: () => Promise<(SensorDevice | BehaviorDevice)[]>
}

const props = defineProps<Props>()

const mapper = ref<FieldMapper[]>([])
const data = ref<(SensorData | BehaviorData)[]>([])
const device = ref<(SensorDevice | BehaviorDevice)[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// Pagination and sorting state
const currentPage = ref(1)
const pageSize = ref(10)
const sortField = ref('id')
const sortDesc = ref(false)
const viewMode = ref<'table' | 'chart'>('table')
const whereDoNo = ref<string | undefined>(undefined)
const selectedChartField = ref<string>('')

// Compute visible columns from mapper
const visibleColumns = computed(() => {
  return mapper.value.filter((field) => field.visible === '1')
})

// Compute table headers
const headers = computed(() => {
  const baseHeaders = [
    { key: 'id', label: 'ID' },
    { key: 'd_no', label: '设备编号' },
  ]

  const fieldHeaders = visibleColumns.value.map((field) => ({
    key: field.db_name,
    label: field.f_name + (field.unit ? ` (${field.unit})` : ''),
  }))

  const endHeaders = [
    { key: 'c_time', label: '更新时间' },
    { key: 'online', label: '在线状态' },
  ]

  return [...baseHeaders, ...fieldHeaders, ...endHeaders]
})

// Compute total pages (we don't have total count, so show navigation)
const offset = computed(() => (currentPage.value - 1) * pageSize.value)
const hasNextPage = computed(() => data.value.length === pageSize.value)

// Load field mapper
async function loadMapper() {
  try {
    mapper.value = await props.fetchMapper()
  } catch (e) {
    error.value = '加载字段映射失败: ' + (e as Error).message
  }
}

// Load data
async function loadData() {
  loading.value = true
  error.value = null
  try {
    data.value = await props.fetchData({
      limit: pageSize.value,
      offset: offset.value,
      order_table: sortField.value,
      desc: sortDesc.value,
      where: { d_no: whereDoNo.value },
    })
  } catch (e) {
    error.value = '加载数据失败: ' + (e as Error).message
  } finally {
    loading.value = false
  }
}

async function loadDevice() {
  try {
    device.value = await props.fetchDevice()
  } catch (e) {
    error.value = '加载设备列表失败: ' + (e as Error).message
  }
}

// Sort by column
function sortBy(field: string) {
  if (sortField.value === field) {
    sortDesc.value = !sortDesc.value
  } else {
    sortField.value = field
    sortDesc.value = false
  }
  currentPage.value = 1
  loadData()
}

// Pagination controls
function nextPage() {
  currentPage.value++
  loadData()
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    loadData()
  }
}

function changePageSize(size: number) {
  pageSize.value = size
  currentPage.value = 1
  loadData()
}

// Format date
function formatDate(dateString: string | null) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('zh-CN')
}

// Get cell value
function getCellValue(row: SensorData | BehaviorData, key: string) {
  const rowRecord = row as unknown as Record<string, unknown>
  const value = rowRecord[key]
  if (key === 'c_time') {
    return formatDate(value as string | null)
  }
  return value ?? '-'
}

// Initialize
onMounted(async () => {
  await loadMapper()
  await loadData()
  await loadDevice()
})

// Watch page size changes
watch(pageSize, () => {
  currentPage.value = 1
  loadData()
})

watch(whereDoNo, () => {
  loadData()
})

// Initialize selected chart field
watch(
  visibleColumns,
  (newColumns) => {
    if (newColumns.length > 0 && !selectedChartField.value) {
      selectedChartField.value = newColumns[0].db_name
    }
  },
  { immediate: true },
)

// Compute chart field label
const selectedChartFieldLabel = computed(() => {
  const field = visibleColumns.value.find((f) => f.db_name === selectedChartField.value)
  return field ? field.f_name + (field.unit ? ` (${field.unit})` : '') : ''
})
</script>

<template>
  <div class="data-table">
    <div class="table-header">
      <h2>{{ title }}</h2>
      <div class="controls">
        <div class="view-toggle">
          <button :class="{ active: viewMode === 'table' }" @click="viewMode = 'table'">
            表格视图
          </button>
          <button :class="{ active: viewMode === 'chart' }" @click="viewMode = 'chart'">
            图表视图
          </button>
        </div>
        <label v-if="viewMode === 'table'">
          每页显示:
          <select
            :value="pageSize"
            @change="changePageSize(Number(($event.target as HTMLSelectElement).value))"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </label>
        <label v-if="viewMode === 'chart' && visibleColumns.length > 0">
          选择字段:
          <select v-model="selectedChartField">
            <option v-for="field in visibleColumns" :key="field.db_name" :value="field.db_name">
              {{ field.f_name }}
            </option>
          </select>
        </label>
        <label>
          选择设备:
          <select v-model="whereDoNo">
            <option :value="undefined">全部</option>
            <option v-for="field in device" :key="field.d_no" :value="field.d_no">
              {{ field.d_no }}
            </option>
          </select>
        </label>
      </div>
    </div>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else-if="viewMode === 'chart'" class="chart-container">
      <LineChart
        v-if="data.length > 0 && selectedChartField"
        :data="data"
        :field-key="selectedChartField"
        :field-label="selectedChartFieldLabel"
      />
      <div v-else class="no-data">暂无数据</div>
    </div>

    <div v-else class="table-container">
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

    <div v-if="viewMode === 'table'" class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
      <span class="page-info">第 {{ currentPage }} 页</span>
      <button @click="nextPage" :disabled="!hasNextPage">下一页</button>
    </div>

    <div v-if="viewMode === 'table'" class="stats">
      共显示 {{ data.length }} 条记录 | 排序字段: {{ sortField }} {{ sortDesc ? '降序' : '升序' }}
    </div>
  </div>
</template>

<style scoped>
.data-table {
  margin: 20px 0;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.table-header h2 {
  margin: 0;
  color: #333;
}

.controls {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.view-toggle {
  display: flex;
  gap: 4px;
  background: #f5f5f5;
  padding: 4px;
  border-radius: 6px;
}

.view-toggle button {
  padding: 6px 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  font-size: 13px;
  transition: all 0.2s ease;
}

.view-toggle button:hover {
  background: rgba(25, 118, 210, 0.1);
}

.view-toggle button.active {
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  color: #1976d2;
}

.controls label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.controls select {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.error {
  color: #d32f2f;
  background: #ffebee;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 16px;
}

.chart-container {
  margin-bottom: 16px;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #666;
  background: white;
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
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid v-bind('colorConfig.tableBorder');
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
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
}

td {
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

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
}

.pagination button {
  padding: 8px 16px;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.pagination button:hover:not(:disabled) {
  background: #1565c0;
}

.pagination button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #666;
}

.stats {
  text-align: center;
  margin-top: 12px;
  font-size: 13px;
  color: #666;
}
</style>

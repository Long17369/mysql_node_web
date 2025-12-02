<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { FieldMapper, Data, Device, DataCount, Where, WhereCondition } from '@/types/api'
import LineChart from './LineChart.vue'
import DataTable from './DataTable.vue'
import TimeRangePicker from '../TimeRangePicker.vue'
import '@/assets/controls.css'

// 组件 Props
interface Props {
  title: string
  showChart?: boolean
  fetchMapper: () => Promise<FieldMapper[]>
  fetchData: (params: {
    limit: number
    offset: number
    order_table: string
    desc: boolean
    where: Where
  }) => Promise<Data[]>
  fetchDevice: () => Promise<Device[]>
  fetchCount: (where: object) => Promise<DataCount>
  fetchTimeRange: (where: object) => Promise<{ minTime: string; maxTime: string }>
}

const props = withDefaults(defineProps<Props>(), {
  showChart: true,
})

// 状态变量
const mapper = ref<FieldMapper[]>([])
const data = ref<Data[]>([])
const dataCount = ref<DataCount>({
  count: 0,
})
const device = ref<Device[]>([])

let loadTimer: number = -1
const loadingState = ref<boolean>(false)
const loading = computed({
  get: () => loadingState.value,
  set: (val: boolean) => {
    clearTimeout(loadTimer)
    loadTimer = -1
    if (val === false) {
      loadingState.value = false
    } else {
      loadTimer = setTimeout(() => {
        loadingState.value = val
      }, 300)
    }
  },
})

const error = ref<string | null>(null)

// 分页和排序状态
const pageSize = ref(10)
const offset = ref(0)
const currentPage = computed({
  get: () => Math.floor(offset.value / pageSize.value) + 1,
  set: (val) => {
    offset.value = (val - 1) * pageSize.value
  },
})
const sortField = ref('id')
const sortDesc = ref(false)
const viewMode = ref<'table' | 'chart'>('table')
const whereDoNo = ref<string | undefined>(undefined)
const selectedChartField = ref<string>('')
const startTime = ref<Date>()
const endTime = ref<Date>()
const minTime = ref<Date>(new Date('2020-01-01'))
const maxTime = ref<Date>(new Date())

const pageCount = computed(() => {
  return Math.ceil(dataCount.value.count / pageSize.value)
})

// Compute visible columns from mapper
const visibleColumns = computed(() => {
  return mapper.value.filter((field) => field.visible === '1')
})

// Compute table headers
const headers = computed(() => {
  const baseHeaders = [{ key: 'd_no', label: '设备编号' }]

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
// const offset = computed(() => (currentPage.value - 1) * pageSize.value)

// Load field mapper
async function loadMapper() {
  try {
    mapper.value = await props.fetchMapper()
  } catch (err) {
    error.value = 'Failed to load field mapper'
    console.error(err)
  }
}

async function loadTimeRange() {
  try {
    const range = await props.fetchTimeRange({})
    if (range.minTime) {
      minTime.value = new Date(range.minTime)
    }
    if (range.maxTime) {
      maxTime.value = new Date(range.maxTime)
    }
  } catch (err) {
    console.error('Failed to load time range:', err)
  }
}

function getWhereParams(): Where {
  const where: Where = {}
  if (whereDoNo.value !== undefined) {
    where.d_no = {
      value: whereDoNo.value,
      operator: '=',
    }
  }

  const timeConditions: WhereCondition[] = []
  if (startTime.value) {
    timeConditions.push({
      value: startTime.value.toISOString(),
      operator: '>=',
    })
  }
  if (endTime.value) {
    timeConditions.push({
      value: endTime.value.toISOString(),
      operator: '<=',
    })
  }

  if (timeConditions.length > 0) {
    where.c_time = timeConditions
  }
  return where
}

// Load data
async function loadData() {
  loading.value = true
  error.value = null
  try {
    const where = getWhereParams()
    data.value = await props.fetchData({
      limit: pageSize.value,
      offset: offset.value,
      order_table: sortField.value,
      desc: sortDesc.value,
      where: where,
    })
  } catch (e) {
    error.value = '加载数据失败: ' + (e as Error).message
  } finally {
    clearTimeout(loadTimer)
    loading.value = false
  }
}

async function loadDataCount() {
  const where = getWhereParams()
  dataCount.value = await props.fetchCount(where)
  console.log(dataCount.value)
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
function setPage(pageNumber: number) {
  if (currentPage.value === pageNumber) return
  if (!Number.isInteger(pageNumber)) return
  if (pageNumber <= 0) return
  if (pageNumber > pageCount.value) return
  currentPage.value = pageNumber
  loadData()
}

function showPage(pageNumber: number) {
  if (pageNumber === 0) return false
  if (pageNumber === 1) return true
  if (pageCount.value !== 1 && pageNumber === pageCount.value) return true
  if (Math.abs(pageNumber - currentPage.value) < 3) return true
  return false
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
function getCellValue(row: Data, key: string) {
  const rowRecord = row as unknown as Record<string, unknown>
  const value = rowRecord[key]
  if (key === 'c_time') {
    return formatDate(value as string | null)
  }
  return value ?? '-'
}

// Initialize
onMounted(() => {
  loadMapper()
  loadDevice()
  loadData()
  loadTimeRange()
})

watch(
  () => [offset.value, pageSize.value, sortField.value, sortDesc.value],
  () => {
    loadData()
    loadDataCount()
  },
)

function handleQuery() {
  currentPage.value = 1
  loadData()
  loadDataCount()
}

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

// Chart interaction
const isDragging = ref(false)
const startX = ref(0)
const startOffset = ref(0)
const chartWidth = ref(0)

function handleWheel(event: WheelEvent) {
  if (event.deltaY < 0) {
    if (pageSize.value > 5) {
      pageSize.value = Math.max(5, pageSize.value - 1)
    }
  } else {
    if (pageSize.value < 100) {
      pageSize.value = Math.min(100, pageSize.value + 1)
    }
  }
}

function handleMouseDown(event: MouseEvent) {
  isDragging.value = true
  startX.value = event.clientX
  startOffset.value = offset.value
  const el = event.currentTarget as HTMLElement
  chartWidth.value = el.clientWidth
}

let lastUpdate = 0

function handleMouseMove(event: MouseEvent) {
  if (!isDragging.value) return

  const now = Date.now()
  if (now - lastUpdate < 50) return
  lastUpdate = now

  const currentX = event.clientX
  const diffX = currentX - startX.value

  if (chartWidth.value > 0) {
    const deltaData = -Math.round((diffX / chartWidth.value) * pageSize.value)
    if (deltaData !== 0) {
      const newOffset = startOffset.value + deltaData
      // 边界检查
      if (newOffset >= 0 && newOffset < dataCount.value.count) {
        offset.value = newOffset
      } else if (newOffset < 0) {
        offset.value = 0
      } else if (newOffset >= dataCount.value.count) {
        offset.value = dataCount.value.count - 1
      }
    }
  }
}

function handleMouseUp() {
  isDragging.value = false
}

function handleMouseLeave() {
  isDragging.value = false
}
</script>

<template>
  <div class="data-table">
    <div class="table-header">
      <h2>{{ title }}</h2>
      <div class="controls">
        <TimeRangePicker
          v-model:start-time="startTime"
          v-model:end-time="endTime"
          :min-time="minTime"
          :max-time="maxTime"
        />
        <label>
          选择设备:
          <select v-model="whereDoNo">
            <option :value="undefined">全部</option>
            <option v-for="field in device" :key="field.device_name" :value="field.device_name">
              {{ field.device_name }}
            </option>
          </select>
        </label>
        <button class="query-btn" @click="handleQuery">查询</button>
      </div>
    </div>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>

    <div v-else-if="data.length === 0" class="empty-state">
      <p>暂无数据</p>
    </div>

    <template v-else>
      <DataTable
        :data="data"
        :headers="headers"
        :sort-desc="sortDesc"
        :sort-field="sortField"
        :get-cell-value="getCellValue"
        :sort-by="sortBy"
      />

      <LineChart
        v-if="showChart"
        :mapper="mapper"
        :data="data"
        :field-key="selectedChartField"
        :field-label="selectedChartFieldLabel"
        @wheel.prevent="handleWheel"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseLeave"
      />
    </template>

    <div v-if="viewMode === 'table'" class="pagination">
      <button @click="() => setPage(currentPage - 1)" :disabled="currentPage === 1">上一页</button>
      <ul id="pageSelect">
        <li v-for="(_, index) in Array.from({ length: pageCount + 1 })" :key="index">
          <button
            @click="() => setPage(index)"
            v-if="showPage(index)"
            :disabled="index === currentPage"
          >
            {{ index }}
          </button>
        </li>
      </ul>
      <button @click="() => setPage(currentPage + 1)" :disabled="currentPage === pageCount">
        下一页
      </button>
      <span class="page-info">第 {{ currentPage }} 页, 共 {{ pageCount }} 页</span>
      <div class="controls">
        <label>
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
      </div>
    </div>
  </div>
</template>

<style scoped>
.data-table {
  padding: 20px;
  background: #fff;
  height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.table-header > h2 {
  margin: 0;
  color: #333;
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

.loading-state,
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #666;
  min-height: 200px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.stats {
  text-align: center;
  margin-top: 12px;
  font-size: 13px;
  color: #666;
}

#pageSelect {
  display: flex;
  padding: 0;
}
#pageSelect > li {
  list-style-type: none;
}

.query-btn {
  padding: 6px 16px;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  height: 32px;
}

.query-btn:hover {
  background: #1565c0;
}
</style>

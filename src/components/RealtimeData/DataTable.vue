<script setup lang="ts">
import type { Data, DataCount, Device, FieldMapper, Where } from '@/types/api'
import DataCard from './DataCard.vue'
import { onMounted, onUnmounted, ref, watch } from 'vue'

// 组件 Props
interface Props {
  title: string
  fetchMapper: () => Promise<FieldMapper[]>
  fetchData: (where?: Where) => Promise<Data[]>
  fetchDevice: () => Promise<Device[]>
  fetchCount: (where: object) => Promise<DataCount>
}
const props = defineProps<Props>()

// 状态变量
const data = ref<Data[]>([])
const mapper = ref<FieldMapper[]>([])
const device = ref<Device[]>([])

const time = ref<number>(1000)
const timer = ref<number>()
const d_no = ref<string>()
const loading = ref(true)

// 加载数据
async function loadData() {
  try {
    data.value = await props.fetchData(
      d_no.value === undefined
        ? {}
        : {
            d_no: {
              value: d_no.value,
              operator: '=',
            },
          },
    )
  } finally {
    loading.value = false
  }
  timer.value = setTimeout(loadData, time.value)
}

const loadMapper = async () => (mapper.value = await props.fetchMapper())
const loadDevice = async () => (device.value = await props.fetchDevice())

watch(d_no, () => {
  loadData()
})

onMounted(async () => {
  loadMapper()
  loadDevice()
  loadData()
})

onUnmounted(async () => {
  clearTimeout(timer.value)
  timer.value = undefined
})
</script>
<template>
  <div class="DataTable">
    <div class="controls">
      <label>
        <select v-model="d_no">
          <option :value="undefined" selected>全部设备</option>
          <option v-for="item in device" :key="item.device_name" :value="item.device_name">
            {{ item.device_name }}
          </option>
        </select>
      </label>
    </div>

    <div v-if="loading && data.length === 0" class="loading-state">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>

    <div v-else-if="data.length === 0" class="empty-state">
      <p>暂无实时数据</p>
    </div>

    <div v-else class="data">
      <DataCard v-for="item in data" :data="item" :mapper="mapper" :key="item.id" />
    </div>
  </div>
</template>
<style scoped>
.loading-state,
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #666;
  height: 90%;
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

.data {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  height: 90%;
}
.DataTable {
  height: 100vh;
}
.controls {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
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
</style>

<script setup lang="ts">
import type { Data, DataCount, Device, FieldMapper } from '@/types/api'
import DataCard from './DataCard.vue'
import { onMounted, onUnmounted, ref, watch } from 'vue'
interface Props {
  title: string
  fetchMapper: () => Promise<FieldMapper[]>
  fetchData: (where?: object) => Promise<Data[]>
  fetchDevice: () => Promise<Device[]>
  fetchCount: (where: object) => Promise<DataCount>
}
const props = defineProps<Props>()

const data = ref<Data[]>([])
const mapper = ref<FieldMapper[]>([])
const device = ref<Device[]>([])

const time = ref<number>(1000)
const timer = ref<number>()
const d_no = ref<string>()

async function loadData() {
  data.value = await props.fetchData({
    d_no: d_no.value,
  })
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
    <div class="data">
      <DataCard v-for="item in data" :data="item" :mapper="mapper" :key="item.id" />
    </div>
  </div>
</template>
<style scoped>
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

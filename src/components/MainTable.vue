<script setup lang="ts">
import DataTable from './DataTable.vue'
import {
  getSensorData,
  getBehaviorData,
  getSensorDevice,
  getBehaviorDevice,
  getSensorFieldMapper,
  getBehaviorFieldMapper,
} from '../services/api'
import type {
  BehaviorData,
  BehaviorDevice,
  FieldMapper,
  SensorData,
  SensorDevice,
} from '@/types/api'
import { computed } from 'vue'

interface Table {
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

interface Tables {
  [key: string]: Table
}

const tables: Tables = {
  sensor: {
    title: '传感器数据表',
    fetchMapper: getSensorFieldMapper,
    fetchData: getSensorData,
    fetchDevice: getSensorDevice,
  },
  behavior: {
    title: '行为数据表',
    fetchMapper: getBehaviorFieldMapper,
    fetchData: getBehaviorData,
    fetchDevice: getBehaviorDevice,
  },
}

interface Props {
  activeTab: string
}

const props = defineProps<Props>()

const table = computed(() => {
  console.log(tables[props.activeTab])
  return tables[props.activeTab]
})
</script>

<template>
  <div>
    <DataTable
      :key="table.title"
      :title="table.title"
      :fetch-mapper="table.fetchMapper"
      :fetch-data="table.fetchData"
      :fetch-device="table.fetchDevice"
    />
  </div>
</template>

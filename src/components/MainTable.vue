<script setup lang="ts">
import DataComp from './DataComp.vue'
import {
  getSensorData,
  getBehaviorData,
  getSensorDevice,
  getBehaviorDevice,
  getSensorFieldMapper,
  getBehaviorFieldMapper,
  getSensorDataCount,
  getBehaviorDataCount,
} from '../services/api'
import type { Data, Device, FieldMapper, DataCount } from '@/types/api'
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
  }) => Promise<Data[]>
  fetchDevice: () => Promise<Device[]>
  fetchCount: (where: object) => Promise<DataCount>
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
    fetchCount: getSensorDataCount,
  },
  behavior: {
    title: '行为数据表',
    fetchMapper: getBehaviorFieldMapper,
    fetchData: getBehaviorData,
    fetchDevice: getBehaviorDevice,
    fetchCount: getBehaviorDataCount,
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
  <div class="maintable">
    <DataComp
      :key="table.title"
      :title="table.title"
      :fetch-mapper="table.fetchMapper"
      :fetch-data="table.fetchData"
      :fetch-device="table.fetchDevice"
      :fetch-count="table.fetchCount"
    />
  </div>
</template>

<style>
.maintable {
  width: 100%;
  height: 100%;
}
</style>

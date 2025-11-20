<script setup lang="ts">
import type { Data, DataCount, Device, FieldMapper, Where } from '@/types/api'
import { computed } from 'vue'
import {
  getBehaviorData,
  getBehaviorDataCount,
  getDevice,
  getBehaviorFieldMapper,
  getSensorData,
  getSensorDataCount,
  getSensorFieldMapper,
  getSensorTimeRange,
  getBehaviorTimeRange,
} from '../services/api'
import DataComp from './HistoryData/DataComp.vue'
import DataTable from './RealtimeData/DataTable.vue'
import SettingTable from './SettingData/SettingTable.vue'
import DeviceData from './DeviceData/DeviceData.vue'

interface HistoryData {
  fetchMapper: () => Promise<FieldMapper[]>
  fetchData: (params: {
    limit?: number
    offset?: number
    order_table?: string
    desc?: boolean
    where?: Where
  }) => Promise<Data[]>
  fetchDevice: () => Promise<Device[]>
  fetchCount: (where: object) => Promise<DataCount>
  fetchTimeRange: (where: object) => Promise<{ minTime: string; maxTime: string }>
}

interface RealtimeData {
  fetchMapper: () => Promise<FieldMapper[]>
  fetchData: (where?: Where) => Promise<Data[]>
  fetchDevice: () => Promise<Device[]>
  fetchCount: (where: object) => Promise<DataCount>
}

interface HistoryTable {
  title: string
  data: HistoryData
  type: 'HistoryTable'
}

interface RealtimeTable {
  title: string
  data: RealtimeData
  type: 'RealtimeTable'
}

interface DeviceTable {
  title: string
  type: 'DeviceTable'
}

interface SettingTable {
  title: string
  type: 'SettingTable'
}

interface Tables {
  [key: string]: HistoryTable | RealtimeTable | SettingTable | DeviceTable
}

const tables: Tables = {
  sensorRealtime: {
    title: '实时传感器数据',
    type: 'RealtimeTable',
    data: {
      fetchMapper: getSensorFieldMapper,
      fetchData: (where?: Where) =>
        getSensorData({
          limit: 1,
          order_table: 'c_time',
          where: where,
          desc: true,
        }),
      fetchDevice: getDevice,
      fetchCount: getSensorDataCount,
    },
  },
  sensorHistory: {
    title: '历史传感器数据',
    type: 'HistoryTable',
    data: {
      fetchMapper: getSensorFieldMapper,
      fetchData: getSensorData,
      fetchDevice: getDevice,
      fetchCount: getSensorDataCount,
      fetchTimeRange: getSensorTimeRange,
    },
  },
  behaviorRealtime: {
    title: '实时行为数据',
    type: 'RealtimeTable',
    data: {
      fetchMapper: getBehaviorFieldMapper,
      fetchData: (where?: Where) =>
        getBehaviorData({
          limit: 1,
          order_table: 'c_time',
          where: where,
          desc: true,
        }),
      fetchDevice: getDevice,
      fetchCount: getBehaviorDataCount,
    },
  },
  behaviorHistory: {
    title: '历史行为数据',
    type: 'HistoryTable',
    data: {
      fetchMapper: getBehaviorFieldMapper,
      fetchData: getBehaviorData,
      fetchDevice: getDevice,
      fetchCount: getBehaviorDataCount,
      fetchTimeRange: getBehaviorTimeRange,
    },
  },
  deviceManger: {
    title: '设备管理',
    type: 'DeviceTable',
  },
  setting: {
    title: '设置',
    type: 'SettingTable',
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
      v-if="table.type === 'HistoryTable'"
      :key="table.title"
      :title="table.title"
      :fetch-mapper="table.data.fetchMapper"
      :fetch-data="table.data.fetchData"
      :fetch-device="table.data.fetchDevice"
      :fetch-count="table.data.fetchCount"
      :fetch-time-range="table.data.fetchTimeRange"
    />
    <DataTable
      v-if="table.type === 'RealtimeTable'"
      :key="table.title"
      :title="table.title"
      :fetch-mapper="table.data.fetchMapper"
      :fetch-data="table.data.fetchData"
      :fetch-device="table.data.fetchDevice"
      :fetch-count="table.data.fetchCount"
    />
    <DeviceData :title="table.title" v-if="props.activeTab === 'deviceManger'" />
    <SettingTable v-if="props.activeTab === 'SettingTable'" />
  </div>
</template>

<style scoped>
.maintable {
  width: 100%;
  height: 100%;
}
</style>

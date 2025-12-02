<script setup lang="ts">
import type { Data, DataCount, Device, FieldMapper, Where } from '@/types/api'
import { computed, ref } from 'vue'
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
  getErrorData,
  getErrorDataCount,
  getErrorFieldMapper,
  getErrorTimeRange,
} from '../services/api'
import DataComp from './HistoryData/DataComp.vue'
import DataTable from './RealtimeData/DataTable.vue'
import SettingTable from './SettingData/SettingTable.vue'
import DeviceData from './DeviceData/DeviceData.vue'
import DeviceConfig from './DeviceConfig/DeviceConfig.vue'

// 历史数据接口
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

// 实时数据接口
interface RealtimeData {
  fetchMapper: () => Promise<FieldMapper[]>
  fetchData: (where?: Where) => Promise<Data[]>
  fetchDevice: () => Promise<Device[]>
  fetchCount: (where: object) => Promise<DataCount>
}

// 历史数据表配置
interface HistoryTable {
  title: string
  data: HistoryData
  type: 'HistoryTable'
  showChart?: boolean
}

// 实时数据表配置
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
  errorData: {
    title: '错误数据',
    type: 'HistoryTable',
    showChart: false,
    data: {
      fetchMapper: getErrorFieldMapper,
      fetchData: getErrorData,
      fetchDevice: getDevice,
      fetchCount: getErrorDataCount,
      fetchTimeRange: getErrorTimeRange,
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
  deviceConfig: {
    title: '设备配置',
    type: 'DeviceConfigTable',
  },
}

interface Props {
  activeTab: string
  currentDeviceNo: string
  setActiveTab: (tab: string, dNo?: string) => void
}

const props = defineProps<Props>()

const dataType = ref<'sensor' | 'behavior'>('sensor')

const table = computed(() => {
  if (props.activeTab === 'realtimeData') {
    return dataType.value === 'sensor' ? tables.sensorRealtime : tables.behaviorRealtime
  }
  if (props.activeTab === 'historyData') {
    return dataType.value === 'sensor' ? tables.sensorHistory : tables.behaviorHistory
  }
  return tables[props.activeTab]
})
</script>

<template>
  <div class="maintable">
    <div
      v-if="props.activeTab === 'realtimeData' || props.activeTab === 'historyData'"
      class="type-selector"
    >
      <label :class="{ active: dataType === 'sensor' }">
        <input type="radio" v-model="dataType" value="sensor" />
        传感器数据
      </label>
      <label :class="{ active: dataType === 'behavior' }">
        <input type="radio" v-model="dataType" value="behavior" />
        行为数据
      </label>
    </div>
    <div class="content-container">
      <Transition name="fade" mode="out-in">
        <DataComp
          v-if="table.type === 'HistoryTable'"
          :key="table.title + 'H'"
          :title="table.title"
          :show-chart="table.showChart"
          :fetch-mapper="table.data.fetchMapper"
          :fetch-data="table.data.fetchData"
          :fetch-device="table.data.fetchDevice"
          :fetch-count="table.data.fetchCount"
          :fetch-time-range="table.data.fetchTimeRange"
        />
        <DataTable
          v-else-if="table.type === 'RealtimeTable'"
          :key="table.title + 'R'"
          :title="table.title"
          :fetch-mapper="table.data.fetchMapper"
          :fetch-data="table.data.fetchData"
          :fetch-device="table.data.fetchDevice"
          :fetch-count="table.data.fetchCount"
        />
        <DeviceData
          v-else-if="table.type === 'DeviceTable'"
          :key="table.title + 'D'"
          :title="table.title"
        />
        <SettingTable v-else-if="table.type === 'SettingTable'" :key="table.title + 'S'" />
        <DeviceConfig
          v-else-if="table.type === 'DeviceConfigTable'"
          :key="table.title + 'C'"
          :d-no="props.currentDeviceNo"
        />
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.maintable {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
}

.content-container {
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.type-selector {
  margin: 20px;
  display: inline-flex;
  background: #e9ecef;
  padding: 4px;
  border-radius: 12px;
  width: fit-content;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
}

.type-selector label {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 24px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  color: #6c757d;
  font-weight: 500;
  user-select: none;
  min-width: 100px;
}

.type-selector label:hover:not(.active) {
  color: #495057;
  background: rgba(255, 255, 255, 0.5);
}

.type-selector label.active {
  background: #fff;
  color: #228be6;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.08),
    0 1px 2px rgba(0, 0, 0, 0.04);
  font-weight: 600;
}

.type-selector input {
  display: none;
}
</style>

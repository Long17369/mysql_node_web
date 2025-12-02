<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { getDevice } from '@/services/api'
import type { Device } from '@/types/api'
import DeviceControl from '@/components/DeviceData/DeviceControl.vue'

const props = defineProps<{
  dNo?: string
}>()

const devices = ref<Device[]>([])
const selectedDeviceNo = ref<string>('')

const fetchDevices = async () => {
  try {
    devices.value = await getDevice()
  } catch (error) {
    console.error('Failed to fetch devices:', error)
  }
}

const handleDeviceChange = (val: string) => {
  selectedDeviceNo.value = val
}

onMounted(async () => {
  await fetchDevices()
  if (props.dNo) {
    selectedDeviceNo.value = props.dNo
  } else if (devices.value.length > 0 && !selectedDeviceNo.value) {
    // 默认选中第一个? 或者保持为空
    // selectedDeviceNo.value = devices.value[0].number
  }
})

// 监听 props 变化 (如果从外部传入 dNo)
watch(
  () => props.dNo,
  (newVal) => {
    if (newVal) {
      selectedDeviceNo.value = newVal
    }
  },
)
</script>

<template>
  <div class="device-config-page">
    <div class="header">
      <h2>设备配置</h2>
      <div class="selector">
        <label>选择设备：</label>
        <el-select v-model="selectedDeviceNo" placeholder="请选择设备" @change="handleDeviceChange">
          <el-option
            v-for="device in devices"
            :key="device.id"
            :label="device.device_name + ' (' + device.number + ')'"
            :value="device.number"
          />
        </el-select>
      </div>
    </div>

    <div class="content">
      <div v-if="!selectedDeviceNo" class="empty-state">请先选择一个设备进行配置</div>
      <DeviceControl v-else :d-no="selectedDeviceNo" :key="selectedDeviceNo" />
    </div>
  </div>
</template>

<style scoped>
.device-config-page {
  padding: 20px;
  background: #fff;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

.header h2 {
  margin: 0;
  color: #333;
}

.selector {
  align-items: center;
  text-wrap: nowrap;
}

.content {
  flex: 1;
  overflow-y: auto;
}

.empty-state {
  color: #909399;
  text-align: center;
  margin-top: 50px;
  font-size: 16px;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import MainMenu from './components/MainMenu.vue'

import MainTable from './components/MainTable.vue'

// 当前激活的标签页
const activeTab = ref<string>('sensorRealtime')
// 当前选中的设备编号 (用于设备配置页面)
const currentDeviceNo = ref<string>('')

// 设置激活的标签页
function setActiveTab(value: string, dNo?: string) {
  console.log(value, dNo)
  activeTab.value = value
  if (dNo) {
    currentDeviceNo.value = dNo
  }
}
</script>

<template>
  <div class="app">
    <MainMenu :set-active-tab="(val) => setActiveTab(val)" />
    <MainTable
      :active-tab="activeTab"
      :current-device-no="currentDeviceNo"
      :set-active-tab="setActiveTab"
    />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #31b1af 0%, #2d9c91 100%);
  display: flex;
}
</style>

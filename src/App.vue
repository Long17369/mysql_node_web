<script setup lang="ts">
import { ref } from 'vue'
import MainMenu from './components/MainMenu.vue'

import MainTable from './components/MainTable.vue'

const activeTab = ref<string>('sensor')

function setActiveTab(value: string) {
  console.log(value)
  activeTab.value = value
}
</script>

<template>
  <div class="app">
    <MainMenu :set-active-tab="setActiveTab" />
    <MainTable :active-tab="activeTab" />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #31b1af 0%, #2d9c91 100%);
  display: flex;
}
</style>

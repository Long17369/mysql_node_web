<script setup lang="ts">
import { ref } from 'vue'
import DataTable from './components/DataTable.vue'
import ColorSettings from './components/ColorSettings.vue'
import { getSensorFieldMapper, getSensorData, getBehaviorFieldMapper, getBehaviorData } from './services/api'

const activeTab = ref<'sensor' | 'behavior'>('sensor')
</script>

<template>
  <div class="app">
    <ColorSettings />
    
    <header>
      <h1>数据监控系统</h1>
      <p>传感器数据与行为数据展示</p>
    </header>

    <div class="tabs">
      <button
        :class="{ active: activeTab === 'sensor' }"
        @click="activeTab = 'sensor'"
      >
        📊 传感器数据
      </button>
      <button
        :class="{ active: activeTab === 'behavior' }"
        @click="activeTab = 'behavior'"
      >
        📈 行为数据
      </button>
    </div>

    <main>
      <DataTable
        v-if="activeTab === 'sensor'"
        title="传感器数据表"
        :fetch-mapper="getSensorFieldMapper"
        :fetch-data="getSensorData"
      />

      <DataTable
        v-if="activeTab === 'behavior'"
        title="行为数据表"
        :fetch-mapper="getBehaviorFieldMapper"
        :fetch-data="getBehaviorData"
      />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

header {
  text-align: center;
  color: white;
  margin-bottom: 30px;
}

header h1 {
  margin: 0;
  font-size: 2.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

header p {
  margin: 10px 0 0;
  font-size: 1.1rem;
  opacity: 0.9;
}

.tabs {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 20px;
}

.tabs button {
  padding: 12px 24px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.tabs button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.tabs button.active {
  background: white;
  color: #667eea;
  border-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

main {
  max-width: 1400px;
  margin: 0 auto;
}
</style>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
</style>


<script setup lang="ts">
import { ref } from 'vue'
import { colorConfig, updateColorConfig, resetColorConfig } from '@/config/colors'

const showSettings = ref(false)

function toggleSettings() {
  showSettings.value = !showSettings.value
}

function handleColorChange(key: keyof typeof colorConfig, event: Event) {
  const target = event.target as HTMLInputElement
  updateColorConfig({ [key]: target.value })
}

function handleReset() {
  resetColorConfig()
}
</script>

<template>
  <div class="color-settings">
    <button class="settings-toggle" @click="toggleSettings" title="颜色设置">
      🎨 颜色配置
    </button>

    <div v-if="showSettings" class="settings-panel">
      <div class="settings-header">
        <h3>颜色配置</h3>
        <button class="close-btn" @click="toggleSettings">✕</button>
      </div>

      <div class="settings-content">
        <div class="color-item">
          <label>主色调:</label>
          <input
            type="color"
            :value="colorConfig.primary"
            @input="handleColorChange('primary', $event)"
          />
          <span>{{ colorConfig.primary }}</span>
        </div>

        <div class="color-item">
          <label>次要色调:</label>
          <input
            type="color"
            :value="colorConfig.secondary"
            @input="handleColorChange('secondary', $event)"
          />
          <span>{{ colorConfig.secondary }}</span>
        </div>

        <div class="color-item">
          <label>表头背景:</label>
          <input
            type="color"
            :value="colorConfig.tableHeaderBg"
            @input="handleColorChange('tableHeaderBg', $event)"
          />
          <span>{{ colorConfig.tableHeaderBg }}</span>
        </div>

        <div class="color-item">
          <label>表格偶数行:</label>
          <input
            type="color"
            :value="colorConfig.tableRowEven"
            @input="handleColorChange('tableRowEven', $event)"
          />
          <span>{{ colorConfig.tableRowEven }}</span>
        </div>

        <div class="color-item">
          <label>表格奇数行:</label>
          <input
            type="color"
            :value="colorConfig.tableRowOdd"
            @input="handleColorChange('tableRowOdd', $event)"
          />
          <span>{{ colorConfig.tableRowOdd }}</span>
        </div>

        <div class="color-item">
          <label>表格悬停:</label>
          <input
            type="color"
            :value="colorConfig.tableRowHover"
            @input="handleColorChange('tableRowHover', $event)"
          />
          <span>{{ colorConfig.tableRowHover }}</span>
        </div>

        <div class="color-item">
          <label>表格边框:</label>
          <input
            type="color"
            :value="colorConfig.tableBorder"
            @input="handleColorChange('tableBorder', $event)"
          />
          <span>{{ colorConfig.tableBorder }}</span>
        </div>

        <button class="reset-btn" @click="handleReset">重置为默认颜色</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.color-settings {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.settings-toggle {
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.settings-toggle:hover {
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.settings-panel {
  position: absolute;
  top: 50px;
  right: 0;
  width: 320px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.settings-header h3 {
  margin: 0;
  font-size: 16px;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  opacity: 0.8;
}

.settings-content {
  padding: 16px;
  max-height: 500px;
  overflow-y: auto;
}

.color-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.color-item label {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.color-item input[type='color'] {
  width: 50px;
  height: 30px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.color-item span {
  font-size: 12px;
  color: #666;
  font-family: monospace;
  min-width: 70px;
}

.reset-btn {
  width: 100%;
  padding: 10px;
  margin-top: 16px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.reset-btn:hover {
  background: #ebebeb;
}
</style>

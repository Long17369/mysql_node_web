<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  startTime?: Date
  endTime?: Date
  minTime?: Date
  maxTime?: Date
}>()

const emit = defineEmits<{
  (e: 'update:startTime', value: Date | undefined): void
  (e: 'update:endTime', value: Date | undefined): void
}>()

// Helper to format Date to YYYY-MM-DDTHH:mm:ss for input type="datetime-local"
const formatDate = (date: Date | undefined) => {
  if (!date) return ''
  // Adjust for timezone offset to show local time in input
  const offset = date.getTimezoneOffset() * 60000
  const localDate = new Date(date.getTime() - offset)
  return localDate.toISOString().slice(0, 19)
}

// Helper to parse string back to Date
const parseDate = (value: string) => {
  if (!value) return undefined
  return new Date(value)
}

const startStr = computed({
  get: () => formatDate(props.startTime),
  set: (val) => emit('update:startTime', parseDate(val))
})

const endStr = computed({
  get: () => formatDate(props.endTime),
  set: (val) => emit('update:endTime', parseDate(val))
})

const minStr = computed(() => formatDate(props.minTime))
const maxStr = computed(() => formatDate(props.maxTime))

</script>

<template>
  <div class="time-range-picker">
    <div class="picker-group">
      <input
        type="datetime-local"
        v-model="startStr"
        :min="minStr"
        :max="endStr || maxStr"
        step="1"
      />
    </div>
    <span class="separator">至</span>
    <div class="picker-group">
      <input
        type="datetime-local"
        v-model="endStr"
        :min="startStr || minStr"
        :max="maxStr"
        step="1"
      />
    </div>
  </div>
</template>

<style scoped>
.time-range-picker {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f5f7fa;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.picker-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.picker-group label {
  font-size: 12px;
  color: #606266;
  font-weight: 500;
}

input[type="datetime-local"] {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 6px 8px;
  color: #606266;
  font-family: inherit;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
  background-color: white;
}

input[type="datetime-local"]:hover {
  border-color: #c0c4cc;
}

input[type="datetime-local"]:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.separator {
  color: #909399;
  font-size: 14px;
  font-weight: bold;
}
</style>

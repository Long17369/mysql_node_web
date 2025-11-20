<script setup lang="ts">
import { ref, watch } from 'vue'

// 组件 Props
interface Props {
  setDate: (date: string | undefined) => void
  title: string
  minTime: string
  maxTime: string
}

const props = defineProps<Props>()
const date = ref<string>()

// 监听日期变化
watch(date, () => {
  props.setDate(date.value)
})
</script>

<template>
  <div class="DateSelect">
    <label>
      {{ props.title }}
      <input type="date" v-model="date" :title="props.title" :min="minTime" :max="maxTime" />
    </label>
  </div>
</template>

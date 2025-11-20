<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  setDate: (date: string | undefined) => void
  title: string
  minTime: string
  maxTime: string
}

const props = defineProps<Props>()
const date = ref<string>()

watch(date, () => {
  props.setDate(date.value)
})
</script>

<template>
  <div class="DateSelect">
    <label>
      {{ props.title }}
      <input type="date" v-model="date" :title="props.title" :min="minTime" :max="maxTime"/>
    </label>
  </div>
</template>

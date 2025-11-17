<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  SetDate: (date: Date | undefined) => void
  title: string
}

const props = defineProps<Props>()
const date = ref<Date>()

watch(date, () => {
  props.SetDate(date.value)
})
</script>

<template>
  <div class="DateSelect">
    <label>
      {{ props.title }}
      <input type="date" v-model="date" />
    </label>
  </div>
</template>

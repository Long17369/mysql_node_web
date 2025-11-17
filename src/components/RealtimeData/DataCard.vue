<script setup lang="ts">
import type { Data, FieldMapper } from '@/types/api'
import { onMounted, ref } from 'vue'

interface Props {
  data: Data
  mapper: FieldMapper[]
}

type Value = {
  id: number
  key: string
  value: string
}[]

const props = defineProps<Props>()

const values = ref<Value>([])

onMounted(async () => {
  if (props.data.d_no === null) return
  values.value.push({
    id: -1,
    key: '设备编号',
    value: props.data.d_no,
  })
  props.mapper.forEach((item) => {
    const value = props.data[item.db_name]
    if (value === null) return
    values.value.push({
      id: item.id,
      key: item.f_name,
      value: value,
    })
  })
  const date = new Date(props.data.c_time)
  const formattedDate = date.toLocaleString()
  values.value.push({
    id: -2,
    key: '更新时间',
    value: formattedDate,
  })
})
</script>

<template>
  <div class="Card">
    <div class="keys">
      <ul>
        <li class="key" v-for="value in values" :key="value.id">{{ value.key }}</li>
      </ul>
    </div>
    <div class="values">
      <ul>
        <li class="value" v-for="value in values" :key="value.id">
          {{ value.value }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.Card {
  background-color: white;
  width: 30%;
  height: 45%;
  margin: 1%;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.keys,
.values {
  float: left;
  padding: 2%;
  margin: 2%;
  height: 92%;
}
.keys {
  width: 30%;
}
.values {
  width: 54%;
}
.values > ul {
  padding: 0;
}
.Card ul {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;
  margin: 0;
}
.Card li {
  text-align: left;
  list-style-type: none;
  padding: 2%;
}
</style>

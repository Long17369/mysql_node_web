<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { fetchDirectConfig, fetchDirectData, updateDirectData } from '@/services/api'
import type { DirectConfig } from '@/types/api'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  dNo: string
}>()

let loadTimer: number = -1
const loadingState = ref<boolean>(false)
const loading = computed({
  get: () => loadingState.value,
  set: (val: boolean) => {
    clearTimeout(loadTimer)
    loadTimer = -1
    if (val === false) {
      loadingState.value = false
    } else {
      loadTimer = setTimeout(() => {
        loadingState.value = val
      }, 300)
    }
  },
})

const error = ref('')
const configs = ref<DirectConfig[]>([])
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const model = ref<Record<number, any>>({})

// 解析开关值 "关:off|开:on"
const getSwitchValue = (fValue: string | null, active: boolean) => {
  if (!fValue) return active ? 'on' : 'off'
  const parts = fValue.split('|')
  const target = active ? parts[1] : parts[0] // 假设格式固定为 关|开
  if (!target) return active ? 'on' : 'off'
  const val = target.split(':')[1]
  return val || target
}

// 解析单选框选项 "关:off|开:on"
const getRadioOptions = (fValue: string | null) => {
  if (!fValue) return []
  return fValue.split('|').map((item) => {
    const [label, value] = item.split(':')
    return { label, value: value || label }
  })
}

const loadData = async () => {
  if (!props.dNo) return
  loading.value = true
  error.value = ''
  try {
    // 并行获取配置和数据
    const [configRes, dataRes] = await Promise.all([
      fetchDirectConfig(props.dNo),
      fetchDirectData(props.dNo),
    ])

    configs.value = configRes

    // 初始化模型数据
    const newModel: Record<number, any> = {}
    // 先填入默认值或空值
    configRes.forEach((c) => {
      newModel[c.id] = null
    })
    // 填入实际数据
    dataRes.forEach((d) => {
      // 根据类型转换数据格式
      const config = configRes.find((c) => c.id === d.config_id)
      if (config && config.f_type === '3') {
        newModel[d.config_id] = Number(d.value)
      } else {
        newModel[d.config_id] = d.value
      }
    })
    model.value = newModel
  } catch (err) {
    error.value = err instanceof Error ? err.message : '加载失败'
  } finally {
    clearTimeout(loadTimer)
    loading.value = false
  }
}

const handleChange = async (config: DirectConfig) => {
  try {
    const value = model.value[config.id]
    await updateDirectData({
      config_id: config.id,
      value: String(value),
      d_no: props.dNo,
    })
    ElMessage.success('设置成功')
    // 更新成功后重新加载配置，因为可见性可能发生变化
    await loadData()
  } catch (err) {
    ElMessage.error('设置失败: ' + (err instanceof Error ? err.message : '未知错误'))
    // 失败回滚? 暂时重新加载
    await loadData()
  }
}

watch(
  () => props.dNo,
  () => {
    loadData()
  },
  { immediate: true },
)
</script>

<template>
  <div class="device-control">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="control-list">
      <div v-for="config in configs" :key="config.id" class="control-item">
        <div class="control-label">
          <i v-if="config.icon" :class="config.icon"></i>
          {{ config.t_name }}
        </div>
        <div class="control-input">
          <!-- 1: 开关 (Switch) -->
          <el-switch
            v-if="config.f_type === '1'"
            v-model="model[config.id]"
            :active-value="getSwitchValue(config.f_value, true)"
            :inactive-value="getSwitchValue(config.f_value, false)"
            @change="handleChange(config)"
          />

          <!-- 2: 输入框 (Input) -->
          <el-input
            v-else-if="config.f_type === '2'"
            v-model="model[config.id]"
            @change="handleChange(config)"
          >
            <template #append v-if="config.preffix">{{ config.preffix }}</template>
          </el-input>

          <!-- 3: 滑动条 (Slider) -->
          <div v-else-if="config.f_type === '3'" class="slider-container">
            <el-slider
              v-model="model[config.id]"
              :min="Number(config.min) || 0"
              :max="Number(config.max) || 100"
              show-input
              @change="handleChange(config)"
            />
          </div>

          <!-- 4: 时间选择 (TimePicker) -->
          <el-time-picker
            v-else-if="config.f_type === '4'"
            v-model="model[config.id]"
            value-format="HH:mm:ss"
            @change="handleChange(config)"
          />

          <!-- 5: 单选框 (Radio) -->
          <el-radio-group
            v-else-if="config.f_type === '5'"
            v-model="model[config.id]"
            @change="handleChange(config)"
          >
            <el-radio
              v-for="option in getRadioOptions(config.f_value)"
              :key="option.value"
              :label="option.value"
            >
              {{ option.label }}
            </el-radio>
          </el-radio-group>

          <span v-else>未知类型: {{ config.f_type }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.device-control {
  padding: 20px;
}
.control-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.control-item {
  display: flex;
  align-items: center;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
}
.control-label {
  width: 120px;
  font-weight: bold;
  color: #606266;
}
.control-input {
  flex: 1;
}
.slider-container {
  padding: 0 10px;
}
</style>

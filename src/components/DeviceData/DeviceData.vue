<script setup lang="ts">
import { colorConfig } from '@/config/colors'
import { getDevice, addDevice, updateDevice, deleteDevice } from '@/services/api'
import type { Device } from '@/types/api'
import { ref, onMounted, reactive } from 'vue'

// 组件 Props
interface Props {
  title: string
}

const props = defineProps<Props>()

// 表头接口
interface Header {
  key: string
  label: string
}

const data = ref<Device[]>([])
const headers = ref<Header[]>([
  { key: 'device_name', label: '设备名称' },
  { key: 'number', label: '设备编号' },
  { key: 'remarks', label: '备注' },
  { key: 'c_time', label: '创建时间' },
])

const searchParams = reactive({
  device_name: '',
  number: '',
})

const showModal = ref(false)
const isEdit = ref(false)
const currentDevice = reactive<Partial<Device>>({})

// 格式化日期
function formatDate(dateString: string | null) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('zh-CN')
}

// 获取单元格值
function getCellValue(row: Device, key: string) {
  const rowRecord = row as unknown as Record<string, unknown>
  const value = rowRecord[key]
  if (key === 'c_time') {
    return formatDate(value as string | null)
  }
  return value ?? '-'
}

// Fetch data
const fetchData = async () => {
  data.value = await getDevice(searchParams)
}

// Search
const handleSearch = () => {
  fetchData()
}

// Add
const handleAdd = () => {
  isEdit.value = false
  Object.assign(currentDevice, { device_name: '', number: '', remarks: '' })
  showModal.value = true
}

// Edit
const handleEdit = (row: Device) => {
  isEdit.value = true
  Object.assign(currentDevice, row)
  showModal.value = true
}

// Delete
const handleDelete = async (id: number) => {
  if (confirm('确定要删除该设备吗？')) {
    await deleteDevice(id)
    fetchData()
  }
}

// Save
const handleSave = async () => {
  if (!currentDevice.device_name || !currentDevice.number) {
    alert('请填写设备名称和编号')
    return
  }

  try {
    if (isEdit.value && currentDevice.id) {
      await updateDevice(currentDevice.id, currentDevice)
    } else {
      await addDevice(currentDevice as Omit<Device, 'id' | 'c_time'>)
    }
    showModal.value = false
    fetchData()
  } catch (e) {
    alert('操作失败: ' + (e as Error).message)
  }
}

onMounted(fetchData)
</script>

<template>
  <div class="deviceData">
    <h2>{{ title }}</h2>

    <!-- Search & Add -->
    <div class="toolbar">
      <input v-model="searchParams.device_name" placeholder="设备名称" />
      <input v-model="searchParams.number" placeholder="设备编号" />
      <button @click="handleSearch">查询</button>
      <button @click="handleAdd" class="add-btn">新增设备</button>
    </div>

    <div class="data">
      <table>
        <thead>
          <tr>
            <th v-for="value in headers" :key="value.key">{{ value.label }}</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in data"
            :key="row.id"
            :class="{ even: index % 2 === 0, odd: index % 2 === 1 }"
          >
            <td v-for="header in headers" :key="header.key">
              {{ getCellValue(row, header.key) }}
            </td>
            <td>
              <span class="modify" @click="() => handleEdit(row)">修改</span>
              <span class="delete" @click="() => handleDelete(row.id)">删除</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h3>{{ isEdit ? '编辑设备' : '新增设备' }}</h3>
        <div class="form-item">
          <label>设备名称:</label>
          <input v-model="currentDevice.device_name" />
        </div>
        <div class="form-item">
          <label>设备编号:</label>
          <input v-model="currentDevice.number" />
        </div>
        <div class="form-item">
          <label>备注:</label>
          <input v-model="currentDevice.remarks" />
        </div>
        <div class="modal-actions">
          <button @click="showModal = false">取消</button>
          <button @click="handleSave" class="primary">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modify {
  color: #1976d2;
  cursor: pointer;
  margin-right: 10px;
}

.delete {
  color: #d32f2f;
  cursor: pointer;
}

.deviceData {
  padding: 20px;
  background: #fff;
  height: calc(100vh - 40px);
}

.deviceData > h2 {
  margin: 0 0 2% 0;
  color: #333;
}

.data {
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th {
  background: v-bind('colorConfig.tableHeaderBg');
  padding: 12px 8px;
  text-align: center;
  font-weight: 600;
  border-bottom: 2px solid v-bind('colorConfig.tableBorder');
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  position: relative;
}

th.sortable:hover {
  background: #ebebeb;
}

th.active {
  background: #e3f2fd;
  color: #1976d2;
}

.sort-icon {
  font-size: 10px;
  margin-left: 4px;
  position: absolute;
  z-index: 1;
}

td {
  text-align: center;
  padding: 10px 8px;
  border-bottom: 1px solid #eee;
}

tbody tr.even {
  background: v-bind('colorConfig.tableRowEven');
}

tbody tr.odd {
  background: v-bind('colorConfig.tableRowOdd');
}

tbody tr:hover {
  background: v-bind('colorConfig.tableRowHover');
}

.toolbar {
  margin-bottom: 16px;
  display: flex;
  gap: 10px;
}
.toolbar input {
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.toolbar button {
  padding: 6px 12px;
  cursor: pointer;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.add-btn {
  background: #4caf50 !important;
  color: white;
  border: none !important;
  margin-left: auto;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}
.settings-modal {
  width: 600px;
  max-width: 90vw;
}
.form-item {
  margin-bottom: 15px;
}
.form-item label {
  display: block;
  margin-bottom: 5px;
}
.form-item input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
.modal-actions button {
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: white;
}
.modal-actions button.primary {
  background: #1976d2;
  color: white;
  border: none;
}
</style>

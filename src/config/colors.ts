// 应用颜色配置接口
export interface ColorConfig {
  primary: string[]
  secondary: string
  tableHeaderBg: string
  tableRowEven: string
  tableRowOdd: string
  tableRowHover: string
  tableBorder: string
  textPrimary: string
  textSecondary: string
}

// 默认颜色配置
export const defaultColors: ColorConfig = {
  primary: [
    '#667eea', // 蓝色
    '#5a67d8',
    '#4c51bf',
    '#434190',
    '#f56565', // 红色
    '#ed8936', // 橙色
    '#f6e05e', // 黄色
    '#48bb78', // 绿色
    '#38b2ac', // 青色
    '#4299e1', // 浅蓝
    '#9f7aea', // 紫色
    '#ed64a6', // 粉色
  ],
  secondary: '#764ba2',
  tableHeaderBg: '#f5f5f5',
  tableRowEven: '#ffffff',
  tableRowOdd: '#f9f9f9',
  tableRowHover: '#e3f2fd',
  tableBorder: '#ddd',
  textPrimary: '#333',
  textSecondary: '#666',
}

// 创建响应式颜色配置
import { reactive } from 'vue'

export const colorConfig = reactive<ColorConfig>({ ...defaultColors })

// 更新颜色配置函数
export function updateColorConfig(newColors: Partial<ColorConfig>) {
  Object.assign(colorConfig, newColors)
}

// 重置为默认颜色函数
export function resetColorConfig() {
  Object.assign(colorConfig, defaultColors)
}

// Color configuration for the application
export interface ColorConfig {
  primary: string
  secondary: string
  tableHeaderBg: string
  tableRowEven: string
  tableRowOdd: string
  tableRowHover: string
  tableBorder: string
  textPrimary: string
  textSecondary: string
}

// Default color configuration
export const defaultColors: ColorConfig = {
  primary: '#667eea',
  secondary: '#764ba2',
  tableHeaderBg: '#f5f5f5',
  tableRowEven: '#ffffff',
  tableRowOdd: '#f9f9f9',
  tableRowHover: '#e3f2fd',
  tableBorder: '#ddd',
  textPrimary: '#333',
  textSecondary: '#666',
}

// Create a reactive color configuration
import { reactive } from 'vue'

export const colorConfig = reactive<ColorConfig>({ ...defaultColors })

// Function to update color configuration
export function updateColorConfig(newColors: Partial<ColorConfig>) {
  Object.assign(colorConfig, newColors)
}

// Function to reset to default colors
export function resetColorConfig() {
  Object.assign(colorConfig, defaultColors)
}

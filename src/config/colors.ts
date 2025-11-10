// Color configuration for the application
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

// Default color configuration
export const defaultColors: ColorConfig = {
  primary: [
    '#667eea', // blue
    '#5a67d8',
    '#4c51bf',
    '#434190',
    '#f56565', // red
    '#ed8936', // orange
    '#f6e05e', // yellow
    '#48bb78', // green
    '#38b2ac', // teal
    '#4299e1', // light blue
    '#9f7aea', // purple
    '#ed64a6', // pink
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

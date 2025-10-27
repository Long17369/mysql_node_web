import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface TableData {
  id: number
  [key: string]: string | number | boolean | null | undefined
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor?: string
    backgroundColor?: string
  }[]
}

export const api = {
  // Users
  getUsers: async (): Promise<TableData[]> => {
    const response = await apiClient.get('/users')
    return response.data
  },

  // Products
  getProducts: async (): Promise<TableData[]> => {
    const response = await apiClient.get('/products')
    return response.data
  },

  // Orders
  getOrders: async (): Promise<TableData[]> => {
    const response = await apiClient.get('/orders')
    return response.data
  },

  // Statistics
  getStatistics: async (): Promise<Record<string, unknown>> => {
    const response = await apiClient.get('/statistics')
    return response.data
  },
}

export default api

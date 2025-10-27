import axios from 'axios'
import type { TableData, StatisticsResponse } from '../types'

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

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
  getStatistics: async (): Promise<StatisticsResponse> => {
    const response = await apiClient.get('/statistics')
    return response.data
  },
}

export default api

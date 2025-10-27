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

export interface StatisticsResponse {
  salesData: ChartData
  ordersData: ChartData
  usersData: ChartData
  totalUsers: number
  totalOrders: number
  totalSales: number
}

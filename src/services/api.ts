import type {
  FieldMapper,
  SensorData,
  BehaviorData,
  DataQueryParams,
  ApiResponse
} from '@/types/api'

const BASE_URL = '/api'

async function fetchApi<T>(url: string): Promise<T> {
  const response = await fetch(url)
  const data: ApiResponse<T> = await response.json()

  if (data.success) {
    return data.data
  } else {
    throw new Error(data.error.message)
  }
}

// Sensor API
export async function getSensorFieldMapper(): Promise<FieldMapper[]> {
  return fetchApi<FieldMapper[]>(`${BASE_URL}/sensor/table`)
}

export async function getSensorData(params: DataQueryParams = {}): Promise<SensorData[]> {
  const { limit = 10, offset = 0, order_table = 'id', desc = false } = params
  const queryString = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
    order_table,
    desc: desc.toString()
  })
  return fetchApi<SensorData[]>(`${BASE_URL}/sensor/data?${queryString}`)
}

// Behavior API
export async function getBehaviorFieldMapper(): Promise<FieldMapper[]> {
  return fetchApi<FieldMapper[]>(`${BASE_URL}/behavior/table`)
}

export async function getBehaviorData(params: DataQueryParams = {}): Promise<BehaviorData[]> {
  const { limit = 10, offset = 0, order_table = 'id', desc = false } = params
  const queryString = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
    order_table,
    desc: desc.toString()
  })
  return fetchApi<BehaviorData[]>(`${BASE_URL}/behavior/data?${queryString}`)
}

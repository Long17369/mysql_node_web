import type {
  FieldMapper,
  SensorData,
  BehaviorData,
  SensorDevice,
  BehaviorDevice,
  DataQueryParams,
  ApiResponse,
  SensorDataCount,
  BehaviorDataCount,
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
  const { limit = 10, offset = 0, order_table = 'id', desc = false, where = {} } = params
  const queryString = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
    order_table,
    desc: desc.toString(),
    where: JSON.stringify(where),
  })
  return fetchApi<SensorData[]>(`${BASE_URL}/sensor/data?${queryString}`)
}

// Behavior API
export async function getBehaviorFieldMapper(): Promise<FieldMapper[]> {
  return fetchApi<FieldMapper[]>(`${BASE_URL}/behavior/table`)
}

export async function getBehaviorData(params: DataQueryParams = {}): Promise<BehaviorData[]> {
  const { limit = 10, offset = 0, order_table = 'id', desc = false, where = {} } = params
  const queryString = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
    order_table,
    desc: desc.toString(),
    where: JSON.stringify(where),
  })
  return fetchApi<BehaviorData[]>(`${BASE_URL}/behavior/data?${queryString}`)
}

export async function getSensorDataCount(where: object) {
  const queryString = new URLSearchParams({
    where: JSON.stringify(where),
  })
  return fetchApi<SensorDataCount>(`${BASE_URL}/sensor/data?${queryString}`)
}

export async function getBehaviorDataCount(where: object) {
  const queryString = new URLSearchParams({
    where: JSON.stringify(where),
  })
  return fetchApi<BehaviorDataCount>(`${BASE_URL}/behavior/data?${queryString}`)
}

export async function getSensorDevice() {
  return fetchApi<SensorDevice[]>(`${BASE_URL}/behavior/device`)
}

export async function getBehaviorDevice() {
  return fetchApi<BehaviorDevice[]>(`${BASE_URL}/sensor/device`)
}

import type {
  FieldMapper,
  Data,
  DataQueryParams,
  ApiResponse,
  Device,
  DataCount,
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

async function getData(table: string, params: DataQueryParams): Promise<Data[]> {
  const { limit = 10, offset = 0, order_table = 'id', desc = false, where = {} } = params
  const queryString = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
    order_table,
    desc: desc.toString(),
    where: JSON.stringify(where),
  })
  return fetchApi<Data[]>(`${BASE_URL}/${table}/data?${queryString}`)
}

export const getSensorFieldMapper = () => fetchApi<FieldMapper[]>(`${BASE_URL}/sensor/table`)
export const getSensorData = (params: DataQueryParams = {}) => getData('sensor', params)
export const getBehaviorFieldMapper = () => fetchApi<FieldMapper[]>(`${BASE_URL}/behavior/table`)
export const getBehaviorData = (params: DataQueryParams = {}) => getData('behavior', params)

export const getDevice = () => fetchApi<Device[]>(`${BASE_URL}/device`)

export async function getSensorDataCount(where: object) {
  const queryString = new URLSearchParams({
    where: JSON.stringify(where),
  })
  return fetchApi<DataCount>(`${BASE_URL}/sensor/count?${queryString}`)
}

export async function getBehaviorDataCount(where: object) {
  const queryString = new URLSearchParams({
    where: JSON.stringify(where),
  })
  return fetchApi<DataCount>(`${BASE_URL}/behavior/count?${queryString}`)
}

export async function getSensorTimeRange(where: object = {}) {
  const queryString = new URLSearchParams({
    where: JSON.stringify(where),
  })
  return fetchApi<{ minTime: string; maxTime: string }>(
    `${BASE_URL}/sensor/time-range?${queryString}`,
  )
}

export async function getBehaviorTimeRange(where: object = {}) {
  const queryString = new URLSearchParams({
    where: JSON.stringify(where),
  })
  return fetchApi<{ minTime: string; maxTime: string }>(
    `${BASE_URL}/behavior/time-range?${queryString}`,
  )
}

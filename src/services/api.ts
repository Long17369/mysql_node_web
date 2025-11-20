import type {
  FieldMapper,
  Data,
  DataQueryParams,
  ApiResponse,
  Device,
  DataCount,
} from '@/types/api'

const BASE_URL = '/api'

/**
 * 通用 API 请求函数
 * @param url 请求地址
 * @returns Promise<T>
 */
async function fetchApi<T>(url: string): Promise<T> {
  const response = await fetch(url)
  const data: ApiResponse<T> = await response.json()

  if (data.success) {
    return data.data
  } else {
    throw new Error(data.error.message)
  }
}

/**
 * 获取数据
 * @param table 表名
 * @param params 查询参数
 * @returns Promise<Data[]>
 */
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

/**
 * 获取传感器字段映射
 * @returns Promise<FieldMapper[]>
 */
export const getSensorFieldMapper = () => fetchApi<FieldMapper[]>(`${BASE_URL}/sensor/table`)

/**
 * 获取传感器数据
 * @param params 查询参数
 * @returns Promise<Data[]>
 */
export const getSensorData = (params: DataQueryParams = {}) => getData('sensor', params)

/**
 * 获取行为字段映射
 * @returns Promise<FieldMapper[]>
 */
export const getBehaviorFieldMapper = () => fetchApi<FieldMapper[]>(`${BASE_URL}/behavior/table`)

/**
 * 获取行为数据
 * @param params 查询参数
 * @returns Promise<Data[]>
 */
export const getBehaviorData = (params: DataQueryParams = {}) => getData('behavior', params)

/**
 * 获取设备列表
 * @returns Promise<Device[]>
 */
export const getDevice = () => fetchApi<Device[]>(`${BASE_URL}/device`)

/**
 * 获取传感器数据总数
 * @param where 查询条件
 * @returns Promise<DataCount>
 */
export async function getSensorDataCount(where: object) {
  const queryString = new URLSearchParams({
    where: JSON.stringify(where),
  })
  return fetchApi<DataCount>(`${BASE_URL}/sensor/count?${queryString}`)
}

/**
 * 获取行为数据总数
 * @param where 查询条件
 * @returns Promise<DataCount>
 */
export async function getBehaviorDataCount(where: object) {
  const queryString = new URLSearchParams({
    where: JSON.stringify(where),
  })
  return fetchApi<DataCount>(`${BASE_URL}/behavior/count?${queryString}`)
}

/**
 * 获取传感器数据时间范围
 * @param where 查询条件
 * @returns Promise<{ minTime: string; maxTime: string }>
 */
export async function getSensorTimeRange(where: object = {}) {
  const queryString = new URLSearchParams({
    where: JSON.stringify(where),
  })
  return fetchApi<{ minTime: string; maxTime: string }>(
    `${BASE_URL}/sensor/time-range?${queryString}`,
  )
}

/**
 * 获取行为数据时间范围
 * @param where 查询条件
 * @returns Promise<{ minTime: string; maxTime: string }>
 */
export async function getBehaviorTimeRange(where: object = {}) {
  const queryString = new URLSearchParams({
    where: JSON.stringify(where),
  })
  return fetchApi<{ minTime: string; maxTime: string }>(
    `${BASE_URL}/behavior/time-range?${queryString}`,
  )
}

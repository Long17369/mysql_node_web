// 统一响应格式
export interface SuccessResponse<T> {
  success: true
  data: T
}

export interface ErrorResponse {
  success: false
  error: {
    message: string
    code: 'INVALID_PARAMETER' | 'DATABASE_ERROR' | 'UNKNOWN_ERROR'
  }
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse

// 字段映射类型
export interface FieldMapper {
  id: number
  f_name: string
  db_name: string
  p_name: string
  unit: string // 单位
  type: '1' | '2' | '3' // 1: 文本, 2: 图片, 3: 视频
  visible: '0' | '1' // 0: 不可见, 1: 可见
}

// 传感器数据类型
export interface SensorData {
  id: number
  d_no: string | null
  field1: string | null
  field2: string | null
  field3: string | null
  field4: string | null
  field5: string | null
  field6: string | null
  field7: string | null
  field8: string | null
  field9: string | null
  field10: string | null
  c_time: string // ISO 8601 格式
  online: string | null // "实时数据" | "保存数据"
}

// 行为数据类型
export interface BehaviorData {
  id: number
  d_no: string | null
  field1: string | null
  field2: string | null
  field3: string | null
  field4: string | null
  field5: string | null
  field6: string | null
  field7: string | null
  field8: string | null
  field9: string | null
  field10: string | null
  c_time: string // ISO 8601 格式
  online: string | null // "实时数据" | "保存数据"
}

export interface SensorDevice {
  d_no: string
}

export interface BehaviorDevice {
  d_no: string
}

// 查询参数
export interface DataQueryParams {
  limit?: number // 默认: 10, 最大: 100
  offset?: number // 默认: 0
  order_table?: string // 默认: "id"
  desc?: boolean | 'true' | '1' // 默认: false
  where?: object // 默认: {}
}

// API 响应类型
export type SensorMapperResponse = ApiResponse<FieldMapper[]>
export type BehaviorMapperResponse = ApiResponse<FieldMapper[]>
export type SensorDataResponse = ApiResponse<SensorData[]>
export type BehaviorDataResponse = ApiResponse<BehaviorData[]>

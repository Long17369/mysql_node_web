// API Response types based on the API documentation

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

// Field Mapper type
export interface FieldMapper {
  id: number
  f_name: string
  db_name: string
  p_name: string
  unit: string
  type: '1' | '2' | '3' // 1: 文本, 2: 图片, 3: 视频
  visible: '0' | '1' // 0: 不可见, 1: 可见
}

// Sensor Data type
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
  c_time: string // ISO 8601 format
  online: string | null // "实时数据" | "保存数据"
}

// Behavior Data type
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
  c_time: string // ISO 8601 format
  online: string | null // "实时数据" | "保存数据"
}

// Query parameters
export interface DataQueryParams {
  limit?: number // Default: 10, Max: 1000
  offset?: number // Default: 0
  order_table?: string // Default: "id"
  desc?: boolean // Default: false
}

// API response types
export type SensorMapperResponse = ApiResponse<FieldMapper[]>
export type BehaviorMapperResponse = ApiResponse<FieldMapper[]>
export type SensorDataResponse = ApiResponse<SensorData[]>
export type BehaviorDataResponse = ApiResponse<BehaviorData[]>

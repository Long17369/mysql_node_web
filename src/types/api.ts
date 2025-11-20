// 统一响应格式
export interface SuccessResponse<T> {
  success: true
  data: T
}

// 错误响应格式
export interface ErrorResponse {
  success: false
  error: {
    message: string
    code: 'INVALID_PARAMETER' | 'DATABASE_ERROR' | 'UNKNOWN_ERROR'
  }
}

// API 响应类型联合
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse

// 字段映射类型
export interface FieldMapper {
  id: number
  f_name: string
  db_name: `field${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}`
  p_name: string
  unit: string // 单位
  type: '1' | '2' | '3' // 1: 文本, 2: 图片, 3: 视频
  visible: '0' | '1' // 0: 不可见, 1: 可见
}

// 传感器数据类型
export interface Data {
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
  // Error data fields
  e_msg?: string
  e_no?: string
  type?: string
}

// 数据总数类型
export interface DataCount {
  count: number
}

// 设备信息类型
export interface Device {
  id: number
  device_name: string
  remarks: string | null
  c_time: string
  number: string
}

export type CreateDeviceParams = Omit<Device, 'id' | 'c_time'>
export type UpdateDeviceParams = Partial<Omit<Device, 'id' | 'c_time'>>

// 查询条件类型
export interface WhereCondition {
  value: string
  operator: '=' | '>' | '<' | '>=' | '<='
}

// 查询条件对象
export interface Where {
  [key: string]: WhereCondition | WhereCondition[]
}

// 查询参数
export interface DataQueryParams {
  limit?: number // 默认: 10, 最大: 100
  offset?: number // 默认: 0
  order_table?: string // 默认: "id"
  desc?: boolean | 'true' | '1' // 默认: false
  where?: Where // 默认: {}
}

// API 响应类型别名
export type MapperResponse = ApiResponse<FieldMapper[]>
export type DataResponse = ApiResponse<Data[]>
export type DataCountResponse = ApiResponse<number>

# 前端开发计划

## 类型定义 (src/types/api.ts)

- [ ] **同步后端类型**
  - 添加 `DirectConfig` 接口
  - 添加 `Direct` 接口
  - 添加 `UpdateDirectParams` 接口

## API 服务 (src/services/api.ts)

- [ ] **添加指令相关 API**
  - `fetchDirectConfig(d_no?: string)`: 获取指令配置 (支持传入设备号以获取过滤后的配置)
  - `fetchDirectData(d_no: string)`: 获取设备指令数据
  - `updateDirectData(data: UpdateDirectParams)`: 更新指令数据

## 组件开发 (src/components/SettingData/)

- [ ] **新建/更新设置组件**
  - 目标组件: `SettingTable.vue` 或新建 `DeviceControl.vue`
- [ ] **动态表单渲染**
  - 根据 `DirectConfig.f_type` 渲染不同控件:
    - `1`: 开关 (Switch)
    - `2`: 输入框 (Input)
    - `3`: 滑动条 (Slider) - 使用 `min`/`max` 属性
    - `4`: 时间选择 (TimePicker)
    - `5`: 单选框 (Radio) - 解析 `f_value` (如 "关:off|开:on")
- [ ] **联动逻辑**
  - (后端已处理显示过滤，前端只需渲染返回的列表)
  - 但需注意：修改父级配置后，可能需要重新获取配置列表 (因为可见性可能改变)
- [ ] **数据交互**
  - 加载时获取配置 (传入 `d_no`) 和当前数据
  - 修改控件值时调用 `updateDirectData`
  - 修改成功后，重新获取配置列表 (刷新显示状态)

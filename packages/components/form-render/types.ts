export enum ThemeMap {
  dark = 'dark',
  halfGrey = 'halfGrey',
  light = 'light',
}
export type ThemeType = ThemeMap.dark | ThemeMap.halfGrey | ThemeMap.light

export interface SelectOptions {
  label?: string
  value?: string | number
  code?: string | number
  name?: string
  [prop: string]: unknown
}

export enum FormType {
  card = 'card',
  cardGroup = 'cardGroup',
  title = 'title',
  amount = 'amount',
  input = 'input',
  number = 'number',
  select = 'select',
  textarea = 'textarea',
  dialogSelect = 'dialogSelect',
  date = 'date',
  dateTime = 'dateTime',
  month = 'month',
  timeRange = 'timeRange',
  week = 'week',
  cascader = 'cascader',
  radio = 'radio',
  checkbox = 'checkbox',
  switch = 'switch',
  readonly = 'readonly',
  desensitize = 'desensitize',
  rate = 'rate',
  slot = 'slot',
  amountReadOnly = 'amountReadOnly',
}

export interface FormOptionType {
  label: string
  field: string
  type: string
  labelTip?: string // 标签后的提示文案
  hidden?: boolean
  width?: string
  itemMarginRight?: string
  required?: boolean
  options?: any
  mapping?: any // 对应下拉框的key value的字段名，如果需要传入则key、 value字段名同时传入： ["key", "value"]
  isChildItem?: boolean // 如果是子项 则必填
  clickCallBack?: Function
  handleOnChange?: Function
  rules?: any
  key?: string
  children?: FormOptionType[]
  disabled?: boolean
  cardTitleType?: 'fixed' | 'follow' //fixed: 固定标题 直接获取label，follow：为卡片数组，标题后要显示1,2,3
  fieldLink?: 'object' | 'array' | 'keyArray' // 卡片时的配置项
  isShowExpand?: boolean // 需和expand配合使用
  expand?: boolean // 需和isShowExpand配合使用
  attrs?: any // antd 各组件的配置属性，如下拉框的showSearch hasAll?: boolean // 下拉框是否需要‘多选’这个选项
  listeners?: any // antd 各组件的监听事件
  titleTip?: string
  titleTipLevel?: string
  cardClass?: string // 卡片的自定义样式，内部的卡片可能需要框
  formattedValue?: (val: any) => string // 只读模式下，格式化下拉等形式的值
}

export interface CascaderOption {
  value: string
  label: string
  disabled?: boolean
  children?: CascaderOption[]
}

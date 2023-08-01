<template>
  <a-form-item
    v-if="isShowItem"
    :label="getLabel"
    :class="{
      'item-input__wrap': dataSource.type === FormType.amount,
      'item-readonly': isReadonly,
    }"
    :name="getItemName"
    :style="getFormItemStyle"
    :colon="isReadonly"
    :rules="isReadonly ? null : dataSource.rules">
    <template v-if="dataSource.labelTip" #label>
      {{ dataSource.label }}
      <a-tooltip placement="bottomLeft" :arrow-point-at-center="true">
        <template #title>
          <div>{{ dataSource.labelTip }}</div>
        </template>
        <icon-custom-question-grey class="ml-4px"></icon-custom-question-grey>
      </a-tooltip>
    </template>
    <a-input
      v-if="dataSource.type === FormType.input"
      v-model:value="newFormData[dataSource.field]"
      :placeholder="(dataSource?.attrs?.placeholder) ? dataSource.attrs.placeholder : `请输入${dataSource.label}`"
      :disabled="isDisabled"
      :suffix="dataSource.attrs?.suffix"
      :maxlength="getMaxLength"
      @keyup.enter="handleEnter"
      @blur="handleInputBlur"></a-input>

    <template v-else-if="dataSource.type === FormType.number">
      <a-input
        v-model:value="newFormData[dataSource.field]"
        :placeholder="`请输入${dataSource.label}`"
        :disabled="isDisabled"
        :maxlength="getMaxLength"
        @change="dataSource?.handleOnChange"
        @keyup="limitInputAmount(newFormData, dataSource.field)"></a-input>
    </template>

    <template v-else-if="dataSource.type === FormType.amount">
      <a-input
        v-model:value="newFormData[dataSource.field]"
        :placeholder="`请输入${dataSource.label}`"
        :disabled="isDisabled"
        @change="dataSource?.handleOnChange"
        @keyup="limitInputAmount(newFormData, dataSource.field, dataSource.attrs?.canNegative)"
        @focus="unFormatAmount(newFormData, dataSource.field)"
        @blur="formatAmount(newFormData, dataSource.field)"></a-input>
      <p class="chineses-amount">
        {{ upperChineseAmount(newFormData[dataSource.field]) }}
      </p>
    </template>

    <!-- 只读 -->
    <template
      v-else-if="[FormType.amountReadOnly, FormType.readonly].includes(dataSource.type as FormType)">
      <div class="w-full pl-20px">
        <pre class="reset-pre" :class="{ 'mt-6px': dataSource.type === FormType.amountReadOnly }">{{
          getReadonlyData
        }}</pre>
        <p v-if="dataSource.type === FormType.amountReadOnly" class="chineses-amount">
          {{ upperChineseAmount(newFormData[dataSource.field]) }}
        </p>
      </div>
    </template>

    <span v-if="dataSource.type === FormType.dialogSelect" class="select-dialog-area flex">
      <a-input
        v-model:value="newFormData[dataSource.field]"
        :placeholder="`请输入${dataSource.label}`"
        :maxlength="getMaxLength"
        :disabled="isDisabled"></a-input>
      <span class="select-btn" @click="handleSelectDialogClick(dataSource)">选择</span>
    </span>

    <a-button
      v-else-if="dataSource.type === FormType.button"
      class="query-btn"
      :type="
        dataSource.attrs && dataSource.attrs.buttonType ? dataSource.attrs.buttonType : 'primary'
      "
      :disabled="isDisabled"
      @click="dataSource.clickCallBack && dataSource.clickCallBack()">
      {{ dataSource.buttonText }}
    </a-button>
    <a-date-picker
      v-else-if="dataSource.type === FormType.date"
      v-model:value="newFormData[dataSource.field]"
      value-format="YYYY-MM-DD"
      :placeholder="`请选择${dataSource.label}`"
      :disabled="isDisabled"
      :disabled-date="dataSource.attrs?.disabledDate"
      @change="dataSource?.handleOnChange" />
    <a-date-picker
      v-else-if="dataSource.type === FormType.dateTime"
      v-model:value="newFormData[dataSource.field]"
      allow-clear
      show-time
      :disabled-date="dataSource.attrs?.disabledDate"
      value-format="YYYY-MM-DD HH:mm:ss"
      :placeholder="`请选择${dataSource.label}`"
      :disabled="isDisabled"
      @change="dataSource?.handleOnChange" />
    <a-month-picker
      v-else-if="dataSource.type === FormType.month"
      v-model:value="newFormData[dataSource.field]"
      :placeholder="`请选择${dataSource.label}`"
      :disabled="isDisabled"
      @change="dataSource?.handleOnChange" />
    <a-range-picker
      v-else-if="dataSource.type === FormType.timeRange"
      v-model:value="newFormData[dataSource.field]"
      :placeholder="['开始时间', '结束时间']"
      :disabled="isDisabled"
      @change="dataSource?.handleOnChange" />

    <a-week-picker
      v-else-if="dataSource.type === FormType.week"
      v-model:value="newFormData[dataSource.field]"
      :placeholder="`请选择${dataSource.label}`"
      :disabled="isDisabled"
      @change="dataSource?.handleOnChange" />

    <a-cascader
      v-else-if="dataSource.type === FormType.cascader"
      v-model:value="newFormData[dataSource.field]"
      :allow-clear="dataSource.attrs?.allowClear"
      :field-names="dataSource.attrs?.fieldNames"
      :options="dataSource.options"
      :show-search="{ filter }"
      :placeholder="`请选择${dataSource.label}`"
      :disabled="isDisabled"
      @change="dataSource?.handleOnChange" />

    <a-select
      v-else-if="dataSource.type === FormType.select"
      v-model:value="newFormData[dataSource.field]"
      :mode="dataSource.attrs?.multiple ?? ''"
      :allow-clear="dataSource.attrs?.allowClear ?? true"
      :show-search="dataSource.attrs?.showSearch ?? false"
      :placeholder="`请选择${dataSource.label}`"
      :disabled="isDisabled"
      :auto-clear-search-value="false"
      option-filter-prop="label"
      @change="dataSource.handleOnChange"
      @select="select">
      <a-select-option v-if="dataSource.hasAll" value="all" :type="dataSource.field" label="全部">
        全部
      </a-select-option>
      <a-select-option
        v-for="(v, index) in dataSource.options"
        :key="index"
        :type="dataSource.field"
        :label="dataSource.mapping ? v[dataSource.mapping[1]] : v.label"
        :value="dataSource.mapping ? v[dataSource.mapping[0]] : v.value">
        {{ dataSource.mapping ? v[dataSource.mapping[1]] : v.label }}
      </a-select-option>
    </a-select>

    <a-radio-group
      v-else-if="dataSource.type === FormType.radio"
      v-model:value="newFormData[dataSource.field]"
      :disabled="isDisabled"
      :options="formatOptions"
      @change="dataSource?.handleOnChange"></a-radio-group>

    <a-checkbox-group
      v-else-if="dataSource.type === FormType.checkbox"
      v-model:check="newFormData[dataSource.field]"
      :options="formatOptions"
      :disabled="isDisabled"
      @change="dataSource?.handleOnChange"></a-checkbox-group>

    <a-switch
      v-else-if="dataSource.type === FormType.switch"
      v-model:checked="newFormData[dataSource.field]"
      :disabled="isDisabled"
      @change="dataSource?.handleOnChange"></a-switch>

    <a-textarea
      v-if="dataSource.type === FormType.textarea"
      v-model:value="newFormData[dataSource.field]"
      :auto-size="{ minRows: 4 }"
      :maxlength="dataSource.attrs?.maxlength"
      :show-count="dataSource.attrs?.showCount"
      :placeholder="`请输入${dataSource.label}`"
      :disabled="isDisabled" />

    <slot
      :name="getSlotName"
      :field="dataSource.field"
      :item="dataSource"
      :form-data="newFormData"
      :child-index="childIndex"
      :card-index="cardIndex"
      :parent-item="parentItem"></slot>
  </a-form-item>
</template>
<script setup lang="ts" name="FormItem">
import { PropType, computed, inject, ref } from 'vue'
import {
  FormOptionType,
  CascaderOption,
  ThemeType,
  ThemeMap,
  FormType,
  SelectOptions,
} from './types.ts'
import { useFmtAmount } from '../../composables/useFmtAmount.ts'
const {
  limitInputAmount,
  amountLimitInput,
  formatAmount,
  unFormatAmount,
  amountUnFormat,
  amountFormat,
  upperChineseAmount,
} = useFmtAmount()
const props = defineProps({
  dataSource: {
    type: Object as PropType<FormOptionType>,
    default: () => ({}),
  },
  formData: {
    type: Object,
    default: () => ({}),
  },
  isChildItem: {
    type: Boolean,
    default: false,
  },
  childIndex: {
    type: Number,
    default: 1,
  },
  cardIndex: {
    type: Number,
    default: 0,
  },
  isGroupItem: {
    type: Boolean,
    default: false,
  },
  parentItem: {
    type: Object as PropType<FormOptionType>,
    default: () => undefined,
  },
})

const isReadonly = computed(() => {
  return [FormType.amountReadOnly, FormType.readonly].includes(props.dataSource.type as FormType)
})

const formTheme = inject<ThemeType>('formTheme')
const globalMarginRight = inject<string>('globalMarginRight')
const globalItemWidth = inject<string>('globalItemWidth')
const selectDataCallback = inject<Function>('selectDataCallback')
const onKeyupEnter = inject<Function>('onKeyupEnter')

const emits = defineEmits(['on-select-dialog'])
const isShowItem = computed(() => {
  return !(props.dataSource.hidden === true)
})

const getReadonlyData = computed(() => {
  const value = newFormData.value[props.dataSource.field]
  if (props.dataSource.formattedValue) {
    return props.dataSource.formattedValue(value)
  }
  return value
})

const getMaxLength = computed(() => {
  if (
    [FormType.input, FormType.number, FormType.dialogSelect].includes(
      props.dataSource.type as FormType
    )
  ) {
    const rules = props.dataSource.rules
    if (Array.isArray(rules)) {
      return rules?.find((item: any) => item.max)?.max
    } else if (rules?.max) {
      return rules.max
    }
    return undefined
  }
  return undefined
})

const getItemName = computed(() => {
  if (props.parentItem?.fieldLink === 'object') {
    return [props.parentItem.field, props.dataSource.field]
  } else if (['keyArray', 'array'].includes(props.parentItem?.fieldLink ?? '')) {
    return [props.parentItem?.field, props.cardIndex, props.dataSource.field]
    // if (props.parentItem?.type === FormType.cardGroup) {
    //   return [props.parentItem.field, props.cardIndex, props.dataSource.field]
    // } else {
    //   if (props.dataSource.isChildItem) {
    //     return [props.parentItem.field, props.childIndex + 1, props.dataSource.field]
    //   } else {
    //     return [props.parentItem.field, 0, props.dataSource.field]
    //   }
    // }
  } else {
    return props.dataSource.field
  }
})

const isDisabled = computed(() => {
  return props.dataSource.attrs?.disabled || props.dataSource.disabled
})

const formatOptions = computed(() => {
  if (props.dataSource.mapping) {
    const [code, name] = props.dataSource.mapping
    return props.dataSource.options.map((item: SelectOptions) => ({
      value: item[code],
      label: item[name],
    }))
  } else {
    return props.dataSource.options
  }
})

const filter = (inputValue: string, path: CascaderOption[]) => {
  const key = (props.dataSource.attrs?.fieldNames.label ?? 'label') as string
  return path.some(
    (option: any) => option[key]?.toLowerCase()?.indexOf(inputValue.toLowerCase()) > -1
  )
}

const handleEnter = () => {
  onKeyupEnter?.()
}

const handleInputBlur = (data: any) => {
  if (newFormData.value[props.dataSource.field])
    newFormData.value[props.dataSource.field] = newFormData.value[props.dataSource.field].trim()

  formatAmount(newFormData, props.dataSource.field)
}

const handleSelectDialogClick = (dataSource: FormOptionType) => {
  if(props.dataSource?.attrs?.dialogSelectInputDisabled){
    selectDataCallback?.(dataSource)
    return
  }
  if (isDisabled.value) return
  selectDataCallback?.(dataSource)
}

const getSlotName = computed(() => {
  if (props.dataSource.isChildItem) {
    return props.parentItem?.field ?? props.dataSource.field
  } else {
    return props.dataSource.field
  }
})

const getLabel = computed(() => {
  if (props.dataSource.labelTip) return
  if (props.isChildItem) {
    return props.dataSource.label + (props.isChildItem ? props.childIndex + 2 : '')
  } else {
    const suffix = props.dataSource.children?.length ? 1 : ''
    return props.dataSource.label + suffix
  }
})

const getFormItemStyle = computed(() => {
  const reg = /px|%/
  const itemWidth = formTheme === ThemeMap.dark ? '300' : '420'
  const width = props.dataSource.width ? props.dataSource.width : globalItemWidth || itemWidth
  const marginRight = props.dataSource?.itemMarginRight ?? (globalMarginRight || '120')
  return {
    width: width + (reg.test(width) ? '' : 'px'),
    marginRight: marginRight + (reg.test(marginRight) ? '' : 'px'),
  }
})

const select = (value: string, option: any) => {
  if (value === 'all') {
    newFormData.value[option.type] = ['all']
  }
  if (newFormData.value[option.type]?.includes('all')) {
    newFormData.value[option.type] = ['all']
  }
}

const newFormData = computed(() => props.formData)
</script>
<style lang="less" scoped>
.read-only__cell {
  height: 40px;
  line-height: 40px;
}
.select-dialog-area {
  background-color: #f7f8fa;
  padding-right: 8px;
  border-radius: 4px;
  width: 100%;
  .select-btn {
    height: 32px;
    line-height: 32px;
    color: #017fff;
    flex-shrink: 0;
    cursor: pointer;
  }
}
.reset-pre {
  // margin-top: 6px;
  margin-bottom: 0;
  white-space: break-spaces;
  word-break: break-all;
  font-family: apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji';
}
</style>

<template>
  <div>
    <a-form
      ref="formRef"
      :model="JSONData"
      label-align="right"
      layout="horizontal"
      :label-col="getLabelColStyle"
      class="productInfoForm flex flex-wrap"
      :class="['global-' + formTheme]"
      :rules="formRules">
      <form-item-tree :form-data="JSONData" :children="coFormJson">
        <template v-for="(slot, slotName) in $slots" #[slotName]="slotProps">
          <slot :name="slotName" v-bind="slotProps" />
        </template>
      </form-item-tree>
    </a-form>
<!--    <SelectData-->
<!--      v-if="hasSelectDataOption"-->
<!--      :ref="(el: any) => (refsList = el)"-->
<!--      style="width: 100%"-->
<!--      :text="currFormItem?.selectDataParams?.title"-->
<!--      :params="currFormItem?.selectDataParams"-->
<!--      :modal-visible="selectDialogVisible"-->
<!--      @cancel="selectDialogVisible = false"-->
<!--      @ok="handleSelected"></SelectData>-->
  </div>
</template>
<script setup lang="ts" name="FormRender">
import { computed, PropType, ref, provide, toRefs, isReactive, onUpdated } from 'vue'
import { FormOptionType, ThemeType, FormType, ThemeMap } from './types'
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface'
import FormItemTree from './FormItemTree.vue'
import { Form } from 'ant-design-vue'
import scrollIntoView from 'scroll-into-view-if-needed'
const useForm = Form.useForm

const emits = defineEmits(['on-enter'])
const props = defineProps({
  formData: {
    type: Object,
    default: () => ({}),
  },
  formJson: {
    type: Array as PropType<FormOptionType[]>,
    default: () => [],
  },
  formRules: {
    type: Object,
    default: null,
  },
  labelWidth: {
    type: String,
    default: '120px',
  },
  formTheme: {
    type: String,
    default: 'halfGrey',
  },
  globalMarginRight: {
    type: String,
    default: '',
  },
  globalItemWidth: {
    type: String,
    default: '',
  },
  hasSelectDataOption: {
    type: Boolean,
    default: false,
  },
})

const formRef = ref()
const currFormItem = ref<FormOptionType>()

const refsList = ref<any>([])
const selectDialogVisible = ref(false)

const getLabelColStyle = computed(() => {
  const reg = /px|%/
  const labelWidth = props.labelWidth + (reg.test(props.labelWidth) ? '' : 'px')
  return { style: `width:${labelWidth}` }
})

const JSONData = computed(() => props.formData)
const coFormJson = computed(() => props.formJson)

const handleDialogSelected = (data: FormOptionType) => {
  currFormItem.value = data
  selectDialogVisible.value = true
}

const handleKeyupEnter = (data: FormOptionType) => {
  emits('on-enter')
}

const handleSelected = (select: any) => {
  currFormItem.value?.clickCallBack?.(select)
  selectDialogVisible.value = false
}

provide('formTheme', props.formTheme)
provide('globalMarginRight', props.globalMarginRight)
provide('globalItemWidth', props.globalItemWidth)
provide('selectDataCallback', handleDialogSelected)
provide('onKeyupEnter', handleKeyupEnter)

const validateByFields = (fieldArr: string[] | string[][]) => {
  formRef.value.validateFields(fieldArr)
}
const onSubmit = () => {
  return formRef.value
    .validate()
    .then(() => {
      console.log('onSubmit:', JSONData.value)
      return { formData: JSONData.value }
    })
    .catch((error: ValidateErrorEntity<any>) => {
      console.log('onSubmit:', error)
      const name = error.errorFields[0].name
      const field = Array.isArray(name) ? name.join('_') : name
      scrollToField(field)
      return { error }
    })
}

const { resetFields } = useForm(props.formData)

function clearValidate() {
  formRef.value.clearValidate()
}
function clearValidateByFiled(fields: any) {
  formRef.value.clearValidate(fields)
}
function resetFormFields() {
  formRef.value.resetFields()
}
/**
 * 表单校验失败时，滚动至第一个校验错误位置
 */
function scrollToField(fieldName: string) {
  const ID = `form_item_${fieldName}`
  const node = document.getElementById(ID) as Element
  try {
    scrollIntoView(node, {
      behavior: 'smooth',
      scrollMode: 'if-needed',
    })
  } catch (e) {}
}

defineExpose({
  onSubmit,
  resetFields,
  resetFormFields,
  validateByFields,
  clearValidate,
  clearValidateByFiled,
})
</script>
<style lang="less" scoped>
.form-card-title {
  position: sticky;
  top: -7px;
  background: #fff;
  z-index: 2;
  height: 40px;
  margin-bottom: 16px;
}

:deep(.ant-form-item-control-input-content) {
  display: flex;
}
:deep(.form-title) {
  width: 100%;
}
:deep(.item-input__wrap .ant-form-item-control-input-content) {
  flex-wrap: wrap !important;
  // justify-content: flex-end;
}
:deep(.ant-select-selection-item),
:deep(.ant-select-selection-placeholder),
:deep(
    .ant-select-single:not(.ant-select-customize-input)
      .ant-select-selector
      .ant-select-selection-search-input
  ) {
  height: 32px !important;
  line-height: 32px !important;
}
:deep(.ant-select-multiple .ant-select-selection-item) {
  line-height: 22px !important;
  height: 22px !important;
}

:deep(.ant-form-item-label > label) {
  height: auto;
  min-height: 32px;
  // padding-left: 12px;
}
:deep(.ant-form-item.item-readonly .ant-form-item-label > label) {
  color: rgba(53, 53, 53, 0.6);
  // padding-left: 12px;
}

:deep(.ant-radio-wrapper + .ant-radio-wrapper) {
  margin-left: 60px;
}

:deep(.ant-form-item-label > label.ant-form-item-required) {
  padding-right: 8px;
}
:deep(.ant-form-item-label > label.ant-form-item-required::before) {
  position: absolute;
  top: 10px;
  right: 2px;
}
:deep(.ant-form-item-control-input) {
  min-height: 32px;
}

::v-deep(.ant-select-selector .ant-select-selection-overflow) {
  // overflow: hidden;
  // flex-wrap: nowrap;
}

// :deep(.required label) {
//   padding-right: 20px;
// }
// :deep(.required label::after) {
//   position: absolute;
//   top: 14px;
//   right: 2px;
//   display: inline-block;
//   margin-right: 4px;
//   color: #ff4d4f;
//   font-size: 14px;
//   font-family: SimSun, sans-serif;
//   line-height: 1;
//   content: '*';
// }
:deep(.ant-form-item .ant-input-affix-wrapper-disabled) {
  border: none;
  border-radius: 4px;
  padding: 0 11px;
}
:deep(.ant-form-item .ant-input-textarea) {
  width: 100%;
}
:deep(.ant-form-item .ant-select-single:not(.ant-select-customize-input) .ant-select-selector) {
  height: 32px;
}
.global-halfGrey {
  :deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
    border-radius: 4px;
  }
  :deep(.ant-input),
  :deep(.ant-select-selector),
  :deep(.ant-input-number-input),
  :deep(.ant-input-number),
  :deep(.ant-picker) {
    border: none !important;
    background-color: #f7f8fa !important;
    border-right-width: 0 !important;
    outline: 0 !important;
    box-shadow: none !important;
    border-radius: 4px;
    min-height: 32px;
    width: 100%;
  }
  :deep(textarea.ant-input) {
    height: auto;
  }
}
.global-dark {
  :deep(.ant-form-item) {
    border-radius: 4px;
    background: #f7f8fa;
  }
  :deep(.ant-input),
  :deep(.ant-select-selector),
  :deep(.ant-input-number-input),
  :deep(.ant-input-number),
  :deep(.ant-picker) {
    border: none !important;
    background-color: transparent !important;
    border-right-width: 0 !important;
    outline: 0 !important;
    box-shadow: none !important;
    min-height: 32px;
    width: 100%;
  }
  :deep(textarea.ant-input) {
    height: auto;
  }
}
:deep(.ant-select-multiple .ant-select-selection-item-remove) {
  display: inline-flex;
  align-items: center;
}
:deep(.ant-picker) {
  padding: 4px 18px 4px 4px;
}
:deep(.ant-input + .chineses-amount) {
  margin-left: 13px;
}
</style>

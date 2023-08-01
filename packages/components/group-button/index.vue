<template>
  <div class="flex">
    <a-button
      v-for="item in filterData"
      :key="item.label"
      :type="item.type"
      :class="['group-button__item', size]"
      @click="item.clickCallBack()">
      {{ item.label }}
      <template v-if="item.iconType" #icon>
        <icon-custom-add-border-blue
          v-if="item.iconType === 'add'"
          class="icon-prefix"></icon-custom-add-border-blue>
      </template>
    </a-button>
  </div>
</template>
<script setup lang="ts">
import { PropType, computed } from 'vue'

type Shape = 'default' | 'circle' | 'round'
interface ButtonType {
  label: string
  type?: string
  clickCallBack: Function
  shape?: Shape
  iconType?: string
  show?: boolean
}
const props = defineProps({
  buttons: {
    type: Array as PropType<ButtonType[]>,
    default: () => [],
    required: true,
  },
  alignType: {
    type: String,
    default: 'start',
  },
  size: {
    type: String,
    default: 'normal',
  },
})

const filterData = computed(() => {
  return props.buttons.filter((item: ButtonType) => item.show !== false)
})
</script>
<style lang="less" scoped>
:deep(.flex .ant-btn) {
  border-radius: 4px;
}
// .group-button__item {
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 40px;
//   border-radius: 4px;
//   color: @primary-color;
//   border: 1px solid @primary-color;
//   line-height: 40px;
//   text-align: center;
//   padding: 0 17px;
//   cursor: pointer;
//   &.primary {
//     background-color: @primary-color;
//     color: #fff;
//     border: none;
//   }
//   &.danger {
//     background-color: #fff;
//     color: @error-color;
//     border: 1px solit @error-color;
//   }
//   img {
//     width: 12px;
//     height: 12px;
//   }
//   span {
//     margin-left: 8px;
//     margin-right: 8px;
//   }
// }
.group-button__item + .group-button__item {
  margin-left: 12px;
}
:deep(.group-button__item.large) {
  height: 40px;
  background: transparent;
  border: 1px dashed #1890ff;
  color: #1890ff;
  box-shadow: none;
  flex: 1;
  border-radius: 8px;
  text-shadow: none;
}
</style>

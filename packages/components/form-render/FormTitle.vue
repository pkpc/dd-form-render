<template>
  <div class="form-title" :class="{ pointer: JSONData.isShowExpand }" @click="handleExpand">
    <div class="flex items-center">
      <span class="title">{{ title }}</span>
      <slot name="titleAfter" :card-index="cardIndex" :data="JSONData"></slot>
      <a-tooltip placement="bottomLeft" :arrow-point-at-center="true">
        <template #title>
          <div>{{ JSONData.titleTip }}</div>
        </template>
        <icon-custom-question-grey
          v-if="JSONData.titleTip"
          class="ml-4px"></icon-custom-question-grey>
      </a-tooltip>
    </div>

    <slot name="right" :card-index="cardIndex" :data="JSONData"></slot>
    <slot name="titleRight" :card-index="cardIndex" :data="JSONData"></slot>
    <div v-if="JSONData.isShowExpand" class="form-arrow">
      <!-- <span class="mr-6px">{{ getExpandText }}</span> -->
      <RightOutlined :class="[JSONData.expand === false ? 'right' : 'down']" />
    </div>
  </div>
</template>

<script lang="ts" setup name="FormTitle">
import { toRefs, toRef, computed, isReactive, PropType, onUpdated, watch, ref } from 'vue'
import { FormOptionType, ThemeType, FormType } from './types.ts'
import { RightOutlined, InfoCircleOutlined } from '@ant-design/icons-vue'
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  dataSource: {
    type: Object as PropType<FormOptionType>,
    default: () => ({}),
  },
  cardIndex: {
    type: Number,
    default: 0,
  },
})

const colorArr = ref<any>({ info: '#0AADB9', warn: '#FFA300', error: '#FF0000' })
const JSONData = computed(() => props.dataSource)
const handleExpand = () => {
  if (JSONData.value.isShowExpand && JSONData.value.expand !== undefined) {
    JSONData.value.expand = !JSONData.value.expand
  }
}

const getExpandText = computed(() => {
  return JSONData.value.expand === false ? '展开' : '收起'
})
</script>

<style lang="less" scoped>
.form-title {
  display: flex;
  align-items: center;
  line-height: 22px;
  // padding: 5px 0;
  position: relative;
  justify-content: space-between;
  &.pointer {
    cursor: pointer;
  }
  .anticon.down {
    transition: transform 0.5s ease;
    transform: rotate(90deg);
  }
  .anticon.right {
    transition: transform 0.5s ease;
    transform: rotate(0deg);
  }
  .title {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
    position: relative;
  }

  .title::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 8px;
    background: #4c84ff;
    opacity: 0.2;
    top: 12px;
  }

  // .title::after {
  //   position: absolute;
  //   left: -10px;
  //   width: 4px;
  //   height: 14px;
  //   background: #4c84ff;
  //   box-shadow: 0px 2px 4px 0px rgba(0, 189, 204, 0.5);
  //   border-radius: 3px;
  //   top: 50%;
  //   transform: translateY(-50%);
  //   content: '';
  // }

  .help {
    font-size: 12px;
    margin-left: 4px;
  }

  .icon {
    cursor: pointer;
    font-size: 14px;
  }

  .form-arrow {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    cursor: pointer;
    color: #017FFF;
  }
}
</style>

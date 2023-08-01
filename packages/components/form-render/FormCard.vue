<template>
  <div v-if="isShowCard" class="form-card" :class="[JSONData.cardClass]">
    <form-title
      class="mb-16px form-card-title"
      :class="{ expand: JSONData.expand !== false }"
      :title="getCardTitle"
      :data-source="JSONData"
      :card-index="cardIndex">
      <template v-for="(slot, slotName) in $slots" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps" />
      </template>
    </form-title>
    <section v-show="JSONData.expand !== false" class="form-card-area">
      <form-item-tree
        :form-data="formData"
        :parent="JSONData"
        :children="JSONData.children"
        :card-index="cardIndex">
        <template v-for="(slot, slotName) in $slots" #[slotName]="slotProps">
          <slot :name="slotName" v-bind="slotProps" />
        </template>
      </form-item-tree>
    </section>
  </div>
</template>
<script setup lang="ts" name="FormCard">
import { PropType, computed, isReactive, toRef, toRefs } from 'vue'
import { FormOptionType, ThemeType, FormType } from './types.ts'
import FormTitle from './FormTitle.vue'
import FormItemTree from './FormItemTree.vue'
const props = defineProps({
  formJson: {
    type: Object as PropType<FormOptionType>,
    default: () => ({}),
  },
  formData: {
    type: Object,
    default: () => ({}),
  },
  cardIndex: {
    type: Number,
    default: 0,
  },
})

const getCardTitle = computed(() => {
  if (JSONData.value.cardTitleType === 'follow') {
    return JSONData.value.label + (props.cardIndex + 1)
  } else {
    return JSONData.value.label
  }
})

const JSONData = computed(() => props.formJson)
const isShowCard = computed(() => JSONData.value.hidden !== true)
</script>
<style lang="less" scoped>
.form-card {
  padding: 10px 20px;
  // margin-bottom: 12px;
  border-radius: 8px;
  background-color: #fff;
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  & + .form-card {
    margin-top: 12px;
  }
  &.border {
    margin: 0 20px 20px;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
  .form-card-title {
    position: sticky;
    top: -24px;
    background: #fff;
    z-index: 2;
    height: 30px;
    margin-bottom: 0;
    display: flex;
    width: 100%;
    justify-content: space-between;
    &.expand {
      margin-bottom: 12px;
    }
    &__sp {
      font-size: 16px;
      font-weight: 600;
      color: #1a1a1a;
      position: relative;
      &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 8px;
        background: #4c84ff;
        opacity: 0.2;
        top: 12px;
      }
    }
  }
  .form-card-area {
    display: flex;
    flex-flow: row wrap;
  }
}
</style>

<template>
  <template v-for="(item, index) in children" :key="item.label + index">
    <form-item-tree
      v-if="item.type === FormType.cardGroup && item.children?.length"
      :parent="item"
      :form-data="newFormData"
      :children="item.children">
      <template v-for="(slot, slotName) in $slots" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps" />
      </template>
    </form-item-tree>
    <form-card
      v-else-if="item.type === FormType.card"
      :form-data="getCardFormData(parent, item, index)"
      :form-json="item"
      :card-index="index">
      <template v-for="(slot, slotName) in $slots" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps" />
      </template>
    </form-card>
    <form-title
      v-else-if="item.type === FormType.title"
      class="mb-16px form-card-title"
      :title="item.label"
      :data-source="item"
      :card-index="index">
      <template v-for="(slot, slotName) in $slots" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps" />
      </template>
    </form-title>

    <template v-else-if="item.type === FormType.slot">
      <slot name="itemSlot" :form-data="newFormData" :data= "item"></slot>
    </template>
    <template v-else-if="![FormType.cardGroup, FormType.card, FormType.title].includes(item.type)">
      <form-item
        :data-source="item"
        :form-data="newFormData"
        :is-group-item="true"
        :parent-item="parent"
        :child-index="index"
        :card-index="cardIndex">
        <template v-for="(slot, slotName) in $slots" #[slotName]="slotProps">
          <slot :name="slotName" v-bind="slotProps" />
        </template>
      </form-item>
      <form-item-tree
        v-if="item.children"
        :parent="item"
        :form-data="newFormData"
        :children="item.children">
        <template v-for="(slot, slotName) in $slots" #[slotName]="slotProps">
          <slot :name="slotName" v-bind="slotProps" />
        </template>
      </form-item-tree>
    </template>
  </template>
</template>
<script setup lang="ts" name="FormItemTree">
import { PropType, computed } from 'vue'
import { FormOptionType, ThemeType, FormType } from './types.ts'
import FormItem from './FormItem.vue'
import FormCard from './FormCard.vue'
import FormTitle from './FormTitle.vue'
const props = defineProps({
  formData: {
    type: Object,
    default: () => ({}),
  },
  children: {
    type: Array as PropType<FormOptionType[]>,
    default: () => [],
  },
  parent: {
    type: Object as PropType<FormOptionType>,
    default: () => undefined,
  },
  cardIndex: {
    type: Number,
    default: 0,
  },
})

const getCardFormData = (parent: FormOptionType, child: FormOptionType, cardIndex: number) => {
  if (parent?.type === FormType.cardGroup) {
    return parent.field ? newFormData.value[parent.field][cardIndex] : newFormData.value[cardIndex]
  } else if (child.fieldLink === 'object') {
    return newFormData.value[child.field]
  } else if (child.fieldLink === 'array') {
    return newFormData.value[cardIndex]
  } else if (child.fieldLink === 'keyArray') {
    if (Array.isArray(newFormData.value)) {
      return newFormData.value[cardIndex]
    } else {
      return newFormData.value[child.field][cardIndex]
    }
  } else {
    return newFormData.value
  }
}
const newFormData = computed(() => props.formData)
</script>
<style lang="less" scoped></style>

<template>
  <div class="container">
    <FormRender ref="formRenderRef" :form-json="formJson" :formData="formData"></FormRender>
    <a-button @click="handleRestValid">重置</a-button>
    <div>
      <a href="https://vitejs.dev" target="_blank">
        <img src="/vite.svg" class="logo" alt="Vite logo" />
      </a>
      <a href="https://vuejs.org/" target="_blank">
        <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
      </a>
    </div>
    <HelloWorld msg="Vite + Vue" />
  </div>
  <!--  <DButton></DButton>-->
</template>

<script setup lang="ts">
import {ref} from 'vue'
import HelloWorld from './components/HelloWorld.vue'
// import DButton from "../packages/components/DButton/DButton.vue";
import FormRender from "../packages/components/form-render/index.ts";
import {FormType} from "../packages/components/form-render/types.ts";
// import button from '../packages/button'

const formData = ref({
  applyNo: '',
  state: 1,
  test: '900000',
  readOnly: '手动阀手动阀舒服点啊顺丰快递到家了jlsajflkjljlsdf手动阀手动阀舒服点啊顺丰快递到家了jlsajflkjljlsdf手动阀手动阀舒服点啊顺丰快递到家了jlsajflkjljlsdf手动阀手动阀舒服点啊顺丰快递到家了jlsajflkjljlsdf手动阀手动阀舒服点啊顺丰快递到家了jlsajflkjljlsdf'
})
const formJson = [
  {
    label: 'amountReadOnly',
    field: 'test',
    type: FormType.amountReadOnly,
  },
  {
    label: 'readOnly',
    field: 'readOnly',
    type: FormType.readonly,
  },  {
    label: 'dialogSelect',
    field: 'test2',
    type: FormType.dialogSelect,
    handleOnChange: ( ) => {
      console.log('click')
    }
  },
  {
    label: '订单编号3',
    field: 'applyNo',
    type: 'input',
    itemMarginRight: '40',
    labelTip: 'kkkasdf这是',
    title: '颗粒剂',
    attrs: {
      maxlength: 4,
      hasAll: true,
    },
    listeners: {
      change: () => {
        console.log('change')
      },
      pressEnter: () => {
        console.log('pressEnter')
      },
    },
    handleOnChange: () => {
      console.log('kkk欢欢')
    }
  },
  {
    label: '婚姻状态',
    field: 'state',
    type: 'select',
    options: [
      {code: 1, name: '已婚',},
      {code: 2, name: '未婚',},
      {code: 3, name: '离婚',},
    ],
    attrs: {
      mode: 'multiple',
      hasAll: true,
    },
    rules: [{required: true, message: '请输入'}],
    mapping: ['code', 'name'],
    // listeners: {
    //   change: (value: any) => {
    //     console.log('change:', value)
    //   }
    // },
    handleOnChange: (value: any) => {
      console.log('handleOnChange:', value)
    }
  }
]

const formRenderRef = ref()
const handleRestValid = () => {
  formRenderRef.value.clearValidate()
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  background-color: #efefef;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

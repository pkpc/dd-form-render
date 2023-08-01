<script setup lang="ts">
import {ref} from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import DButton from "../packages/components/DButton/DButton.vue";
import FormRender from "../packages/components/form-render/index.vue";
// import button from '../packages/button'

const formData = ref({})
const formJson = [
  {
    label: '订单编号',
    field: 'applyNo',
    type: 'input',
    itemMarginRight: '40',
  },
]
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
  <DButton></DButton>
  <a-button>kk</a-button>
  <FormRender :form-json="formJson" :formData="formData"></FormRender>
</template>

<style scoped>
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

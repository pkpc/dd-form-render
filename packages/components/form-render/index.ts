import { App } from 'vue'
import FormRender from './index.vue'

FormRender.name = 'FormRender'
FormRender.install = function (app: App) {
    app.component('FormRender', FormRender)
}

export default FormRender
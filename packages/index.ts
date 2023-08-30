import FormRender from './components/form-render'
import type {FormOptionType, FormType} from './components/form-render/types'
import type { App } from 'vue'

const components = [
    FormRender
]
const install = (app: App) => {
    components.map((item) => {
        app.component(item.name, item)
    })
}
export default {
    install,
}
export {
    FormRender,
    FormOptionType,
    FormType
}
import DButton from './button'

const components = [
    DButton
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
    DButton
}
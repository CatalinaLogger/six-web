import Vue from 'vue'
import SvgIcon from '@/components/svg-icon'// svg组件
import icons from '@/pages/system/menu/icons.js'// just for @/views/icons , you can delete it

// register globally
Vue.component('svg-icon', SvgIcon)

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./svg', false, /\.svg$/)
const iconMap = requireAll(req)

icons.generate(iconMap) // just for @/views/icons , you can delete it

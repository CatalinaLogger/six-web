import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/pages/layout/index'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/404', component: _import('error/404'), hidden: true },
  { path: '/401', component: _import('error/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard' }
    }]
  },
  {
    path: '/system',
    component: Layout,
    hidden: true,
    children: [{
      path: 'center',
      component: _import('system/center/index'),
      name: 'center',
      meta: { title: 'center' }
    }]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

/**
 * 递归处理菜单树动态生成路由
 */
export function treeToRouters(menuTree, parent, meta, src, level) {
  let routers = []
  menuTree.forEach(function(record) {
    if (record.type !== 2) { /** 如果不是按钮 */
      let tmp = {meta: {}}
      let _level = 1
      if (level !== undefined && level !== null) {
        try {
          tmp.component = _import(`${src}${record.path}/index`)
          _level = level + 1
          parent.push(tmp)
          tmp.path = record.path
        } catch (e) {
          /** 找不到模板文件不做处理 */
          return
        }
      } else {
        src = ''
        routers.push(tmp)
        tmp.path = `/${record.path}`
        tmp.component = Layout
      }
      tmp.redirect = record.redirect
      tmp.hidden = record.hidden === 1
      tmp.name = `keep_${record.path}`
      tmp.meta.title = record.path
      tmp.meta.icon = record.icon
      tmp.meta.noCache = !record.cache
      tmp.level = _level
      if (record.children && record.children.length > 0) {
        tmp.children = []
        treeToRouters(record.children, tmp.children, tmp.meta, `${src}${record.path}/`, _level)
      }
    } else {
      if (!meta.buttons) {
        meta.buttons = []
      }
      meta.buttons.push({path: record.path, name: record.name, icon: record.icon, noCache: !record.cache})
    }
  })
  return routers
}

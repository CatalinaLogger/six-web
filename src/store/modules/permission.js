import { constantRouterMap, treeToRouters } from '@/router'

const permission = {
  state: {
    allRouters: constantRouterMap,
    addRouters: []
  },
  mutations: {
    ADD_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.allRouters = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, menuTree) {
      return new Promise(resolve => {
        let accessedRouters = treeToRouters(menuTree)
        commit('ADD_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission

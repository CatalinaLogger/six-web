import storage from 'good-storage'
import { getDaily } from '@/api/login'

const app = {
  state: {
    sidebar: {
      opened: !storage.get('sidebarStatus')
    },
    language: storage.get('language') || 'zh'
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        storage.set('sidebarStatus', 1)
      } else {
        storage.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
    },
    SET_LANGUAGE: (state, language) => {
      state.language = language
      storage.set('language', language)
    }
  },
  actions: {
    toggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },
    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language)
    },
    GetDaily({ commit }, date) {
      return new Promise((resolve, reject) => {
        getDaily(date).then(response => {
          let daily = JSON.parse(response.data)
          resolve(daily)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default app

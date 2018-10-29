const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  visitedViews: state => state.tags.visitedViews,
  cachedViews: state => state.tags.cachedViews,
  token: state => state.user.token,
  socket: state => state.user.socket,
  notice: state => state.user.notice,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  allRouters: state => state.permission.allRouters,
  addRouters: state => state.permission.addRouters
}
export default getters

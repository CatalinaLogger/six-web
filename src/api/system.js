import request from '@/common/utils/request'

export function getMenuTree() {
  return request({
    url: '/system/menu/tree',
    method: 'get'
  })
}

export function insertMenu(menu) {
  return request({
    url: '/system/menu/insert',
    method: 'post',
    params: {
      name: menu.name,
      path: menu.path,
      redirect: menu.redirect,
      icon: menu.icon,
      hidden: menu.hidden,
      cache: menu.cache,
      parentId: menu.parent.id,
      seq: menu.seq,
      type: menu.type,
      remark: menu.remark
    }
  })
}

export function updateMenu(menu) {
  return request({
    url: '/system/menu/update',
    method: 'put',
    params: {
      id: menu.id,
      name: menu.name,
      path: menu.path,
      redirect: menu.redirect,
      icon: menu.icon,
      hidden: menu.hidden,
      cache: menu.cache,
      parentId: menu.parent.id,
      seq: menu.seq,
      type: menu.type,
      remark: menu.remark
    }
  })
}

export function deleteMenu(menuId) {
  return request({
    url: '/system/menu/delete',
    method: 'delete',
    params: {
      menuId
    }
  })
}

export function getDeptTree() {
  return request({
    url: '/system/dept/tree',
    method: 'get'
  })
}

/** 获取部门主管列表 */
export function getDeptLeadList(deptId) {
  return request({
    url: '/system/dept/lead/list',
    method: 'get',
    params: {
      deptId
    }
  })
}

export function insertDept(dept) {
  return request({
    url: '/system/dept/insert',
    method: 'post',
    params: {
      name: dept.name,
      parentId: dept.parent.id,
      seq: dept.seq,
      remark: dept.remark
    }
  })
}

export function updateDept(dept) {
  return request({
    url: '/system/dept/update',
    method: 'put',
    params: {
      id: dept.id,
      name: dept.name,
      parentId: dept.parent.id,
      leadKeys: dept.leadKeys.toString(),
      seq: dept.seq,
      remark: dept.remark
    }
  })
}

export function deleteDept(deptId) {
  return request({
    url: '/system/dept/delete',
    method: 'delete',
    params: {
      deptId
    }
  })
}

export function getGroupList() {
  return request({
    url: '/system/role/group/list',
    method: 'get'
  })
}

/** 获取所有角色数据 */
export function getRoleList() {
  return request({
    url: '/system/role/list',
    method: 'get'
  })
}

/** 获取当前用户角色数据 */
export function getRoleMine() {
  return request({
    url: '/system/role/mine',
    method: 'get'
  })
}

/** 获取当前角色绑定的菜单权限key值 */
export function getRoleMenuKeys(roleId) {
  return request({
    url: '/system/role/menu/keys',
    method: 'get',
    params: {
      roleId
    }
  })
}

export function insertGroup(group) {
  return request({
    url: '/system/role/group/insert',
    method: 'post',
    params: {
      name: group.name
    }
  })
}

export function updateGroup(group) {
  return request({
    url: '/system/role/group/update',
    method: 'put',
    params: {
      id: group.id,
      name: group.name
    }
  })
}

/** 添加角色信息并且更新绑定的菜单权限信息 */
export function insertRole(role) {
  return request({
    url: '/system/role/insert',
    method: 'post',
    params: {
      id: role.id,
      code: role.code,
      name: role.name,
      groupId: role.groupId,
      menuKeys: role.menuKeys.toString()
    }
  })
}

/** 更新角色信息并且更新绑定的菜单权限信息 */
export function updateRole(role) {
  return request({
    url: '/system/role/update',
    method: 'put',
    params: {
      id: role.id,
      code: role.code,
      name: role.name,
      groupId: role.groupId,
      menuKeys: role.menuKeys.toString()
    }
  })
}

export function deleteRole(roleId) {
  return request({
    url: '/system/role/delete',
    method: 'delete',
    params: {
      roleId
    }
  })
}

/** 获取已绑定当前角色的用户数据 支持分页 */
export function getBoundUserPage(roleId, query, page, size) {
  return request({
    url: '/system/role/user/page/bound',
    method: 'get',
    params: {
      roleId,
      query,
      page,
      size
    }
  })
}

/** 获取未绑定当前角色的用户数据 支持分页 */
export function getUnboundUserPage(roleId, query, page, size) {
  return request({
    url: '/system/role/user/page/unbound',
    method: 'get',
    params: {
      roleId,
      query,
      page,
      size
    }
  })
}

/** 批量添加绑定当前角色的用户 */
export function binding(role) {
  return request({
    url: '/system/role/user/binding',
    method: 'post',
    params: {
      id: role.id,
      code: role.code,
      name: role.name,
      userKeys: role.bindingKeys.toString()
    }
  })
}

/** 批量移除绑定当前角色的用户 */
export function untying(role) {
  return request({
    url: '/system/role/user/untying',
    method: 'post',
    params: {
      id: role.id,
      code: role.code,
      name: role.name,
      userKeys: role.untyingKeys.toString()
    }
  })
}

/** 获取当前部门下的用户数据 支持分页 */
export function getUserPage(deptId, query, page, size) {
  return request({
    url: '/system/user/page',
    method: 'get',
    params: {
      deptId,
      query,
      page,
      size
    }
  })
}

/** 检查用户属性值是否已被占用 */
export function checkExist(userId, field, value) {
  return request({
    url: '/system/user/check',
    method: 'get',
    params: {
      userId,
      field,
      value
    }
  })
}

export function insertUser(user) {
  return request({
    url: '/system/user/insert',
    method: 'post',
    params: {
      name: user.name,
      phone: user.phone,
      mail: user.mail,
      username: user.username,
      deptId: user.deptId,
      status: user.status,
      remark: user.remark,
      deptKeys: user.deptKeys.toString(),
      roleKeys: user.roleKeys.toString()
    }
  })
}

export function updateUser(user) {
  return request({
    url: '/system/user/update',
    method: 'put',
    params: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      mail: user.mail,
      username: user.username,
      deptId: user.deptId,
      status: user.status,
      remark: user.remark,
      deptKeys: user.deptKeys.toString(),
      roleKeys: user.roleKeys.toString()
    }
  })
}

export function resetUser() {
  return request({
    url: '/system/user/reset',
    method: 'put'
  })
}

export function deleteUser(userId) {
  return request({
    url: '/system/user/delete',
    method: 'delete',
    params: {
      userId
    }
  })
}

export function deleteBatchUser(userKeys) {
  return request({
    url: '/system/user/delete/batch',
    method: 'delete',
    params: {
      userKeys: userKeys.toString()
    }
  })
}
/** 根据角色编码获取用户 */
export function getUserListRole(roleCode) {
  return request({
    url: '/system/user/list/role',
    method: 'get',
    params: {
      roleCode
    }
  })
}

/** 获取用户绑定角色的Key值 */
export function getUserRoleKeys(userId) {
  return request({
    url: '/system/user/role/keys',
    method: 'get',
    params: {
      userId
    }
  })
}

/** 获取用户所在部门列表 */
export function getUserDeptList(userId) {
  return request({
    url: '/system/user/dept/list',
    method: 'get',
    params: {
      userId
    }
  })
}

/** 获取我领导的人员 */
export function getWithList(userId) {
  return request({
    url: '/system/under/with/list',
    method: 'get',
    params: {
      userId
    }
  })
}

/** 获取没有领导的人员 */
export function getNonePage(query, page, size) {
  return request({
    url: '/system/under/none/page',
    method: 'get',
    params: {
      query,
      page,
      size
    }
  })
}

/** 绑定下属 */
export function underPush(userId, userKeys) {
  return request({
    url: '/system/under/push',
    method: 'put',
    params: {
      userId,
      userKeys: userKeys.toString()
    }
  })
}

/** 解除下属 */
export function underPull(userId, userKeys) {
  return request({
    url: '/system/under/pull',
    method: 'put',
    params: {
      userId,
      userKeys: userKeys.toString()
    }
  })
}

export function getMineInfo() {
  return request({
    url: '/system/user/mine',
    method: 'get'
  })
}

export function updateInfo(info) {
  return request({
    url: '/system/user/info/update',
    method: 'post',
    params: {
      name: info.name,
      sex: info.sex,
      birthday: info.birthday,
      hometown: info.hometown.toString(),
      school: info.school,
      email: info.email,
      phone: info.phone,
      introduction: info.introduction
    }
  })
}

/** 获取当前用户个人资料 */
export function mineSelect() {
  return request({
    url: 'system/center/mine/select',
    method: 'get'
  })
}

/** 修改当前用户个人资料 */
export function mineChange(info) {
  return request({
    url: 'system/center/mine/update',
    method: 'put',
    params: {
      jsonInfo: JSON.stringify(info)
    }
  })
}

/** 修改当前用户密码 */
export function passChange({ oldPassword, newPassword }) {
  return request({
    url: 'system/center/pass/update',
    method: 'put',
    params: {
      oldPassword,
      newPassword
    }
  })
}

/** 获取用户登录信息列表 */
export function getSignPage(page, size) {
  return request({
    url: 'system/center/login/page',
    method: 'get',
    params: {
      page,
      size
    }
  })
}

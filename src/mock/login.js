const userMap = {
  admin: {
    roles: ['admin'],
    token: 'admin',
    introduction: '我是超级管理员',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  editor: {
    roles: ['editor'],
    token: 'editor',
    introduction: '我是编辑',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

export default {
  loginByUsername: request => {
    const { username } = JSON.parse(request.body)
    return {
      code: 0,
      msg: '请求成功',
      data: userMap[username]
    }
  },
  getUserInfo: request => {
    return {
      code: 0,
      msg: '请求成功',
      data: userMap['admin']
    }
  },
  logout: () => {
    return {
      code: 0,
      msg: '请求成功'
    }
  }
}

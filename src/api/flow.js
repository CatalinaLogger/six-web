import request from '@/common/utils/request'

/** 获取流程定义列表 */
export function getFlowList(name, category, last) {
  return request({
    url: '/flow/list',
    method: 'get',
    params: {
      name,
      category,
      last
    }
  })
}

/** 停用流程 */
export function suspendFlow(processId) {
  return request({
    url: '/flow/suspend',
    method: 'post',
    params: {
      processId
    }
  })
}

/** 启用流程 */
export function activateFlow(processId) {
  return request({
    url: '/flow/activate',
    method: 'post',
    params: {
      processId
    }
  })
}

/** 获取用户发起流程列表 */
export function getMinePage(param, page, size) {
  return request({
    url: '/flow/mine/page',
    method: 'get',
    params: {
      category: param.category,
      name: param.name,
      level: param.level,
      status: param.status,
      start: param.startEnd[0],
      end: param.startEnd[1],
      page,
      size
    }
  })
}

/** 流程催办 */
export function pressFlow(processId) {
  return request({
    url: '/flow/press',
    method: 'post',
    params: {
      processId
    }
  })
}

/** 获取用户待办任务列表 */
export function getWaitPage(param, page, size) {
  return request({
    url: '/task/wait/page',
    method: 'get',
    params: {
      name: param.name,
      task: param.task,
      user: param.user,
      level: param.level,
      start: param.startEnd[0],
      end: param.startEnd[1],
      page,
      size
    }
  })
}

/** 获取用户已办任务列表 */
export function getPastPage(param, page, size) {
  return request({
    url: '/task/past/page',
    method: 'get',
    params: {
      name: param.name,
      task: param.task,
      user: param.user,
      level: param.level,
      start: param.startEnd[0],
      end: param.startEnd[1],
      page,
      size
    }
  })
}

/** 获取流程已办任务列表 */
export function getTaskList(processId) {
  return request({
    url: '/flow/task',
    method: 'get',
    params: {
      processId
    }
  })
}

import request from '@/common/utils/request'

/** 查询申请表单草稿 */
export function selectDraft(defineId) {
  return request({
    url: '/work/draft/select',
    method: 'get',
    params: {
      defineId
    }
  })
}

/** 保存申请表单草稿 */
export function insertDraft(defineId, model) {
  return request({
    url: '/work/draft/insert',
    method: 'post',
    params: {
      defineId,
      jsonData: model
    }
  })
}

/** 保存申请表单草稿 */
export function deleteDraft(defineId) {
  return request({
    url: '/work/draft/delete',
    method: 'delete',
    params: {
      defineId
    }
  })
}

/** 通用发起申请接口 */
export function startEasy({defineId, taskId, taskCode, taskName, content}) {
  return request({
    url: '/work/easy/start',
    method: 'post',
    params: {
      defineId,
      taskId,
      taskCode,
      taskName,
      content
    }
  })
}

/** 通用处理审批接口 */
export function solveEasy({taskId, taskCode, taskName, taskNote}) {
  return request({
    url: '/work/easy/solve',
    method: 'post',
    params: {
      taskId,
      taskCode,
      taskName,
      taskNote
    }
  })
}

/** 通用查询审批表单接口 */
export function selectEasy(processId) {
  return request({
    url: '/work/easy/select',
    method: 'get',
    params: {
      processId
    }
  })
}

/** 通用修改附件表单接口 */
export function updateEasy(processId, carbon) {
  return request({
    url: '/work/easy/update',
    method: 'put',
    params: {
      processId,
      carbon
    }
  })
}

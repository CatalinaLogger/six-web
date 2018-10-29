import request from '@/common/utils/request'

/** 获取字典数据树 */
export function getConfDataTree(code) {
  return request({
    url: '/global/conf/data/tree',
    method: 'get',
    params: {
      code
    }
  })
}

/** 获取所有字典分类数据 */
export function getConfList() {
  return request({
    url: '/global/conf/list',
    method: 'get'
  })
}

export function insertConf(conf) {
  return request({
    url: '/global/conf/insert',
    method: 'post',
    params: {
      code: conf.code,
      name: conf.name,
      seq: conf.seq
    }
  })
}

export function updateConf(conf) {
  return request({
    url: '/global/conf/update',
    method: 'put',
    params: {
      id: conf.id,
      code: conf.code,
      name: conf.name,
      seq: conf.seq
    }
  })
}

export function deleteConf(confId) {
  return request({
    url: '/global/conf/delete',
    method: 'delete',
    params: {
      confId
    }
  })
}

export function insertConfData(confData) {
  return request({
    url: '/global/conf/data/insert',
    method: 'post',
    params: {
      confId: confData.confId,
      code: confData.code,
      name: confData.name,
      value: confData.value,
      parentId: confData.parent.id,
      seq: confData.seq
    }
  })
}

export function updateConfData(confData) {
  return request({
    url: '/global/conf/data/update',
    method: 'put',
    params: {
      id: confData.id,
      confId: confData.confId,
      code: confData.code,
      name: confData.name,
      value: confData.value,
      parentId: confData.parent.id,
      seq: confData.seq
    }
  })
}

export function deleteConfData(confDataId) {
  return request({
    url: '/global/conf/data/delete',
    method: 'delete',
    params: {
      confDataId
    }
  })
}

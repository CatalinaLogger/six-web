import request from '@/common/utils/request'

/** 获取上周周报 */
export function selectWeeklyBefore() {
  return request({
    url: '/desk/report/weekly/select/before',
    method: 'get'
  })
}

/** 获取本周周报 */
export function selectWeekly() {
  return request({
    url: '/desk/report/weekly/select',
    method: 'get'
  })
}

/** 获取汇总周报 */
export function mergeWeekly(date) {
  return request({
    url: '/desk/report/merge/weekly',
    method: 'get',
    params: {date}
  })
}

/** 新增周报 */
export function insertWeekly(weekly) {
  return request({
    url: '/desk/report/weekly/insert',
    method: 'post',
    params: weekly
  })
}

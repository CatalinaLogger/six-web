import request from '@/common/utils/request'

/** 获取仓库列表 */
export function selectStore() {
  return request({
    url: '/datum/store/select',
    method: 'get'
  })
}

/** 新增仓库 */
export function insertStore({code, name, dutyId, dutyLink, seq, address, remark}) {
  return request({
    url: '/datum/store/insert',
    method: 'post',
    params: {code, name, dutyId, dutyLink, seq, address, remark}
  })
}

/** 修改仓库 */
export function updateStore({id, code, name, dutyId, dutyLink, seq, address, remark}) {
  return request({
    url: '/datum/store/update',
    method: 'put',
    params: {id, code, name, dutyId, dutyLink, seq, address, remark}
  })
}

/** 修改仓库状态 */
export function updateStoreStatus({storeId, status}) {
  return request({
    url: '/datum/store/update/status',
    method: 'put',
    params: {storeId, status}
  })
}

/** 删除仓库 */
export function deleteStore(storeId) {
  return request({
    url: '/datum/product/store/delete',
    method: 'delete',
    params: {storeId}
  })
}

/** 获取产品分类树 */
export function getProductGroupTree() {
  return request({
    url: '/datum/product/group/tree',
    method: 'get'
  })
}

/** 新增产品分类 */
export function insertProductGroup({name, parentId}) {
  return request({
    url: '/datum/product/group/insert',
    method: 'post',
    params: {name, parentId}
  })
}

/** 修改产品分类 */
export function updateProductGroup({id, name, parentId}) {
  return request({
    url: '/datum/product/group/update',
    method: 'put',
    params: {id, name, parentId}
  })
}

/** 删除产品分类 */
export function deleteProductGroup(groupId) {
  return request({
    url: '/datum/product/group/delete',
    method: 'delete',
    params: {groupId}
  })
}

/** 上移产品分类 */
export function upProductGroup(groupId) {
  return request({
    url: '/datum/product/group/up',
    method: 'put',
    params: {groupId}
  })
}

/** 下移产品分类 */
export function downProductGroup(groupId) {
  return request({
    url: '/datum/product/group/down',
    method: 'put',
    params: {groupId}
  })
}

/** 获取属性列表 */
export function getPropertyGroupList() {
  return request({
    url: '/datum/property/group/list',
    method: 'get'
  })
}

/** 新增属性 */
export function insertPropertyGroup({name}) {
  return request({
    url: '/datum/property/group/insert',
    method: 'post',
    params: {name}
  })
}

/** 修改属性 */
export function updatePropertyGroup({id, name}) {
  return request({
    url: '/datum/property/group/update',
    method: 'put',
    params: {id, name}
  })
}

/** 删除属性 */
export function deletePropertyGroup(groupId) {
  return request({
    url: '/datum/property/group/delete',
    method: 'delete',
    params: {groupId}
  })
}

/** 上移属性 */
export function upPropertyGroup(groupId) {
  return request({
    url: '/datum/property/group/up',
    method: 'put',
    params: {groupId}
  })
}

/** 下移属性 */
export function downPropertyGroup(groupId) {
  return request({
    url: '/datum/property/group/down',
    method: 'put',
    params: {groupId}
  })
}

/** 获取属性值列表 */
export function getPropertyList(groupId) {
  return request({
    url: '/datum/property/list',
    method: 'get',
    params: {groupId}
  })
}

/** 新增属性值 */
export function insertProperty({name, groupId}) {
  return request({
    url: '/datum/property/insert',
    method: 'post',
    params: {name, groupId}
  })
}

/** 修改属性值 */
export function updateProperty({id, name}) {
  return request({
    url: '/datum/property/update',
    method: 'put',
    params: {id, name}
  })
}

/** 删除属性值 */
export function deleteProperty(propertyId) {
  return request({
    url: '/datum/property/delete',
    method: 'delete',
    params: {propertyId}
  })
}

/** 上移属性值 */
export function upProperty(propertyId) {
  return request({
    url: '/datum/property/up',
    method: 'put',
    params: {propertyId}
  })
}

/** 下移属性值 */
export function downProperty(propertyId) {
  return request({
    url: '/datum/property/down',
    method: 'put',
    params: {propertyId}
  })
}

/** 获取单位列表 */
export function getUnitList(category) {
  return request({
    url: '/datum/unit/list',
    method: 'get',
    params: {category}
  })
}

/** 新增单位 */
export function insertUnit(unit) {
  return request({
    url: '/datum/unit/insert',
    method: 'post',
    data: unit
  })
}

/** 修改单位 */
export function updateUnit({id, name}) {
  return request({
    url: '/datum/unit/update',
    method: 'put',
    params: {id, name}
  })
}

/** 删除单位 */
export function deleteUnit(unitId) {
  return request({
    url: '/datum/unit/delete',
    method: 'delete',
    params: {unitId}
  })
}

/** 上移单位 */
export function upUnit(unitId) {
  return request({
    url: '/datum/unit/up',
    method: 'put',
    params: {unitId}
  })
}

/** 下移单位 */
export function downUnit(unitId) {
  return request({
    url: '/datum/unit/down',
    method: 'put',
    params: {unitId}
  })
}

import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/flight/list',
    method: 'get',
    params
  })
}

export function addInfo(data) {
  return request({
    url: '/flight/add',
    method: 'post',
    data
  })
}

export function updateInfo(data) {
  return request({
    url: '/flight/update',
    method: 'post',
    data
  })
}

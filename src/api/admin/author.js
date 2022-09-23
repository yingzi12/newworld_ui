import request from '@/utils/request'

export function getStoryAuthor(id) {
  return request({
    url: '/admin/author/getStoryAuthor?sid=' + id,
    method: 'get'
  })
}

//
export function getInfo(sid) {
  return request({
    url: '/admin/author/getInfo?sid='+sid,
    method: 'get'
  })
}

//
export function addAuthor(data) {
  return request({
    url: '/admin/author/add',
    method: 'post',
    data: data
  })
}

//
export function updateAuthor(data) {
  return request({
    url: '/admin/author/edit',
    method: 'put',
    data: data
  })
}

//Manage
export function delAuthor(id,sid) {
  return request({
    url: '/admin/author/remove?id=' + id+'&sid='+sid,
    method: 'delete'
  })
}
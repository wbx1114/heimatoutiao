import request from '@/utils/request'

export const getChannelAPI = () => {
  return request({
    url: '/v1_0/user/channels'
  })
}
/**
 * 获取所有频道
 * @returns Promise
 */
export const getAllChannelAPI = () => {
  return request({
    url: '/v1_0/channels'
  })
}
/**
 *删除频道
 * @param {Number|String} id 频道的 id
 * @returns Promise
 */
export const DelChannelAPI = (id) => {
  return request({
    url: `/v1_0/user/channels/${id}`,
    method: 'DELETE'
  })
}
/**
 * 新增频道
 * @param {Number|String} id 新增频道id
 * @param {Number} sep  新增频道添加的索引值
 * @returns Promise
 */
export const addChannelAPI = (id, sep) => {
  return request({
    url: '/v1_0/user/channels',
    method: 'PATCH',
    data: {
      channels: [{ id, sep }]
    }
  })
}

import request from '@/utils/request'
/**
 * 搜索建议
 * @param {*} q 搜索关键词
 * @returns  Promise
 */
export const getSuggestionAPI = (q) => {
  return request({
    url: '/v1_0/suggestion',
    params: {
      q
    }
  })
}
/**
 * 获取搜索结果
 * @param {Number} page 页数，不传默认为1 非必传
 * @param {Number} per_page 每页数量，
 * @param {String} q 搜索关键词
 * @returns Promise
 */
// eslint-disable-next-line camelcase
export const getResultsAPI = (page, per_page, q) => {
  return request({
    url: '/v1_0/search',
    params: {
      page,
      per_page,
      q
    }
  })
}

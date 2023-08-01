/**
 * axios请求类操作
 */

import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios'
import { message } from 'ant-design-vue'
import qs from 'qs'
import {
  getLocalStorage,
  removeSessionStorage,
  getSessionStorage,
  removeLocalStorage,
} from './storage'
import { useMainAppStore } from '@/store/main-app'
import { Query_Encrypt, AES_Encrypt, parseParams } from './crypto/crypto'
import { logger } from '@/utils/alilog'
import { axiosErrorTip, uuid } from './utils'

/**
 * 创建axios请求
 */
const http = axios.create({
  baseURL: '',
  timeout: 50000,
  headers: {
    version: '1.0',
  },
  validateStatus() {
    // 使用async-await，处理reject情况较为繁琐，所以全部返回resolve，在业务代码中处理异常
    return true
  },
})

/**
 * 请求拦截器
 */
http.interceptors.request.use(
  (config) => {
    let url = config.url as string
    const headers = config.headers as AxiosRequestHeaders

    addPending(config) // 将当前请求添加到 pending 中
    // 如果存在token
    if (getLocalStorage('ddjf_accessToken')) {
      headers.token = getLocalStorage('ddjf_accessToken')
      headers.traceId = uuid()
    }
    if (getLocalStorage('ddjf_appCode')) {
      headers.appCode = getLocalStorage('ddjf_appCode')
    }
    
    // aLiYunLogger(url, JSON.stringify(config.data || config.params))

    // 是否需要加密
    if (getLocalStorage('ddjf_isEncrypt')) {
      headers['X-Encrypt'] = getLocalStorage('ddjf_isEncrypt')

      if ((config.method as string).toLowerCase() === 'get') {
        if (config.params) {
          if (url.indexOf('?') === -1) {
            url = url + '?' + parseParams(config.params)
          } else {
            url = url + parseParams(config.params)
          }
        }
        url = Query_Encrypt(url)
      } else {
        url = Query_Encrypt(url)
        let isAes: any = '1'
        if (config.data instanceof FormData) {
          isAes = config.data.get('isAes')
          if (isAes === '0') {
            config.data?.delete('isAes')
          }
        } else if (config.data instanceof Object) {
          isAes = config.data.isAes || '1'
          if (isAes === '0') {
            delete config.data.isAes
          }
        }
        if (config.data && isAes !== '0') {
          config.data = { arg: AES_Encrypt(config.data) }
        }
      }

      config.url = url
      config.params = null
    }

    return config
  },
  (error) => {
    error.data = {}
    error.data.msg = '服务器异常，请联系管理员！'
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 */
http.interceptors.response.use(
  (response) => {
    const url = response.config.url || ''
    // aLiYunLogger(url, JSON.stringify(response.data))

    if (['401', '403'].includes(response.data.code)) {
      clearPending()
      document.getElementsByClassName('ant-message-notice').length < 1 &&
        message.warning('用户未登录，正在跳转登录页')

      const userStore = useMainAppStore().userStore()
      userStore?.logOut()

      return Promise.reject(response.data.msg)
    } else if ((response.data as any).code === '10010') {
      document.getElementsByClassName('ant-message-notice').length < 1 &&
        message.warning('登录状态已过期,请重新登录')
    } else if (response.data.code === '500' && response.data.msg) {
      document.getElementsByClassName('ant-message-notice').length < 1 &&
        message.error(response.data.msg)
      // clearPending()
      return { success: false, msg: '' }
    } else if (url.includes('yapi.')) {
      return {
        success: true,
        code: '200',
        data: response.data,
        result: response.data,
      }
    } else {
      const content = response.headers['content-disposition']
      if (content) {
        // 返回文件流则处理文件名称
        const fileName = content.split(';')[1].split('filename=')[1]
        const contentType = response.headers['content-type']
        return {
          data: response.data,
          fileName: decodeURIComponent(fileName),
          contentType: contentType,
        }
      } else {
        return response.data
      }
    }
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      document.getElementsByClassName('ant-message-notice').length < 1 &&
        message.warning(`Network ${error.message}` || '网络请求超时')
    }
    const status = error.response?.status
    if (status === 401 || status === 403) {
      removeLocalStorage('ddjf_accessToken')
      document.getElementsByClassName('ant-message-notice').length < 1 &&
        message.warning(status === 403 ? error.response.data.msg : '请重新登录')

      const userStore = useMainAppStore().userStore()
      userStore?.logOut()
    } else if (error.response) {
      document.getElementsByClassName('ant-message-notice').length < 1 &&
        message.warning(axiosErrorTip(error))
    }

    aLiYunLogger(error)

    return Promise.reject(error)
  }
)

// 声明一个 Map 用于存储每个请求的标识 和 取消函数
const pending = new Map()
/**
 * 添加请求
 * @param {Object} config
 */
const addPending = (config: AxiosRequestConfig) => {
  const url = [config.method, config.url, config.params, qs.stringify(config.data)].join('&')
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken((cancel: any) => {
      if (!pending.has(url)) {
        // 如果 pending 中不存在当前请求，则添加进去
        pending.set(url, cancel)
      }
    })
}

/**
 * 清空 pending 中的请求（在路由跳转时调用）
 */
export const clearPending = (): void => {
  for (const [url, cancel] of pending as any) {
    cancel(url)
  }
  pending.clear()
}

/**
 * 阿里云日志服务
 */
function aLiYunLogger(error: any, a?: any) {
  console.log('error:', error)
  // if (import.meta.env.VITE_BUILD_ENV !== 'prod') return
  // if (!url.includes('cn-shenzhen.log.aliyuncs.com/logstores')) {
  const { errorLog } = logger()
  const cfg = error.config
  if (cfg) {
    errorLog({
      traceId: cfg.headers?.traceId || '',
      requestData: cfg.data || '',
      params: cfg.params || '',
      url: cfg.url,
      message: error.message,
    })
  }
}

export { http, aLiYunLogger }

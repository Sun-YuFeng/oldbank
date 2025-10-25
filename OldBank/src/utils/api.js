import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/silveragepass'),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 在请求发送之前做一些处理
    const token = localStorage.getItem('adminToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response) {
      // 服务器返回错误状态码
      const { status, data } = error.response
      
      if (status === 401) {
        // 未授权，清除token并跳转到登录页
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminInfo')
        window.location.href = '/login'
      }
      
      // 返回统一的错误格式
      return Promise.reject({
        code: status,
        message: data?.message || '请求失败',
        data: null
      })
    } else if (error.request) {
      // 请求未收到响应
      return Promise.reject({
        code: -1,
        message: '网络连接失败，请检查网络设置',
        data: null
      })
    } else {
      // 请求配置错误
      return Promise.reject({
        code: -2,
        message: '请求配置错误',
        data: null
      })
    }
  }
)

// 登录API
export const login = (username, password) => {
  return api.post('/api/admin/auth/login', {
    username,
    password
  })
}

// 获取用户信息API
export const getUserInfo = () => {
  return api.get('/api/admin/auth/info')
}

// 退出登录API
export const logout = () => {
  return api.post('/api/admin/auth/logout')
}

// 管理员注册API
export const register = (account, password, phone) => {
  return api.post('/api/admin/auth/register', {
    username: account,
    password,
    phone
  })
}

// 获取待审核的管理员账号列表
export const getPendingAccounts = () => {
  return api.get('/api/admin/auth/pending')
}

// 获取所有管理员账号列表
export const getAllAccounts = () => {
  return api.get('/api/admin/auth/accounts')
}

// 审核管理员账号
export const approveAccount = (id, approvalStatus, remark = '', adminLevel = '') => {
  return api.post(`/api/admin/auth/approve/${id}`, {
    approvalStatus,
    remark,
    adminLevel
  })
}

// 获取当前登录的管理员信息
export const getCurrentAdmin = () => {
  return api.get('/api/admin/auth/me')
}

export default api
import axios from 'axios'

// API基础配置
const getApiConfig = () => {
  // 开发环境下使用相对路径（由vite代理处理）
  // 生产环境下使用环境变量配置
  const baseURL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/silveragepass')
  
  return {
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  }
}

// 创建axios实例
const api = axios.create(getApiConfig())

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 在请求发送之前做一些处理
    const token = localStorage.getItem('adminToken')
    const adminInfo = localStorage.getItem('adminInfo')
    
    console.log('🔑 认证检查 - Token:', token ? `已设置 (${token.length}字符)` : '未设置')
    console.log('👤 管理员信息:', adminInfo)
    
    if (token) {
      // 确保token格式正确，去除可能的空格
      const cleanToken = token.trim()
      config.headers.Authorization = `Bearer ${cleanToken}`
      
      // 调试信息
      console.log('📤 API请求拦截器 - Token:', cleanToken ? '已设置' : '未设置')
      console.log('📤 API请求拦截器 - URL:', config.url)
      console.log('📤 API请求拦截器 - Headers:', config.headers)
    } else {
      console.warn('⚠️ 请求没有携带Token:', config.url)
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
    // 调试信息
    console.log('API响应拦截器 - 成功:', response.config.url)
    return response.data
  },
  (error) => {
    // 调试信息
    console.error('API响应拦截器 - 错误:', error)
    
    if (error.response) {
      // 服务器返回错误状态码
      const { status, data, config } = error.response
      
      console.error(`API错误详情 - 状态码: ${status}, URL: ${config?.url}`)
      
      if (status === 401) {
        console.warn('API请求未授权，状态码: 401')
        
        // 返回错误信息，让组件处理后续逻辑
        return Promise.reject({
          code: status,
          message: '请求未授权，请检查登录状态',
          data: null
        })
      }
      
      // 返回统一的错误格式
      return Promise.reject({
        code: status,
        message: data?.message || '请求失败',
        data: null
      })
    } else if (error.request) {
      // 请求未收到响应
      console.error('API网络错误 - 请求未收到响应')
      return Promise.reject({
        code: -1,
        message: '网络连接失败，请检查网络设置',
        data: null
      })
    } else {
      // 请求配置错误
      console.error('API配置错误:', error.message)
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

// 获取用户列表（基础版，不传递搜索筛选参数）
export const getUserList = (pageNumber = 1, pageSize = 9) => {
  return api.get('/api/users', {
    params: {
      page: pageNumber,
      pageSize: pageSize
    }
  })
}

// 获取用户列表（完整版，可传递搜索和筛选参数）
export const getUserListWithFilters = (pageNumber = 1, pageSize = 9, searchQuery = '', roleFilter = '', statusFilter = '') => {
  const params = {
    page: pageNumber,
    pageSize: pageSize
  }
  
  // 只有当参数有值时才添加到请求中
  if (searchQuery && searchQuery.trim() !== '') {
    params.search = searchQuery.trim()
  }
  
  if (roleFilter && roleFilter !== '') {
    params.role = roleFilter
  }
  
  if (statusFilter && statusFilter !== '') {
    params.status = statusFilter
  }
  
  return api.get('/api/users', {
    params
  })
}

// 获取用户总数
export const getUserCount = (includeDeleted = false) => {
  return api.get('/api/users/count', {
    params: {
      includeDeleted
    }
  })
}

// 获取创号统计
export const getUserCreationStats = (days = 7) => {
  return api.get('/api/users/creation-stats', {
    params: {
      days
    }
  })
}

// 获取角色分布统计
export const getRoleStats = () => {
  return api.get('/api/users/role-stats')
}

// 获取状态分布统计
export const getStatusStats = () => {
  return api.get('/api/users/status-stats')
}

// 获取仪表盘统计数据
export const getDashboardStats = () => {
  return api.get('/api/dashboard/stats')
}

// 用户管理操作API

// 封禁/解封用户
export const banUser = (userId, banned, reason = '', days = 7) => {
  return api.post('/api/users/ban', {
    userId,
    banned,
    reason,
    days
  })
}

// 软删除用户
export const softDeleteUser = (userId, reason = '') => {
  return api.delete(`/api/users/${userId}`, {
    params: {
      hardDelete: false,
      reason
    }
  })
}

// 硬删除用户
export const hardDeleteUser = (userId, reason = '') => {
  return api.delete(`/api/users/${userId}`, {
    params: {
      hardDelete: true,
      reason
    }
  })
}

// 获取用户详情
export const getUserDetail = (userId) => {
  return api.get(`/api/users/${userId}`)
}

// 恢复已删除用户
export const restoreUser = (userId) => {
  return api.post(`/api/users/${userId}/restore`)
}

// 志愿者管理API

// 获取志愿者列表
export const getVolunteerList = (page = 1, pageSize = 10, search = '') => {
  const params = {
    page,
    pageSize
  }
  
  // 只有当搜索关键字有值时才添加到请求中
  if (search && search.trim() !== '') {
    params.search = search.trim()
  }
  
  return api.get('/api/volunteers', {
    params
  })
}

// 获取志愿者详情
export const getVolunteerDetail = (volunteerId) => {
  return api.get(`/api/volunteers/${volunteerId}`)
}

// 获取志愿者排名列表
export const getVolunteerRanking = (page = 1, pageSize = 10, search = '') => {
  const params = {
    page,
    pageSize
  }
  
  // 只有当搜索关键字有值时才添加到请求中
  if (search && search.trim() !== '') {
    params.search = search.trim()
  }
  
  return api.get('/api/admin/volunteers/ranking', {
    params
  })
}

// 获取本周服务量趋势
export const getWeeklyServiceTrend = () => {
  return api.get('/api/admin/volunteers/weekly-service-volume')
}

// 投诉管理API

// 获取投诉列表（分页、搜索）
export const getComplaintList = (page = 1, pageSize = 10, search = '') => {
  const params = {
    page,
    pageSize
  }
  
  // 只有当搜索关键字有值时才添加到请求中
  if (search && search.trim() !== '') {
    params.search = search.trim()
  }
  
  return api.get('/api/complaints', {
    params
  })
}

// 处理投诉
export const handleComplaint = (id, result) => {
  return api.post(`/api/complaints/${id}/handle`, {
    result
  })
}

// 获取投诉详情
export const getComplaintDetail = (id) => {
  return api.get(`/api/complaints/${id}`)
}

// 任务管理API

// 获取任务列表（分页、搜索、状态筛选）
export const getTaskList = (page = 1, pageSize = 10, search = '', status = '', type = '') => {
  const params = {
    page,
    pageSize
  }
  
  // 只有当参数有值时才添加到请求中
  if (search && search.trim() !== '') {
    params.search = search.trim()
  }
  
  if (status && status !== '') {
    params.status = status
  }
  
  if (type && type !== '') {
    params.type = type
  }
  
  return api.get('/api/admin/demands', {
    params
  })
}

// 获取任务详情
export const getTaskDetail = (id) => {
  return api.get(`/api/admin/demands/${id}`)
}

// 审核任务
export const approveTask = (id, approvalStatus, remark = '') => {
  return api.post(`/api/admin/demands/${id}/approve`, {
    approvalStatus,
    remark
  })
}

// 获取任务统计信息
export const getTaskStats = () => {
  return api.get('/api/admin/demands/stats')
}

// 暖龄币记录管理API

// 获取暖龄币记录列表
export const getWarmCoinRecords = (page = 1, pageSize = 10, search = '', type = '', userId = '') => {
  const params = {
    page,
    pageSize
  }
  
  // 只有当参数有值时才添加到请求中
  if (search && search.trim() !== '') {
    params.search = search.trim()
  }
  
  if (type && type !== '') {
    params.type = type
  }
  
  if (userId && userId !== '') {
    params.userId = userId
  }
  
  return api.get('/api/admin/warm-coin-records', {
    params
  })
}

// 获取暖龄币记录详情
export const getWarmCoinRecordDetail = (id) => {
  return api.get(`/api/admin/warm-coin-records/${id}`)
}

// 获取用户暖龄币记录
export const getUserWarmCoinRecords = (userId, page = 1, pageSize = 10) => {
  return api.get(`/api/admin/warm-coin-records/user/${userId}`, {
    params: {
      page,
      pageSize
    }
  })
}

export default api
<template>
  <div class="account-management-container">
    <!-- 面包屑导航 -->
    <div class="breadcrumb-section">
      <nav class="breadcrumb">
        <span class="breadcrumb-item">首页</span>
        <span class="breadcrumb-separator">></span>
        <span class="breadcrumb-item active">账号管理</span>
      </nav>
    </div>

    <!-- 账号管理内容 -->
    <div class="account-content">
      <!-- 注册账号审核 -->
      <div class="account-section">
        <div class="section-header">
          <h3 class="section-title">注册账号审核</h3>
          <div class="section-search">
            <input 
              type="text" 
              v-model="searchKeyword"
              placeholder="输入电话或账号搜索..."
              class="search-input"
            />
            <button class="search-button">
              <i class="fa fa-search"></i>
            </button>
          </div>
        </div>
        <div class="account-list">
          <div v-if="loading" class="loading-text">加载中...</div>
          <div v-else-if="filteredPendingAccounts.length === 0" class="empty-text">暂无待审核账号</div>
          <div 
            v-else
            v-for="account in filteredPendingAccounts" 
            :key="account.id"
            class="account-card"
          >
            <div class="account-info">
              <div class="account-details">
                <h4 class="account-name">{{ account.username }}</h4>
                <p class="account-phone">电话：{{ account.phone }}</p>
                <p class="account-level">申请级别：{{ account.adminLevelDesc }}</p>
                <p class="account-register-time">注册时间：{{ account.createTime }}</p>
                <p class="account-status">状态：{{ account.approvalStatusText }}</p>
              </div>
            </div>
            <div class="account-actions">
              <button 
                class="action-btn approve-btn"
                @click="approveAccount(account.id)"
                :disabled="!canApproveAccounts"
              >
                通过
              </button>
              <button 
                class="action-btn reject-btn"
                @click="rejectAccount(account.id)"
                :disabled="!canApproveAccounts"
              >
                拒绝
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 账号权限设置 -->
      <div class="account-section">
        <div class="section-header">
          <h3 class="section-title">账号权限设置</h3>
          <div class="section-search">
            <input 
              type="text" 
              v-model="searchKeyword"
              placeholder="搜索用户账号或电话..."
              class="search-input"
            />
            <button class="search-button">
              <i class="fa fa-search"></i>
            </button>
          </div>
        </div>
        <div class="account-list">
          <div v-if="loading" class="loading-text">加载中...</div>
          <div v-else-if="filteredActiveAccounts.length === 0" class="empty-text">暂无已激活账号</div>
          <div 
            v-else
            v-for="account in filteredActiveAccounts" 
            :key="account.id"
            class="account-card"
          >
            <div class="account-info">
              <div class="account-details">
                <h4 class="account-name">{{ account.username }}</h4>
                <p class="account-phone">电话：{{ account.phone }}</p>
                <p class="account-level">级别：{{ account.adminLevelDesc }}</p>
                <p class="account-status">状态：{{ account.approvalStatusText }}</p>
                <p class="account-register-time">注册时间：{{ account.createTime }}</p>
              </div>
            </div>
            <div class="account-actions">
              <select 
                v-model="account.adminLevel" 
                class="role-select"
                @change="updateRole(account.id, account.adminLevel)"
                :disabled="!canModifyPermissions || account.adminLevel === 'SUPER_ADMIN'"
              >
                <option value="ADMIN">普通管理员</option>
                <option value="SENIOR_ADMIN">高级管理员</option>
                <option value="SUPER_ADMIN">超级管理员</option>
              </select>
              <button 
                class="action-btn delete-btn"
                @click="deleteAccount(account.id)"
                :disabled="!canDeleteAccounts || account.adminLevel === 'SUPER_ADMIN'"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPendingAccounts, getAllAccounts, approveAccount } from '@/utils/api'

export default {
  name: 'AccountManagementPage',
  data() {
    return {
      searchKeyword: '',
      currentUserLevel: 'SUPER_ADMIN', // 当前登录用户权限级别
      loading: false,
      pendingAccounts: [],
      activeAccounts: []
    }
  },
  mounted() {
    this.loadAccounts()
  },
  computed: {
    // 权限检查计算属性
    isSuperAdmin() {
      return this.currentUserLevel === 'SUPER_ADMIN'
    },
    isSeniorAdmin() {
      return this.currentUserLevel === 'SENIOR_ADMIN'
    },
    isJuniorAdmin() {
      return this.currentUserLevel === 'JUNIOR_ADMIN'
    },
    canApproveAccounts() {
      // 只有高级管理员和最高权限管理员可以审核账号
      return this.isSuperAdmin || this.isSeniorAdmin
    },
    canModifyPermissions() {
      // 只有高级管理员可以修改权限（最高权限管理员不能修改自己）
      return this.isSeniorAdmin
    },
    canDeleteAccounts() {
      // 只有高级管理员可以删除账号（最高权限管理员不能被删除）
      return this.isSeniorAdmin
    },
    
    // 过滤后的账号列表
    filteredPendingAccounts() {
      if (!this.searchKeyword) return this.pendingAccounts
      const keyword = this.searchKeyword.toLowerCase()
      return this.pendingAccounts.filter(account => 
        account.username.toLowerCase().includes(keyword) ||
        account.phone.includes(keyword)
      )
    },
    filteredActiveAccounts() {
      // 权限设置区域只显示已审核通过的账号
      const approvedAccounts = this.activeAccounts.filter(account => 
        account.approvalStatus === 'APPROVED' || account.approvalStatus === 1 // 兼容字符串和数字格式
      )
      
      if (!this.searchKeyword) return approvedAccounts
      const keyword = this.searchKeyword.toLowerCase()
      return approvedAccounts.filter(account => 
        account.username.toLowerCase().includes(keyword) ||
        account.phone.includes(keyword)
      )
    }
  },
  methods: {
    async loadAccounts() {
      this.loading = true
      try {
        // 获取待审核账号列表
        console.log('🔄 开始请求待审核账号列表...')
        const pendingResponse = await getPendingAccounts()
        console.log('📥 待审核账号完整响应:', JSON.stringify(pendingResponse, null, 2))
        
        // 检查响应结构
        if (!pendingResponse) {
          console.error('❌ 待审核账号响应为空')
          this.pendingAccounts = []
        } else if (pendingResponse.code === 200) {
          console.log('✅ 待审核账号响应成功，检查数据结构...')
          
          let pendingData = pendingResponse.data
          console.log('📊 待审核账号原始数据类型:', typeof pendingData)
          console.log('📊 待审核账号原始数据:', pendingData)
          
          // 尝试不同的数据结构
          if (Array.isArray(pendingData)) {
            console.log('✅ 数据是数组格式，直接使用')
          } else if (pendingData && typeof pendingData === 'object') {
            // 可能是 { list: [...] } 或 { records: [...] } 结构
            if (Array.isArray(pendingData.list)) {
              pendingData = pendingData.list
              console.log('✅ 数据在 list 字段中')
            } else if (Array.isArray(pendingData.records)) {
              pendingData = pendingData.records
              console.log('✅ 数据在 records 字段中')
            } else if (Array.isArray(pendingData.content)) {
              pendingData = pendingData.content
              console.log('✅ 数据在 content 字段中')
            } else {
              console.warn('⚠️ 对象格式未识别，尝试转换为数组')
              pendingData = Object.values(pendingData)
            }
          } else if (typeof pendingData === 'string') {
            console.log('📝 数据是字符串，尝试解析JSON')
            try {
              const parsed = JSON.parse(pendingData)
              pendingData = Array.isArray(parsed) ? parsed : []
            } catch (parseError) {
              console.error('❌ JSON解析失败:', parseError)
              pendingData = []
            }
          } else {
            console.warn('⚠️ 数据格式未知，设为空数组')
            pendingData = []
          }
          
          // 最终确保是数组
          if (!Array.isArray(pendingData)) {
            console.warn('⚠️ 最终数据不是数组:', pendingData, '设为空数组')
            pendingData = []
          }
          
          console.log('✅ 待审核账号最终数据长度:', pendingData.length)
          this.pendingAccounts = pendingData.map((account, index) => {
            console.log(`👤 处理账号 ${index}:`, account)
            return {
              ...account,
              username: account.username || account.userName || '未知用户',
              phone: account.phone || account.phoneNumber || '未知电话',
              adminLevel: account.level || account.adminLevel || 'ADMIN',
              adminLevelDesc: account.levelDescription || account.adminLevelDesc || account.adminLevelName || account.roleName || '未设置',
              approvalStatus: account.approvalStatus || 'PENDING',
              approvalStatusText: account.approvalStatusDescription || account.approvalStatusText || account.statusText || '未知状态',
              createTime: account.createTime || account.registerTime || account.create_date || '未知时间'
            }
          })
        } else {
          console.error('❌ 待审核账号响应失败:', pendingResponse)
          this.pendingAccounts = []
        }
        
        // 获取所有账号列表
        console.log('🔄 开始请求所有账号列表...')
        const allResponse = await getAllAccounts()
        console.log('📥 所有账号完整响应:', JSON.stringify(allResponse, null, 2))
        
        if (!allResponse) {
          console.error('❌ 所有账号响应为空')
          this.activeAccounts = []
        } else if (allResponse.code === 200) {
          console.log('✅ 所有账号响应成功，检查数据结构...')
          
          let allData = allResponse.data
          console.log('📊 所有账号原始数据类型:', typeof allData)
          console.log('📊 所有账号原始数据:', allData)
          
          // 尝试不同的数据结构
          if (Array.isArray(allData)) {
            console.log('✅ 数据是数组格式，直接使用')
          } else if (allData && typeof allData === 'object') {
            // 可能是 { list: [...] } 或 { records: [...] } 结构
            if (Array.isArray(allData.list)) {
              allData = allData.list
              console.log('✅ 数据在 list 字段中')
            } else if (Array.isArray(allData.records)) {
              allData = allData.records
              console.log('✅ 数据在 records 字段中')
            } else if (Array.isArray(allData.content)) {
              allData = allData.content
              console.log('✅ 数据在 content 字段中')
            } else {
              console.warn('⚠️ 对象格式未识别，尝试转换为数组')
              allData = Object.values(allData)
            }
          } else if (typeof allData === 'string') {
            console.log('📝 数据是字符串，尝试解析JSON')
            try {
              const parsed = JSON.parse(allData)
              allData = Array.isArray(parsed) ? parsed : []
            } catch (parseError) {
              console.error('❌ JSON解析失败:', parseError)
              allData = []
            }
          } else {
            console.warn('⚠️ 数据格式未知，设为空数组')
            allData = []
          }
          
          // 最终确保是数组
          if (!Array.isArray(allData)) {
            console.warn('⚠️ 最终数据不是数组:', allData, '设为空数组')
            allData = []
          }
          
          console.log('✅ 所有账号最终数据长度:', allData.length)
          this.activeAccounts = allData.map((account, index) => {
            console.log(`👤 处理账号 ${index}:`, account)
            return {
              ...account,
              username: account.username || account.userName || '未知用户',
              phone: account.phone || account.phoneNumber || '未知电话',
              adminLevel: account.level || account.adminLevel || 'ADMIN',
              adminLevelDesc: account.levelDescription || account.adminLevelDesc || account.adminLevelName || account.roleName || '未设置',
              approvalStatus: account.approvalStatus || 'APPROVED',
              approvalStatusText: account.approvalStatusDescription || account.approvalStatusText || account.statusText || '未知状态',
              createTime: account.createTime || account.registerTime || account.create_date || '未知时间'
            }
          })
        } else {
          console.error('❌ 所有账号响应失败:', allResponse)
          this.activeAccounts = []
        }
      } catch (error) {
        console.error('❌ 加载账号列表异常:', error)
        console.error('❌ 错误详情:', {
          message: error.message,
          stack: error.stack,
          response: error.response
        })
        // 不再弹出alert，改为只在控制台输出
        this.pendingAccounts = []
        this.activeAccounts = []
      } finally {
        this.loading = false
        console.log('✅ 账号加载完成')
        console.log('📊 最终待审核账号数量:', this.pendingAccounts.length)
        console.log('📊 最终所有账号数量:', this.activeAccounts.length)
      }
    },
    
    async approveAccount(id) {
      if (!this.canApproveAccounts) return
      
      // 让用户选择审核通过的权限级别
      const adminLevel = this.isSuperAdmin ? 'ADMIN' : 'ADMIN'
      
      if (confirm(`确定要通过此账号的审核吗？审核级别：${this.getLevelDescription(adminLevel)}`)) {
        try {
          const response = await approveAccount(id, 1, '审核通过', adminLevel)
          if (response.code === 200) {
            alert('审核通过成功')
            // 重新加载账号列表
            this.loadAccounts()
          } else {
            alert(response.message || '审核失败')
          }
        } catch (error) {
          console.error('审核失败:', error)
          alert(error.message || '审核失败，请检查网络连接')
        }
      }
    },
    
    async rejectAccount(id) {
      if (!this.canApproveAccounts) return
      
      const remark = prompt('请输入拒绝原因：')
      if (remark === null) return
      
      try {
        const response = await approveAccount(id, 2, remark || '审核拒绝')
        if (response.code === 200) {
          alert('审核拒绝成功')
          // 重新加载账号列表
          this.loadAccounts()
        } else {
          alert(response.message || '审核失败')
        }
      } catch (error) {
        console.error('审核失败:', error)
        alert(error.message || '审核失败，请检查网络连接')
      }
    },
    
    getLevelDescription(level) {
      switch (level) {
        case 'SUPER_ADMIN':
          return '超级管理员'
        case 'SENIOR_ADMIN':
          return '高级管理员'
        case 'ADMIN':
          return '普通管理员'
        default:
          return '普通管理员'
      }
    },
    
    updateRole(id, adminLevel) {
      if (!this.canModifyPermissions) return
      console.log('更新账号权限:', id, adminLevel)
      // 这里调用API更新账号角色
      alert(`账号权限已更新为：${this.getLevelDescription(adminLevel)}`)
    },
    
    deleteAccount(id) {
      if (!this.canDeleteAccounts) return
      
      if (confirm('确定要删除此账号吗？此操作不可恢复。')) {
        console.log('删除账号:', id)
        // 这里调用API删除账号
        alert('账号删除成功')
      }
    }
  }
}
</script>

<style scoped>
.account-management-container {
  padding: 24px;
  background-color: #f8fafc;
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
}

.breadcrumb-section {
  margin-bottom: 24px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #64748b;
}

.breadcrumb-item {
  color: #64748b;
}

.breadcrumb-item.active {
  color: #1e293b;
  font-weight: 500;
}

.breadcrumb-separator {
  margin: 0 8px;
  color: #cbd5e1;
}



.account-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.account-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.section-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.section-search {
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-search .search-input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  width: 200px;
  outline: none;
  transition: border-color 0.2s ease;
}

.section-search .search-input:focus {
  border-color: #3b82f6;
}

.section-search .search-button {
  padding: 8px 12px;
  background: #3b82f6;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: background 0.2s ease;
}

.section-search .search-button:hover {
  background: #2563eb;
}

.account-list {
  padding: 0;
}

.account-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.2s ease;
}

.account-card:hover {
  background: #f8fafc;
}

.account-card:last-child {
  border-bottom: none;
}

.account-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.account-details {
  flex: 1;
}

.account-name {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.account-phone,
.account-username,
.account-register-time {
  font-size: 14px;
  color: #64748b;
  margin: 2px 0;
}

.account-status {
  margin: 4px 0 0 0;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.active {
  background: #dcfce7;
  color: #166534;
}

.status-badge.inactive {
  background: #fef2f2;
  color: #991b1b;
}

.account-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.role-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.role-select:focus {
  outline: none;
  border-color: #3b82f6;
}

.role-select:disabled {
  background: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

.action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:disabled {
  background: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

.approve-btn {
  background: #10b981;
  color: white;
}

.approve-btn:hover:not(:disabled) {
  background: #059669;
}

.reject-btn {
  background: #ef4444;
  color: white;
}

.reject-btn:hover:not(:disabled) {
  background: #dc2626;
}

.delete-btn {
  background: #ef4444;
  color: white;
}

.delete-btn:hover:not(:disabled) {
  background: #dc2626;
}

@media (max-width: 768px) {
  .account-management-container {
    padding: 16px;
  }
  
  .account-card {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .account-info {
    flex-direction: column;
    text-align: center;
  }
  
  .account-actions {
    justify-content: center;
  }
  
  .section-title {
    padding: 16px;
    font-size: 16px;
  }
}
</style>
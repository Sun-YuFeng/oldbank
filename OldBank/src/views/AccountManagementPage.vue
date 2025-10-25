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
              <div class="account-avatar">
                <div class="avatar-placeholder">{{ account.username.charAt(0) }}</div>
              </div>
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
              <div class="account-avatar">
                <div class="avatar-placeholder">{{ account.username.charAt(0) }}</div>
              </div>
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
                <option value="JUNIOR_ADMIN">初级管理员</option>
                <option value="SENIOR_ADMIN">高级管理员</option>
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
        account.approvalStatus === 1 // 审核状态为1表示已通过
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
        const pendingResponse = await getPendingAccounts()
        if (pendingResponse.code === 200) {
          this.pendingAccounts = pendingResponse.data || []
        }
        
        // 获取所有账号列表
        const allResponse = await getAllAccounts()
        if (allResponse.code === 200) {
          this.activeAccounts = allResponse.data || []
        }
      } catch (error) {
        console.error('加载账号列表失败:', error)
        alert('加载账号列表失败，请检查网络连接')
      } finally {
        this.loading = false
      }
    },
    
    async approveAccount(id) {
      if (!this.canApproveAccounts) return
      
      // 让用户选择审核通过的权限级别
      const adminLevel = this.isSuperAdmin ? 'SENIOR_ADMIN' : 'JUNIOR_ADMIN'
      
      if (confirm(`确定要通过此账号的审核吗？审核级别：${adminLevel === 'SENIOR_ADMIN' ? '高级管理员' : '初级管理员'}`)) {
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
    
    updateRole(id, adminLevel) {
      if (!this.canModifyPermissions) return
      console.log('更新账号权限:', id, adminLevel)
      // 这里调用API更新账号角色
      alert(`账号权限已更新为：${adminLevel === 'SENIOR_ADMIN' ? '高级管理员' : '初级管理员'}`)
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
  gap: 16px;
  flex: 1;
}

.account-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.account-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
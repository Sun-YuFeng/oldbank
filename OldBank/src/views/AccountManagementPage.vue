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
          <div 
            v-for="account in pendingAccounts" 
            :key="account.id"
            class="account-card"
          >
            <div class="account-info">
              <div class="account-avatar">
                <img :src="account.avatar" :alt="account.username" />
              </div>
              <div class="account-details">
                <h4 class="account-name">{{ account.username }}</h4>
                <p class="account-phone">电话：{{ account.phone }}</p>
                <p class="account-username">账号：{{ account.username }}</p>
                <p class="account-register-time">注册时间：{{ account.registerTime }}</p>
              </div>
            </div>
            <div class="account-actions">
              <button 
                class="action-btn approve-btn"
                @click="approveAccount(account.id)"
                :disabled="!isAdmin"
              >
                通过
              </button>
              <button 
                class="action-btn reject-btn"
                @click="rejectAccount(account.id)"
                :disabled="!isAdmin"
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
          <div 
            v-for="account in activeAccounts" 
            :key="account.id"
            class="account-card"
          >
            <div class="account-info">
              <div class="account-avatar">
                <img :src="account.avatar" :alt="account.username" />
              </div>
              <div class="account-details">
                <h4 class="account-name">{{ account.username }}</h4>
                <p class="account-phone">电话：{{ account.phone }}</p>
                <p class="account-email">邮箱：{{ account.email }}</p>
                <p class="account-status">
                  <span class="status-badge" :class="account.status">{{ account.statusText }}</span>
                </p>
              </div>
            </div>
            <div class="account-actions">
              <select 
                v-model="account.role" 
                class="role-select"
                @change="updateRole(account.id, account.role)"
                :disabled="!isAdmin"
              >
                <option value="member">成员</option>
                <option value="admin">管理者</option>
              </select>
              <button 
                class="action-btn delete-btn"
                @click="deleteAccount(account.id)"
                :disabled="!isAdmin"
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
export default {
  name: 'AccountManagementPage',
  data() {
    return {
      searchKeyword: '',
      isAdmin: true, // 开发过程默认是管理者模式
      pendingAccounts: [
        {
          id: 1,
          username: '张大爷',
          phone: '13800138001',
          email: 'zhang@example.com',
          registerTime: '2025-08-20 14:30',
          avatar: '/src/assets/background.png'
        },
        {
          id: 2,
          username: '李阿姨',
          phone: '13800138002',
          email: 'li@example.com',
          registerTime: '2025-08-19 09:15',
          avatar: '/src/assets/background.png'
        },
        {
          id: 3,
          username: '王叔叔',
          phone: '13800138003',
          email: 'wang@example.com',
          registerTime: '2025-08-18 16:45',
          avatar: '/src/assets/background.png'
        }
      ],
      activeAccounts: [
        {
          id: 101,
          username: '管理员',
          phone: '13800138101',
          email: 'admin@example.com',
          role: 'admin',
          status: 'active',
          statusText: '已激活',
          avatar: '/src/assets/background.png'
        },
        {
          id: 102,
          username: '志愿者1',
          phone: '13800138102',
          email: 'volunteer1@example.com',
          role: 'member',
          status: 'active',
          statusText: '已激活',
          avatar: '/src/assets/background.png'
        },
        {
          id: 103,
          username: '志愿者2',
          phone: '13800138103',
          email: 'volunteer2@example.com',
          role: 'member',
          status: 'active',
          statusText: '已激活',
          avatar: '/src/assets/background.png'
        },
        {
          id: 104,
          username: '志愿者3',
          phone: '13800138104',
          email: 'volunteer3@example.com',
          role: 'member',
          status: 'inactive',
          statusText: '未激活',
          avatar: '/src/assets/background.png'
        }
      ]
    }
  },
  computed: {
    filteredPendingAccounts() {
      if (!this.searchKeyword) return this.pendingAccounts
      const keyword = this.searchKeyword.toLowerCase()
      return this.pendingAccounts.filter(account => 
        account.username.toLowerCase().includes(keyword) ||
        account.phone.includes(keyword) ||
        account.email.toLowerCase().includes(keyword)
      )
    },
    filteredActiveAccounts() {
      if (!this.searchKeyword) return this.activeAccounts
      const keyword = this.searchKeyword.toLowerCase()
      return this.activeAccounts.filter(account => 
        account.username.toLowerCase().includes(keyword) ||
        account.phone.includes(keyword) ||
        account.email.toLowerCase().includes(keyword)
      )
    }
  },
  methods: {
    approveAccount(id) {
      if (!this.isAdmin) return
      console.log('通过账号:', id)
      // 这里调用API审核通过账号
    },
    rejectAccount(id) {
      if (!this.isAdmin) return
      console.log('拒绝账号:', id)
      // 这里调用API拒绝账号
    },
    updateRole(id, role) {
      if (!this.isAdmin) return
      console.log('更新账号权限:', id, role)
      // 这里调用API更新账号角色
    },
    deleteAccount(id) {
      if (!this.isAdmin) return
      console.log('删除账号:', id)
      // 这里调用API删除账号
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
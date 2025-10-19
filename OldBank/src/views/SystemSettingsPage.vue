<template>
  <div class="system-settings-page">
    <div class="breadcrumb">
      <span class="breadcrumb-item">首页</span>
      <span class="breadcrumb-separator">></span>
      <span class="breadcrumb-item active">系统设置</span>
    </div>
    
    <h1>账号信息</h1>
    
    <!-- 账号信息内容 -->
    <div class="account-info-content">
      <div class="info-item">
        <label class="info-label">账号：</label>
        <span class="info-value">{{ accountInfo.username }}</span>
      </div>
      <div class="info-item">
        <label class="info-label">电话：</label>
        <span class="info-value">{{ accountInfo.phone }}</span>
      </div>
      <div class="info-item">
        <label class="info-label">密码：</label>
        <span class="info-value">********</span>
        <button class="change-password-btn">修改密码</button>
      </div>
      <div class="info-item">
        <label class="info-label">用户身份：</label>
        <span class="info-value">
          <span class="role-badge" :class="accountInfo.role">{{ accountInfo.roleText }}</span>
        </span>
      </div>
    </div>
    
    <div class="logout-section">
      <button class="logout-btn" @click="handleLogout">退出登录</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SystemSettingsPage',
  data() {
    return {
      accountInfo: {
        username: 'admin',
        phone: '13800138000',
        role: 'admin', // admin: 管理者, member: 普通成员
        roleText: '管理者'
      }
    }
  },
  methods: {
    handleLogout() {
      if (confirm('确定要退出登录吗？')) {
        console.log('执行退出登录逻辑')
        // 这里调用退出登录API
        this.$router.push('/login')
      }
    }
  }
}
</script>

<style scoped>
.system-settings-page {
  padding: 24px;
  width: 100%;
  box-sizing: border-box;
  background-color: #f8fafc;
  min-height: 100vh;
}

.breadcrumb {
  margin-bottom: 24px;
  font-size: 14px;
  color: #6b7280;
  display: flex;
  align-items: center;
}

.breadcrumb-item {
  color: #6b7280;
}

.breadcrumb-item.active {
  color: #1f2937;
  font-weight: 500;
}

.breadcrumb-separator {
  margin: 0 8px;
  color: #9ca3af;
}

h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 24px;
}

.account-info-content {
  background: white;
  padding: 24px;
  border-radius: 8px;
  max-width: 600px;
  margin-bottom: 24px;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
}

.info-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.info-label {
  width: 100px;
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.info-value {
  flex: 1;
  color: #6b7280;
  font-size: 14px;
}

.role-badge {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

.role-badge.admin {
  background: #dbeafe;
  color: #1e40af;
}

.role-badge.member {
  background: #f0f9ff;
  color: #0369a1;
}

.change-password-btn {
  margin-left: 12px;
  padding: 6px 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.change-password-btn:hover {
  background: #2563eb;
}

.logout-section {
  padding: 20px 24px;
  background: #fef2f2;
  border-top: 1px solid #fee2e2;
  text-align: right;
}

.logout-btn {
  padding: 10px 20px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.logout-btn:hover {
  background: #dc2626;
}

@media (max-width: 768px) {
  .system-settings-page {
    padding: 16px;
  }
  
  .account-info-card {
    margin: 0 auto;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .info-label {
    width: auto;
  }
  
  .logout-section {
    text-align: center;
  }
}
</style>
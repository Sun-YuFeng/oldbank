<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h1 class="header-title">管理后台</h1>
    </div>
    <nav class="nav-container">
      <ul class="nav-list">
        <li>
          <router-link to="/" class="nav-item" active-class="active">
            <span>仪表盘</span>
          </router-link>
        </li>
        <li>
          <router-link to="/user-management" class="nav-item" active-class="active">
            <span>用户管理</span>
          </router-link>
        </li>
        <li>
          <router-link to="/task-approval" class="nav-item" active-class="active">
            <span>任务审核</span>
          </router-link>
        </li>
        <li>
           <router-link to="/points-management" class="nav-item" active-class="active">
            <span>积分管理</span>
          </router-link>
        </li>
        <li>
          <router-link to="/complaint-management" class="nav-item" active-class="active">
            <span>投诉处理</span>
          </router-link>
        </li>
        <li>
          <router-link to="/account-management" class="nav-item" active-class="active">
            <span>账号管理</span>
          </router-link>
        </li>
        <li>
          <router-link to="/system-settings" class="nav-item" active-class="active">
            <span>系统设置</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'SidebarView'
}
</script>

<style scoped>
.sidebar {
  background-color: #334155; /* 深蓝灰色背景 */
  color: #f8fafc;
  height: 100vh;
  width: 240px;
  position: fixed;
  left: 0;
  top: 0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  z-index: 30;
}

.sidebar-header {
  padding: 1.5rem 1.25rem;
  border-bottom: 1px solid #475569;
}

.header-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #f8fafc;
  margin: 0;
}

.nav-container {
  padding-top: 0.5rem;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.875rem 1.25rem;
  color: #cbd5e1;
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  font-weight: 400;
}

.nav-item:hover {
  background-color: #475569;
  color: #f1f5f9;
}

.nav-item.active {
  background-color: #3b82f6;
  color: #ffffff;
  font-weight: 500;
}

/* 移除所有图标相关样式 */

.nav-item:focus {
  outline: none;
}
</style>

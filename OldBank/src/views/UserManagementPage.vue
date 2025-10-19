<template>
  <div class="user-management-container">
    <!-- 第一区域：面包屑导航 -->
    <div class="breadcrumb-section">
      <nav class="breadcrumb">
        <span class="breadcrumb-item">首页</span>
        <span class="breadcrumb-separator">></span>
        <span class="breadcrumb-item active">用户管理</span>
      </nav>
    </div>

    <!-- 第二区域：搜索过滤器 -->
    <UserFilterSection />

    <!-- 第三区域：统计图表 -->
    <UserStatsSection />

    <!-- 第四区域：用户列表 -->
    <UserListSection />
  </div>
</template>

<script>
import UserFilterSection from '../components/UserFilterSection.vue'
import UserStatsSection from '../components/UserStatsSection.vue'
import UserListSection from '../components/UserListSection.vue'

export default {
  name: 'UserManagementPage',
  components: {
    UserFilterSection,
    UserStatsSection,
    UserListSection
  }
}
</script>

<style scoped>
.user-management-container {
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
</style>

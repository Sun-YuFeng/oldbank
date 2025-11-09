<template>
  <div class="points-management-container">
    <div class="page-header">
      <div class="breadcrumb">
        <span class="breadcrumb-item">首页</span>
        <span class="breadcrumb-separator">></span>
        <span class="breadcrumb-item current">积分管理</span>
      </div>
    </div>
    
    <div class="content-wrapper">
      <DashboardAnalytics />
      <PointAdjust />
      <PointRuleSetting />
      <PointRecord />
    </div>
  </div>
</template>

<script setup>
import DashboardAnalytics from '../components/DashboardAnalytics.vue'
import PointAdjust from '../components/PointAdjust.vue'
import PointRuleSetting from '../components/PointRuleSetting.vue'
import PointRecord from '../components/PointRecord.vue'

</script>

<style scoped>
.points-management-container {
  padding: 24px;
  min-height: 100vh;
  background: #f8fafc;
  width: 100%;
}

.page-header {
  padding: 16px 24px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.breadcrumb-item {
  color: #64748b;
}

.breadcrumb-item.current {
  color: #1e293b;
  font-weight: 500;
}

.breadcrumb-separator {
  color: #cbd5e1;
}

.content-wrapper {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  /* 确保内容区占满可用宽度 */
  width: 100%;
  box-sizing: border-box;
}
</style>
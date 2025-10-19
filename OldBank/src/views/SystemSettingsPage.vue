<template>
  <div class="system-settings-page">
    <div class="breadcrumb">
      <span class="breadcrumb-item">首页</span>
      <span class="breadcrumb-separator">></span>
      <span class="breadcrumb-item active">系统设置</span>
    </div>
    
    <h1>系统设置</h1>
    <!-- 后续开发内容将在此处添加 -->
  </div>
</template>

<script setup>
// 系统设置页面逻辑（待开发）
</script>

<style scoped>
.system-settings-page {
  padding: 24px;
  width: 100%;
  box-sizing: border-box;
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
</style>
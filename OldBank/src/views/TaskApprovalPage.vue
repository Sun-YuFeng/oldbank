<template>
  <div class="task-approval-page">
    <!-- 面包屑导航 -->
    <div class="breadcrumb">
      <span class="breadcrumb-item">首页</span>
      <span class="breadcrumb-separator">></span>
      <span class="breadcrumb-item active">任务审核</span>
    </div>

    <!-- 任务统计卡片组 -->
    <TaskStatsCardGroup />

    <!-- 任务状态分布图表 -->
    <TaskStatusChart />

    <!-- 任务列表 -->
    <TaskTableSection />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TaskStatsCardGroup from '../components/TaskStatsCardGroup.vue'
import TaskStatusChart from '../components/TaskStatusChart.vue'
import TaskTableSection from '../components/TaskTableSection.vue'

const searchQuery = ref('')
const statusFilter = ref('')

const handleSearch = (query) => {
  searchQuery.value = query
  console.log('搜索:', query)
}

const handleFilter = (status) => {
  statusFilter.value = status
  console.log('筛选状态:', status)
}
</script>

<style scoped>
.task-approval-page {
  padding: 24px;
  width: 100%;
  box-sizing: border-box;
}

.breadcrumb {
  margin-bottom: 24px;
  font-size: 14px;
  color: #6b7280;
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
</style>

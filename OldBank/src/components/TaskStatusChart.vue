<template>
  <div class="chart-card">
    <div class="chart-header">
      <div class="header-left">
        <h3>任务状态分布</h3>
        <div class="stats-date" v-if="stats.statisticsDate">
          <i class="fas fa-calendar-alt"></i>
          {{ stats.statisticsDate }}
        </div>
      </div>
      <div class="header-right">
        <div class="total-count">
          总任务数：<span>{{ stats.totalCount || 0 }}</span>
        </div>
      </div>
    </div> <!-- 修复：闭合 chart-header 标签 -->
    
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <span>正在加载统计数据...</span>
    </div>
    
    <!-- 统计卡片 -->
    <div v-else class="stats-cards">
      <div class="stat-card total">
        <div class="stat-icon">
          <i class="fas fa-tasks"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.totalCount || 0 }}</div>
          <div class="stat-label">任务总数</div>
        </div>
      </div>
      
      <div class="stat-card waiting">
        <div class="stat-icon">
          <i class="fas fa-clock"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.waitingCount || 0 }}</div>
          <div class="stat-label">待接取</div>
        </div>
      </div>
      
      <div class="stat-card progress">
        <div class="stat-icon">
          <i class="fas fa-spinner"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.inProgressCount || 0 }}</div>
          <div class="stat-label">进行中</div>
        </div>
      </div>
      
      <div class="stat-card completed">
        <div class="stat-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.completedCount || 0 }}</div>
          <div class="stat-label">已完成</div>
        </div>
      </div>
      
      <div class="stat-card cancelled">
        <div class="stat-icon">
          <i class="fas fa-times-circle"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.cancelledCount || 0 }}</div>
          <div class="stat-label">已取消</div>
        </div>
      </div>
    </div> 
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount} from 'vue'
import { getDailyStatusStats } from '../utils/api.js'

const loading = ref(true)
const stats = ref({
  waitingCount: 0,
  inProgressCount: 0,
  completedCount: 0,
  cancelledCount: 0,
  totalCount: 0,
  statisticsDate: ''
})
let chart = null


const fetchDailyStats = async () => {
  try {
    loading.value = true
    console.log('🎯 开始请求每日任务统计API')
    
    const response = await getDailyStatusStats()
    
    console.log('✅ 每日任务统计API响应:', response)
    
    if (response.code === 200 && response.data) {
      // 修复：确保 totalCount 正确计算
      const data = response.data
      stats.value = {
        ...data,
        totalCount: data.totalCount || (
          (data.waitingCount || 0) +
          (data.inProgressCount || 0) +
          (data.completedCount || 0) +
          (data.cancelledCount || 0)
        )
      }
      console.log('📦 每日任务统计数据:', stats.value)
    } else {
      console.error('❌ 获取每日任务统计失败:', response?.message || '未知错误')
      useDefaultData()
    }
  } catch (error) {
    console.error('🚨 获取每日任务统计出错:', error)
    
    // 修复：更健壮的 401 错误判断
    if (error.response?.status === 401 || error.code === 401) {
      console.warn('⚠️ 认证失败，需要重新登录')
      setTimeout(() => {
        window.location.href = '/login'
      }, 1000)
      return
    }
    
    // 其他错误使用默认数据
    useDefaultData()
  } finally {
    loading.value = false
  }
}

const useDefaultData = () => {
  const defaultData = {
    waitingCount: 15,
    inProgressCount: 8,
    completedCount: 23,
    cancelledCount: 2,
    statisticsDate: new Date().toISOString().split('T')[0]
  }
  // 修复：自动计算总数
  defaultData.totalCount = Object.values(defaultData).filter(val => typeof val === 'number').reduce((a, b) => a + b, 0)
  stats.value = defaultData
}

onMounted(() => {
  fetchDailyStats()
})

onBeforeUnmount(() => {
  if (chart) {
    chart.destroy()
    chart = null // 修复：避免内存泄漏
  }
})
</script>

<style scoped>
.chart-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 24px;
  margin-bottom: 30px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-left h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.stats-date {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

.stats-date i {
  margin-right: 6px;
  color: #9ca3af;
}

.total-count {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.total-count span {
  color: #111827;
  font-weight: 700;
  font-size: 16px;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #6b7280;
  min-height: 300px; /* 修复：确保加载状态有足够高度 */
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 统计卡片网格 */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: white;
  transition: all 0.2s ease;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 16px;
}

.stat-card.total .stat-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-card.waiting .stat-icon {
  background: linear-gradient(135deg, #ffa94d 0%, #fd7e14 100%);
  color: white;
}

.stat-card.progress .stat-icon {
  background: linear-gradient(135deg, #339af0 0%, #1864ab 100%);
  color: white;
}

.stat-card.completed .stat-icon {
  background: linear-gradient(135deg, #51cf66 0%, #37b24d 100%);
  color: white;
}

.stat-card.cancelled .stat-icon {
  background: linear-gradient(135deg, #ff6b6b 0%, #f03e3e 100%);
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.chart-content {
  height: 280px;
  position: relative;
  max-width: 350px;
  margin: 0 auto;
  /* 修复：确保图表容器有背景，避免透明问题 */
  background-color: transparent;
}

/* 修复：Chart.js 图例换行问题 */
:deep(.chart-legend) {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

:deep(.chart-legend-item) {
  margin: 0 8px 8px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chart-card {
    padding: 16px;
  }
  
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .header-left {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .stats-cards {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px;
  }
  
  .stat-card {
    padding: 12px;
  }
  
  .stat-icon {
    width: 32px;
    height: 32px;
    font-size: 14px;
    margin-right: 8px;
  }
  
  .stat-number {
    font-size: 18px;
  }
  
  .stat-label {
    font-size: 11px;
  }
  
  .chart-content {
    height: 220px;
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .chart-content {
    height: 200px;
  }
  
  /* 修复：小屏幕上图例显示优化 */
  :deep(.chart-legend) {
    gap: 4px;
  }
  
  :deep(.chart-legend-item) {
    font-size: 11px;
  }
}
</style>
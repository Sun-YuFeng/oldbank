<!-- 任务统计卡片 -->
 <template>
  <div class="stats-container">
    <div class="stats-card">
      <div class="card-title">今日总任务数</div>
      <div class="card-value">{{ totalTasks }}</div>
    </div>
    <div class="stats-card">
      <div class="card-title">进行中</div>
      <div class="card-value pending">{{ underWay }}</div>
    </div>
    <div class="stats-card">
      <div class="card-title">已完成</div>
      <div class="card-value">{{ finish }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getTodayTaskCount, getTodayInProgressCount, getTodayCompletedCount } from '@/utils/api'

const totalTasks = ref(0)
const underWay = ref(0)
const finish = ref(0)

const loadTodayStats = async () => {
  try {
    // 并行请求三个接口提高效率
    const [totalResponse, inProgressResponse, completedResponse] = await Promise.all([
      getTodayTaskCount(),
      getTodayInProgressCount(),
      getTodayCompletedCount()
    ])
    
    totalTasks.value = totalResponse.data || 0
    underWay.value = inProgressResponse.data || 0
    finish.value = completedResponse.data || 0
    
    console.log('今日任务统计数据:', {
      total: totalTasks.value,
      inProgress: underWay.value,
      completed: finish.value
    })
  } catch (error) {
    console.error('获取今日任务统计失败:', error)
    // 保持默认值0，不显示错误给用户
  }
}

onMounted(() => {
  loadTodayStats()
})
</script>

<style scoped>
.stats-container {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  border: 1px solid transparent;
  padding: 0;
}

.stats-card {
  flex: 1;
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.card-title {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.card-value {
  font-size: 32px;
  font-weight: 600;
  color: #1f2937;
}

.card-value.pending {
  color: #f59e0b;
}
</style>

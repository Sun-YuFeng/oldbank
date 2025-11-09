<template>
  <div class="analytics-container">
    <div class="charts-wrapper">
      <div class="chart-box">
        <h3>服务量统计</h3>
        <div class="chart-content">
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>正在加载数据...</p>
          </div>
          <div v-else-if="error" class="error-state">
            <svg class="error-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
            <p>{{ error }}</p>
            <button @click="fetchServiceData" class="retry-btn">重试</button>
          </div>
          <canvas v-else ref="demandChart"></canvas>
        </div>
      </div>
      <div class="chart-box">
        <h3>积分变动原因</h3>
        <div class="chart-content">
          <canvas ref="pieChart"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue'
import Chart from 'chart.js/auto'
import { getWeeklyServiceTrend } from '../utils/api.js'

const demandChart = ref(null)
const pieChart = ref(null)
const demandChartInstance = ref(null)
const pieChartInstance = ref(null)
const loading = ref(true)
const error = ref('')
const serviceData = ref([])

const fetchServiceData = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const response = await getWeeklyServiceTrend()
    
    if (response.code === 200) {
      const data = response.data || []
      
      // 只取最近四天的数据
      const recentFourDays = data.slice(-4)
      
      if (recentFourDays.length === 0) {
        error.value = '暂无服务量数据'
        return
      }

      serviceData.value = recentFourDays
    } else {
      error.value = '获取数据失败: ' + (response.message || '未知错误')
      return
    }
  } catch (err) {
    console.error('获取服务量数据失败:', err)
    error.value = '网络连接失败，请稍后重试'
    return
  } finally {
    loading.value = false
  }
  
  // 数据加载完成且没有错误时，等待 DOM 更新后创建图表
  if (!error.value && serviceData.value.length > 0) {
    await nextTick()
    // 额外延迟确保 canvas 元素已渲染到 DOM
    setTimeout(() => {
      createServiceChart(serviceData.value)
    }, 150)
  }
}

const createServiceChart = (data, retryCount = 0) => {
  console.log('开始创建图表...', retryCount > 0 ? `(重试 ${retryCount})` : '')
  
  // 检查 canvas 元素是否存在
  if (!demandChart.value) {
    // 如果重试次数少于3次，延迟重试
    if (retryCount < 3) {
      console.warn(`Canvas 元素未找到，${100 * (retryCount + 1)}ms 后重试...`)
      setTimeout(() => {
        createServiceChart(data, retryCount + 1)
      }, 100 * (retryCount + 1))
      return
    } else {
      console.error('多次重试后仍找不到 Canvas 元素')
      error.value = '图表容器未找到'
      return
    }
  }

  if (!pieChart.value) {
    console.error('饼图 Canvas 元素未找到')
    // 饼图不是必需的，可以继续创建柱状图
  }

  // 如果已有图表实例，先销毁
  if (demandChartInstance.value) {
    demandChartInstance.value.destroy()
    demandChartInstance.value = null
  }

  if (pieChartInstance.value) {
    pieChartInstance.value.destroy()
    pieChartInstance.value = null
  }

  // 提取日期和服务量数据
  const labels = data.map(item => `${item.dayOfWeek}(${item.date})`)
  const serviceCounts = data.map(item => Number(item.serviceCount) || 0)

  // 创建服务量统计柱状图
  demandChartInstance.value = new Chart(demandChart.value.getContext('2d'), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: '服务量',
        data: serviceCounts,
        backgroundColor: 'rgba(52, 152, 219, 0.7)',
        borderColor: 'rgba(52, 152, 219, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: '服务量'
          }
        },
        x: {
          title: {
            display: true,
            text: '日期'
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        title: {
          display: true,
          text: '最近四天服务量统计'
        }
      }
    }
  })

  // 积分变动原因饼图（如果 canvas 存在）
  if (pieChart.value) {
    pieChartInstance.value = new Chart(pieChart.value.getContext('2d'), {
    type: 'pie',
    data: {
      labels: ['完成任务', '邀请奖励', '注册奖励', '管理员调整', '违规扣分'],
      datasets: [{
        data: [47, 23, 15, 11, 4],
        backgroundColor: [
          'rgba(52, 152, 219, 0.7)',
          'rgba(155, 89, 182, 0.7)',
          'rgba(243, 156, 18, 0.7)',
          'rgba(39, 174, 96, 0.7)',
          'rgba(231, 76, 60, 0.7)'
        ],
        borderColor: [
          'rgba(52, 152, 219, 1)',
          'rgba(155, 89, 182, 1)',
          'rgba(243, 156, 18, 1)',
          'rgba(39, 174, 96, 1)',
          'rgba(231, 76, 60, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right'
        }
      }
    }
    })
  }
  
  console.log('图表创建成功!')
}

onMounted(() => {
  fetchServiceData()
})

// 组件卸载时销毁图表实例
onBeforeUnmount(() => {
  if (demandChartInstance.value) {
    demandChartInstance.value.destroy()
    demandChartInstance.value = null
  }
  if (pieChartInstance.value) {
    pieChartInstance.value.destroy()
    pieChartInstance.value = null
  }
})
</script>

<style scoped>
.analytics-container {
  margin-bottom: 30px;
  box-sizing: border-box;
}

.charts-wrapper {
  display: flex;
  gap: 20px;
  box-sizing: border-box;
}

.chart-box {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.chart-box h3 {
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.chart-content {
  height: 300px;
  position: relative;
  box-sizing: border-box;
}

/* 加载状态样式 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6b7280;
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

/* 错误状态样式 */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6b7280;
  text-align: center;
}

.error-icon {
  width: 48px;
  height: 48px;
  color: #ef4444;
  margin-bottom: 16px;
}

.retry-btn {
  margin-top: 16px;
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-btn:hover {
  background: #2563eb;
}
</style>

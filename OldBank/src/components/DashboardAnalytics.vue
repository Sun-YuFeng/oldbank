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
          <div v-if="warmCoinLoading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>正在加载积分数据...</p>
          </div>
          <div v-else-if="warmCoinError" class="error-state">
            <svg class="error-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
            <p>{{ warmCoinError }}</p>
            <button @click="fetchWarmCoinStats" class="retry-btn">重试</button>
          </div>
          <canvas v-else ref="pieChart"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue'
import Chart from 'chart.js/auto'
import { getWeeklyServiceTrend, getWeeklyWarmCoinStatsByType } from '../utils/api.js'

const demandChart = ref(null)
const pieChart = ref(null)
const demandChartInstance = ref(null)
const pieChartInstance = ref(null)
const loading = ref(true)
const error = ref('')
const serviceData = ref([])
const warmCoinStats = ref([])
const warmCoinLoading = ref(true)
const warmCoinError = ref('')

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
    // 增加延迟时间确保 DOM 完全渲染
    setTimeout(() => {
      createServiceChart(serviceData.value)
    }, 300)
  }
}

const fetchWarmCoinStats = async () => {
  try {
    warmCoinLoading.value = true
    warmCoinError.value = ''
    
    const response = await getWeeklyWarmCoinStatsByType()
    
    if (response.code === 200) {
      const data = response.data || []
      
      if (data.length === 0) {
        warmCoinError.value = '暂无积分变动数据'
        return
      }

      warmCoinStats.value = data
      console.log('积分变动统计数据:', data)
    } else {
      warmCoinError.value = '获取积分数据失败: ' + (response.message || '未知错误')
      return
    }
  } catch (err) {
    console.error('获取积分变动统计失败:', err)
    warmCoinError.value = '网络连接失败，请稍后重试'
    return
  } finally {
    warmCoinLoading.value = false
  }
  
  // 积分数据加载完成且没有错误时，创建饼图
  if (!warmCoinError.value && warmCoinStats.value.length > 0) {
    await nextTick()
    // 增加延迟时间确保 DOM 完全渲染
    setTimeout(() => {
      createWarmCoinChart(warmCoinStats.value)
    }, 300)
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

  // 积分变动原因饼图将在 fetchWarmCoinStats 函数中创建
  
  console.log('服务量图表创建成功!')
}

const createWarmCoinChart = (data, retryCount = 0) => {
  console.log('开始创建积分变动图表...', retryCount > 0 ? `(重试 ${retryCount})` : '')
  console.log('图表数据:', data)
  
  // 检查 canvas 元素是否存在
  if (!pieChart.value) {
    // 如果重试次数少于5次，延迟重试（增加重试次数）
    if (retryCount < 5) {
      console.warn(`饼图 Canvas 元素未找到，${200 * (retryCount + 1)}ms 后重试...`)
      setTimeout(() => {
        createWarmCoinChart(data, retryCount + 1)
      }, 200 * (retryCount + 1))
      return
    } else {
      console.error('多次重试后仍找不到饼图 Canvas 元素')
      warmCoinError.value = '图表容器未找到'
      return
    }
  }

  // 数据验证：确保数据是数组且包含5个元素
  if (!Array.isArray(data) || data.length !== 5) {
    console.error('积分变动数据格式不正确，期望5个元素的数组，实际:', data)
    warmCoinError.value = '数据格式错误'
    return
  }

  // 数据验证：确保所有元素都是数字
  if (!data.every(item => typeof item === 'number' && !isNaN(item))) {
    console.error('积分变动数据包含非数字元素:', data)
    warmCoinError.value = '数据包含无效值'
    return
  }

  // 如果已有图表实例，先销毁
  if (pieChartInstance.value) {
    try {
      pieChartInstance.value.destroy()
    } catch (error) {
      console.warn('销毁图表实例时出错:', error)
    }
    pieChartInstance.value = null
  }

  // 积分变动类型标签
  const labels = ['服务获取', '发布需求支出', '捐赠公益池', '管理员调整', '违规扣除']
  
  try {
    // 创建积分变动原因饼图
    pieChartInstance.value = new Chart(pieChart.value.getContext('2d'), {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [
            'rgba(52, 152, 219, 0.7)',  // 服务获取 - 蓝色
            'rgba(155, 89, 182, 0.7)',  // 发布需求支出 - 紫色
            'rgba(243, 156, 18, 0.7)',  // 捐赠公益池 - 橙色
            'rgba(39, 174, 96, 0.7)',   // 管理员调整 - 绿色
            'rgba(231, 76, 60, 0.7)'    // 违规扣除 - 红色
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
        animation: {
          duration: 800,  // 减少动画时间避免卡顿
          easing: 'easeInOutQuart'
        },
        plugins: {
          legend: {
            position: 'right'
          },
          title: {
            display: true,
            text: '本周积分变动统计'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || ''
                const value = context.parsed || 0
                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0'
                return `${label}: ${value}次 (${percentage}%)`
              }
            }
          }
        }
      }
    })
    
    console.log('积分变动图表创建成功!')
  } catch (error) {
    console.error('创建饼图时出错:', error)
    warmCoinError.value = '图表创建失败: ' + error.message
  }
}

onMounted(() => {
  fetchServiceData()
  fetchWarmCoinStats()
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

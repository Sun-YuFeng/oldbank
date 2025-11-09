<template>
  <!-- 将图表和按钮组合成一个大卡片 -->
  <div class="chart-card">
    <div class="chart-header">
      <h3 class="chart-title">本周服务量趋势</h3>
      <div class="chart-status">
        <span v-if="loading" class="loading-text">加载中...</span>
        <span v-else-if="error" class="error-text">{{ error }}</span>
        <span v-else class="date-range">{{ currentWeekRange }}</span>
      </div>
    </div>
    <div class="chart-container">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>正在加载数据...</p>
      </div>
      <div v-else-if="error" class="error-state">
        <svg class="error-icon" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
        </svg>
        <p>{{ error }}</p>
        <button @click="fetchData" class="retry-btn">重试</button>
      </div>
      <canvas v-else ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, computed, nextTick, onBeforeUnmount } from 'vue';
import Chart from 'chart.js/auto';
import { getWeeklyServiceTrend } from '../utils/api.js';

export default {
  name: 'ServiceTrendChart',
  setup() {
    const chartCanvas = ref(null);
    const chartInstance = ref(null);
    const loading = ref(true);
    const error = ref('');
    const weeklyData = ref([]);
    
    // 计算当前周范围
    const currentWeekRange = computed(() => {
      if (weeklyData.value.length === 0) return '';
      
      const dates = weeklyData.value.map(item => item.date);
      const startDate = dates[0];
      const endDate = dates[dates.length - 1];
      
      return `${startDate} - ${endDate}`;
    });

    const fetchData = async () => {
      try {
        loading.value = true;
        error.value = '';
        
        const response = await getWeeklyServiceTrend();
        
        if (response.code === 200) {
          weeklyData.value = response.data || [];
          console.log('本周服务量趋势数据:', weeklyData.value);
          
          // 确保数据不为空
          if (weeklyData.value.length === 0) {
            console.warn('API返回空数据');
            error.value = '暂无服务量数据';
            return;
          }
        } else {
          error.value = '获取数据失败: ' + (response.message || '未知错误');
          return;
        }
      } catch (err) {
        console.error('获取本周服务量趋势失败:', err);
        error.value = '网络连接失败，请稍后重试';
        return;
      } finally {
        loading.value = false;
      }
      
      // 数据加载完成且没有错误时，等待 DOM 更新后创建图表
      if (!error.value && weeklyData.value.length > 0) {
        await nextTick();
        // 额外延迟确保 canvas 元素已渲染到 DOM
        setTimeout(() => {
          createChart();
        }, 150);
      }
    };

    const createChart = (retryCount = 0) => {
      console.log('开始创建图表...', retryCount > 0 ? `(重试 ${retryCount})` : '');
      
      // 检查 canvas 元素是否存在
      if (!chartCanvas.value) {
        // 如果重试次数少于3次，延迟重试
        if (retryCount < 3) {
          console.warn(`Canvas 元素未找到，${100 * (retryCount + 1)}ms 后重试...`);
          setTimeout(() => {
            createChart(retryCount + 1);
          }, 100 * (retryCount + 1));
          return;
        } else {
          console.error('多次重试后仍找不到 Canvas 元素');
          error.value = '图表容器未找到';
          return;
        }
      }

      // 如果已有图表实例，先销毁
      if (chartInstance.value) {
        chartInstance.value.destroy();
        chartInstance.value = null;
      }

      // 确保有数据再创建图表
      if (!weeklyData.value || weeklyData.value.length === 0) {
        console.warn('没有数据用于创建图表');
        error.value = '暂无数据';
        return;
      }

      console.log('原始数据:', weeklyData.value);

      // 简单过滤：确保数据对象存在
      const validData = weeklyData.value.filter(item => item && typeof item === 'object');

      console.log('过滤后数据:', validData);

      if (validData.length === 0) {
        console.warn('没有有效数据用于创建图表');
        error.value = '数据格式不正确';
        return;
      }

      try {
        _createChartInstance(chartCanvas.value, validData);
      } catch (err) {
        console.error('创建图表实例失败:', err);
        error.value = '图表创建失败: ' + err.message;
      }
    };

    const _createChartInstance = (ctx, validData) => {

      // 提取标签和数据
      const labels = validData.map(item => item.dayOfWeek || '未知');
      const totalServiceData = validData.map(item => Number(item.serviceCount) || 0);
      const completedData = validData.map(item => Number(item.completedCount) || 0);
      const inProgressData = validData.map(item => Number(item.inProgressCount) || 0);
      const waitingData = validData.map(item => Number(item.waitingCount) || 0);

      console.log('标签:', labels);
      console.log('总服务量数据:', totalServiceData);
      console.log('已完成数据:', completedData);
      console.log('进行中数据:', inProgressData);
      console.log('等待中数据:', waitingData);

      // 简化图表配置，先确保基础功能正常
      chartInstance.value = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: '总服务量',
                data: totalServiceData,
                backgroundColor: '#3B82F6',
                borderColor: '#3B82F6',
                borderWidth: 1,
              },
              {
                label: '已完成',
                data: completedData,
                backgroundColor: '#10B981',
                borderColor: '#10B981',
                borderWidth: 1,
              },
              {
                label: '进行中',
                data: inProgressData,
                backgroundColor: '#F59E0B',
                borderColor: '#F59E0B',
                borderWidth: 1,
              },
              {
                label: '等待中',
                data: waitingData,
                backgroundColor: '#EF4444',
                borderColor: '#EF4444',
                borderWidth: 1,
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
            tooltip: {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              titleColor: '#1F2937',
              bodyColor: '#6B7280',
              borderColor: '#E5E7EB',
              borderWidth: 1,
              padding: 12,
              displayColors: true,
              callbacks: {
                label: function(context) {
                  const datasetLabel = context.dataset.label || '';
                  return `${datasetLabel}: ${context.raw}`;
                },
                title: function(context) {
                  const data = validData[context[0].dataIndex];
                  return `${data.dayOfWeek} (${data.date})`;
                }
              }
            },
            legend: {
              position: 'top',
              labels: {
                usePointStyle: true,
                padding: 15,
                font: {
                  size: 12
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              },
              ticks: {
                stepSize: (() => {
                  const maxValue = validData.length > 0 
                    ? Math.max(...validData.map(item => Number(item.serviceCount) || 0))
                    : 10;
                  return Math.max(1, Math.ceil(maxValue / 5));
                })()
              },
              title: {
                display: true,
                text: '服务数量'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          },
          animation: {
            duration: 800,
            easing: 'easeOutQuart'
          },
          interaction: {
            mode: 'index',
            intersect: false
          }
        }
      });
      
      console.log('图表创建成功!');
    };

    onMounted(() => {
      fetchData();
    });

    // 组件卸载时销毁图表实例
    onBeforeUnmount(() => {
      if (chartInstance.value) {
        chartInstance.value.destroy();
        chartInstance.value = null;
      }
    });
    
    return {
      chartCanvas,
      chartInstance,
      loading,
      error,
      currentWeekRange,
      fetchData
    };
  }
};
</script>

<style scoped>
/* 保持图表容器的70vw宽度，但调整高度以适应卡片布局 */
.chart-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 24px;
  width: 100%;
  box-sizing: border-box;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.chart-status {
  font-size: 14px;
  color: #6b7280;
}

.loading-text {
  color: #3b82f6;
}

.error-text {
  color: #ef4444;
}

.date-range {
  color: #10b981;
  font-weight: 500;
}

.chart-container {
  position: relative;
  width: 100%;
  height: 400px;
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

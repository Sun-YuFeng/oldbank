<template>
  <!-- 将图表和按钮组合成一个大卡片 -->
  <div class="chart-card">
    <div class="chart-header">
      <h3 class="chart-title">本周服务量趋势</h3>
      <div class="button-group">
        <button class="btn btn-active">本周</button>
        <button class="btn btn-inactive">本月</button>
      </div>
    </div>
    <div class="chart-container">
      <canvas id="serviceTrendChart"></canvas>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import Chart from 'chart.js/auto';

export default {
  name: 'ServiceTrendChart',
  setup() {
    const chartRef = ref(null);
    
    onMounted(() => {
      const ctx = document.getElementById('serviceTrendChart').getContext('2d');
      
      chartRef.value = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          datasets: [{
            label: '服务量',
            data: [120, 150, 180, 90, 160, 210, 240],
            backgroundColor: '#3B82F6',
            borderRadius: 4,
            barPercentage: 0.6,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              titleColor: '#333',
              bodyColor: '#666',
              borderColor: '#ddd',
              borderWidth: 1,
              padding: 10,
              displayColors: false,
              callbacks: {
                label: function(context) {
                  return `服务量: ${context.raw}`;
                },
                title: function(context) {
                  return context[0].label;
                }
              }
            },
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              },
              ticks: {
                stepSize: 60
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          },
          animation: {
            duration: 1000,
            easing: 'easeOutQuart'
          },
          interaction: {
            mode: 'index',
            intersect: false
          }
        }
      });
    });
    
    return {
      chartRef
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

.button-group {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 6px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-active {
  background-color: #3b82f6;
  color: white;
}

.btn-inactive {
  background-color: #f3f4f6;
  color: #374151;
}

.btn-inactive:hover {
  background-color: #e5e7eb;
}

.chart-container {
  position: relative;
  width: 100%;
  height: 400px;
}
</style>

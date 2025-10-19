<template>
  <div class="analytics-container">
    <div class="charts-wrapper">
      <div class="chart-box">
        <h3>积分分布</h3>
        <div class="chart-content">
          <canvas ref="barChart"></canvas>
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
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'

const barChart = ref(null)
const pieChart = ref(null)

onMounted(() => {
  // 积分分布柱状图
  new Chart(barChart.value.getContext('2d'), {
    type: 'bar',
    data: {
      labels: ['0-300', '300-600', '600-900', '900+'],
      datasets: [{
        label: '用户数量',
        data: [25, 42, 18, 15],
        backgroundColor: 'rgba(142, 68, 173, 0.7)',
        borderColor: 'rgba(142, 68, 173, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  })

  // 积分变动原因饼图
  new Chart(pieChart.value.getContext('2d'), {
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
</style>

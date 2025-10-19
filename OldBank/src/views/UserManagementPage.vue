<template>
  <div class="user-management-container">
    <!-- 第一区域：面包屑导航 -->
    <div class="breadcrumb-section">
      <nav class="breadcrumb">
        <span class="breadcrumb-item">首页</span>
        <span class="breadcrumb-separator">></span>
        <span class="breadcrumb-item active">用户管理</span>
      </nav>
    </div>

    <!-- 第二区域：搜索过滤器 -->
    <UserFilterSection />

    <!-- 近七天创号人数统计图 -->
    <div class="chart-section">
      <div class="chart-card large-chart">
        <h3 class="chart-title">近七天创号人数统计</h3>
        <div class="chart-container">
          <div ref="userCreationChart" class="chart" style="height: 400px;"></div>
        </div>
      </div>
    </div>

    <!-- 第三区域：统计图表 -->
    <UserStatsSection />

    <!-- 第四区域：用户列表 -->
    <UserListSection />
  </div>
</template>

<script>
import UserFilterSection from '../components/UserFilterSection.vue'
import UserStatsSection from '../components/UserStatsSection.vue'
import UserListSection from '../components/UserListSection.vue'
import * as echarts from 'echarts'

export default {
  name: 'UserManagementPage',
  components: {
    UserFilterSection,
    UserStatsSection,
    UserListSection
  },
  data() {
    return {
      chartInstance: null
    }
  },
  mounted() {
    this.initChart()
  },
  beforeUnmount() {
    if (this.chartInstance) {
      this.chartInstance.dispose()
    }
  },
  methods: {
    initChart() {
      const chartDom = this.$refs.userCreationChart
      if (!chartDom) return
      
      this.chartInstance = echarts.init(chartDom)
      
      // 生成最近七天的日期
      const dates = []
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        dates.push(`${date.getMonth() + 1}/${date.getDate()}`)
      }
      
      // 模拟近七天创号人数数据
      const userCounts = [12, 18, 15, 22, 19, 25, 21]
      
      const option = {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderColor: '#3b82f6',
          borderWidth: 1,
          textStyle: {
            color: '#fff',
            fontSize: 12
          },
          formatter: function(params) {
            return `${params.name}<br/>创号人数: <span style="color: #3b82f6; font-weight: bold">${params.value}人</span>`
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: dates,
          axisLine: {
            lineStyle: {
              color: '#e2e8f0'
            }
          },
          axisLabel: {
            color: '#64748b'
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#e2e8f0'
            }
          },
          axisLabel: {
            color: '#64748b',
            formatter: '{value}人'
          },
          splitLine: {
            lineStyle: {
              color: '#f1f5f9',
              type: 'dashed'
            }
          }
        },
        series: [
          {
            name: '创号人数',
            type: 'line',
            data: userCounts,
            smooth: true,
            lineStyle: {
              width: 4,
              color: '#3b82f6'
            },
            itemStyle: {
              color: '#3b82f6'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
                { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
              ])
            },
            emphasis: {
              itemStyle: {
                color: '#1d4ed8',
                borderColor: '#fff',
                borderWidth: 2,
                shadowBlur: 10,
                shadowColor: 'rgba(59, 130, 246, 0.5)'
              },
              lineStyle: {
                width: 5,
                color: '#1d4ed8'
              }
            }
          }
        ]
      }
      
      this.chartInstance.setOption(option)
      
      // 响应式调整
      window.addEventListener('resize', () => {
        this.chartInstance.resize()
      })
    }
  }
}
</script>

<style scoped>
.user-management-container {
  padding: 24px;
  background-color: #f8fafc;
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
}

.breadcrumb-section {
  margin-bottom: 24px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #64748b;
}

.breadcrumb-item {
  color: #64748b;
}

.breadcrumb-item.active {
  color: #1e293b;
  font-weight: 500;
}

.breadcrumb-separator {
  margin: 0 8px;
  color: #cbd5e1;
}

.chart-section {
  margin-bottom: 24px;
}

.chart-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.chart-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.large-chart {
  width: 100%;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 20px;
}

.chart-container {
  width: 100%;
}

.chart {
  width: 100%;
}
</style>

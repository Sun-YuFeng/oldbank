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



    <!-- 近七天创号人数统计图 -->
    <div class="chart-section">
      <div class="chart-card large-chart">
        <h3 class="chart-title">近七天创号人数统计</h3>
        <div class="chart-container">
          <div v-if="loading" class="chart-loading">
            <div class="loading-spinner"></div>
            <span>正在加载数据...</span>
          </div>
          <div v-else ref="userCreationChart" class="chart" style="height: 400px;"></div>
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
import UserStatsSection from '../components/UserStatsSection.vue'
import UserListSection from '../components/UserListSection.vue'
import * as echarts from 'echarts'
import { getUserCreationStats } from '../utils/api'

export default {
  name: 'UserManagementPage',
  components: {
    UserStatsSection,
    UserListSection
  },
  data() {
    return {
      chartInstance: null,
      loading: false,
      chartData: {
        dates: [],
        counts: []
      }
    }
  },
  mounted() {
    this.loadChartData()
  },
  beforeUnmount() {
    if (this.chartInstance) {
      if (this.resizeHandler) {
        window.removeEventListener('resize', this.resizeHandler)
      }
      this.chartInstance.dispose()
      this.chartInstance = null
    }
  },
  methods: {
    async loadChartData() {
      this.loading = true
      try {
        const response = await getUserCreationStats(7)
        if (response.code === 200) {
          this.chartData = response.data
          // 在控制台打印获取到的数据
          console.log('近七天创建账号用户数量数据:', response.data)
          console.log('日期:', response.data.dates)
          console.log('创号人数:', response.data.counts)
        } else {
          console.error('获取创号统计失败:', response.message)
          // 如果API调用失败，使用模拟数据作为降级方案
          this.useFallbackData()
          return
        }
      } catch (error) {
        console.error('获取创号统计出错:', error)
        // 如果API调用出错，使用模拟数据作为降级方案
        this.useFallbackData()
        return
      }
      
      // 数据加载完成后，设置loading为false，然后初始化图表
      this.loading = false
      this.$nextTick(() => {
        setTimeout(() => {
          this.initChart()
        }, 100)
      })
    },
    
    useFallbackData() {
      // 生成最近七天的日期作为降级数据
      const dates = []
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        dates.push(`${date.getMonth() + 1}/${date.getDate()}`)
      }
      
      // 模拟近七天创号人数数据
      const counts = [12, 18, 15, 22, 19, 25, 21]
      
      this.chartData = { dates, counts }
      // 降级数据加载完成后，设置loading为false，然后初始化图表
      this.loading = false
      this.$nextTick(() => {
        setTimeout(() => {
          this.initChart()
        }, 100)
      })
    },
    
    initChart(retryCount = 0) {
      const chartDom = this.$refs.userCreationChart
      if (!chartDom) {
        console.error('图表容器未找到')
        if (retryCount < 3) {
          setTimeout(() => this.initChart(retryCount + 1), 200)
        }
        return
      }
      
      // 确保容器有尺寸
      if (chartDom.clientWidth === 0 || chartDom.clientHeight === 0) {
        console.warn('图表容器尺寸为0，等待DOM更新')
        if (retryCount < 3) {
          setTimeout(() => this.initChart(retryCount + 1), 100)
        }
        return
      }
      
      // 数据校验
      if (!this.chartData || !this.chartData.dates || !this.chartData.counts || 
          this.chartData.dates.length === 0 || this.chartData.counts.length === 0) {
        console.warn('图表数据不完整，无法初始化图表')
        return
      }
      
      // 如果已有图表实例，先销毁
      if (this.chartInstance) {
        this.chartInstance.dispose()
      }
      
      // 初始化图表实例
      this.chartInstance = echarts.init(chartDom)
      
      console.log('图表初始化数据:', this.chartData)
      
      const option = {
        tooltip: {
          trigger: 'axis', // 改为axis触发，更符合折线图
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#3b82f6',
          borderWidth: 1,
          textStyle: {
            color: '#1e293b',
            fontSize: 12
          },
          formatter: function(params) {
            if (params && params.length > 0) {
              const param = params[0]
              return `${param.name}<br/>创号人数: <span style="color: #3b82f6; font-weight: bold">${param.value}人</span>`
            }
            return ''
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.chartData.dates,
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
            data: this.chartData.counts,
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: {
              width: 4,
              color: '#3b82f6'
            },
            itemStyle: {
              color: '#3b82f6',
              borderColor: '#fff',
              borderWidth: 2
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
                borderWidth: 3,
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
      
      try {
        this.chartInstance.setOption(option, true)
      } catch (error) {
        console.error('设置图表配置失败:', error)
        // 如果设置配置失败，尝试重新初始化
        if (retryCount < 3) {
          setTimeout(() => this.initChart(retryCount + 1), 500)
        }
        return
      }
      
      // 响应式调整
      this.resizeHandler = () => {
        if (this.chartInstance && !this.chartInstance.isDisposed()) {
          this.chartInstance.resize()
        }
      }
      window.addEventListener('resize', this.resizeHandler)
      
      console.log('图表初始化完成')
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

.chart-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #64748b;
  font-size: 14px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

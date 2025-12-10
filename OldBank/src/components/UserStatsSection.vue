<template>
  <div class="stats-section">
    <div class="stats-container">
      <!-- 用户角色分布图表 -->
      <div class="chart-card">
        <h3 class="chart-title">用户角色分布</h3>
        <div class="chart-content">
          <div v-if="roleLoading" class="loading-container">
            <div class="loading-spinner"></div>
            <span>加载中...</span>
          </div>
          <div v-else-if="roleError" class="error-container">
            <span class="error-text">{{ roleError }}</span>
            <button @click="loadRoleStats" class="retry-btn">重试</button>
          </div>
          <div v-else ref="roleChart" class="echart-container"></div>
        </div>
      </div>

      <!-- 用户状态分布图表 -->
      <div class="chart-card">
        <h3 class="chart-title">用户状态分布</h3>
        <div class="chart-content">
          <div v-if="statusLoading" class="loading-container">
            <div class="loading-spinner"></div>
            <span>加载中...</span>
          </div>
          <div v-else-if="statusError" class="error-container">
            <span class="error-text">{{ statusError }}</span>
            <button @click="loadStatusStats" class="retry-btn">重试</button>
          </div>
          <div v-else ref="statusChart" class="echart-container"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { getRoleStats, getStatusStats } from '../utils/api'

export default {
  name: 'UserStatsSection',
  data() {
    return {
      roleData: [],
      statusData: [],
      roleChart: null,
      statusChart: null,
      roleLoading: false,
      statusLoading: false,
      roleError: '',
      statusError: ''
    }
  },
  mounted() {
    console.log('UserStatsSection组件已挂载，开始加载数据...')
    console.log('当前环境:', import.meta.env.MODE)
    console.log('API基础URL:', import.meta.env.VITE_API_BASE_URL || '使用相对路径')
    
    this.loadRoleStats()
    this.loadStatusStats()
  },
  beforeUnmount() {
    if (this.roleChart) {
      window.removeEventListener('resize', this.handleRoleChartResize)
      this.roleChart.dispose()
      this.roleChart = null
    }
    if (this.statusChart) {
      window.removeEventListener('resize', this.handleStatusChartResize)
      this.statusChart.dispose()
      this.statusChart = null
    }
  },
  methods: {
    async loadRoleStats() {
      this.roleLoading = true
      this.roleError = ''
      
      try {
        console.log('开始获取角色统计数据...')
        const response = await getRoleStats()
        console.log('角色统计API响应:', response)
        
        if (response.code === 200) {
          console.log('角色统计数据:', response.data)
          
          // 确保数据始终是数组格式
          this.roleData = Array.isArray(response.data) ? response.data : [response.data]
          
          console.log('处理后的角色数据:', this.roleData)
          
          // 数据加载完成后初始化图表
          this.$nextTick(() => {
            this.initRoleChart()
          })
        } else {
          console.error('角色统计API返回错误:', response)
          this.roleError = response.message || '获取角色统计数据失败'
        }
      } catch (error) {
        console.error('获取角色统计数据失败:', error)
        this.roleError = error.message || '网络错误，请检查连接'
      } finally {
        this.roleLoading = false
      }
    },
    
    async loadStatusStats() {
      this.statusLoading = true
      this.statusError = ''
      
      try {
        console.log('开始获取状态统计数据...')
        const response = await getStatusStats()
        console.log('状态统计API响应:', response)
        
        if (response.code === 200) {
          console.log('状态统计数据:', response.data)
          
          // 确保数据始终是数组格式
          this.statusData = Array.isArray(response.data) ? response.data : [response.data]
          
          console.log('处理后的状态数据:', this.statusData)
          
          // 数据加载完成后初始化图表
          this.$nextTick(() => {
            this.initStatusChart()
          })
        } else {
          console.error('状态统计API返回错误:', response)
          this.statusError = response.message || '获取状态统计数据失败'
        }
      } catch (error) {
        console.error('获取状态统计数据失败:', error)
        this.statusError = error.message || '网络错误，请检查连接'
      } finally {
        this.statusLoading = false
      }
    },
    
    initRoleChart(retryCount = 0) {
      const chartDom = this.$refs.roleChart
      if (!chartDom) {
        console.warn('角色图表DOM未找到')
        if (retryCount < 3) {
          setTimeout(() => this.initRoleChart(retryCount + 1), 200)
        }
        return
      }
      
      // 确保容器有尺寸
      if (chartDom.clientWidth === 0 || chartDom.clientHeight === 0) {
        console.warn('图表容器尺寸为0，等待DOM更新')
        if (retryCount < 3) {
          setTimeout(() => this.initRoleChart(retryCount + 1), 100)
        }
        return
      }
      
      // 数据校验
      if (!this.roleData || this.roleData.length === 0) {
        console.warn('角色数据为空，无法初始化图表')
        return
      }
      
      // 如果已有图表实例，先销毁
      if (this.roleChart) {
        this.roleChart.dispose()
      }
      
      // 初始化图表实例
      this.roleChart = echarts.init(chartDom)
      
      const option = this.getChartOption(this.roleData, '#8b5cf6')
      
      try {
        this.roleChart.setOption(option, true)
      } catch (error) {
        console.error('设置角色图表配置失败:', error)
        // 如果设置配置失败，尝试重新初始化
        if (retryCount < 3) {
          setTimeout(() => this.initRoleChart(retryCount + 1), 500)
        }
        return
      }
      
      // 添加窗口resize监听
      window.addEventListener('resize', this.handleRoleChartResize)
      
      console.log('角色图表初始化完成')
    },
    
    handleRoleChartResize() {
      if (this.roleChart && !this.roleChart.isDisposed()) {
        this.roleChart.resize()
      }
    },

    handleStatusChartResize() {
      if (this.statusChart && !this.statusChart.isDisposed()) {
        this.statusChart.resize()
      }
    },
    
    initStatusChart(retryCount = 0) {
      const chartDom = this.$refs.statusChart
      if (!chartDom) {
        console.warn('状态图表DOM未找到')
        if (retryCount < 3) {
          setTimeout(() => this.initStatusChart(retryCount + 1), 200)
        }
        return
      }
      
      // 确保容器有尺寸
      if (chartDom.clientWidth === 0 || chartDom.clientHeight === 0) {
        console.warn('图表容器尺寸为0，等待DOM更新')
        if (retryCount < 3) {
          setTimeout(() => this.initStatusChart(retryCount + 1), 100)
        }
        return
      }
      
      // 数据校验
      if (!this.statusData || this.statusData.length === 0) {
        console.warn('状态数据为空，无法初始化图表')
        return
      }
      
      // 如果已有图表实例，先销毁
      if (this.statusChart) {
        this.statusChart.dispose()
      }
      
      // 初始化图表实例
      this.statusChart = echarts.init(chartDom)
      
      const option = this.getChartOption(this.statusData, '#10b981')
      
      try {
        this.statusChart.setOption(option, true)
      } catch (error) {
        console.error('设置状态图表配置失败:', error)
        // 如果设置配置失败，尝试重新初始化
        if (retryCount < 3) {
          setTimeout(() => this.initStatusChart(retryCount + 1), 500)
        }
        return
      }
      
      // 添加窗口resize监听
      window.addEventListener('resize', this.handleStatusChartResize)
      
      console.log('状态图表初始化完成')
    },
    
    // 公共图表配置函数
    getChartOption(data, color) {
      return {
        tooltip: {
          trigger: 'item', // 改为item触发，精准触发单个柱子
          formatter: (params) => {
            // 增加数据校验，避免params为空
            if (!params || !params.name || params.value === undefined) return ''
            return `<div style="font-weight: bold; color: #1e293b; margin-bottom: 4px;">${params.name}</div>
                   <div style="color: ${color}; font-size: 14px;">用户数量: <span style="font-weight: bold;">${params.value}人</span></div>`
          },
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          borderColor: color,
          borderWidth: 2,
          textStyle: {
            color: '#1e293b',
            fontSize: 13,
            fontWeight: 'normal'
          },
          extraCssText: 'box-shadow: 0 8px 24px rgba(139, 92, 246, 0.25); border-radius: 8px; padding: 12px;',
          position: 'bottom', // 调整显示位置避免被遮挡
          alwaysShowContent: false,
          // 移除confine: true，避免限制tooltip显示范围
          transitionDuration: 0.2
        },
        axisPointer: {
          show: false // 关闭坐标轴指示器，消除虚线
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: data.map(item => item.name || item.label),
          axisLine: {
            lineStyle: {
              color: '#e2e8f0'
            }
          },
          axisLabel: {
            color: '#64748b',
            fontSize: 12
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
            color: '#9ca3af',
            fontSize: 11
          },
          splitLine: {
            show: false
          }
        },
        series: [
          {
            name: '用户数量',
            type: 'bar',
            data: data.map(item => item.value),
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: color },
                { offset: 1, color: this.getDarkerColor(color) }
              ]),
              borderRadius: [4, 4, 0, 0]
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: `rgba(${this.hexToRgb(color)}, 0.5)`,
                borderColor: color,
                borderWidth: 2
              }
            },
            barWidth: '50%'
          }
        ]
      }
    },
    
    // 获取更深的颜色（用于渐变效果）
    getDarkerColor(hexColor) {
      // 简单的颜色加深逻辑
      const colors = {
        '#8b5cf6': '#7c3aed',
        '#10b981': '#059669'
      }
      return colors[hexColor] || hexColor
    },
    
    // 十六进制颜色转RGB（用于阴影效果）
    hexToRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result ? 
        `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
        '139, 92, 246' // 默认紫色
    }
  }
}
</script>

<style scoped>
.stats-section {
  margin-bottom: 24px;
}

.stats-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
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

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 20px;
}

.chart-content {
  display: flex;
  align-items: stretch;
  min-height: 280px;
}

.echart-container {
  width: 100%;
  height: 280px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 280px;
  color: #64748b;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #8b5cf6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 280px;
  text-align: center;
}

.error-text {
  color: #ef4444;
  margin-bottom: 16px;
  font-size: 14px;
}

.retry-btn {
  padding: 8px 16px;
  background-color: #8b5cf6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.retry-btn:hover {
  background-color: #7c3aed;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .stats-container {
    grid-template-columns: 1fr;
  }
  
  .echart-container {
    height: 240px;
  }
  
  .loading-container,
  .error-container {
    height: 240px;
  }
}
</style>

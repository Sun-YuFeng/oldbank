<template>
  <div class="stats-section">
    <div class="stats-container">
      <!-- 用户角色分布图表 -->
      <div class="chart-card">
        <h3 class="chart-title">用户角色分布</h3>
        <div class="chart-content">
          <!-- Fixed Y-axis positioning and layout -->
          <div class="y-axis">
            <span class="y-axis-label" v-for="value in roleYAxisLabels" :key="value">{{ value }}</span>
          </div>
          <div class="chart-wrapper">
            <div class="bar-chart">
              <div class="bar-item" v-for="item in roleData" :key="item.label">
                <div class="bar-wrapper">
                  <div 
                    class="bar role-bar" 
                    :style="{ height: (item.value / maxRoleValue * 100) + '%' }"
                    @mouseenter="showTooltip($event, item.value)"
                    @mouseleave="hideTooltip"
                  ></div>
                </div>
                <span class="bar-label">{{ item.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 用户状态分布图表 -->
      <div class="chart-card">
        <h3 class="chart-title">用户状态分布</h3>
        <div class="chart-content">
          <!-- Fixed Y-axis positioning and layout -->
          <div class="y-axis">
            <span class="y-axis-label" v-for="value in statusYAxisLabels" :key="value">{{ value }}</span>
          </div>
          <div class="chart-wrapper">
            <div class="bar-chart">
              <div class="bar-item" v-for="item in statusData" :key="item.label">
                <div class="bar-wrapper">
                  <div 
                    class="bar status-bar" 
                    :style="{ height: (item.value / maxStatusValue * 100) + '%' }"
                    @mouseenter="showTooltip($event, item.value)"
                    @mouseleave="hideTooltip"
                  ></div>
                </div>
                <span class="bar-label">{{ item.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Tooltip remains unchanged -->
    <div 
      v-if="tooltip.show" 
      class="tooltip" 
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
    >
      {{ tooltip.value }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserStatsSection',
  data() {
    return {
      roleData: [
        { label: '需求者', value: 20 },
        { label: '志愿者', value: 14 },
        { label: '管理员', value: 16 }
      ],
      statusData: [
        { label: '活跃', value: 22 },
        { label: '禁用', value: 13 },
        { label: '待审核', value: 16 }
      ],
      tooltip: {
        show: false,
        x: 0,
        y: 0,
        value: 0
      }
    }
  },
  computed: {
    maxRoleValue() {
      return Math.max(...this.roleData.map(item => item.value))
    },
    maxStatusValue() {
      return Math.max(...this.statusData.map(item => item.value))
    },
    roleYAxisLabels() {
      return [20, 15, 10, 5, 0]
    },
    statusYAxisLabels() {
      return [24, 18, 12, 6, 0]
    }
  },
  methods: {
    showTooltip(event, value) {
      this.tooltip.show = true
      this.tooltip.value = value
      this.tooltip.x = event.clientX + 10
      this.tooltip.y = event.clientY - 30
    },
    hideTooltip() {
      this.tooltip.show = false
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

/* Improved Y-axis styling and positioning */
.y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 240px;
  padding-right: 12px;
  margin-right: 12px;
  border-right: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.y-axis-label {
  font-size: 11px;
  color: #9ca3af;
  line-height: 1;
  text-align: right;
}

/* Added chart-wrapper for better layout control */
.chart-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Improved bar chart spacing and layout */
.bar-chart {
  display: flex;
  align-items: end;
  justify-content: space-evenly;
  height: 200px;
  margin-bottom: 20px;
  padding: 0 10px 0 10px;
  flex: 1;
  gap: 20px;
}

.bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
  margin-bottom: 8px;
}

.bar-wrapper {
  height: 170px;
  display: flex;
  align-items: end;
  width: 50px;
  margin-bottom: 12px;
}

.bar {
  width: 100%;
  border-radius: 4px 4px 0 0;
  transition: all 0.3s ease;
  min-height: 8px;
  cursor: pointer;
}

.role-bar {
  background: linear-gradient(180deg, #8b5cf6 0%, #7c3aed 100%);
}

.status-bar {
  background: linear-gradient(180deg, #10b981 0%, #059669 100%);
}

.bar:hover {
  opacity: 0.8;
  transform: scaleY(1.05);
}

.bar-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
  text-align: center;
  line-height: 1.2;
  margin-top: 4px;
}

/* Removed conflicting chart-axis styles */

.tooltip {
  position: fixed;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  pointer-events: none;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .stats-container {
    grid-template-columns: 1fr;
  }
}
</style>

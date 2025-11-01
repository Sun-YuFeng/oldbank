<template>
  <div class="dashboard-container">
    <!-- 顶部导航路径 -->
    <div class="breadcrumbs">
      <div class="breadcrumb-content">
        <a href="#" class="breadcrumb-link">
          <i class="fas fa-home"></i>首页
        </a>
        <span class="breadcrumb-separator">></span>
        <span class="breadcrumb-current">管理仪表盘</span>
      </div>
    </div>
    
    <!-- Stats container using transparent big box containing three small card boxes -->
    <div class="stats-container">
      <div class="stats-wrapper">
        <StatCard 
          title="总服务量" 
          :value="dashboardStats.totalServices || 0" 
          iconClass="fas fa-chart-line" 
          iconBgClass="bg-blue"
        />
        <StatCard 
          title="活跃志愿者" 
          :value="dashboardStats.activeVolunteers || 0" 
          iconClass="fas fa-users" 
          iconBgClass="bg-green"
        />
        <StatCard 
          title="异常预警" 
          :value="dashboardStats.warningAlerts || 0" 
          iconClass="fas fa-exclamation-triangle" 
          iconBgClass="bg-red"
          valueClass="text-red"
        />
      </div>
    </div>
    
    <!-- 图表区域 -->
    <div class="chart-container">
      <ServiceTrendChart />
    </div>
    
    <!-- 志愿者表格区域 -->
    <div class="volunteer-container">
      <VolunteerTable />
    </div>
  </div>
</template>

<script>
import StatCard from '../components/StatCard.vue';
import ServiceTrendChart from '../components/ServiceTrendChart.vue';
import VolunteerTable from '../components/VolunteerTable.vue';
import { getDashboardStats } from '../utils/api.js';

export default {
  name: 'DashboardView',
  components: {
    StatCard,
    ServiceTrendChart,
    VolunteerTable
  },
  data() {
    return {
      dashboardStats: {
        totalServices: 0,
        activeVolunteers: 0,
        warningAlerts: 0
      },
      loading: false
    }
  },
  mounted() {
    this.fetchDashboardStats();
  },
  methods: {
    async fetchDashboardStats() {
      this.loading = true;
      try {
        const response = await getDashboardStats();
        if (response.code === 200) {
          this.dashboardStats = response.data;
        } else {
          console.error('获取仪表盘统计数据失败:', response.message);
        }
      } catch (error) {
        console.error('获取仪表盘统计数据出错:', error);
        // 如果接口调用失败，使用默认值
        this.dashboardStats = {
          totalServices: 1289,
          activeVolunteers: 56,
          warningAlerts: 12
        };
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.dashboard-container {
  padding: 32px;
  background-color: #f8fafc;
  min-height: 100vh;
  width: 100%;
}

.breadcrumbs {
  margin-bottom: 24px;
}

.breadcrumb-content {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #64748b;
}

.breadcrumb-link {
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  color: #3b82f6;
}

.breadcrumb-link i {
  margin-right: 4px;
}

.breadcrumb-separator {
  margin: 0 8px;
}

.breadcrumb-current {
  color: #3b82f6;
  font-weight: 500;
}

/* Stats container - transparent big box containing three small card boxes */
.stats-container {
  margin-bottom: 32px;
  width: 100%;
}

.stats-wrapper {
  /* Transparent big box that defines the container area */
  display: flex;
  gap: 24px;
  width: 100%;
}

.stats-wrapper > * {
  /* Each small card box takes equal space */
  flex: 1;
}

.chart-container,
.volunteer-container {
  width: 100%;
  margin-bottom: 32px;
}

/* Responsive design */
@media (max-width: 768px) {
  .stats-wrapper {
    flex-direction: column;
    gap: 16px;
  }
  
  .stats-wrapper > * {
    flex: none;
  }
}
</style>

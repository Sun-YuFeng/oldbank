<template>
  <div class="volunteer-detail-page">
    <!-- 面包屑导航 -->
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/' }">管理仪表盘</el-breadcrumb-item>
        <el-breadcrumb-item>志愿者详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">志愿者详情</h1>
      <div class="header-actions">
        <el-button @click="handleBack" icon="el-icon-arrow-left">返回列表</el-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="6" animated />
    </div>

    <!-- 志愿者详情卡片 -->
    <div v-else-if="volunteer" class="detail-card">
      <el-card class="profile-card">
        <div slot="header" class="card-header">
          <span class="card-title">基本信息</span>
        </div>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="info-item">
              <label>志愿者ID：</label>
              <span>{{ volunteer.id }}</span>
            </div>
            <div class="info-item">
              <label>姓名：</label>
              <span>{{ volunteer.name }}</span>
            </div>
            <div class="info-item">
              <label>电话：</label>
              <span>{{ volunteer.phone || '未设置' }}</span>
            </div>
            <div class="info-item">
              <label>邮箱：</label>
              <span>{{ volunteer.email || '未设置' }}</span>
            </div>
          </el-col>
          
          <el-col :span="12">
            <div class="info-item">
              <label>地址：</label>
              <span>{{ volunteer.address || '未设置' }}</span>
            </div>
            <div class="info-item">
              <label>状态：</label>
              <el-tag :type="getStatusType(volunteer.status)">{{ volunteer.status || '未知' }}</el-tag>
            </div>
            <div class="info-item">
              <label>注册时间：</label>
              <span>{{ volunteer.registerTime || '未知' }}</span>
            </div>
            <div class="info-item">
              <label>最后登录：</label>
              <span>{{ volunteer.lastLoginTime || '未知' }}</span>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <!-- 服务统计卡片 -->
      <el-card class="stats-card">
        <div slot="header" class="card-header">
          <span class="card-title">服务统计</span>
        </div>
        
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="stat-item">
              <div class="stat-value">{{ volunteer.totalTasks || 0 }}</div>
              <div class="stat-label">总任务数</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-item">
              <div class="stat-value">{{ volunteer.completedTasks || 0 }}</div>
              <div class="stat-label">完成数</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-item">
              <div class="stat-value">{{ volunteer.warmCoin || 0 }}</div>
              <div class="stat-label">温暖币</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-item">
              <div class="stat-value">{{ volunteer.rating || 0 }}</div>
              <div class="stat-label">评分</div>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <!-- 信用分信息 -->
      <el-card class="credit-card">
        <div slot="header" class="card-header">
          <span class="card-title">信用信息</span>
        </div>
        
        <div class="credit-info">
          <div class="credit-score">
            <div class="score-value">{{ volunteer.creditScore || 0 }}</div>
            <div class="score-label">信用分</div>
          </div>
          <div class="service-count">
            <div class="count-value">{{ volunteer.serviceCount || 0 }}</div>
            <div class="count-label">服务次数</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 错误状态 -->
    <div v-else class="error-container">
      <el-empty description="未找到志愿者信息" />
    </div>
  </div>
</template>

<script>
import { getVolunteerDetail } from '@/utils/api';

export default {
  name: 'VolunteerDetailPage',
  data() {
    return {
      loading: true,
      volunteer: null,
      volunteerId: null
    };
  },
  created() {
    this.volunteerId = this.$route.params.id;
    this.fetchVolunteerDetail();
  },
  methods: {
    async fetchVolunteerDetail() {
      try {
        this.loading = true;
        const response = await getVolunteerDetail(this.volunteerId);
        
        if (response.code === 200) {
          this.volunteer = response.data;
          console.log('志愿者详情数据:', this.volunteer);
        } else {
          this.$message.error('获取志愿者详情失败：' + response.message);
        }
      } catch (error) {
        console.error('获取志愿者详情失败:', error);
        this.$message.error('获取志愿者详情失败，请稍后重试');
      } finally {
        this.loading = false;
      }
    },
    
    getStatusType(status) {
      const statusMap = {
        '活跃': 'success',
        '离线': 'info',
        '封禁': 'danger',
        '休息': 'warning'
      };
      return statusMap[status] || 'info';
    },
    
    handleBack() {
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.volunteer-detail-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.breadcrumb {
  margin-bottom: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.loading-container {
  padding: 40px 0;
}

.detail-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-card,
.stats-card,
.credit-card {
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.card-header {
  border-bottom: none;
  padding: 20px 20px 0;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.info-item {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.info-item label {
  font-weight: 500;
  color: #6b7280;
  min-width: 100px;
  margin-right: 10px;
}

.info-item span {
  color: #1f2937;
  font-size: 16px;
}

.stat-item {
  text-align: center;
  padding: 20px 0;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
}

.credit-info {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 20px 0;
}

.credit-score,
.service-count {
  text-align: center;
}

.score-value,
.count-value {
  font-size: 48px;
  font-weight: 700;
  color: #10b981;
  margin-bottom: 8px;
}

.score-label,
.count-label {
  font-size: 16px;
  color: #6b7280;
  font-weight: 500;
}

.error-container {
  padding: 60px 0;
  text-align: center;
}

@media (max-width: 768px) {
  .volunteer-detail-page {
    padding: 10px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .info-item label {
    min-width: auto;
    margin-bottom: 5px;
  }
  
  .credit-info {
    flex-direction: column;
    gap: 30px;
  }
}
</style>
<template>
  <div class="volunteer-detail-page">
    <!-- 顶部导航路径 -->
    <div class="breadcrumbs">
      <div class="breadcrumb-content">
        <a href="#" class="breadcrumb-link">
          <i class="fas fa-home"></i>首页
        </a>
        <span class="breadcrumb-separator">></span>
        <a href="#" @click="goToDashboard" class="breadcrumb-link">管理仪表盘</a>
        <span class="breadcrumb-separator">></span>
        <span class="breadcrumb-current">志愿者详情</span>
      </div>
    </div>
    
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">志愿者详情</h1>
      <div class="header-actions">
        <button @click="handleBack" class="back-button">
          <i class="fas fa-arrow-left"></i>
          返回列表
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <span>正在加载志愿者详情...</span>
    </div>

    <!-- 志愿者详情内容 -->
    <div v-else-if="volunteer" class="detail-content">
      <!-- 基本信息卡片 -->
      <div class="info-card">
        <div class="card-header">
          <h3 class="card-title">基本信息</h3>
        </div>
        <div class="card-body">
          <div class="info-grid">
            <div class="info-item">
              <label class="info-label">志愿者ID</label>
              <span class="info-value">{{ volunteer.id }}</span>
            </div>
            <div class="info-item">
              <label class="info-label">用户名</label>
              <span class="info-value">{{ volunteer.username || '未设置' }}</span>
            </div>
            <div class="info-item">
              <label class="info-label">真实姓名</label>
              <span class="info-value">{{ volunteer.realName || '未设置' }}</span>
            </div>
            <div class="info-item">
              <label class="info-label">电话</label>
              <span class="info-value">{{ volunteer.phone || '未设置' }}</span>
            </div>
            <div class="info-item">
              <label class="info-label">邮箱</label>
              <span class="info-value">{{ volunteer.email || '未设置' }}</span>
            </div>
            <div class="info-item">
              <label class="info-label">年龄</label>
              <span class="info-value">{{ volunteer.age || '未设置' }}</span>
            </div>
            <div class="info-item full-width">
              <label class="info-label">地址</label>
              <span class="info-value">{{ volunteer.address || '未设置' }}</span>
            </div>
            <div class="info-item full-width" v-if="volunteer.savedAddresses && volunteer.savedAddresses.length > 0">
              <label class="info-label">保存的地址</label>
              <div class="address-list">
                <span v-for="(address, index) in volunteer.savedAddresses" :key="index" class="address-tag">
                  {{ address }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 账户状态 -->
      <div class="status-card">
        <div class="card-header">
          <h3 class="card-title">账户状态</h3>
        </div>
        <div class="card-body">
          <div class="status-grid">
            <div class="status-item">
              <label class="status-label">账户状态</label>
              <span class="status-value" :class="{ 'status-active': volunteer.enabled, 'status-inactive': !volunteer.enabled }">
                {{ volunteer.enabled ? '正常' : '已禁用' }}
              </span>
            </div>
            <div class="status-item">
              <label class="status-label">封禁状态</label>
              <span class="status-value" v-if="volunteer.bannedUntil">
                封禁至 {{ volunteer.bannedUntil }}
              </span>
              <span class="status-value status-normal" v-else>正常</span>
            </div>
            <div class="status-item" v-if="volunteer.banReason">
              <label class="status-label">封禁原因</label>
              <span class="status-value status-banned">{{ volunteer.banReason }}</span>
            </div>
            <div class="status-item">
              <label class="status-label">删除状态</label>
              <span class="status-value" :class="{ 'status-deleted': volunteer.deleted, 'status-normal': !volunteer.deleted }">
                {{ volunteer.deleted ? '已删除' : '正常' }}
              </span>
            </div>
          </div>
          <div class="time-info">
            <div class="time-item">
              <label class="time-label">注册时间</label>
              <span class="time-value">{{ volunteer.createTime || '未知' }}</span>
            </div>
            <div class="time-item">
              <label class="time-label">更新时间</label>
              <span class="time-value">{{ volunteer.updateTime || '未知' }}</span>
            </div>
            <div class="time-item">
              <label class="time-label">最后登录</label>
              <span class="time-value">{{ volunteer.lastLoginTime || '未知' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 服务统计 -->
      <div class="stats-card">
        <div class="card-header">
          <h3 class="card-title">服务统计</h3>
        </div>
        <div class="card-body">
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-number">{{ volunteer.totalTasks || 0 }}</div>
              <div class="stat-label">总任务数</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ volunteer.completedTasks || 0 }}</div>
              <div class="stat-label">已完成</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ volunteer.inProgressTasks || 0 }}</div>
              <div class="stat-label">进行中</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ volunteer.cancelledTasks || 0 }}</div>
              <div class="stat-label">已取消</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ volunteer.waitingTasks || 0 }}</div>
              <div class="stat-label">待处理</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ volunteer.completionRate || 0 }}%</div>
              <div class="stat-label">完成率</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 暖龄币统计 -->
      <div class="coin-card">
        <div class="card-header">
          <h3 class="card-title">暖龄币统计</h3>
        </div>
        <div class="card-body">
          <div class="coin-grid">
            <div class="coin-item">
              <div class="coin-number">{{ volunteer.warmCoin || 0 }}</div>
              <div class="coin-label">当前余额</div>
            </div>
            <div class="coin-item">
              <div class="coin-number">{{ volunteer.totalEarnedCoins || 0 }}</div>
              <div class="coin-label">累计获得</div>
            </div>
            <div class="coin-item">
              <div class="coin-number">{{ volunteer.totalSpentCoins || 0 }}</div>
              <div class="coin-label">累计消费</div>
            </div>
            <div class="coin-item">
              <div class="coin-number">{{ volunteer.totalDonatedCoins || 0 }}</div>
              <div class="coin-label">累计捐赠</div>
            </div>
            <div class="coin-item">
              <div class="coin-number">{{ volunteer.totalTransferredCoins || 0 }}</div>
              <div class="coin-label">累计转赠</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 信用评价 -->
      <div class="credit-card">
        <div class="card-header">
          <h3 class="card-title">信用评价</h3>
        </div>
        <div class="card-body">
          <div class="credit-grid">
            <div class="credit-item">
              <div class="credit-score">{{ volunteer.creditScore || 0 }}</div>
              <div class="credit-label">信用分</div>
            </div>
            <div class="credit-item">
              <div class="credit-score">{{ volunteer.rating || 0 }}</div>
              <div class="credit-label">评分</div>
            </div>
            <div class="credit-item">
              <div class="credit-score">{{ volunteer.totalRatings || 0 }}</div>
              <div class="credit-label">评价次数</div>
            </div>
            <div class="credit-item">
              <div class="credit-level">{{ volunteer.creditLevel || '未知' }}</div>
              <div class="credit-label">信用等级</div>
            </div>
          </div>
          <div class="service-hours">
            <div class="hours-item">
              <label class="hours-label">总服务时长</label>
              <span class="hours-value">{{ volunteer.totalServiceHours || 0 }} 小时</span>
            </div>
            <div class="hours-item">
              <label class="hours-label">本月服务次数</label>
              <span class="hours-value">{{ volunteer.thisMonthServiceCount || 0 }} 次</span>
            </div>
            <div class="hours-item">
              <label class="hours-label">本月服务时长</label>
              <span class="hours-value">{{ volunteer.thisMonthServiceHours || 0 }} 小时</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 状态描述 -->
      <div class="description-card">
        <div class="card-header">
          <h3 class="card-title">状态描述</h3>
        </div>
        <div class="card-body">
          <div class="status-description">
            <span class="status-badge" :class="getStatusClass(volunteer.statusDescription)">
              {{ volunteer.statusDescription || '未知' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else class="error-container">
      <div class="error-icon">
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <h3>未找到志愿者信息</h3>
      <p>请检查志愿者ID是否正确</p>
      <button @click="handleBack" class="back-button">返回列表</button>
    </div>
  </div>
</template>

<script>
import { getVolunteerDetailInfo } from '../utils/api.js';

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
        console.log('🎯 开始请求志愿者详情API，ID:', this.volunteerId);
        
        const response = await getVolunteerDetailInfo(this.volunteerId);
        
        console.log('✅ 志愿者详情API响应:', response);
        
        if (response.code === 200) {
          this.volunteer = response.data;
          console.log('📦 志愿者详情数据:', this.volunteer);
        } else {
          console.error('❌ 获取志愿者详情失败:', response.message);
          // 使用默认数据
          this.volunteer = this.getDefaultVolunteerData();
        }
      } catch (error) {
        console.error('🚨 获取志愿者详情出错:', error);
        
        // 如果是401错误，需要重新登录
        if (error.code === 401) {
          console.warn('⚠️ 认证失败，需要重新登录');
          this.$router.push('/login');
          return;
        }
        
        // 其他错误使用默认数据
        this.volunteer = this.getDefaultVolunteerData();
      } finally {
        this.loading = false;
      }
    },
    
    getDefaultVolunteerData() {
      return {
        id: this.volunteerId,
        username: 'volunteer001',
        phone: '13800138001',
        email: 'volunteer@example.com',
        realName: '张志愿',
        avatar: 'http://example.com/avatar.jpg',
        age: 28,
        address: '北京市朝阳区',
        savedAddresses: ['北京市朝阳区', '北京市海淀区'],
        
        warmCoin: 350,
        enabled: true,
        bannedUntil: null,
        banReason: null,
        deleted: false,
        deletedTime: null,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-11-20 15:30:00',
        lastLoginTime: '2024-11-20 14:00:00',
        
        rating: 4.8,
        creditScore: 95,
        totalRatings: 0,
        
        totalTasks: 50,
        completedTasks: 45,
        inProgressTasks: 2,
        cancelledTasks: 1,
        waitingTasks: 2,
        
        totalEarnedCoins: 450,
        totalSpentCoins: 100,
        totalDonatedCoins: 0,
        totalTransferredCoins: 0,
        
        totalServiceHours: 90,
        thisMonthServiceCount: 8,
        thisMonthServiceHours: 16,
        
        completionRate: 90.0,
        statusDescription: '活跃',
        creditLevel: '优秀'
      };
    },
    
    getStatusClass(status) {
      const statusMap = {
        '活跃': 'status-active',
        '离线': 'status-offline',
        '封禁': 'status-banned',
        '休息': 'status-rest'
      };
      return statusMap[status] || 'status-unknown';
    },
    
    handleBack() {
      this.$router.push('/');
    },
    
    goToDashboard() {
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
/* 页面容器 */
.volunteer-detail-page {
  padding: 32px;
  background-color: #f8fafc;
  min-height: 100vh;
  width: 100%;
}

/* 面包屑导航 */
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

/* 页面标题 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.back-button {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-button:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.back-button i {
  margin-right: 6px;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #6b7280;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 内容布局 */
.detail-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 卡片基础样式 */
.info-card,
.status-card,
.stats-card,
.coin-card,
.credit-card,
.description-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.card-header {
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f3f4f6;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.card-body {
  padding: 24px;
}

/* 基本信息网格 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-label {
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
}

.info-value {
  font-size: 14px;
  color: #111827;
  font-weight: 500;
}

.address-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.address-tag {
  display: inline-block;
  padding: 4px 8px;
  background: #eff6ff;
  color: #1e40af;
  border: 1px solid #bfdbfe;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

/* 状态信息 */
.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.status-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.status-label {
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
}

.status-value {
  font-size: 14px;
  font-weight: 600;
}

.status-value.status-active,
.status-value.status-normal {
  color: #059669;
}

.status-value.status-inactive,
.status-value.status-banned {
  color: #dc2626;
}

.status-value.status-deleted {
  color: #7c3aed;
}

/* 时间信息 */
.time-info {
  display: flex;
  gap: 32px;
  padding-top: 20px;
  border-top: 1px solid #f3f4f6;
}

.time-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.time-label {
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
}

.time-value {
  font-size: 14px;
  color: #111827;
}

/* 统计数据网格 */
.stats-grid,
.coin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 24px;
}

.stat-item,
.coin-item {
  text-align: center;
  padding: 20px 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.stat-number,
.coin-number {
  font-size: 28px;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 8px;
}

.stat-label,
.coin-label {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

/* 信用评价 */
.credit-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.credit-item {
  text-align: center;
  padding: 16px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 8px;
  color: white;
}

.credit-score,
.credit-level {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 6px;
}

.credit-label {
  font-size: 13px;
  opacity: 0.9;
  font-weight: 500;
}

.service-hours {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  padding-top: 20px;
  border-top: 1px solid #f3f4f6;
}

.hours-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hours-label {
  font-size: 14px;
  color: #6b7280;
}

.hours-value {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

/* 状态描述 */
.status-description {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.status-badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.status-badge.status-active {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.status-badge.status-offline {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.status-badge.status-banned {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.status-badge.status-rest {
  background: #fef3c7;
  color: #b45309;
  border: 1px solid #fde68a;
}

/* 错误状态 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.error-icon {
  font-size: 48px;
  color: #f59e0b;
  margin-bottom: 16px;
}

.error-container h3 {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
}

.error-container p {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 24px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .volunteer-detail-page {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .status-grid,
  .credit-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid,
  .coin-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .time-info,
  .service-hours {
    flex-direction: column;
    gap: 16px;
  }
  
  .hours-item {
    justify-content: space-between;
  }
  
  .stats-grid,
  .coin-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .stat-item,
  .coin-item {
    padding: 16px 12px;
  }
  
  .stat-number,
  .coin-number {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .stats-grid,
  .coin-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-item,
  .coin-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
    padding: 12px 16px;
  }
  
  .stat-number,
  .coin-number {
    font-size: 20px;
    margin-bottom: 0;
  }
}
</style>
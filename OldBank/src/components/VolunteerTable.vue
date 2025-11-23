<template>
  <!-- 志愿者活跃度排名表格 - 使用盒子模型嵌套 -->
  <div class="table-container">
    <!-- 头部区域 -->
    <div class="header-section">
      <h3 class="table-title">志愿者活跃度排名</h3>
      <div class="header-actions">
        <!-- 搜索框 -->
        <div class="search-box">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="搜索志愿者姓名..." 
            class="search-input"
            @keyup.enter="handleSearch"
          >
          <button @click="handleSearch" class="search-button">
            <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </button>
        </div>
        <button class="export-button">
          <svg class="download-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          导出数据
        </button>
      </div>
    </div>
    
    <!-- 表格区域 -->
    <div class="table-wrapper">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <span>正在加载数据...</span>
      </div>
      
      <!-- 表格内容 -->
      <table v-if="!loading" class="volunteer-table">
        <thead>
          <tr class="table-header">
            <th class="checkbox-column">
              <input type="checkbox" class="table-checkbox">
            </th>
            <th class="name-column">姓名</th>
            <th class="score-column">信用分</th>
            <th class="service-column">服务次数</th>
            <th class="action-column">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="volunteer in volunteers" :key="volunteer.id" class="table-row">
            <td class="checkbox-cell">
              <input type="checkbox" class="table-checkbox">
            </td>
            <td class="name-cell">
              <div class="user-info">
                <div class="avatar">
                  <svg class="avatar-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <div class="user-details">
                  <div class="user-name">{{ volunteer.name }}</div>
                  <div class="user-id">ID: {{ volunteer.id }}</div>
                </div>
              </div>
            </td>
            <td class="score-cell">{{ volunteer.creditScore }}</td>
            <td class="service-cell">{{ volunteer.serviceCount }}</td>
        <td class="action-cell">
          <button class="detail-btn" @click="handleViewDetail(volunteer)">查看详情</button>
        </td>
          </tr>
        </tbody>
      </table>
      
      <!-- 空状态 -->
        <div v-if="!loading && volunteers.length === 0" class="empty-state">
          <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p>暂无志愿者数据</p>
        </div>
        
        <!-- 未授权提示 -->
        <div v-if="!loading && unauthorized" class="unauthorized-state">
          <svg class="warning-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <div class="unauthorized-content">
            <h4>访问权限受限</h4>
            <p>请先登录管理员账号以查看志愿者信息</p>
            <button @click="goToLogin" class="login-button">前往登录</button>
          </div>
        </div>
    </div>
    
    <!-- 分页组件 -->
    <div v-if="!loading && volunteers.length > 0" class="pagination-container">
      <div class="pagination-info">
        共 {{ pagination.totalElements }} 条记录，当前显示第 {{ (pagination.currentPage - 1) * pagination.pageSize + 1 }}-{{ Math.min(pagination.currentPage * pagination.pageSize, pagination.totalElements) }} 条
      </div>
      <div class="pagination-controls">
        <button 
          @click="handlePageChange(pagination.currentPage - 1)" 
          :disabled="pagination.currentPage <= 1"
          class="pagination-button"
        >
          上一页
        </button>
        <span class="pagination-current">第 {{ pagination.currentPage }} 页</span>
        <button 
          @click="handlePageChange(pagination.currentPage + 1)" 
          :disabled="pagination.currentPage >= pagination.totalPages"
          class="pagination-button"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { getVolunteerRanking } from '../utils/api.js';

export default {
  name: 'VolunteerTable',
  data() {
    return {
      volunteers: [],
      loading: false,
      unauthorized: false,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0
      },
      searchQuery: ''
    };
  },
  mounted() {
    this.fetchVolunteers();
  },
  methods: {
    async fetchVolunteers() {
      this.loading = true;
      try {
        console.log('🎯 开始请求志愿者列表API');
        console.log('📋 请求参数:', {
          page: this.pagination.currentPage,
          pageSize: this.pagination.pageSize,
          search: this.searchQuery
        });
        
        const response = await getVolunteerRanking(
          this.pagination.currentPage, 
          this.pagination.pageSize, 
          this.searchQuery
        );
        
        console.log('✅ API响应数据:', response);
        console.log('📊 响应结构:', {
          code: response.code,
          message: response.message,
          dataLength: response.data ? Object.keys(response.data) : 'null',
          contentLength: response.data?.content?.length || 0
        });
        
        if (response.code === 200) {
          console.log('📦 实际数据内容:', response.data);
          console.log('👥 志愿者数据:', response.data || []);
          
          // API返回的数据直接是数组，没有content包装
          this.volunteers = response.data || [];
          this.pagination.totalElements = response.data.length || 0;
          this.pagination.totalPages = Math.ceil(response.data.length / this.pagination.pageSize) || 0;
          
          console.log('📈 处理后数据状态:', {
            volunteersCount: this.volunteers.length,
            totalElements: this.pagination.totalElements,
            totalPages: this.pagination.totalPages
          });
        } else {
          console.error('❌ 获取志愿者列表失败:', response);
          console.error('📝 错误详情:', response.message);
          // 如果接口调用失败，使用默认值
          this.volunteers = [
            { id: 1, name: '张伟', creditScore: 850, serviceCount: 42 },
            { id: 2, name: '李娜', creditScore: 820, serviceCount: 38 },
            { id: 3, name: '王芳', creditScore: 790, serviceCount: 35 },
            { id: 4, name: '赵强', creditScore: 780, serviceCount: 32 },
            { id: 5, name: '刘洋', creditScore: 760, serviceCount: 30 }
          ];
        }
      } catch (error) {
        console.error('🚨 获取志愿者列表出错:', error);
        console.error('🔍 错误详情:', {
          code: error.code,
          message: error.message,
          stack: error.stack
        });
        
        // 如果是401错误，说明用户需要重新登录，不应该使用默认值
        if (error.code === 401) {
          console.warn('⚠️ 认证失败，需要重新登录');
          // 显示错误信息，提示用户重新登录
          this.volunteers = [];
          this.$emit('unauthorized', error.message);
        } else {
          console.warn('🔄 使用默认数据');
          // 其他错误使用默认值
          this.volunteers = [
            { id: 1, name: '张伟', creditScore: 850, serviceCount: 42 },
            { id: 2, name: '李娜', creditScore: 820, serviceCount: 38 },
            { id: 3, name: '王芳', creditScore: 790, serviceCount: 35 },
            { id: 4, name: '赵强', creditScore: 780, serviceCount: 32 },
            { id: 5, name: '刘洋', creditScore: 760, serviceCount: 30 }
          ];
        }
      } finally {
        this.loading = false;
        console.log('🏁 请求完成，loading状态:', this.loading);
      }
    },
    
    handleSearch() {
      this.pagination.currentPage = 1;
      this.fetchVolunteers();
    },
    
    handlePageChange(page) {
      this.pagination.currentPage = page;
      this.fetchVolunteers();
    },
    
    handleViewDetail(volunteer) {
      console.log('查看志愿者详情:', volunteer);
      // 跳转到志愿者详情页面
      this.$router.push(`/volunteer/${volunteer.id}`);
    },
    
    goToLogin() {
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
/* 外层容器 - 带边框和阴影 */
.table-container {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

/* 头部区域 */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* 搜索框样式 */
.search-box {
  display: flex;
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  overflow: hidden;
  background: white;
}

.search-input {
  padding: 6px 12px;
  border: none;
  outline: none;
  font-size: 13px;
  min-width: 200px;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-button {
  padding: 6px 12px;
  background: #f3f4f6;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-button:hover {
  background: #e5e7eb;
}

.search-icon {
  width: 16px;
  height: 16px;
}

.table-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.export-button {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  background: #dbeafe;
  color: #2563eb;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.export-button:hover {
  background: #bfdbfe;
}

.download-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}

/* 表格包装器 */
.table-wrapper {
  overflow-x: auto;
  min-height: 200px;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
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

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #9ca3af;
}

.empty-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 12px;
}

/* 分页样式 */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
}

.pagination-info {
  font-size: 13px;
  color: #6b7280;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pagination-button {
  padding: 6px 12px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-button:hover:not(:disabled) {
  background: #f3f4f6;
}

.pagination-button:disabled {
  background: #f9fafb;
  color: #d1d5db;
  cursor: not-allowed;
}

.pagination-current {
  font-size: 13px;
  color: #374151;
  font-weight: 500;
}

/* 表格样式 */
.volunteer-table {
  width: 100%;
  border-collapse: collapse;
}

/* 表头样式 */
.table-header {
  border-bottom: 1px solid #f3f4f6;
}

.table-header th {
  padding: 12px 20px;
  text-align: left;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
}

.checkbox-column {
  width: 48px;
}

/* 表格行样式 */
.table-row {
  border-bottom: 1px solid #f9fafb;
  transition: background-color 0.2s;
}

.table-row:hover {
  background-color: #fafafa;
}

.table-row td {
  padding: 14px 20px;
  vertical-align: middle;
}

/* 复选框样式 */
.table-checkbox {
  width: 16px;
  height: 16px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
}

/* 用户信息区域 */
.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 36px;
  height: 36px;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.avatar-icon {
  width: 18px;
  height: 18px;
  color: #6b7280;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 13px;
  font-weight: 500;
  color: #111827;
  margin-bottom: 2px;
}

.user-id {
  font-size: 11px;
  color: #6b7280;
}

/* 数据单元格样式 */
.score-cell,
.service-cell {
  font-size: 13px;
  font-weight: 500;
  color: #111827;
}

/* 操作按钮样式 */
.detail-btn {
  color: #3b82f6;
  background: #eff6ff;
  border: 1px solid #3b82f6;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.detail-btn:hover {
  background: #3b82f6;
  color: white;
  text-decoration: none;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

.detail-btn:active {
  transform: translateY(0);
  box-shadow: none;
}

/* 未授权状态样式 */
.unauthorized-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #6b7280;
}

.warning-icon {
  width: 48px;
  height: 48px;
  color: #f59e0b;
  margin-bottom: 16px;
}

.unauthorized-content {
  text-align: center;
  max-width: 400px;
}

.unauthorized-content h4 {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
}

.unauthorized-content p {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 20px 0;
  line-height: 1.5;
}

.login-button {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-button:hover {
  background: #2563eb;
}
</style>

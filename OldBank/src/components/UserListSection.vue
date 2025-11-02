<!-- 用户列表区 -->
<template>
  <div class="list-section">
    <!-- 搜索和筛选区域 -->
    <div class="filter-section">
      <div class="filter-container">
        <!-- 搜索框 -->
        <div class="search-box">
          <input 
            type="text" 
            placeholder="搜索用户名或手机号..."
            class="search-input"
            v-model="searchQuery"
            @keyup.enter="handleSearchButton"
          >
          <i class="fas fa-search search-icon"></i>
        </div>

        <!-- 过滤器 -->
        <div class="filters">
          <select class="filter-select" v-model="roleFilter">
            <option value="">所有角色</option>
            <option value="管理员">管理员</option>
            <option value="志愿者">志愿者</option>
            <option value="需求者">需求者</option>
          </select>

          <select class="filter-select" v-model="statusFilter">
            <option value="">所有状态</option>
            <option value="活跃">活跃</option>
            <option value="禁用">禁用</option>
            <option value="待审核">待审核</option>
          </select>
        </div>

        <!-- 搜索和重置按钮 -->
        <div class="action-buttons">
          <button class="search-btn" @click="handleSearchButton">
            <i class="fas fa-search"></i>
            搜索
          </button>
          <button class="reset-btn" @click="handleReset">
            <i class="fas fa-redo"></i>
            重置
          </button>
        </div>
      </div>
    </div>

    <div class="list-container">
      <div class="list-header">
        <h3 class="list-title">用户列表</h3>
        <div class="list-info">
          <span class="info-text">共 {{ totalElements || 0 }} 位用户，当前显示 {{ startIndex }}-{{ endIndex }} 位</span>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="user-table">
          <thead>
            <tr>
              <th>用户名</th>
              <th>手机号</th>
              <th>角色</th>
              <th>信誉分</th>
              <th>登录状态</th>
              <th>注册时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in userList" :key="user.id" class="table-row">
              <td class="user-name">{{ user.username || user.name || 'N/A' }}</td>
              <td class="phone-number">{{ user.phone || user.phoneNumber || 'N/A' }}</td>
              <td class="user-role">{{ user.userIdentity || user.role || '普通用户' }}</td>
              <td class="warm-coin">{{ user.warmCoin || user.coin || 0 }}</td>
              <td>
                <span :class="['status-badge', getLoginStatusClass(user.status)]">
                  {{ getLoginStatusText(user.status) }}
                </span>
              </td>
              <td class="register-time">{{ user.registerTime || user.createTime || 'N/A' }}</td>
              <td class="actions">
                <button class="action-btn edit-btn">编辑</button>
                <button class="action-btn disable-btn">禁用</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Element Plus 分页组件 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="totalElements"
          :page-sizes="[9, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getUserList, getUserCount, getUserListWithFilters } from '@/utils/api'

export default {
  name: 'UserListSection',
  data() {
    return {
      userList: [],
      currentPage: 1,
      pageSize: 9,
      totalElements: 0,
      loading: false,
      searchQuery: '',
      roleFilter: '',
      statusFilter: '',
      searchTimer: null
    }
  },
  computed: {
    startIndex() {
      if (this.totalElements === 0) return 0
      return (this.currentPage - 1) * this.pageSize + 1
    },
    endIndex() {
      if (this.totalElements === 0) return 0
      const end = this.currentPage * this.pageSize
      return end > this.totalElements ? this.totalElements : end
    }
  },
  async mounted() {
    await this.fetchUserList()
  },
  methods: {
    // 统一的数据获取方法
    async fetchUserList() {
      this.loading = true
      try {
        // 始终使用带参数的方法，传递空的搜索和筛选参数
        const response = await getUserListWithFilters(
          this.currentPage, 
          this.pageSize,
          this.searchQuery,
          this.roleFilter,
          this.statusFilter
        )
        
        console.log('获取用户列表响应:', response)
        if (response.code === 200) {
          // 根据接口文档修正字段名
          this.userList = response.data.content || []
          
          // 修正后端返回的totalElements问题：如果有搜索或筛选条件，使用实际返回的数据条数
          if (this.hasSearchOrFilter()) {
            // 有搜索条件时，使用实际返回的数据条数作为totalElements
            this.totalElements = this.userList.length
          } else {
            // 没有搜索条件时，使用后端返回的totalElements
            this.totalElements = response.data.totalElements || 0
          }
          
          // 检查当前页码是否超出范围，如果超出则重置到第一页
          const totalPages = Math.ceil(this.totalElements / this.pageSize)
          if (this.currentPage > totalPages && totalPages > 0) {
            this.currentPage = 1
            // 重新获取数据
            await this.fetchUserList()
            return
          }
          
          console.log('更新后的用户列表:', this.userList)
          console.log('更新后的分页数据:', { currentPage: this.currentPage, pageSize: this.pageSize, totalElements: this.totalElements })
        }
      } catch (error) {
        console.error('获取用户列表失败:', error)
        
        // 如果是401错误，跳转到登录页
        if (error.code === 401) {
          alert('登录已过期，请重新登录')
          this.$router.push('/login')
          return
        }
        
        // 其他错误显示空数据
        this.userList = []
        this.totalElements = 0
      } finally {
        this.loading = false
      }
    },
    
    // Element Plus 分页事件处理
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.currentPage = 1 // 重置到第一页
      this.fetchUserList()
    },
    
    handleCurrentChange(newPage) {
      this.currentPage = newPage
      this.fetchUserList()
    },
    
    getLoginStatusText(status) {
      if (status === -1) return '从未登录'
      if (status === 0) return '今天登录'
      if (status === 1) return '1天前登录'
      if (status === 7) return '7天前登录'
      if (status === 30) return '30天前登录'
      if (status === 365) return '365天前登录'
      return `${status}天前登录`
    },
    
    getLoginStatusClass(status) {
      if (status === -1) return 'status-never-login'
      if (status === 0) return 'status-today-login'
      if (status <= 7) return 'status-recent-login'
      if (status <= 30) return 'status-month-login'
      return 'status-long-time-login'
    },
    
    // 检查是否有搜索或筛选条件
    hasSearchOrFilter() {
      return this.searchQuery.trim() !== '' || this.roleFilter !== '' || this.statusFilter !== ''
    },
    
    handleSearchButton() {
      // 重置到第一页进行搜索
      this.currentPage = 1
      this.fetchUserList()
    },
    
    handleReset() {
      // 重置所有筛选条件
      this.searchQuery = ''
      this.roleFilter = ''
      this.statusFilter = ''
      
      // 重置到第一页并重新获取数据
      this.currentPage = 1
      this.fetchUserList()
    }
  }
}
</script>

<style scoped>
.filter-section {
  margin-bottom: 24px;
}

.filter-container {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f9fafb;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 14px;
}

.filters {
  display: flex;
  gap: 12px;
}

.filter-select {
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background-color: white;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-select:hover {
  border-color: #9ca3af;
}

/* 搜索和重置按钮样式 */
.action-buttons {
  display: flex;
  gap: 8px;
}

.search-btn, .reset-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 80px;
  justify-content: center;
  white-space: nowrap;
}

.search-btn {
  background-color: #3b82f6;
  color: white;
}

.search-btn:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
}

.reset-btn {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.reset-btn:hover {
  background-color: #e5e7eb;
  border-color: #9ca3af;
  transform: translateY(-1px);
}

/* 搜索和重置按钮样式 */
.action-buttons {
  display: flex;
  gap: 8px;
}

.search-btn, .reset-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 80px;
  justify-content: center;
  white-space: nowrap;
}

.search-btn {
  background-color: #3b82f6;
  color: white;
}

.search-btn:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
}

.reset-btn {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.reset-btn:hover {
  background-color: #e5e7eb;
  border-color: #9ca3af;
  transform: translateY(-1px);
}

.list-section {
  margin-bottom: 24px;
}

.list-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.list-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.info-text {
  font-size: 14px;
  color: #64748b;
}

.table-wrapper {
  overflow-x: auto;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
}

.user-table th {
  background-color: #f8fafc;
  padding: 16px 20px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px solid #e2e8f0;
}

.table-row {
  transition: all 0.2s ease;
}

.table-row:hover {
  background-color: #f8fafc;
}

.user-table td {
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
  color: #374151;
}

.user-name {
  font-weight: 500;
  color: #1e293b;
}

.phone-number {
  color: #64748b;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  display: inline-block;
  min-width: 60px;
}

/* 登录状态样式 */
.status-never-login {
  background-color: #f3f4f6;
  color: #6b7280;
}

.status-today-login {
  background-color: #dcfce7;
  color: #166534;
}

.status-recent-login {
  background-color: #dbeafe;
  color: #1e40af;
}

.status-month-login {
  background-color: #fef3c7;
  color: #92400e;
}

.status-long-time-login {
  background-color: #fee2e2;
  color: #991b1b;
}

.actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-btn {
  background-color: #3b82f6;
  color: white;
}

.edit-btn:hover {
  background-color: #2563eb;
}

.enable-btn {
  background-color: #10b981;
  color: white;
}

.enable-btn:hover {
  background-color: #059669;
}

.disable-btn {
  background-color: #ef4444;
  color: white;
}

.disable-btn:hover {
  background-color: #dc2626;
}

/* Element Plus 分页样式 */
.pagination-container {
  padding: 20px 24px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: center;
}

/* 自定义 Element Plus 分页样式 */
.pagination-container :deep(.el-pagination) {
  justify-content: center;
}

.pagination-container :deep(.el-pagination .btn-prev),
.pagination-container :deep(.el-pagination .btn-next) {
  border: 1px solid #d1d5db;
  border-radius: 6px;
}

.pagination-container :deep(.el-pagination .el-pager li) {
  border: 1px solid #d1d5db;
  border-radius: 6px;
  margin: 0 4px;
}

.pagination-container :deep(.el-pagination .el-pager li.active) {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.pagination-container :deep(.el-pagination .el-pager li:hover) {
  border-color: #9ca3af;
}

.pagination-container :deep(.el-pagination .el-pager li.active:hover) {
  background-color: #2563eb;
  border-color: #2563eb;
}

@media (max-width: 768px) {
  .list-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .user-table {
    font-size: 12px;
  }
  
  .user-table th,
  .user-table td {
    padding: 12px 16px;
  }
  
  .actions {
    flex-direction: column;
    gap: 4px;
  }
  
  .pagination-container :deep(.el-pagination) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px;
  }
  
  .pagination-container :deep(.el-pagination .el-pager) {
    order: -1;
    width: 100%;
    justify-content: center;
    margin-bottom: 8px;
  }
}
</style>

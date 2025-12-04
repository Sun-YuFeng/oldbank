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
          <i class="fa fa-search search-icon"></i>
        </div>

        <!-- 过滤器 -->
        <div class="filters">
          <select class="filter-select" v-model="roleFilter">
            <option value="">所有角色</option>
            <option 
              v-for="role in roleOptions" 
              :key="role.value" 
              :value="role.value"
              :title="role.description"
            >
              {{ role.label }}
            </option>
          </select>

          <select class="filter-select" v-model="statusFilter">
            <option value="">所有状态</option>
            <option 
              v-for="status in statusOptions" 
              :key="status.value" 
              :value="status.value"
              :title="status.description"
            >
              {{ status.label }}
            </option>
          </select>
        </div>

        <!-- 搜索和重置按钮 -->
        <div class="action-buttons">
          <button class="search-btn" @click="handleSearchButton">
            <i class="fa fa-search"></i>
            <span>搜索</span>
          </button>
          <button class="reset-btn" @click="handleReset">
            <i class="fa fa-undo"></i>
            <span>重置</span>
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
              <th>状态</th>
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
                <span :class="['status-badge', getStatusClass(user.status)]">
                  {{ getStatusText(user.status) }}
                </span>
              </td>
              <td class="register-time">{{ user.registerTime || user.createTime || 'N/A' }}</td>
              <td class="actions">
                <button class="action-btn edit-btn" @click="handleViewUserDetail(user)">详情</button>
                <button 
                  v-if="isUserBanned(user.status)"
                  class="action-btn unban-btn"
                  @click="handleUnbanUser(user)"
                >
                  解封
                </button>
                <button 
                  v-else
                  class="action-btn ban-btn"
                  @click="handleBanUser(user)"
                >
                  封禁
                </button>
                <button 
                  class="action-btn delete-btn"
                  @click="handleDeleteUser(user)"
                >
                  删除
                </button>
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

    <!-- 封禁确认弹窗 -->
    <BanConfirmModal
      v-model:visible="banModalVisible"
      :user="selectedUser"
      :action="modalAction"
      @confirm="handleBanConfirm"
      @cancel="handleBanCancel"
    />
  </div>
</template>

<script>
import { getUserList, getUserCount, searchUsers, getUserDetail, getUserFilterOptions, banUser, softDeleteUser } from '@/utils/api'
import BanConfirmModal from './BanConfirmModal.vue'

export default {
  name: 'UserListSection',
  components: {
    BanConfirmModal
  },
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
      searchTimer: null,
      
      // 筛选选项
      roleOptions: [],
      statusOptions: [],
      
      // 封禁相关
      banModalVisible: false,
      selectedUser: null,
      modalAction: 'ban' // 'ban' 或 'unban'
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
    await this.loadFilterOptions()
    await this.fetchUserList()
  },
  methods: {
    // 加载筛选选项
    async loadFilterOptions() {
      try {
        const response = await getUserFilterOptions()
        if (response.code === 200) {
          this.roleOptions = response.data.roles || []
          this.statusOptions = response.data.statuses || []
          console.log('筛选选项加载成功:', { roles: this.roleOptions, statuses: this.statusOptions })
        }
      } catch (error) {
        console.error('加载筛选选项失败:', error)
        // 设置默认选项，避免页面显示空白
        this.roleOptions = [
          { value: 'ELDERLY', label: '需求者', description: '需要帮助的老年人' },
          { value: 'VOLUNTEER', label: '志愿者', description: '提供志愿服务的用户' }
        ]
        this.statusOptions = [
          { value: 'NORMAL', label: '正常', description: '账户状态正常，可以正常使用' },
          { value: 'BANNED', label: '已禁用', description: '账户已被禁用，无法登录和使用' }
        ]
      }
    },
    
    // 统一的数据获取方法
    async fetchUserList() {
      this.loading = true
      try {
        let response
        
        // 统一使用新的用户搜索API
        const searchQuery = this.searchQuery.trim()
        
        // 智能判断：如果输入纯数字且长度≥3，作为手机号搜索；否则作为用户名搜索
        const isPhoneSearch = /^\d+$/.test(searchQuery) && searchQuery.length >= 3
        const isUsernameSearch = !isPhoneSearch || searchQuery.length < 3
        
        response = await searchUsers(
          isUsernameSearch ? searchQuery : '', // username参数
          isPhoneSearch ? searchQuery : '',     // phone参数
          this.roleFilter,                      // role参数
          this.statusFilter,                    // status参数
          this.currentPage,
          this.pageSize
        )
        
        console.log('获取用户列表响应:', response)
        if (response.code === 200) {
          // 根据新API文档修正字段名
          this.userList = response.data.content || []
          
          // 统一使用新API的total字段
          this.totalElements = response.data.total || 0
          
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
    },
    
    // 判断用户是否被封禁
    isUserBanned(status) {
      // 假设状态字段中，"禁用"表示被封禁
      return status === '禁用' || status === 'banned' || status === '封禁'
    },
    
    // 获取状态显示文本
    getStatusText(status) {
      if (this.isUserBanned(status)) {
        return '已封禁'
      }
      if (status === 'active' || status === '活跃') {
        return '活跃'
      }
      if (status === 'pending' || status === '待审核') {
        return '待审核'
      }
      return status || '正常'
    },
    
    // 获取状态样式类
    getStatusClass(status) {
      if (this.isUserBanned(status)) {
        return 'status-banned'
      }
      if (status === 'active' || status === '活跃') {
        return 'status-active'
      }
      if (status === 'pending' || status === '待审核') {
        return 'status-pending'
      }
      return 'status-normal'
    },
    
    // 封禁用户
    handleBanUser(user) {
      this.selectedUser = user
      this.modalAction = 'ban'
      this.banModalVisible = true
    },
    
    // 解封用户
    handleUnbanUser(user) {
      this.selectedUser = user
      this.modalAction = 'unban'
      this.banModalVisible = true
    },
    
    // 删除用户
    handleDeleteUser(user) {
      this.$confirm('确认删除该用户吗？删除后可以恢复。', '删除确认', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await softDeleteUser(user.id, '管理操作')
          this.$message.success('用户删除成功')
          this.fetchUserList() // 刷新列表
        } catch (error) {
          console.error('删除用户失败:', error)
          this.$message.error(error.message || '删除失败')
        }
      }).catch(() => {
        // 用户取消操作
      })
    },
    
    // 封禁确认回调
    handleBanConfirm() {
      this.fetchUserList() // 刷新列表
    },
    
    // 封禁取消回调
    handleBanCancel() {
      this.selectedUser = null
    },
    
    // 查看用户详情
    async handleViewUserDetail(user) {
      try {
        console.log('正在获取用户详情，用户ID:', user.id)
        const response = await getUserDetail(user.id)
        
        if (response.code === 200) {
          const userDetail = response.data
          
          // 创建一个美观的弹窗显示用户详情
          const detailHtml = `
            <div style="max-width: 500px; font-family: Arial, sans-serif;">
              <h3 style="margin-bottom: 20px; color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
                用户详细信息
              </h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 8px 0; font-weight: 600; color: #374151; width: 120px;">用户名：</td>
                  <td style="padding: 8px 0; color: #1e293b;">${userDetail.username || 'N/A'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 8px 0; font-weight: 600; color: #374151;">真实姓名：</td>
                  <td style="padding: 8px 0; color: #1e293b;">${userDetail.realName || 'N/A'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 8px 0; font-weight: 600; color: #374151;">手机号：</td>
                  <td style="padding: 8px 0; color: #1e293b;">${userDetail.phone || 'N/A'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 8px 0; font-weight: 600; color: #374151;">邮箱：</td>
                  <td style="padding: 8px 0; color: #1e293b;">${userDetail.email || 'N/A'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 8px 0; font-weight: 600; color: #374151;">地址：</td>
                  <td style="padding: 8px 0; color: #1e293b;">${userDetail.address || 'N/A'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 8px 0; font-weight: 600; color: #374151;">年龄：</td>
                  <td style="padding: 8px 0; color: #1e293b;">${userDetail.age || 'N/A'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 8px 0; font-weight: 600; color: #374151;">用户身份：</td>
                  <td style="padding: 8px 0; color: #1e293b;">${userDetail.userIdentity || 'N/A'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 8px 0; font-weight: 600; color: #374151;">暖心币：</td>
                  <td style="padding: 8px 0; color: #1e293b;">${userDetail.warmCoin || 0}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 8px 0; font-weight: 600; color: #374151;">状态：</td>
                  <td style="padding: 8px 0;">
                    <span style="padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; 
                      background-color: ${userDetail.banned ? '#fee2e2' : '#dcfce7'}; 
                      color: ${userDetail.banned ? '#991b1b' : '#166534'};">
                      ${userDetail.banned ? '已禁用' : '正常'}
                    </span>
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 8px 0; font-weight: 600; color: #374151;">注册时间：</td>
                  <td style="padding: 8px 0; color: #1e293b;">${userDetail.createTime || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #374151;">最后登录：</td>
                  <td style="padding: 8px 0; color: #1e293b;">${userDetail.lastLoginTime || 'N/A'}</td>
                </tr>
              </table>
              ${userDetail.banned ? `
                <div style="margin-top: 15px; padding: 10px; background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 6px;">
                  <p style="margin: 0; color: #991b1b; font-size: 14px;">
                    <strong>禁用原因：</strong>${userDetail.banReason || '未填写'}
                  </p>
                  ${userDetail.banExpireTime ? `
                    <p style="margin: 5px 0 0 0; color: #991b1b; font-size: 14px;">
                      <strong>禁用到期时间：</strong>${userDetail.banExpireTime}
                    </p>
                  ` : ''}
                </div>
              ` : ''}
            </div>
          `
          
          // 使用 Element Plus 的 MessageBox 显示详情
          this.$msgbox({
            title: '用户详情',
            message: detailHtml,
            dangerouslyUseHTMLString: true,
            showConfirmButton: true,
            confirmButtonText: '确定',
            customClass: 'user-detail-dialog'
          }).catch(() => {
            // 用户点击取消或关闭弹窗
          })
          
        } else {
          this.$message.error(response.message || '获取用户详情失败')
        }
      } catch (error) {
        console.error('获取用户详情失败:', error)
        this.$message.error(error.message || '获取用户详情失败')
      }
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
  gap: 8px;
  min-width: 80px;
  justify-content: center;
  white-space: nowrap;
}

.search-btn i,
.reset-btn i {
  font-size: 14px;
  display: inline-block;
  line-height: 1;
  flex-shrink: 0;
}

.search-btn span,
.reset-btn span {
  display: inline-block;
  line-height: 1;
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

/* 用户状态样式 */
.status-banned {
  background-color: #fee2e2;
  color: #991b1b;
}

.status-active {
  background-color: #dcfce7;
  color: #166534;
}

.status-pending {
  background-color: #fef3c7;
  color: #92400e;
}

.status-normal {
  background-color: #dbeafe;
  color: #1e40af;
}

/* 保留原有的登录状态样式，兼容老代码 */
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

.ban-btn {
  background-color: #f97316;
  color: white;
}

.ban-btn:hover {
  background-color: #ea580c;
}

.unban-btn {
  background-color: #10b981;
  color: white;
}

.unban-btn:hover {
  background-color: #059669;
}

.delete-btn {
  background-color: #ef4444;
  color: white;
}

.delete-btn:hover {
  background-color: #dc2626;
}

/* 保留原有的样式，兼容老代码 */
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

/* 用户详情弹窗样式 */
:deep(.user-detail-dialog) {
  max-width: 600px;
}

:deep(.user-detail-dialog .el-message-box__content) {
  max-height: 500px;
  overflow-y: auto;
}

:deep(.user-detail-dialog table) {
  font-size: 14px;
}

:deep(.user-detail-dialog table td) {
  vertical-align: top;
  line-height: 1.5;
}

:deep(.user-detail-dialog table td:first-child) {
  white-space: nowrap;
}
</style>

<template>
  <div class="complaint-management-container">
    <!-- 面包屑导航 -->
    <div class="breadcrumb-section">
      <nav class="breadcrumb">
        <span class="breadcrumb-item">首页</span>
        <span class="breadcrumb-separator">></span>
        <span class="breadcrumb-item active">用户投诉</span>
      </nav>
    </div>

    <!-- 搜索框 -->
    <div class="search-section">
      <div class="search-container">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索投诉内容、投诉人..."
          class="search-input"
          clearable
          @input="handleSearch"
        >
          <template #append>
            <el-button @click="handleSearch">
              <i class="fa fa-search"></i>
            </el-button>
          </template>
        </el-input>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="5" animated />
    </div>

    <!-- 投诉列表 -->
    <div v-else class="complaint-list">
      <div 
        v-for="complaint in complaintList" 
        :key="complaint.id"
        class="complaint-card"
      >
        <div class="complaint-content">
          <!-- 左侧图片 -->
          <div class="complaint-image">
            <img :src="complaint.image || '/src/assets/background.png'" :alt="complaint.title" />
          </div>
          
          <!-- 中间内容 -->
          <div class="complaint-info">
            <h4 class="complaint-title">{{ complaint.title }}</h4>
            <p class="complaint-description">{{ complaint.description }}</p>
            <div class="complaint-meta">
              <span class="complaint-author">投诉人：{{ complaint.author }}</span>
              <span class="complaint-time">投诉时间：{{ complaint.time }}</span>
              <el-tag 
                :type="getStatusType(complaint.status)"
                size="small"
                class="status-tag"
              >
                {{ getStatusText(complaint.status) }}
              </el-tag>
            </div>
          </div>
          
          <!-- 右侧处理按钮 -->
          <div class="complaint-actions">
            <el-button 
              type="primary"
              @click="handleComplaint(complaint.id)"
              :disabled="complaint.status === 'resolved'"
            >
              {{ complaint.status === 'resolved' ? '已处理' : '处理' }}
            </el-button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="complaintList.length === 0" class="empty-state">
        <el-empty description="暂无投诉数据" />
      </div>
    </div>

    <!-- ElementUI分页组件 -->
    <div class="pagination-container" v-if="total > pageSize">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { getComplaintList } from '@/utils/api'
import { ElMessage } from 'element-plus'

export default {
  name: 'ComplaintManagementPage',
  data() {
    return {
      searchKeyword: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      complaintList: [],
      loading: false,
      searchTimer: null
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.total / this.pageSize)
    }
  },
  mounted() {
    this.fetchComplaintList()
  },
  methods: {
    // 获取投诉列表
    async fetchComplaintList() {
      this.loading = true
      try {
        const response = await getComplaintList(this.currentPage, this.pageSize, this.searchKeyword)
        
        if (response.code === 200) {
          // 适配后端返回的数据结构
          this.complaintList = response.data.content || []
          this.total = response.data.totalElements || 0
        } else {
          ElMessage.error(response.message || '获取投诉列表失败')
        }
      } catch (error) {
        console.error('获取投诉列表失败:', error)
        ElMessage.error('获取投诉列表失败，请检查网络连接')
        // 开发环境下使用模拟数据
        if (import.meta.env.DEV) {
          this.useMockData()
        }
      } finally {
        this.loading = false
      }
    },

    // 开发环境下的模拟数据
    useMockData() {
      this.complaintList = [
        {
          id: 1,
          title: '服务态度差',
          description: '志愿者服务态度非常差，对老人不尊重，希望加强培训',
          author: '张大爷',
          time: '2025-08-20 14:30',
          image: '/src/assets/background.png',
          status: 'pending'
        },
        {
          id: 2,
          title: '任务完成不及时',
          description: '志愿者承诺完成任务但迟迟未完成，影响正常生活',
          author: '李阿姨',
          time: '2025-08-19 09:15',
          image: '/src/assets/background.png',
          status: 'resolved'
        }
      ]
      this.total = 2
    },

    // 处理搜索
    handleSearch() {
      // 防抖处理，避免频繁请求
      if (this.searchTimer) {
        clearTimeout(this.searchTimer)
      }
      
      this.searchTimer = setTimeout(() => {
        this.currentPage = 1
        this.fetchComplaintList()
      }, 500)
    },

    // 处理投诉
    handleComplaint(id) {
      this.$router.push(`/complaint-management/${id}`)
    },

    // 分页大小改变
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.currentPage = 1
      this.fetchComplaintList()
    },

    // 当前页改变
    handleCurrentChange(newPage) {
      this.currentPage = newPage
      this.fetchComplaintList()
    },

    // 获取状态类型
    getStatusType(status) {
      const statusMap = {
        'pending': 'warning',
        'resolved': 'success'
      }
      return statusMap[status] || 'info'
    },

    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        'pending': '待处理',
        'resolved': '已处理'
      }
      return statusMap[status] || '未知'
    }
  }
}
</script>

<style scoped>
.complaint-management-container {
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

.search-section {
  margin-bottom: 24px;
}

.search-container {
  max-width: 400px;
}

.loading-container {
  margin: 20px 0;
}

.complaint-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.complaint-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  transition: transform 0.2s ease;
}

.complaint-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.complaint-content {
  display: flex;
  padding: 20px;
  gap: 16px;
  align-items: center;
}

.complaint-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.complaint-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.complaint-info {
  flex: 1;
  min-width: 0;
}

.complaint-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

.complaint-description {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.complaint-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #94a3b8;
  align-items: center;
}

.status-tag {
  margin-left: 8px;
}

.complaint-actions {
  flex-shrink: 0;
}

.empty-state {
  margin: 40px 0;
}

/* ElementUI分页样式 */
.pagination-container {
  margin-top: 24px;
  padding: 20px 0;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .complaint-management-container {
    padding: 16px;
  }
  
  .complaint-content {
    flex-direction: column;
    padding: 16px;
  }
  
  .complaint-image {
    width: 100%;
    height: 120px;
  }
  
  .complaint-meta {
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;
  }
  
  .status-tag {
    margin-left: 0;
    margin-top: 4px;
  }
}
</style>
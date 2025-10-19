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
        <input 
          type="text" 
          v-model="searchKeyword"
          placeholder="搜索投诉内容、投诉人..."
          class="search-input"
        />
        <button class="search-button">
          <i class="fa fa-search"></i>
        </button>
      </div>
    </div>

    <!-- 投诉列表 -->
    <div class="complaint-list">
      <div 
        v-for="complaint in filteredComplaints" 
        :key="complaint.id"
        class="complaint-card"
      >
        <div class="complaint-content">
          <!-- 左侧图片 -->
          <div class="complaint-image">
            <img :src="complaint.image" :alt="complaint.title" />
          </div>
          
          <!-- 中间内容 -->
          <div class="complaint-info">
            <h4 class="complaint-title">{{ complaint.title }}</h4>
            <p class="complaint-description">{{ complaint.description }}</p>
            <div class="complaint-meta">
              <span class="complaint-author">投诉人：{{ complaint.author }}</span>
              <span class="complaint-time">投诉时间：{{ complaint.time }}</span>
            </div>
          </div>
          
          <!-- 右侧处理按钮 -->
          <div class="complaint-actions">
            <button 
              class="handle-button"
              @click="handleComplaint(complaint.id)"
            >
              处理
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页组件 -->
    <div class="pagination-container" v-if="totalPages > 1">
      <div class="pagination">
        <button 
          class="pagination-btn" 
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          上一页
        </button>
        
        <div class="page-numbers">
          <button 
            v-for="page in totalPages" 
            :key="page"
            :class="['page-btn', { active: page === currentPage }]"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
        </div>
        
        <button 
          class="pagination-btn" 
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComplaintManagementPage',
  data() {
    return {
      searchKeyword: '',
      currentPage: 1,
      pageSize: 10,
      complaints: [
        {
          id: 1,
          title: '服务态度差',
          description: '志愿者服务态度非常差，对老人不尊重，希望加强培训',
          author: '张大爷',
          time: '2025-08-20 14:30',
          image: '/src/assets/background.png'
        },
        {
          id: 2,
          title: '任务完成不及时',
          description: '志愿者承诺完成任务但迟迟未完成，影响正常生活',
          author: '李阿姨',
          time: '2025-08-19 09:15',
          image: '/src/assets/background.png'
        },
        {
          id: 3,
          title: '设备损坏',
          description: '社区提供的助老设备损坏严重，需要维修',
          author: '王叔叔',
          time: '2025-08-18 16:45',
          image: '/src/assets/background.png'
        },
        {
          id: 4,
          title: '积分计算错误',
          description: '完成任务后积分计算有误，少计算了20分',
          author: '赵奶奶',
          time: '2025-08-17 11:20',
          image: '/src/assets/background.png'
        },
        {
          id: 5,
          title: '系统登录问题',
          description: '无法正常登录系统，提示密码错误但密码正确',
          author: '钱爷爷',
          time: '2025-08-16 13:10',
          image: '/src/assets/background.png'
        },
        {
          id: 6,
          title: '任务分配不公',
          description: '任务分配存在明显偏向，部分志愿者任务过多',
          author: '孙阿姨',
          time: '2025-08-15 10:05',
          image: '/src/assets/background.png'
        },
        {
          id: 7,
          title: '信息更新延迟',
          description: '个人信息更新后系统显示延迟，影响使用',
          author: '周叔叔',
          time: '2025-08-14 15:30',
          image: '/src/assets/background.png'
        },
        {
          id: 8,
          title: '通知未收到',
          description: '重要系统通知未收到，错过重要活动',
          author: '吴大爷',
          time: '2025-08-13 08:45',
          image: '/src/assets/background.png'
        },
        {
          id: 9,
          title: '积分兑换问题',
          description: '积分兑换商品时系统卡顿，无法完成兑换',
          author: '郑奶奶',
          time: '2025-08-12 14:20',
          image: '/src/assets/background.png'
        },
        {
          id: 10,
          title: '志愿者培训不足',
          description: '新志愿者培训不足，服务过程中出现问题',
          author: '冯阿姨',
          time: '2025-08-11 11:15',
          image: '/src/assets/background.png'
        }
      ]
    }
  },
  computed: {
    filteredComplaints() {
      let filtered = this.complaints
      
      // 搜索过滤
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase()
        filtered = filtered.filter(complaint => 
          complaint.title.toLowerCase().includes(keyword) ||
          complaint.description.toLowerCase().includes(keyword) ||
          complaint.author.toLowerCase().includes(keyword)
        )
      }
      
      // 分页
      const startIndex = (this.currentPage - 1) * this.pageSize
      const endIndex = startIndex + this.pageSize
      return filtered.slice(startIndex, endIndex)
    },
    totalPages() {
      return Math.ceil(this.complaints.length / this.pageSize)
    }
  },
  methods: {
    handleComplaint(id) {
      this.$router.push(`/complaint-management/${id}`)
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
      }
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
  display: flex;
  max-width: 400px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: none;
  outline: none;
  font-size: 14px;
}

.search-button {
  padding: 12px 16px;
  background: #3b82f6;
  border: none;
  color: white;
  cursor: pointer;
  transition: background 0.2s ease;
}

.search-button:hover {
  background: #2563eb;
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
}

.complaint-actions {
  flex-shrink: 0;
}

.handle-button {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.handle-button:hover {
  background: #2563eb;
}

/* 分页样式 */
.pagination-container {
  margin-top: 24px;
  padding: 20px 0;
  display: flex;
  justify-content: center;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-btn {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.pagination-btn:disabled {
  color: #9ca3af;
  cursor: not-allowed;
  background: #f9fafb;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.page-btn {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 40px;
}

.page-btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.page-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
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
  }
  
  .pagination {
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px;
  }
  
  .page-numbers {
    order: -1;
    width: 100%;
    justify-content: center;
    margin-bottom: 8px;
  }
}
</style>
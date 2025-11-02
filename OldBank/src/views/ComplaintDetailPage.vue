<template>
  <div class="complaint-detail-container">
    <!-- 面包屑导航 -->
    <div class="breadcrumb-section">
      <nav class="breadcrumb">
        <span class="breadcrumb-item" @click="$router.push('/complaint-management')" style="cursor: pointer;">
          用户投诉
        </span>
        <span class="breadcrumb-separator">></span>
        <span class="breadcrumb-item active">投诉详情</span>
      </nav>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>

    <!-- 投诉详情内容 -->
    <div v-else-if="complaintDetail" class="complaint-detail-content">
      <!-- 基本信息卡片 -->
      <el-card class="info-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">投诉基本信息</span>
            <el-tag :type="getStatusType(complaintDetail.status)" size="small">
              {{ getStatusText(complaintDetail.status) }}
            </el-tag>
          </div>
        </template>

        <div class="info-grid">
          <div class="info-item">
            <label class="info-label">投诉标题：</label>
            <span class="info-value">{{ complaintDetail.title }}</span>
          </div>
          
          <div class="info-item">
            <label class="info-label">投诉人：</label>
            <span class="info-value">{{ complaintDetail.author }}</span>
          </div>
          
          <div class="info-item">
            <label class="info-label">联系电话：</label>
            <span class="info-value">{{ complaintDetail.phone || '未提供' }}</span>
          </div>
          
          <div class="info-item">
            <label class="info-label">投诉时间：</label>
            <span class="info-value">{{ complaintDetail.time }}</span>
          </div>
        </div>
      </el-card>

      <!-- 投诉内容卡片 -->
      <el-card class="content-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">投诉内容</span>
          </div>
        </template>
        
        <div class="complaint-description">
          {{ complaintDetail.description }}
        </div>
      </el-card>

      <!-- 图片证据 -->
      <el-card v-if="complaintDetail.images && complaintDetail.images.length > 0" class="images-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">相关图片</span>
          </div>
        </template>
        
        <div class="images-container">
          <div 
            v-for="(image, index) in complaintDetail.images" 
            :key="index"
            class="image-item"
          >
            <el-image 
              :src="image" 
              :preview-src-list="complaintDetail.images"
              fit="cover"
              class="complaint-image"
            >
              <template #error>
                <div class="image-error">
                  <i class="fa fa-image"></i>
                  <span>图片加载失败</span>
                </div>
              </template>
            </el-image>
          </div>
        </div>
      </el-card>

      <!-- 处理信息（已处理时显示） -->
      <el-card v-if="complaintDetail.status === 'resolved'" class="handle-info-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">处理信息</span>
          </div>
        </template>
        
        <div class="handle-info-grid">
          <div class="info-item">
            <label class="info-label">处理人：</label>
            <span class="info-value">{{ complaintDetail.handler || '系统管理员' }}</span>
          </div>
          
          <div class="info-item">
            <label class="info-label">处理时间：</label>
            <span class="info-value">{{ complaintDetail.handleTime }}</span>
          </div>
          
          <div class="info-item full-width">
            <label class="info-label">处理结果：</label>
            <div class="handle-result">
              {{ complaintDetail.result }}
            </div>
          </div>
        </div>
      </el-card>

      <!-- 处理投诉表单（待处理时显示） -->
      <el-card v-if="complaintDetail.status === 'pending'" class="handle-form-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">处理投诉</span>
          </div>
        </template>
        
        <el-form 
          ref="handleFormRef"
          :model="handleForm"
          :rules="handleFormRules"
          label-width="100px"
        >
          <el-form-item label="处理结果" prop="result">
            <el-input
              v-model="handleForm.result"
              type="textarea"
              :rows="4"
              placeholder="请输入处理结果和说明..."
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
          
          <el-form-item>
            <el-button 
              type="primary" 
              @click="handleSubmit"
              :loading="submitting"
            >
              提交处理结果
            </el-button>
            <el-button @click="$router.back()">
              返回列表
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button @click="$router.back()">
          返回列表
        </el-button>
        <el-button 
          v-if="complaintDetail.status === 'resolved'"
          type="primary"
          @click="handleReopen"
        >
          重新打开
        </el-button>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else class="error-container">
      <el-result icon="error" title="加载失败" :sub-title="errorMessage">
        <template #extra>
          <el-button type="primary" @click="fetchComplaintDetail">
            重新加载
          </el-button>
          <el-button @click="$router.back()">
            返回列表
          </el-button>
        </template>
      </el-result>
    </div>
  </div>
</template>

<script>
import { getComplaintDetail, handleComplaint } from '@/utils/api'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'ComplaintDetailPage',
  data() {
    return {
      loading: false,
      submitting: false,
      complaintDetail: null,
      errorMessage: '',
      handleForm: {
        result: ''
      },
      handleFormRules: {
        result: [
          { required: true, message: '请输入处理结果', trigger: 'blur' },
          { min: 10, message: '处理结果至少需要10个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    complaintId() {
      return this.$route.params.id
    }
  },
  mounted() {
    this.fetchComplaintDetail()
  },
  methods: {
    // 获取投诉详情
    async fetchComplaintDetail() {
      this.loading = true
      this.errorMessage = ''
      
      try {
        const response = await getComplaintDetail(this.complaintId)
        
        if (response.code === 200) {
          this.complaintDetail = response.data
        } else {
          this.errorMessage = response.message || '获取投诉详情失败'
          ElMessage.error(this.errorMessage)
        }
      } catch (error) {
        console.error('获取投诉详情失败:', error)
        this.errorMessage = error.message || '获取投诉详情失败，请检查网络连接'
        
        // 开发环境下使用模拟数据
        if (import.meta.env.DEV) {
          this.useMockData()
        } else {
          ElMessage.error(this.errorMessage)
        }
      } finally {
        this.loading = false
      }
    },

    // 开发环境下的模拟数据
    useMockData() {
      this.complaintDetail = {
        id: parseInt(this.complaintId),
        title: '志愿者服务态度差',
        description: '服务过程中态度恶劣，不耐烦，对老人不尊重。志愿者在服务过程中频繁看手机，对老人的需求回应不及时，态度冷漠。',
        author: '张三',
        phone: '13800138000',
        time: '2024-01-15 10:30:00',
        images: [
          'http://example.com/image1.jpg',
          'http://example.com/image2.jpg'
        ],
        status: 'pending',
        handler: '',
        handleTime: '',
        result: ''
      }
    },

    // 提交处理结果
    async handleSubmit() {
      // 验证表单
      try {
        await this.$refs.handleFormRef.validate()
      } catch (error) {
        ElMessage.warning('请完善处理结果信息')
        return
      }

      this.submitting = true
      
      try {
        const response = await handleComplaint(
          this.complaintId, 
          this.handleForm.result,
          '当前管理员'
        )
        
        if (response.code === 200) {
          ElMessage.success('投诉处理成功')
          // 重新加载详情数据
          await this.fetchComplaintDetail()
        } else {
          ElMessage.error(response.message || '处理投诉失败')
        }
      } catch (error) {
        console.error('处理投诉失败:', error)
        ElMessage.error(error.message || '处理投诉失败，请检查网络连接')
      } finally {
        this.submitting = false
      }
    },

    // 重新打开投诉
    async handleReopen() {
      try {
        await ElMessageBox.confirm(
          '确定要重新打开这个投诉吗？',
          '确认操作',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        
        // 这里可以调用重新打开投诉的API
        ElMessage.success('投诉已重新打开')
        // 重新加载详情数据
        await this.fetchComplaintDetail()
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('操作失败')
        }
      }
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
.complaint-detail-container {
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
  cursor: pointer;
}

.breadcrumb-item:hover {
  color: #3b82f6;
}

.breadcrumb-item.active {
  color: #1e293b;
  font-weight: 500;
  cursor: default;
}

.breadcrumb-separator {
  margin: 0 8px;
  color: #cbd5e1;
}

.loading-container {
  margin: 40px 0;
}

.complaint-detail-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card,
.content-card,
.images-card,
.handle-info-card,
.handle-form-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  min-height: 32px;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-label {
  font-weight: 500;
  color: #64748b;
  min-width: 80px;
}

.info-value {
  color: #1e293b;
  flex: 1;
}

.complaint-description {
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
  white-space: pre-wrap;
}

.images-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.image-item {
  width: 100%;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
}

.complaint-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-error {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f1f5f9;
  color: #64748b;
  font-size: 14px;
}

.handle-info-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.handle-result {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 12px;
  font-size: 14px;
  color: #475569;
  line-height: 1.5;
  white-space: pre-wrap;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.error-container {
  margin: 40px 0;
}

@media (max-width: 768px) {
  .complaint-detail-container {
    padding: 16px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .images-container {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>
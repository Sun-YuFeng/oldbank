<template>
  <div class="complaint-detail-container">
    <!-- 面包屑导航 -->
    <div class="breadcrumb-section">
      <nav class="breadcrumb">
        <span class="breadcrumb-item">首页</span>
        <span class="breadcrumb-separator">></span>
        <span class="breadcrumb-item" @click="$router.push('/complaint-management')">用户投诉</span>
        <span class="breadcrumb-separator">></span>
        <span class="breadcrumb-item active">投诉ID: {{ complaint.id }}</span>
      </nav>
    </div>

    <!-- 投诉详情内容 -->
    <div class="complaint-detail-content">
      <!-- 投诉基本信息 -->
      <div class="complaint-header">
        <h1 class="complaint-title">{{ complaint.title }}</h1>
        <div class="complaint-meta">
          <span class="complaint-author">投诉人：{{ complaint.author }}</span>
          <span class="complaint-time">投诉时间：{{ complaint.time }}</span>
          <span :class="['status-badge', getStatusClass(complaint.status)]">
            {{ complaint.status }}
          </span>
        </div>
      </div>

      <!-- 投诉内容 -->
      <div class="complaint-body">
        <div class="section">
          <h3 class="section-title">投诉内容</h3>
          <p class="complaint-description">{{ complaint.description }}</p>
        </div>

        <!-- 投诉图片 -->
        <div class="section" v-if="complaint.images && complaint.images.length > 0">
          <h3 class="section-title">相关图片</h3>
          <div class="image-gallery">
            <div 
              v-for="(image, index) in complaint.images" 
              :key="index"
              class="image-item"
            >
              <img :src="image" :alt="`投诉图片${index + 1}`" />
            </div>
          </div>
        </div>

        <!-- 投诉详情 -->
        <div class="section" v-if="complaint.details">
          <h3 class="section-title">详细描述</h3>
          <p class="complaint-details">{{ complaint.details }}</p>
        </div>
      </div>

      <!-- 处理区域 -->
      <div class="handling-section">
        <h3 class="section-title">投诉处理</h3>
        
        <!-- 处理表单 -->
        <div class="handling-form">
          <div class="form-group">
            <label class="form-label">处理结果</label>
            <select v-model="handlingResult" class="form-select">
              <option value="">请选择处理结果</option>
              <option value="已处理">已处理</option>
              <option value="处理中">处理中</option>
              <option value="无法处理">无法处理</option>
              <option value="需要进一步调查">需要进一步调查</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">处理说明</label>
            <textarea 
              v-model="handlingDescription"
              placeholder="请输入处理说明..."
              class="form-textarea"
              rows="4"
            ></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">处理人</label>
            <input 
              type="text" 
              v-model="handler"
              placeholder="请输入处理人姓名"
              class="form-input"
            />
          </div>

          <div class="form-actions">
            <button 
              class="submit-button"
              @click="submitHandling"
              :disabled="!canSubmit"
            >
              提交处理
            </button>
            <button 
              class="cancel-button"
              @click="$router.push('/complaint-management')"
            >
              返回列表
            </button>
          </div>
        </div>

        <!-- 处理历史 -->
        <div class="handling-history" v-if="handlingHistory.length > 0">
          <h4 class="history-title">处理历史</h4>
          <div 
            v-for="(record, index) in handlingHistory" 
            :key="index"
            class="history-record"
          >
            <div class="record-header">
              <span class="record-result">{{ record.result }}</span>
              <span class="record-time">{{ record.time }}</span>
            </div>
            <p class="record-description">{{ record.description }}</p>
            <p class="record-handler">处理人：{{ record.handler }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComplaintDetailPage',
  data() {
    return {
      complaint: {
        id: 1,
        title: '服务态度差',
        description: '志愿者服务态度非常差，对老人不尊重，希望加强培训',
        details: '具体描述：志愿者在服务过程中表现出不耐烦的态度，对老人的问题回答敷衍，甚至出现言语不尊重的情况。希望系统能够加强对志愿者的培训和管理。',
        author: '张大爷',
        time: '2025-08-20 14:30',
        status: '待处理',
        images: [
          '/src/assets/background.png',
          '/src/assets/background.png'
        ]
      },
      handlingResult: '',
      handlingDescription: '',
      handler: '',
      handlingHistory: [
        {
          result: '处理中',
          description: '已联系相关志愿者了解情况',
          handler: '管理员A',
          time: '2025-08-21 09:00'
        }
      ]
    }
  },
  computed: {
    canSubmit() {
      return this.handlingResult && this.handlingDescription && this.handler
    }
  },
  methods: {
    getStatusClass(status) {
      const statusMap = {
        '待处理': 'status-pending',
        '处理中': 'status-processing',
        '已处理': 'status-resolved',
        '无法处理': 'status-cancelled'
      }
      return statusMap[status] || 'status-default'
    },
    submitHandling() {
      if (!this.canSubmit) return
      
      // 添加处理记录
      const newRecord = {
        result: this.handlingResult,
        description: this.handlingDescription,
        handler: this.handler,
        time: new Date().toLocaleString('zh-CN')
      }
      
      this.handlingHistory.unshift(newRecord)
      
      // 更新投诉状态
      this.complaint.status = this.handlingResult
      
      // 清空表单
      this.handlingResult = ''
      this.handlingDescription = ''
      this.handler = ''
      
      alert('处理结果提交成功！')
    }
  },
  mounted() {
    // 从路由参数获取投诉ID
    const complaintId = this.$route.params.id
    // 这里可以根据ID从API获取具体的投诉数据
    console.log('加载投诉详情，ID:', complaintId)
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

.breadcrumb-item.active {
  color: #1e293b;
  font-weight: 500;
  cursor: default;
}

.breadcrumb-item:not(.active):hover {
  color: #3b82f6;
  text-decoration: underline;
}

.breadcrumb-separator {
  margin: 0 8px;
  color: #cbd5e1;
}

.complaint-detail-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.complaint-header {
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.complaint-title {
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
}

.complaint-meta {
  display: flex;
  gap: 24px;
  align-items: center;
  font-size: 14px;
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

.status-pending {
  background-color: #fef3c7;
  color: #d97706;
}

.status-processing {
  background-color: #dbeafe;
  color: #1d4ed8;
}

.status-resolved {
  background-color: #dcfce7;
  color: #166534;
}

.status-cancelled {
  background-color: #fee2e2;
  color: #dc2626;
}

.complaint-body {
  padding: 24px;
}

.section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e2e8f0;
}

.complaint-description,
.complaint-details {
  font-size: 16px;
  line-height: 1.6;
  color: #374151;
}

.image-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.image-item {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.image-item img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.handling-section {
  padding: 24px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

.handling-form {
  background: white;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
}

.form-select,
.form-input,
.form-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.form-select:focus,
.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.submit-button {
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.submit-button:hover:not(:disabled) {
  background: #2563eb;
}

.submit-button:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.cancel-button {
  padding: 12px 24px;
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.cancel-button:hover {
  background: #4b5563;
}

.handling-history {
  background: white;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.history-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
}

.history-record {
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  margin-bottom: 12px;
  background: #f8fafc;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.record-result {
  font-weight: 500;
  color: #1e293b;
}

.record-time {
  font-size: 12px;
  color: #64748b;
}

.record-description {
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
  margin-bottom: 8px;
}

.record-handler {
  font-size: 12px;
  color: #64748b;
}

@media (max-width: 768px) {
  .complaint-detail-container {
    padding: 16px;
  }
  
  .complaint-header {
    padding: 16px;
  }
  
  .complaint-title {
    font-size: 20px;
  }
  
  .complaint-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .complaint-body,
  .handling-section {
    padding: 16px;
  }
  
  .image-gallery {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .submit-button,
  .cancel-button {
    width: 100%;
  }
}
</style>
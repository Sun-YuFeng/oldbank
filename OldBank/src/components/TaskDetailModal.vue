<!-- 任务详情弹窗组件 -->
<template>
  <div v-if="visible" class="modal-overlay" @click="handleClose">
    <div class="modal-container" @click.stop>
      <!-- 弹窗头部 -->
      <div class="modal-header">
        <h3 class="modal-title">任务详情</h3>
        <button class="close-btn" @click="handleClose">
          <span>×</span>
        </button>
      </div>

      <!-- 弹窗内容 -->
      <div class="modal-content">
        <div v-if="loading" class="loading-container">
          <span>加载中...</span>
        </div>
        
        <div v-else-if="error" class="error-container">
          <span class="error-text">{{ error }}</span>
          <button class="retry-btn" @click="loadTaskDetail">重试</button>
        </div>
        
        <div v-else-if="taskDetail" class="task-detail">
          <!-- 基本信息 -->
          <div class="detail-section">
            <h4 class="section-title">基本信息</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <label>任务ID：</label>
                <span>{{ taskDetail.id }}</span>
              </div>
              <div class="detail-item">
                <label>任务标题：</label>
                <span>{{ taskDetail.title }}</span>
              </div>
              <div class="detail-item">
                <label>发布人：</label>
                <span>{{ taskDetail.publisherName }}</span>
              </div>
              <div class="detail-item">
                <label>发布人电话：</label>
                <span>{{ taskDetail.publisherPhone }}</span>
              </div>
              <div class="detail-item">
                <label>暖币：</label>
                <span>{{ taskDetail.warmCoin }}</span>
              </div>
              <div class="detail-item">
                <label>任务类型：</label>
                <span>{{ getTaskTypeText(taskDetail.type) }}</span>
              </div>
              <div class="detail-item">
                <label>任务状态：</label>
                <span :class="getStatusClass(taskDetail.statusCode)">{{ taskDetail.status }}</span>
              </div>
              <div class="detail-item">
                <label>服务地址：</label>
                <span>{{ taskDetail.serviceAddress }}</span>
              </div>
            </div>
          </div>

          <!-- 时间信息 -->
          <div class="detail-section">
            <h4 class="section-title">时间信息</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <label>发布时间：</label>
                <span>{{ taskDetail.publishTime }}</span>
              </div>
              <div class="detail-item">
                <label>接单时间：</label>
                <span>{{ taskDetail.acceptTime || '-' }}</span>
              </div>
              <div class="detail-item">
                <label>完成时间：</label>
                <span>{{ taskDetail.completeTime || '-' }}</span>
              </div>
            </div>
          </div>

          <!-- 志愿者信息 -->
          <div v-if="taskDetail.volunteerName" class="detail-section">
            <h4 class="section-title">志愿者信息</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <label>志愿者姓名：</label>
                <span>{{ taskDetail.volunteerName }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 弹窗底部 -->
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="handleClose">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { getTaskDetail } from '../utils/api.js'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  taskId: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['update:visible'])

const loading = ref(false)
const error = ref('')
const taskDetail = ref(null)

// 任务类型映射
const taskTypeMap = {
  'SHOPPING': '购物陪同',
  'MEDICAL': '医疗陪同',
  'COMPANION': '日常陪伴',
  'OTHER': '其他'
}

// 状态样式映射
const getStatusClass = (statusCode) => {
  const classes = {
    'WAITING': 'status-pending',
    'IN_PROGRESS': 'status-in-progress',
    'COMPLETED': 'status-approved',
    'CANCELLED': 'status-rejected'
  }
  return classes[statusCode] || 'status-pending'
}

// 获取任务类型文本
const getTaskTypeText = (type) => {
  return taskTypeMap[type] || type
}

// 加载任务详情
const loadTaskDetail = async () => {
  if (!props.taskId) {
    error.value = '任务ID不能为空'
    return
  }

  loading.value = true
  error.value = ''
  taskDetail.value = null

  try {
    const response = await getTaskDetail(props.taskId)
    if (response.code === 200) {
      taskDetail.value = response.data
    } else {
      error.value = response.message || '获取任务详情失败'
    }
  } catch (err) {
    console.error('获取任务详情出错:', err)
    error.value = err.message || '网络请求失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 关闭弹窗
const handleClose = () => {
  emit('update:visible', false)
}

// 监听visible变化
watch(() => props.visible, (newVal) => {
  if (newVal && props.taskId) {
    loadTaskDetail()
  } else {
    // 关闭时重置状态
    loading.value = false
    error.value = ''
    taskDetail.value = null
  }
})

// 监听taskId变化
watch(() => props.taskId, (newVal) => {
  if (props.visible && newVal) {
    loadTaskDetail()
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 600px;
  max-width: 90vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
}

.modal-content {
  padding: 24px;
  flex: 1;
  overflow-y: auto;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #6b7280;
}

.error-text {
  color: #ef4444;
  margin-bottom: 16px;
}

.retry-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.retry-btn:hover {
  background: #2563eb;
}

.detail-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f3f4f6;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.detail-item span {
  font-size: 14px;
  color: #1f2937;
}

.modal-footer {
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
}

/* 状态样式 */
.status-pending {
  background: #fef3c7;
  color: #92400e;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-in-progress {
  background: #dbeafe;
  color: #1e40af;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-approved {
  background: #dcfce7;
  color: #166534;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-rejected {
  background: #fee2e2;
  color: #991b1b;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-container {
    width: 95vw;
    margin: 20px;
  }
}
</style>
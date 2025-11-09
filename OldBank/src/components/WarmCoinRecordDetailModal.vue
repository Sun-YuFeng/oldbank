<!-- 暖龄币记录详情模态框 -->
<template>
  <!-- ElementUI对话框组件 -->
  <el-dialog
    v-model="dialogVisible"
    :title="modalTitle"
    width="600px"
    :before-close="handleClose"
    class="record-detail-modal"
  >
    <div class="detail-content">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <span>正在加载记录详情...</span>
      </div>
      
      <!-- 错误状态 -->
      <div v-else-if="error" class="error-container">
        <div class="error-icon">❌</div>
        <span class="error-text">{{ errorMessage }}</span>
        <button class="retry-btn" @click="fetchRecordDetail">重试</button>
      </div>
      
      <!-- 详情内容 -->
      <div v-else-if="recordDetail" class="record-detail">
        <div class="detail-section">
          <h4 class="section-title">基本信息</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <label>记录ID:</label>
              <span>{{ recordDetail.id }}</span>
            </div>
            <div class="detail-item">
              <label>用户ID:</label>
              <span>{{ recordDetail.userId }}</span>
            </div>
            <div class="detail-item">
              <label>用户名:</label>
              <span>{{ recordDetail.username }}</span>
            </div>
            <div class="detail-item">
              <label>手机号:</label>
              <span>{{ recordDetail.phone || '-' }}</span>
            </div>
            <div class="detail-item">
              <label>变动金额:</label>
              <span :class="getAmountClass(recordDetail.amount)">
                {{ recordDetail.amount > 0 ? '+' : '' }}{{ recordDetail.amount }}
              </span>
            </div>
            <div class="detail-item">
              <label>变动后余额:</label>
              <span>{{ recordDetail.balanceAfter }}</span>
            </div>
            <div class="detail-item">
              <label>变动类型:</label>
              <span class="type-badge" :class="getTypeClass(recordDetail.type)">
                {{ recordDetail.typeDesc || recordDetail.type }}
              </span>
            </div>
            <div class="detail-item full-width">
              <label>变动时间:</label>
              <span>{{ formatTime(recordDetail.createTime) }}</span>
            </div>
          </div>
        </div>
        
        <div class="detail-section">
          <h4 class="section-title">详细信息</h4>
          <div class="detail-grid">
            <div class="detail-item full-width">
              <label>描述:</label>
              <span class="description-text">{{ recordDetail.description || '-' }}</span>
            </div>
            
            <!-- 关联任务信息 -->
            <div v-if="recordDetail.demandId" class="detail-item full-width">
              <label>关联任务:</label>
              <div class="task-info">
                <span class="task-id">任务ID: {{ recordDetail.demandId }}</span>
                <span v-if="recordDetail.demandTitle" class="task-title">标题: {{ recordDetail.demandTitle }}</span>
                <button class="view-task-btn" @click="viewTaskDetail(recordDetail.demandId)">查看任务详情</button>
              </div>
            </div>
            
            <!-- 目标用户信息 -->
            <div v-if="recordDetail.targetUsername" class="detail-item full-width">
              <label>目标用户:</label>
              <div class="target-user-info">
                <span class="target-user-id">用户ID: {{ recordDetail.targetUserId }}</span>
                <span class="target-user-name">用户名: {{ recordDetail.targetUsername }}</span>
                <button class="view-user-btn" @click="viewUserDetail(recordDetail.targetUserId)">查看用户详情</button>
              </div>
            </div>
            
            <!-- 管理员调整信息 -->
            <div v-if="recordDetail.type === 'ADMIN_ADJUST'" class="detail-item full-width">
              <label>管理员说明:</label>
              <span class="admin-note">{{ recordDetail.description || '管理员手动调整' }}</span>
            </div>
          </div>
        </div>
        
        <!-- 操作记录（如果有） -->
        <div v-if="recordDetail.operationLogs && recordDetail.operationLogs.length > 0" class="detail-section">
          <h4 class="section-title">操作记录</h4>
          <div class="operation-logs">
            <div v-for="log in recordDetail.operationLogs" :key="log.id" class="log-item">
              <span class="log-time">{{ formatTime(log.operationTime) }}</span>
              <span class="log-operator">{{ log.operatorName }}</span>
              <span class="log-action">{{ log.action }}</span>
              <span class="log-remark" v-if="log.remark">({{ log.remark }})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
        <el-button 
          v-if="recordDetail && recordDetail.demandId" 
          type="primary" 
          @click="viewTaskDetail(recordDetail.demandId)"
        >
          查看关联任务
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { getWarmCoinRecordDetail } from '../utils/api'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  recordId: {
    type: [String, Number],
    default: null
  }
})

const emit = defineEmits(['update:visible', 'view-task', 'view-user'])

const dialogVisible = ref(false)
const recordDetail = ref(null)
const loading = ref(false)
const error = ref(false)
const errorMessage = ref('')

// 模态框标题
const modalTitle = computed(() => {
  if (recordDetail.value) {
    return `记录详情 - ${recordDetail.value.username} (${recordDetail.value.id})`
  }
  return '暖龄币记录详情'
})

// 监听props变化
watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal
  if (newVal && props.recordId) {
    fetchRecordDetail()
  }
})

// 监听dialogVisible变化
watch(dialogVisible, (newVal) => {
  emit('update:visible', newVal)
  if (!newVal) {
    // 关闭时重置状态
    recordDetail.value = null
    error.value = false
    errorMessage.value = ''
  }
})

// 获取记录详情
const fetchRecordDetail = async () => {
  if (!props.recordId) return
  
  loading.value = true
  error.value = false
  errorMessage.value = ''
  
  try {
    const response = await getWarmCoinRecordDetail(props.recordId)
    
    if (response.code === 200) {
      recordDetail.value = response.data
    } else {
      error.value = true
      errorMessage.value = response.message || '获取记录详情失败'
    }
  } catch (err) {
    console.error('获取记录详情错误:', err)
    error.value = true
    errorMessage.value = err.message || '网络请求失败'
  } finally {
    loading.value = false
  }
}

// 金额样式
const getAmountClass = (amount) => {
  return amount > 0 ? 'positive' : 'negative'
}

// 类型样式
const getTypeClass = (type) => {
  const typeMap = {
    'SERVICE_EARN': 'earn',
    'DEMAND_SPEND': 'spend',
    'TRANSFER': 'transfer',
    'DONATE': 'donate',
    'ADMIN_ADJUST': 'admin',
    'REGISTER_BONUS': 'bonus',
    'VIOLATION_DEDUCT': 'violation',
    'INVITATION_BONUS': 'invitation'
  }
  return typeMap[type] || 'default'
}

// 格式化时间
const formatTime = (timeStr) => {
  if (!timeStr) return '-'
  return timeStr.replace('T', ' ').replace(/\.\d+$/, '')
}

// 查看任务详情
const viewTaskDetail = (taskId) => {
  emit('view-task', taskId)
  handleClose()
}

// 查看用户详情
const viewUserDetail = (userId) => {
  emit('view-user', userId)
  handleClose()
}

// 关闭模态框
const handleClose = () => {
  dialogVisible.value = false
}

// 重试加载
const retryLoad = () => {
  fetchRecordDetail()
}
</script>

<style scoped>
.record-detail-modal {
  max-width: 100%;
}

.detail-content {
  max-height: 70vh;
  overflow-y: auto;
  padding: 0 20px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #666;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #e74c3c;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.error-text {
  font-size: 14px;
  margin-bottom: 16px;
}

.retry-btn {
  padding: 8px 16px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.retry-btn:hover {
  background: #2980b9;
}

.record-detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
}

.section-title {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item.full-width {
  grid-column: 1 / -1;
}

.detail-item label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.detail-item span {
  font-size: 14px;
  color: #333;
}

.positive {
  color: #27ae60;
  font-weight: 500;
}

.negative {
  color: #e74c3c;
  font-weight: 500;
}

.type-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
}

.type-badge.earn {
  background: #e8f5e8;
  color: #27ae60;
}

.type-badge.spend {
  background: #ffeaea;
  color: #e74c3c;
}

.type-badge.transfer {
  background: #e8f0ff;
  color: #3498db;
}

.type-badge.donate {
  background: #f9f0e6;
  color: #f39c12;
}

.type-badge.admin {
  background: #f0e8f5;
  color: #9b59b6;
}

.type-badge.bonus {
  background: #e6f9f0;
  color: #2ecc71;
}

.type-badge.violation {
  background: #fee;
  color: #d63031;
}

.type-badge.invitation {
  background: #f0f8ff;
  color: #6c5ce7;
}

.type-badge.default {
  background: #f5f5f5;
  color: #666;
}

.description-text {
  line-height: 1.4;
  word-break: break-word;
}

.task-info,
.target-user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.task-id,
.task-title,
.target-user-id,
.target-user-name {
  font-size: 13px;
  color: #555;
}

.view-task-btn,
.view-user-btn {
  padding: 4px 8px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  width: fit-content;
}

.view-task-btn:hover,
.view-user-btn:hover {
  background: #2980b9;
}

.admin-note {
  font-style: italic;
  color: #666;
}

.operation-logs {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.log-item {
  display: flex;
  gap: 12px;
  padding: 8px;
  background: white;
  border-radius: 4px;
  font-size: 12px;
}

.log-time {
  color: #666;
}

.log-operator {
  color: #3498db;
  font-weight: 500;
}

.log-action {
  color: #333;
}

.log-remark {
  color: #999;
  font-style: italic;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .detail-content {
    padding: 0 16px;
  }
}
</style>
<!-- 积分调整 -->
 <template>
  <div class="adjust-container">
    <h3>积分调整</h3>
    <div class="adjust-form">
      <div class="form-row">
        <div class="form-group">
          <label>用户ID</label>
          <input 
            type="text" 
            v-model="userId" 
            placeholder="输入用户ID"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label>调整值</label>
          <input 
            type="number" 
            v-model="adjustValue" 
            placeholder="正数增加，负数减少"
            class="form-input"
            step="1"
          />
        </div>
        <div class="form-group">
          <label>原因</label>
          <input 
            type="text" 
            v-model="reason" 
            placeholder="调整原因"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <button 
            class="adjust-btn"
            :disabled="!canAdjust || loading"
            @click="executeAdjust"
          >
            {{ loading ? '调整中...' : '执行调整' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- 消息提示 -->
    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { adjustUserPoints } from '../utils/api'

const userId = ref('')
const adjustValue = ref('')
const reason = ref('')
const loading = ref(false)
const message = ref('')
const messageType = ref('') // 'success' or 'error'

const canAdjust = computed(() => {
  return userId.value.trim() !== '' && 
         adjustValue.value !== '' && 
         adjustValue.value !== '0' &&
         reason.value.trim() !== ''
})

const showMessage = (text, type) => {
  message.value = text
  messageType.value = type
  setTimeout(() => {
    message.value = ''
    messageType.value = ''
  }, 3000)
}

const executeAdjust = async () => {
  if (!canAdjust.value) return
  
  loading.value = true
  
  try {
    const result = await adjustUserPoints(userId.value, adjustValue.value, reason.value)
    
    if (result.code === 200) {
      showMessage(`积分调整成功！用户 ${result.data.username} 积分${adjustValue.value > 0 ? '增加' : '减少'} ${Math.abs(adjustValue.value)}，当前余额：${result.data.balanceAfter}`, 'success')
      
      // 重置表单
      userId.value = ''
      adjustValue.value = ''
      reason.value = ''
      
      // 触发父组件刷新事件
      const event = new CustomEvent('point-adjusted', { 
        detail: { 
          userId: result.data.userId,
          amount: result.data.amount,
          balanceAfter: result.data.balanceAfter
        } 
      })
      window.dispatchEvent(event)
    } else {
      showMessage(result.message || '积分调整失败', 'error')
    }
  } catch (error) {
    console.error('积分调整错误:', error)
    showMessage(error.message || '网络错误，请稍后重试', 'error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.adjust-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.adjust-container h3 {
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.form-row {
  display: flex;
  gap: 20px;
  align-items: end;
  box-sizing: border-box;
}

.form-group {
  flex: 1;
  box-sizing: border-box;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #3498db;
}

.adjust-btn {
  padding: 10px 24px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  box-sizing: border-box;
}

.adjust-btn:hover:not(:disabled) {
  background: #2980b9;
}

.adjust-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.message {
  margin-top: 15px;
  padding: 12px 16px;
  border-radius: 4px;
  font-size: 14px;
  animation: slideIn 0.3s ease-out;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

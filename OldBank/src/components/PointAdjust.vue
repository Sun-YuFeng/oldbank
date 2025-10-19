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
            placeholder="-1"
            class="form-input"
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
            :disabled="!canAdjust"
            @click="executeAdjust"
          >
            执行调整
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const userId = ref('')
const adjustValue = ref('')
const reason = ref('')

const canAdjust = computed(() => {
  return userId.value.trim() !== '' && 
         adjustValue.value !== '' && 
         reason.value.trim() !== ''
})

const executeAdjust = () => {
  if (canAdjust.value) {
    console.log('执行积分调整:', {
      userId: userId.value,
      adjustValue: adjustValue.value,
      reason: reason.value
    })
    // 重置表单
    userId.value = ''
    adjustValue.value = ''
    reason.value = ''
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
</style>

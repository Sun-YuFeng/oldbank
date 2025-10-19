<!-- 积分规则 -->
 <template>
  <div class="rules-container">
    <h3>积分规则设置</h3>
    <div class="rules-form">
      <div class="form-row">
        <div class="form-group">
          <label>完成任务奖励</label>
          <input 
            type="number" 
            v-model="taskReward" 
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label>邀请用户奖励</label>
          <input 
            type="number" 
            v-model="inviteReward" 
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label>违规扣分</label>
          <input 
            type="number" 
            v-model="violationPenalty" 
            class="form-input"
          />
        </div>
        <div class="form-group">
          <button 
            class="save-btn"
            @click="saveRules"
          >
            保存规则
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const taskReward = ref(0)
const inviteReward = ref(0)
const violationPenalty = ref(0)

const saveRules = () => {
  console.log('保存积分规则:', {
    taskReward: taskReward.value,
    inviteReward: inviteReward.value,
    violationPenalty: violationPenalty.value
  })
}
</script>

<style scoped>
.rules-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.rules-container h3 {
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
  border-color: #27ae60;
}

.save-btn {
  padding: 10px 24px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  box-sizing: border-box;
}

.save-btn:hover {
  background: #229954;
}
</style>

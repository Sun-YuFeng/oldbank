<!-- 任务统计卡片 -->
 <template>
  <div class="stats-container">
    <div class="stats-card">
      <div class="card-title">总任务数</div>
      <div class="card-value">{{ totalTasks }}</div>
    </div>
    <div class="stats-card">
      <div class="card-title">待审核</div>
      <div class="card-value pending">{{ pendingTasks }}</div>
    </div>
    <div class="stats-card">
      <div class="card-title">平均信用分</div>
      <div class="card-value">{{ averageScore }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const totalTasks = ref(20)
const pendingTasks = ref(3)
const averageScore = ref(114)
</script>

<style scoped>
.stats-container {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  border: 1px solid transparent;
  padding: 0;
}

.stats-card {
  flex: 1;
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.card-title {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.card-value {
  font-size: 32px;
  font-weight: 600;
  color: #1f2937;
}

.card-value.pending {
  color: #f59e0b;
}
</style>

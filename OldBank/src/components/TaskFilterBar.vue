<!-- 任务筛选栏 -->
 <template>
  <div class="filter-container">
    <div class="search-section">
      <div class="search-input-wrapper">
        <input 
          type="text" 
          placeholder="搜索任务标题或提交人..."
          v-model="searchQuery"
          class="search-input"
        />
        <i class="fas fa-search search-icon"></i>
      </div>
    </div>
    <div class="filter-section">
      <select v-model="selectedStatus" class="status-select">
        <option value="">全部状态</option>
        <option value="WAITING">待接单</option>
        <option value="IN_PROGRESS">进行中</option>
        <option value="COMPLETED">已完成</option>
        <option value="CANCELLED">已取消</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const searchQuery = ref('')
const selectedStatus = ref('')

const emit = defineEmits(['search', 'filter'])

// Watch for changes and emit events
import { watch } from 'vue'

watch(searchQuery, (newValue) => {
  emit('search', newValue)
})

watch(selectedStatus, (newValue) => {
  emit('filter', newValue)
})
</script>

<style scoped>
.filter-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 20px;
  margin-bottom: 30px;
  display: flex;
  gap: 20px;
  align-items: center;
}

.search-section {
  flex: 1;
}

.search-input-wrapper {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 10px 40px 10px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #3b82f6;
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 14px;
}

.filter-section {
  min-width: 120px;
}

.status-select {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  outline: none;
  cursor: pointer;
}

.status-select:focus {
  border-color: #3b82f6;
}
</style>

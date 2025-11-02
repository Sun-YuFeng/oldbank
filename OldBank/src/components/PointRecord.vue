<!-- 积分记录列表 -->
 <template>
  <div class="record-container">
    <div class="record-header">
      <h3>积分记录</h3>
      <span class="record-count">共 50 条记录，当前显示 1-10 条</span>
    </div>
    
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-group">
          <label>用户ID</label>
          <input 
            type="text" 
            v-model="filters.userId" 
            placeholder="筛选用户ID"
            class="filter-input"
          />
        </div>
        <div class="filter-group">
          <label>变动原因</label>
          <select v-model="filters.reason" class="filter-select">
            <option value="">全部原因</option>
            <option value="完成任务">完成任务</option>
            <option value="违规扣分">违规扣分</option>
            <option value="邀请奖励">邀请奖励</option>
            <option value="管理员调整">管理员调整</option>
            <option value="注册奖励">注册奖励</option>
          </select>
        </div>
        <div class="filter-group">
          <label>日期范围</label>
          <select v-model="filters.dateRange" class="filter-select">
            <option value="">全部时间</option>
            <option value="today">今天</option>
            <option value="week">本周</option>
            <option value="month">本月</option>
          </select>
        </div>
      </div>
    </div>

    <div class="table-section">
      <table class="record-table">
        <thead>
          <tr>
            <th>记录ID</th>
            <th>用户ID</th>
            <th>用户名</th>
            <th>变动值</th>
            <th>变动后余额</th>
            <th>变动原因</th>
            <th>时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in records" :key="record.id">
            <td>{{ record.id }}</td>
            <td>{{ record.userId }}</td>
            <td>{{ record.userName }}</td>
            <td :class="record.change > 0 ? 'positive' : 'negative'">
              {{ record.change > 0 ? '+' : '' }}{{ record.change }}
            </td>
            <td>{{ record.balance }}</td>
            <td>{{ record.reason }}</td>
            <td>{{ record.time }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ElementUI分页组件 -->
    <div class="pagination-container" v-if="records.length >= pageSize">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="records.length"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const filters = reactive({
  userId: '',
  reason: '',
  dateRange: ''
})

const currentPage = ref(1)
const pageSize = ref(10)

const records = ref([
  {
    id: 'credit_1',
    userId: 'user_19',
    userName: '用户24',
    change: 2,
    balance: 960,
    reason: '完成任务',
    time: '2025/8/9 16:29:45'
  },
  {
    id: 'credit_2',
    userId: 'user_8',
    userName: '用户26',
    change: -82,
    balance: 1117,
    reason: '违规扣分',
    time: '2025/8/19 07:39:51'
  },
  {
    id: 'credit_3',
    userId: 'user_4',
    userName: '用户4',
    change: -38,
    balance: 1471,
    reason: '邀请奖励',
    time: '2025/7/29 04:15:08'
  },
  {
    id: 'credit_4',
    userId: 'user_3',
    userName: '用户28',
    change: -45,
    balance: 793,
    reason: '管理员调整',
    time: '2025/8/9 12:00:07'
  },
  {
    id: 'credit_5',
    userId: 'user_22',
    userName: '用户18',
    change: 39,
    balance: 907,
    reason: '违规扣分',
    time: '2025/7/29 23:33:34'
  },
  {
    id: 'credit_6',
    userId: 'user_15',
    userName: '用户12',
    change: 30,
    balance: 1481,
    reason: '管理员调整',
    time: '2025/8/24 10:43:56'
  },
  {
    id: 'credit_7',
    userId: 'user_11',
    userName: '用户21',
    change: -97,
    balance: 1355,
    reason: '邀请奖励',
    time: '2025/8/22 18:59:25'
  },
  {
    id: 'credit_8',
    userId: 'user_28',
    userName: '用户19',
    change: 67,
    balance: 1389,
    reason: '管理员调整',
    time: '2025/8/11 01:57:14'
  },
  {
    id: 'credit_9',
    userId: 'user_9',
    userName: '用户18',
    change: -84,
    balance: 546,
    reason: '邀请奖励',
    time: '2025/8/12 01:00:11'
  },
  {
    id: 'credit_10',
    userId: 'user_29',
    userName: '用户28',
    change: -19,
    balance: 1118,
    reason: '注册奖励',
    time: '2025/7/27 20:26:24'
  }
])

// ElementUI分页事件处理
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  currentPage.value = 1
}

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
}
</script>

<style scoped>
.record-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  box-sizing: border-box;
}

.record-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.record-count {
  font-size: 14px;
  color: #666;
}

.filter-section {
  margin-bottom: 20px;
  box-sizing: border-box;
}

.filter-row {
  display: flex;
  gap: 20px;
  box-sizing: border-box;
}

.filter-group {
  flex: 1;
  box-sizing: border-box;
}

.filter-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.filter-input,
.filter-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #3498db;
}

.table-section {
  margin-bottom: 20px;
  overflow-x: auto;
  box-sizing: border-box;
}

.record-table {
  width: 100%;
  border-collapse: collapse;
  box-sizing: border-box;
}

.record-table th,
.record-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}

.record-table th {
  background: #f8f9fa;
  font-weight: 500;
  color: #333;
}

.record-table td {
  color: #666;
}

.positive {
  color: #27ae60;
  font-weight: 500;
}

.negative {
  color: #e74c3c;
  font-weight: 500;
}

/* ElementUI分页样式 */
.pagination-container {
  margin-top: 20px;
  padding: 20px 0;
  display: flex;
  justify-content: center;
}

/* 自定义ElementUI分页样式 */
.pagination-container :deep(.el-pagination) {
  justify-content: center;
}

.pagination-container :deep(.el-pagination .btn-prev),
.pagination-container :deep(.el-pagination .btn-next) {
  border: 1px solid #d1d5db;
  border-radius: 6px;
}

.pagination-container :deep(.el-pagination .el-pager li) {
  border: 1px solid #d1d5db;
  border-radius: 6px;
  margin: 0 4px;
}

.pagination-container :deep(.el-pagination .el-pager li.active) {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.pagination-container :deep(.el-pagination .el-pager li:hover) {
  border-color: #9ca3af;
}

.pagination-container :deep(.el-pagination .el-pager li.active:hover) {
  background-color: #2563eb;
  border-color: #2563eb;
}
</style>

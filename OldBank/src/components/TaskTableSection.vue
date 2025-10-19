<!-- 任务表格区域 -->
 <template>
  <div class="table-container">
    <div class="table-header">
      <h3>任务列表</h3>
      <div class="table-info">
        共 {{ totalTasks }} 条任务，当前显示 {{ startIndex }}-{{ endIndex }} 条
      </div>
    </div>
    
    <div class="table-wrapper">
      <table class="task-table">
        <thead>
          <tr>
            <th>任务ID</th>
            <th>标题</th>
            <th>提交人</th>
            <th>信用分</th>
            <th>状态</th>
            <th>提交时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in paginatedTasks" :key="task.id">
            <td>{{ task.id }}</td>
            <td class="task-title">{{ task.title }}</td>
            <td>{{ task.submitter }}</td>
            <td>{{ task.score }}</td>
            <td>
              <span :class="getStatusClass(task.status)">
                {{ getStatusText(task.status) }}
              </span>
            </td>
            <td>{{ task.submitTime }}</td>
            <td>
              <TaskOperationCell 
                :task="task"
                @detail="handleDetail"
                @approve="handleApprove"
                @reject="handleReject"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="pagination">
      <button 
        class="pagination-btn"
        :disabled="currentPage === 1"
        @click="previousPage"
      >
        上一页
      </button>
      <span class="page-info">{{ currentPage }}</span>
      <button 
        class="pagination-btn"
        :disabled="currentPage === totalPages"
        @click="nextPage"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import TaskOperationCell from './TaskOperationCell.vue'

const currentPage = ref(1)
const pageSize = ref(10)

const tasks = ref([
  { id: 'task_1', title: '代购生活用品', submitter: 'user3', score: 84, status: 'approved', submitTime: '2025/8/20 00:08:10' },
  { id: 'task_2', title: '陪同就医', submitter: 'user76', score: 107, status: 'approved', submitTime: '2025/8/21 19:09:24' },
  { id: 'task_3', title: '家电维修', submitter: 'user22', score: 115, status: 'approved', submitTime: '2025/8/24 08:32:33' },
  { id: 'task_4', title: '代取快递', submitter: 'user11', score: 145, status: 'rejected', submitTime: '2025/8/19 04:26:42' },
  { id: 'task_5', title: '陪聊', submitter: 'user77', score: 138, status: 'rejected', submitTime: '2025/8/22 06:41:53' },
  { id: 'task_6', title: '代购生活用品', submitter: 'user82', score: 122, status: 'rejected', submitTime: '2025/8/25 07:18:00' },
  { id: 'task_7', title: '陪同就医', submitter: 'user37', score: 90, status: 'rejected', submitTime: '2025/8/18 20:54:59' },
  { id: 'task_8', title: '家电维修', submitter: 'user93', score: 137, status: 'pending', submitTime: '2025/8/25 13:52:29' },
  { id: 'task_9', title: '代取快递', submitter: 'user89', score: 118, status: 'rejected', submitTime: '2025/8/24 14:10:43' },
  { id: 'task_10', title: '陪聊', submitter: 'user53', score: 87, status: 'pending', submitTime: '2025/8/19 16:38:31' }
])

const totalTasks = computed(() => tasks.value.length)
const totalPages = computed(() => Math.ceil(totalTasks.value / pageSize.value))
const startIndex = computed(() => (currentPage.value - 1) * pageSize.value + 1)
const endIndex = computed(() => Math.min(currentPage.value * pageSize.value, totalTasks.value))

const paginatedTasks = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return tasks.value.slice(start, end)
})

const getStatusClass = (status) => {
  const classes = {
    'approved': 'status-approved',
    'rejected': 'status-rejected',
    'pending': 'status-pending'
  }
  return classes[status] || ''
}

const getStatusText = (status) => {
  const texts = {
    'approved': '已通过',
    'rejected': '已拒绝',
    'pending': '待审核'
  }
  return texts[status] || status
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const handleDetail = (task) => {
  console.log('查看详情:', task)
}

const handleApprove = (task) => {
  console.log('通过任务:', task)
  // Update task status
  const taskIndex = tasks.value.findIndex(t => t.id === task.id)
  if (taskIndex !== -1) {
    tasks.value[taskIndex].status = 'approved'
  }
}

const handleReject = (task) => {
  console.log('拒绝任务:', task)
  // Update task status
  const taskIndex = tasks.value.findIndex(t => t.id === task.id)
  if (taskIndex !== -1) {
    tasks.value[taskIndex].status = 'rejected'
  }
}
</script>

<style scoped>
.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.table-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.table-info {
  font-size: 14px;
  color: #6b7280;
}

.table-wrapper {
  overflow-x: auto;
}

.task-table {
  width: 100%;
  border-collapse: collapse;
}

.task-table th {
  background: #f9fafb;
  padding: 12px 16px;
  text-align: left;
  font-weight: 500;
  color: #374151;
  font-size: 14px;
  border-bottom: 1px solid #e5e7eb;
}

.task-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 14px;
  color: #1f2937;
}

.task-title {
  color: #3b82f6;
  cursor: pointer;
}

.task-title:hover {
  text-decoration: underline;
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

.status-pending {
  background: #fef3c7;
  color: #92400e;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.pagination {
  padding: 16px 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  border-top: 1px solid #e5e7eb;
}

.pagination-btn {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #6b7280;
  min-width: 20px;
  text-align: center;
}
</style>

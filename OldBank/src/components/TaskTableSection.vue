<!-- 任务表格区域 -->
 <template>
  <div class="table-container">
    <!-- 筛选栏 -->
    <div class="filter-container">
      <div class="search-section">
        <div class="search-input-wrapper">
          <input 
            type="text" 
            placeholder="搜索任务标题或提交人..."
            v-model="searchQuery"
            class="search-input"
            @keyup.enter="handleSearch"
          />
          <i class="fas fa-search search-icon"></i>
        </div>
      </div>
      <div class="filter-section">
        <select v-model="selectedStatus" class="status-select">
          <option value="">全部状态</option>
          <option value="待接单">待接单</option>
          <option value="进行中">进行中</option>
          <option value="已完成">已完成</option>
          <option value="已取消">已取消</option>
        </select>
      </div>
      
      <!-- 按钮区域 -->
      <div class="button-section">
        <button class="search-btn" @click="handleSearch">
          <i class="fas fa-search"></i>
          搜索
        </button>
        <button class="reset-btn" @click="handleReset">
          <i class="fas fa-redo"></i>
          重置
        </button>
      </div>
    </div>
    
    <div class="table-header">
      <h3>任务列表</h3>
      <div class="table-info">
        <span v-if="loading">加载中...</span>
        <span v-else>
          <span v-if="searchQuery.trim()">
            搜索"{{ searchQuery }}"结果：共 {{ totalTasks }} 条任务，当前显示 {{ startIndex }}-{{ endIndex }} 条
          </span>
          <span v-else>
            共 {{ totalTasks }} 条任务，当前显示 {{ startIndex }}-{{ endIndex }} 条
          </span>
        </span>
      </div>
    </div>
    
    <div class="table-wrapper">
      <table class="task-table">
        <thead>
          <tr>
            <th>任务ID</th>
            <th>标题</th>
            <th>发布人</th>
            <th>发布人电话</th>
            <th>暖币</th>
            <th>状态</th>
            <th>志愿者</th>
            <th>服务地址</th>
            <th>发布时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="10" style="text-align: center; padding: 40px;">
              <span>加载中...</span>
            </td>
          </tr>
          <tr v-else-if="tasks.length === 0">
            <td colspan="10" style="text-align: center; padding: 40px;">
              <span v-if="searchQuery.trim()">
                未找到包含"{{ searchQuery }}"的任务
              </span>
              <span v-else>
                暂无任务数据
              </span>
            </td>
          </tr>
          <tr v-else v-for="task in tasks" :key="task.id">
            <td>{{ task.id }}</td>
            <td class="task-title">{{ task.title }}</td>
            <td>{{ task.publisherName }}</td>
            <td>{{ task.publisherPhone }}</td>
            <td>{{ task.warmCoin }}</td>
            <td>
              <span :class="getStatusClass(task.status)">
                {{ task.status }}
              </span>
            </td>
            <td>{{ task.volunteerName || '暂无' }}</td>
            <td>{{ task.serviceAddress }}</td>
            <td>{{ task.publishTime }}</td>
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
    
    <!-- ElementUI分页组件 -->
    <div class="pagination-container" v-if="!loading && totalTasks >= pageSize">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="totalTasks"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 任务详情弹窗 -->
    <TaskDetailModal 
      v-model:visible="showDetailModal"
      :task-id="selectedTaskId"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { getTaskList, getTasksByStatus, searchTasks } from '../utils/api.js'
import TaskOperationCell from './TaskOperationCell.vue'
import TaskDetailModal from './TaskDetailModal.vue'

const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const tasks = ref([])
const totalTasks = ref(0)
const showDetailModal = ref(false)
const selectedTaskId = ref(null)

// 本地筛选状态
const searchQuery = ref('')
const selectedStatus = ref('')

// 计算属性
const startIndex = computed(() => (currentPage.value - 1) * pageSize.value + 1)
const endIndex = computed(() => Math.min(currentPage.value * pageSize.value, totalTasks.value))

// 状态样式映射
const getStatusClass = (status) => {
  const classes = {
    '待接单': 'status-waiting',
    '进行中': 'status-in-progress',
    '已完成': 'status-completed',
    '已取消': 'status-cancelled'
  }
  return classes[status] || 'status-waiting'
}

// 中文状态映射到英文枚举值
const mapStatusToEnum = (status) => {
  const statusMap = {
    '待接单': 'WAITING',
    '进行中': 'IN_PROGRESS',
    '已完成': 'COMPLETED',
    '已取消': 'CANCELLED'
  }
  return statusMap[status] || status
}

// 加载任务列表
const loadTasks = async () => {
  loading.value = true
  try {
    let response
    
    // 如果有搜索关键词，使用搜索接口
    if (searchQuery.value.trim()) {
      console.log('🔍 使用搜索接口，参数:', {
        keyword: searchQuery.value.trim(),
        page: currentPage.value - 1,
        size: pageSize.value
      })
      
      response = await searchTasks(
        searchQuery.value.trim(),
        currentPage.value - 1, // API页码从0开始
        pageSize.value
      )
    } else if (selectedStatus.value) {
      // 如果选择了状态筛选，使用状态筛选接口
      response = await getTasksByStatus(
        mapStatusToEnum(selectedStatus.value),
        currentPage.value,
        pageSize.value
      )
    } else {
      // 否则使用通用任务列表接口
      response = await getTaskList(
        currentPage.value, 
        pageSize.value, 
        searchQuery.value, 
        mapStatusToEnum(selectedStatus.value)
      )
    }
    
    console.log('📦 任务列表API响应:', response)
    
    if (response.code === 200) {
      tasks.value = response.data.content || []
      totalTasks.value = response.data.totalElements || 0
      console.log('📋 任务数据:', {
        任务数量: tasks.value.length,
        总数: totalTasks.value,
        当前页: currentPage.value
      })
    } else {
      console.error('❌ 获取任务列表失败:', response.message)
      tasks.value = []
      totalTasks.value = 0
    }
  } catch (error) {
    console.error('🚨 获取任务列表出错:', error)
    tasks.value = []
    totalTasks.value = 0
  } finally {
    loading.value = false
  }
}

// ElementUI分页事件处理
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  currentPage.value = 1
  loadTasks()
}

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
  loadTasks()
}

// 任务操作处理
const handleDetail = (task) => {
  console.log('查看任务详情:', task)
  selectedTaskId.value = task.id
  showDetailModal.value = true
}

const handleApprove = (task) => {
  console.log('通过任务:', task)
  // TODO: 实现任务审核通过逻辑
}

const handleReject = (task) => {
  console.log('拒绝任务:', task)
  // TODO: 实现任务审核拒绝逻辑
}

// 搜索按钮处理
const handleSearch = () => {
  const keyword = searchQuery.value.trim()
  console.log('🔍 点击搜索，关键词:', `"${keyword}"`)
  console.log('📄 当前页码:', currentPage.value)
  
  currentPage.value = 1 // 重置到第一页
  loadTasks()
}

// 重置按钮处理
const handleReset = () => {
  searchQuery.value = ''
  selectedStatus.value = ''
  currentPage.value = 1
  loadTasks()
}

// 监听分页参数变化
watch([currentPage, pageSize], () => {
  loadTasks()
})

// 监听筛选参数变化，移除自动搜索，改为手动触发
// watch([searchQuery, selectedStatus], () => {
//   currentPage.value = 1 // 重置到第一页
//   loadTasks()
// })

// 组件挂载时加载数据
onMounted(() => {
  loadTasks()
})
</script>

<style scoped>
/* 筛选栏样式 */
.filter-container {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 20px 24px;
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
  transition: all 0.2s;
  box-sizing: border-box;
}

.search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-input::placeholder {
  color: #9ca3af;
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

/* 按钮区域样式 */
.button-section {
  display: flex;
  gap: 12px;
}

.search-btn, .reset-btn {
  padding: 10px 20px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.search-btn {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.search-btn:hover {
  background: #2563eb;
  border-color: #2563eb;
}

.reset-btn {
  background: white;
  color: #6b7280;
}

.reset-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
  color: #374151;
}

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
  overflow-x: hidden;
  width: 100%;
}

.task-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  min-width: 1200px; /* 确保表格足够宽，避免换行 */
}

.task-table th {
  background: #f9fafb;
  padding: 18px 12px;
  text-align: left;
  font-weight: 500;
  color: #374151;
  font-size: 14px;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
}

.task-table td {
  padding: 24px 12px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 14px;
  color: #1f2937;
  vertical-align: top;
  line-height: 1.6;
  min-height: 60px;
}

/* 允许换行的列 */
.task-table td:nth-child(2), /* 标题 */
.task-table td:nth-child(8), /* 服务地址 */
.task-table td:nth-child(9)  /* 发布时间 */
{
  white-space: normal;
  word-wrap: break-word;
  word-break: break-word;
  line-height: 1.8;
}

/* 设置列宽 */
.task-table th:nth-child(1), .task-table td:nth-child(1) { width: 80px; }  /* 任务ID */
.task-table th:nth-child(2), .task-table td:nth-child(2) { width: 180px; } /* 标题 */
.task-table th:nth-child(3), .task-table td:nth-child(3) { width: 100px; } /* 发布人 */
.task-table th:nth-child(4), .task-table td:nth-child(4) { width: 120px; } /* 发布人电话 */
.task-table th:nth-child(5), .task-table td:nth-child(5) { width: 80px; }  /* 暖币 */
.task-table th:nth-child(6), .task-table td:nth-child(6) { width: 100px; } /* 状态 */
.task-table th:nth-child(7), .task-table td:nth-child(7) { width: 100px; } /* 志愿者 */
.task-table th:nth-child(8), .task-table td:nth-child(8) { width: 160px; } /* 服务地址 */
.task-table th:nth-child(9), .task-table td:nth-child(9) { width: 140px; } /* 发布时间 */
.task-table th:nth-child(10), .task-table td:nth-child(10) { width: 180px; } /* 操作 */

.task-title {
  color: #3b82f6;
  cursor: pointer;
}

.task-title:hover {
  text-decoration: underline;
}

/* 待接单 - 黄色（保持原有颜色） */
.status-waiting {
  background: #fef3c7;
  color: #92400e;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

/* 进行中 - 蓝色 */
.status-in-progress {
  background: #dbeafe;
  color: #1e40af;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

/* 已完成 - 绿色 */
.status-completed {
  background: #dcfce7;
  color: #166534;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

/* 已取消 - 灰色 */
.status-cancelled {
  background: #f3f4f6;
  color: #6b7280;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

/* ElementUI分页样式 */
.pagination-container {
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
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

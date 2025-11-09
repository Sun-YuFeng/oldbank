<!-- 积分记录列表 -->
<template>
  <div class="record-container">
    <div class="record-header">
      <h3>积分/暖龄币记录</h3>
      <span class="record-count">共 {{ totalRecords }} 条记录，当前显示 {{ startRecord }}-{{ endRecord }} 条</span>
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
            @input="handleFilterChange"
          />
        </div>
        <div class="filter-group">
          <label>变动类型</label>
          <select v-model="filters.type" class="filter-select" @change="handleFilterChange">
            <option value="">全部类型</option>
            <option value="SERVICE_EARN">服务获得</option>
            <option value="DEMAND_SPEND">发布需求支出</option>
            <option value="TRANSFER">转赠他人</option>
            <option value="DONATE">捐赠公益池</option>
            <option value="ADMIN_ADJUST">管理员调整</option>
            <option value="VIOLATION_DEDUCT">违规扣分</option>
          </select>
        </div>
        <div class="filter-group">
          <label>搜索关键词</label>
          <input 
            type="text" 
            v-model="filters.search" 
            placeholder="用户名/手机号/描述"
            class="filter-input"
            @input="handleSearchChange"
          />
        </div>
      </div>
      <div class="filter-actions">
        <button class="reset-btn" @click="resetFilters">重置筛选</button>
      </div>
    </div>

    <div class="table-section">
      <table class="record-table">
        <thead>
          <tr>
            <th>记录ID</th>
            <th>用户ID</th>
            <th>用户名</th>
            <th>手机号</th>
            <th>变动金额</th>
            <th>变动后余额</th>
            <th>变动类型</th>
            <th>描述</th>
            <th>关联任务</th>
            <th>目标用户</th>
            <th>时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in records" :key="record.id" @click="viewRecordDetail(record.id)" class="record-row">
            <td>{{ record.id }}</td>
            <td>{{ record.userId }}</td>
            <td>{{ record.username }}</td>
            <td>{{ record.phone || '-' }}</td>
            <td :class="getAmountClass(record.amount)">
              {{ record.amount > 0 ? '+' : '' }}{{ record.amount }}
            </td>
            <td>{{ record.balanceAfter }}</td>
            <td>
              <span class="type-badge" :class="getTypeClass(record.type)">
                {{ record.typeDesc || record.type }}
              </span>
            </td>
            <td>{{ record.description || '-' }}</td>
            <td>
              <span v-if="record.demandId" class="task-link" @click="viewTaskDetail(record.demandId)">
                {{ record.demandTitle || record.demandId }}
              </span>
              <span v-else class="no-data">-</span>
            </td>
            <td>
              <span v-if="record.targetUsername">{{ record.targetUsername }}</span>
              <span v-else class="no-data">-</span>
            </td>
            <td>{{ formatTime(record.createTime) }}</td>
          </tr>
        </tbody>
      </table>
      
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <span>正在加载数据...</span>
      </div>
      
      <!-- 空数据状态 -->
      <div v-else-if="records.length === 0" class="empty-container">
        <div class="empty-icon">📊</div>
        <span class="empty-text">暂无数据</span>
      </div>
    </div>

    <!-- ElementUI分页组件 -->
    <div class="pagination-container" v-if="!loading && records.length > 0">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="totalRecords"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 详情模态框 -->
    <WarmCoinRecordDetailModal
      v-model:visible="detailModalVisible"
      :record-id="selectedRecordId"
      @view-task="viewTaskDetail"
      @view-user="viewUserDetail"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { getWarmCoinRecords } from '../utils/api'
import WarmCoinRecordDetailModal from './WarmCoinRecordDetailModal.vue'

const filters = reactive({
  userId: '',
  type: '',
  search: ''
})

const currentPage = ref(1)
const pageSize = ref(10)
const records = ref([])
const totalRecords = ref(0)
const loading = ref(false)

// 详情模态框状态
const detailModalVisible = ref(false)
const selectedRecordId = ref(null)

// 计算显示的记录范围
const startRecord = computed(() => {
  return (currentPage.value - 1) * pageSize.value + 1
})

const endRecord = computed(() => {
  return Math.min(currentPage.value * pageSize.value, totalRecords.value)
})

// 搜索防抖
let searchTimer = null

const handleSearchChange = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    currentPage.value = 1
    fetchRecords()
  }, 500)
}

const handleFilterChange = () => {
  currentPage.value = 1
  fetchRecords()
}

const resetFilters = () => {
  filters.userId = ''
  filters.type = ''
  filters.search = ''
  currentPage.value = 1
  fetchRecords()
}

// 查看记录详情
const viewRecordDetail = (recordId) => {
  selectedRecordId.value = recordId
  detailModalVisible.value = true
}

// 查看任务详情
const viewTaskDetail = (taskId) => {
  console.log('查看任务详情:', taskId)
  // 这里可以跳转到任务详情页面或显示模态框
  // 可以根据实际需求实现跳转到任务详情页面
}

// 查看用户详情
const viewUserDetail = (userId) => {
  console.log('查看用户详情:', userId)
  // 这里可以跳转到用户详情页面
}

// 获取记录列表
const fetchRecords = async () => {
  loading.value = true
  try {
    const response = await getWarmCoinRecords(
      currentPage.value,
      pageSize.value,
      filters.search,
      filters.type,
      filters.userId
    )
    
    console.log('获取到的积分记录数据:', response)
    
    if (response.code === 200) {
      records.value = response.data.content || []
      totalRecords.value = response.data.totalElements || 0
      console.log('积分记录列表:', records.value)
      console.log('总记录数:', totalRecords.value)
    } else {
      console.error('获取数据失败:', response.message)
      records.value = []
      totalRecords.value = 0
    }
  } catch (error) {
    console.error('API请求错误:', error)
    records.value = []
    totalRecords.value = 0
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

// ElementUI分页事件处理
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  currentPage.value = 1
  fetchRecords()
}

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
  fetchRecords()
}

// 组件挂载时加载数据
onMounted(() => {
  fetchRecords()
})
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

.filter-actions {
  display: flex;
  justify-content: flex-end;
}

.reset-btn {
  padding: 8px 16px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #666;
  cursor: pointer;
  font-size: 14px;
}

.reset-btn:hover {
  background: #e5e5e5;
}

.table-section {
  margin-bottom: 20px;
  overflow-x: auto;
  box-sizing: border-box;
  min-height: 200px;
}

.record-table td {
  white-space: nowrap;
}

.record-row {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.record-row:hover {
  background-color: #f5f9ff;
}

.record-row:active {
  background-color: #e8f0ff;
}

.record-row {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.record-row:hover {
  background-color: #f5f9ff;
}

.record-row:active {
  background-color: #e8f0ff;
}

.type-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
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

.task-link {
  color: #3498db;
  cursor: pointer;
  text-decoration: underline;
}

.task-link:hover {
  color: #2980b9;
}

.no-data {
  color: #999;
  font-style: italic;
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

.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #999;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.empty-text {
  font-size: 14px;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
    gap: 10px;
  }
  
  .filter-group {
    flex: none;
  }
  
  .table-section {
    overflow-x: auto;
  }
  
  .record-table {
    min-width: 800px;
  }
}
</style>

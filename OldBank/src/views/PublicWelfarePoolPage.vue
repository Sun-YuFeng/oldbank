<template>
  <div class="public-welfare-pool">
    <div class="page-header">
      <h2 class="page-title">公益池资金监管</h2>
    </div>

    <!-- 数据概览卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-label">公益池总积分 (暖龄币)</span>
        <div class="stat-value text-blue">{{ poolInfo.balance.toLocaleString() }}</div>
      </div>
      <div class="stat-card">
        <span class="stat-label">累计捐赠总额</span>
        <div class="stat-value text-green">{{ poolInfo.totalDonated.toLocaleString() }}</div>
      </div>
      <div class="stat-card">
        <span class="stat-label">累计发放总额</span>
        <div class="stat-value">{{ poolInfo.totalDistributed.toLocaleString() }}</div>
      </div>
      <div class="stat-card">
        <span class="stat-label">最后更新时间</span>
        <div class="stat-value" style="font-size: 16px; color: #666;">{{ poolInfo.updateTime }}</div>
      </div>
    </div>

    <!-- 表格区域 -->
    <div class="table-container">
      <!-- 筛选栏 -->
      <div class="filter-bar">
        <div class="input-group">
          <label>捐赠人：</label>
          <input type="text" placeholder="输入姓名/ID" v-model="filters.donor">
        </div>
        <div class="input-group">
          <label>来源类型：</label>
          <select v-model="filters.sourceType">
            <option value="all">全部</option>
            <option value="volunteer">志愿者主动捐赠</option>
            <option value="heritage">老人遗产转化</option>
          </select>
        </div>
        <div class="input-group">
          <label>日期范围：</label>
          <input type="date" v-model="filters.startDate">
          <span>-</span>
          <input type="date" v-model="filters.endDate">
        </div>
        <div class="input-group" style="margin-left: auto;">
          <button class="btn btn-primary" @click="searchDonations">查询</button>
          <button class="btn btn-reset" style="margin-left: 10px;" @click="resetFilters">重置</button>
        </div>
      </div>

      <!-- 表格 -->
      <table>
        <thead>
          <tr>
            <th>流水号</th>
            <th>捐赠人信息</th>
            <th>捐赠数量 (积分)</th>
            <th>来源类型</th>
            <th>所在社区</th>
            <th>捐赠时间</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="donation in donations" :key="donation.id">
            <td>{{ donation.serialNumber }}</td>
            <td>
              <div><strong>{{ donation.name }} ({{ donation.role }})</strong></div>
              <div style="font-size: 12px; color:#999;">ID: {{ donation.userId }}</div>
            </td>
            <td style="font-weight: bold; color: #333;">+ {{ donation.amount.toLocaleString() }}</td>
            <td>
              <span class="tag" :class="getSourceTypeClass(donation.sourceType)">
                {{ getSourceTypeLabel(donation.sourceType) }}
              </span>
            </td>
            <td>{{ donation.community }}</td>
            <td>{{ donation.donationTime }}</td>
            <td>
              <span :style="{ color: getStatusColor(donation.status) }">● {{ getStatusLabel(donation.status) }}</span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 分页 -->
      <div class="pagination">
        <div class="page-item" @click="prevPage">&lt;</div>
        <div 
          class="page-item" 
          :class="{ active: currentPage === page }"
          v-for="page in visiblePages" 
          :key="page"
          @click="goToPage(page)"
        >
          {{ page }}
        </div>
        <div class="page-item" @click="nextPage">&gt;</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { getCharityPoolInfo } from '@/utils/api'

export default {
  name: 'PublicWelfarePoolPage',
  data() {
    return {
      filters: {
        donor: '',
        sourceType: 'all',
        startDate: '',
        endDate: ''
      },
      currentPage: 1,
      totalPages: 10,
      poolInfo: {
        balance: 0,
        totalDonated: 0,
        totalDistributed: 0,
        updateTime: ''
      },
      donations: [
        {
          id: 1,
          serialNumber: '#20231024001',
          name: '张伟',
          role: '志愿者',
          userId: '882103',
          amount: 50,
          sourceType: 'volunteer',
          community: '幸福街道阳光社区',
          donationTime: '2025-12-7 14:30:22',
          status: 'completed'
        },
        {
          id: 2,
          serialNumber: '#20231024002',
          name: '李秀英',
          role: '老人',
          userId: '102934',
          amount: 120,
          sourceType: 'heritage',
          heritagePercent: 20,
          community: '和平路街道',
          donationTime: '2025-12-7 09:15:00',
          status: 'completed'
        },
        {
          id: 3,
          serialNumber: '#20231023055',
          name: '王强',
          role: '志愿者',
          userId: '773412',
          amount: 200,
          sourceType: 'volunteer',
          community: '滨湖社区',
          donationTime: '2025-12-7 18:20:11',
          status: 'completed'
        },
        {
          id: 4,
          serialNumber: '#20231023048',
          name: '赵兰花',
          role: '老人',
          userId: '100221',
          amount: 100,
          sourceType: 'heritage',
          heritagePercent: 10,
          community: '花园路社区',
          donationTime: '2025-12-7 16:05:33',
          status: 'reviewing'
        },
        {
          id: 5,
          serialNumber: '#20231023041',
          name: '刘浩',
          role: '志愿者',
          userId: '991203',
          amount: 110,
          sourceType: 'volunteer',
          community: '阳光社区',
          donationTime: '2025-12-7 10:12:45',
          status: 'completed'
        }
      ]
    }
  },
  async mounted() {
    await this.loadPoolInfo()
  },
  computed: {
    visiblePages() {
      const pages = []
      const maxVisible = 5
      let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2))
      let end = Math.min(this.totalPages, start + maxVisible - 1)
      
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1)
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      return pages
    }
  },
  methods: {
    async loadPoolInfo() {
      try {
        const response = await getCharityPoolInfo()
        if (response.code === 200) {
          this.poolInfo = response.data
          console.log('公益池信息加载成功:', this.poolInfo)
        } else {
          console.error('获取公益池信息失败:', response.message)
        }
      } catch (error) {
        console.error('获取公益池信息出错:', error)
      }
    },
    getSourceTypeClass(type) {
      return {
        'tag-blue': type === 'volunteer',
        'tag-purple': type === 'heritage'
      }[type] || 'tag-gray'
    },
    getSourceTypeLabel(type) {
      const labels = {
        'volunteer': '主动捐赠',
        'heritage': '遗产转化'
      }
      const donation = this.donations.find(d => d.sourceType === type)
      if (type === 'heritage' && donation && donation.heritagePercent) {
        return `遗产转化 (${donation.heritagePercent}%)`
      }
      return labels[type] || type
    },
    getStatusColor(status) {
      const colors = {
        'completed': '#52c41a',
        'reviewing': '#999'
      }
      return colors[status] || '#999'
    },
    getStatusLabel(status) {
      const labels = {
        'completed': '已入池',
        'reviewing': '审核中'
      }
      return labels[status] || status
    },
    searchDonations() {
      console.log('搜索条件:', this.filters)
      // 这里添加搜索逻辑
    },
    resetFilters() {
      this.filters = {
        donor: '',
        sourceType: 'all',
        startDate: '',
        endDate: ''
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },
    goToPage(page) {
      this.currentPage = page
    }
  }
}
</script>

<style scoped>
.public-welfare-pool {
  padding: 24px;
  background-color: #f0f2f5;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 1.5rem;
  margin-bottom: 24px;
  font-weight: 500;
  color: #333;
}

/* 数据概览卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 24px;
}

.stat-card {
  background: #ffffff;
  padding: 24px;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.stat-label {
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 30px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.85);
}

.text-blue {
  color: #1890ff;
}

.text-green {
  color: #52c41a;
}

/* 表格区域 */
.table-container {
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
  padding: 24px;
}

/* 筛选栏 */
.filter-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-group label {
  color: #333;
  font-size: 14px;
  white-space: nowrap;
}

input, select {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  outline: none;
  transition: all 0.3s;
}

input:focus, select:focus {
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.btn {
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-primary {
  background: #1890ff;
  color: white;
}

.btn-primary:hover {
  background: #40a9ff;
}

.btn-reset {
  background: white;
  border: 1px solid #d9d9d9;
  color: #333;
}

.btn-reset:hover {
  border-color: #40a9ff;
  color: #40a9ff;
}

/* 表格样式 */
table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

thead tr {
  background-color: #fafafa;
  border-bottom: 1px solid #e8e8e8;
}

th {
  padding: 16px;
  font-weight: 500;
  color: #333;
}

td {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  color: #666;
}

tr:hover td {
  background-color: #fafafa;
}

/* 标签样式 */
.tag {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 12px;
  border: 1px solid;
}

.tag-blue {
  background: #e6f7ff;
  border-color: #91d5ff;
  color: #1890ff;
}

.tag-purple {
  background: #f9f0ff;
  border-color: #d3adf7;
  color: #722ed1;
}

.tag-gray {
  background: #f5f5f5;
  border-color: #d9d9d9;
  color: rgba(0, 0, 0, 0.25);
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  gap: 8px;
}

.page-item {
  padding: 5px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.page-item:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.page-item.active {
  border-color: #1890ff;
  color: #1890ff;
  font-weight: bold;
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-bar {
    flex-direction: column;
    gap: 12px;
  }
  
  .input-group {
    width: 100%;
  }
  
  .input-group:last-child {
    margin-left: 0;
  }
}
</style>
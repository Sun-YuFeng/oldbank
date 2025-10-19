<!-- 用户列表区 -->
 <template>
  <div class="list-section">
    <div class="list-container">
      <div class="list-header">
        <h3 class="list-title">用户列表</h3>
        <div class="list-info">
          <span class="info-text">共 {{ totalUsers }} 位用户，当前显示 {{ startIndex }}-{{ endIndex }} 位</span>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="user-table">
          <thead>
            <tr>
              <th>用户名</th>
              <th>手机号</th>
              <th>角色</th>
              <th>信用分</th>
              <th>状态</th>
              <th>注册时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in paginatedUsers" :key="user.id" class="table-row">
              <td class="user-name">{{ user.username }}</td>
              <td class="phone-number">{{ user.phone }}</td>
              <td class="user-role">{{ user.role }}</td>
              <td class="credit-score">{{ user.credit }}</td>
              <td>
                <span :class="['status-badge', getStatusClass(user.status)]">
                  {{ user.status }}
                </span>
              </td>
              <td class="register-time">{{ user.registerTime }}</td>
              <td class="actions">
                <button class="action-btn edit-btn">编辑</button>
                <button :class="['action-btn', user.status === '禁用' ? 'enable-btn' : 'disable-btn']">
                  {{ user.status === '禁用' ? '启用' : '禁用' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页组件 -->
      <div class="pagination-container">
        <div class="pagination">
          <button 
            class="pagination-btn" 
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
          >
            上一页
          </button>
          
          <div class="page-numbers">
            <button 
              v-for="page in totalPages" 
              :key="page"
              :class="['page-btn', { active: page === currentPage }]"
              @click="changePage(page)"
            >
              {{ page }}
            </button>
          </div>
          
          <button 
            class="pagination-btn" 
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserListSection',
  data() {
    return {
      users: [
        {
          id: 1,
          username: 'user1',
          phone: '13816277518',
          role: '管理员',
          credit: 226,
          status: '待审核',
          registerTime: '2025-08-05'
        },
        {
          id: 2,
          username: 'user2',
          phone: '13884068310',
          role: '志愿者',
          credit: 736,
          status: '活跃',
          registerTime: '2025-07-29'
        },
        {
          id: 3,
          username: 'user3',
          phone: '13891706193',
          role: '志愿者',
          credit: 231,
          status: '活跃',
          registerTime: '2025-08-21'
        },
        {
          id: 4,
          username: 'user4',
          phone: '13880348157',
          role: '管理员',
          credit: 637,
          status: '禁用',
          registerTime: '2025-08-24'
        },
        {
          id: 5,
          username: 'user5',
          phone: '13893284372',
          role: '志愿者',
          credit: 826,
          status: '待审核',
          registerTime: '2025-08-19'
        },
        {
          id: 6,
          username: 'user6',
          phone: '13876593440',
          role: '志愿者',
          credit: 890,
          status: '待审核',
          registerTime: '2025-08-09'
        },
        {
          id: 7,
          username: 'user7',
          phone: '13877961411',
          role: '管理员',
          credit: 725,
          status: '待审核',
          registerTime: '2025-08-11'
        },
        {
          id: 8,
          username: 'user8',
          phone: '13846169087',
          role: '需求者',
          credit: 213,
          status: '待审核',
          registerTime: '2025-08-01'
        },
        {
          id: 9,
          username: 'user9',
          phone: '13847273438',
          role: '管理员',
          credit: 618,
          status: '待审核',
          registerTime: '2025-08-06'
        },
        {
          id: 10,
          username: 'user10',
          phone: '13812345678',
          role: '志愿者',
          credit: 450,
          status: '活跃',
          registerTime: '2025-08-15'
        },
        {
          id: 11,
          username: 'user11',
          phone: '13823456789',
          role: '需求者',
          credit: 320,
          status: '活跃',
          registerTime: '2025-08-20'
        },
        {
          id: 12,
          username: 'user12',
          phone: '13834567890',
          role: '志愿者',
          credit: 780,
          status: '禁用',
          registerTime: '2025-08-12'
        },
        {
          id: 13,
          username: 'user13',
          phone: '13845678901',
          role: '管理员',
          credit: 920,
          status: '活跃',
          registerTime: '2025-08-08'
        },
        {
          id: 14,
          username: 'user14',
          phone: '13856789012',
          role: '志愿者',
          credit: 550,
          status: '待审核',
          registerTime: '2025-08-25'
        },
        {
          id: 15,
          username: 'user15',
          phone: '13867890123',
          role: '需求者',
          credit: 410,
          status: '活跃',
          registerTime: '2025-08-18'
        },
        {
          id: 16,
          username: 'user16',
          phone: '13878901234',
          role: '志愿者',
          credit: 680,
          status: '待审核',
          registerTime: '2025-08-22'
        },
        {
          id: 17,
          username: 'user17',
          phone: '13889012345',
          role: '管理员',
          credit: 830,
          status: '活跃',
          registerTime: '2025-08-14'
        },
        {
          id: 18,
          username: 'user18',
          phone: '13890123456',
          role: '需求者',
          credit: 290,
          status: '禁用',
          registerTime: '2025-08-07'
        }
      ],
      currentPage: 1,
      pageSize: 9
    }
  },
  computed: {
    totalUsers() {
      return this.users.length
    },
    totalPages() {
      return Math.ceil(this.totalUsers / this.pageSize)
    },
    paginatedUsers() {
      const startIndex = (this.currentPage - 1) * this.pageSize
      const endIndex = startIndex + this.pageSize
      return this.users.slice(startIndex, endIndex)
    },
    startIndex() {
      return (this.currentPage - 1) * this.pageSize + 1
    },
    endIndex() {
      const end = this.currentPage * this.pageSize
      return end > this.totalUsers ? this.totalUsers : end
    }
  },
  methods: {
    getStatusClass(status) {
      const statusMap = {
        '活跃': 'status-active',
        '禁用': 'status-disabled',
        '待审核': 'status-pending'
      }
      return statusMap[status] || 'status-default'
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
      }
    }
  }
}
</script>

<style scoped>
.list-section {
  margin-bottom: 24px;
}

.list-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.list-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.info-text {
  font-size: 14px;
  color: #64748b;
}

.table-wrapper {
  overflow-x: auto;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
}

.user-table th {
  background-color: #f8fafc;
  padding: 16px 20px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px solid #e2e8f0;
}

.table-row {
  transition: all 0.2s ease;
}

.table-row:hover {
  background-color: #f8fafc;
}

.user-table td {
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
  color: #374151;
}

.user-name {
  font-weight: 500;
  color: #1e293b;
}

.phone-number {
  color: #64748b;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  display: inline-block;
  min-width: 60px;
}

.status-active {
  background-color: #dcfce7;
  color: #166534;
}

.status-disabled {
  background-color: #fee2e2;
  color: #dc2626;
}

.status-pending {
  background-color: #fef3c7;
  color: #d97706;
}

.actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-btn {
  background-color: #3b82f6;
  color: white;
}

.edit-btn:hover {
  background-color: #2563eb;
}

.enable-btn {
  background-color: #10b981;
  color: white;
}

.enable-btn:hover {
  background-color: #059669;
}

.disable-btn {
  background-color: #ef4444;
  color: white;
}

.disable-btn:hover {
  background-color: #dc2626;
}

/* 分页样式 */
.pagination-container {
  padding: 20px 24px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: center;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-btn {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.pagination-btn:disabled {
  color: #9ca3af;
  cursor: not-allowed;
  background: #f9fafb;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.page-btn {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 40px;
}

.page-btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.page-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

@media (max-width: 768px) {
  .list-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .user-table {
    font-size: 12px;
  }
  
  .user-table th,
  .user-table td {
    padding: 12px 16px;
  }
  
  .actions {
    flex-direction: column;
    gap: 4px;
  }
  
  .pagination {
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px;
  }
  
  .page-numbers {
    order: -1;
    width: 100%;
    justify-content: center;
    margin-bottom: 8px;
  }
}
</style>

<template>
  <!-- 志愿者活跃度排名表格 - 使用盒子模型嵌套 -->
  <div class="table-container">
    <!-- 头部区域 -->
    <div class="header-section">
      <h3 class="table-title">志愿者活跃度排名</h3>
      <button class="export-button">
        <svg class="download-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        导出数据
      </button>
    </div>
    
    <!-- 表格区域 -->
    <div class="table-wrapper">
      <table class="volunteer-table">
        <thead>
          <tr class="table-header">
            <th class="checkbox-column">
              <input type="checkbox" class="table-checkbox">
            </th>
            <th class="name-column">姓名</th>
            <th class="score-column">信用分</th>
            <th class="service-column">服务次数</th>
            <th class="action-column">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="volunteer in volunteers" :key="volunteer.id" class="table-row">
            <td class="checkbox-cell">
              <input type="checkbox" class="table-checkbox">
            </td>
            <td class="name-cell">
              <div class="user-info">
                <div class="avatar">
                  <svg class="avatar-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <div class="user-details">
                  <div class="user-name">{{ volunteer.name }}</div>
                  <div class="user-id">ID: {{ volunteer.id }}</div>
                </div>
              </div>
            </td>
            <td class="score-cell">{{ volunteer.creditScore }}</td>
            <td class="service-cell">{{ volunteer.serviceCount }}</td>
            <td class="action-cell">
              <a href="#" class="detail-link">查看详情</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VolunteerTable',
  data() {
    return {
      volunteers: [
        { id: 1, name: '张伟', creditScore: 850, serviceCount: 42 },
        { id: 2, name: '李娜', creditScore: 820, serviceCount: 38 },
        { id: 3, name: '王芳', creditScore: 790, serviceCount: 35 },
        { id: 4, name: '赵强', creditScore: 780, serviceCount: 32 },
        { id: 5, name: '刘洋', creditScore: 760, serviceCount: 30 }
      ]
    };
  }
};
</script>

<style scoped>
/* 外层容器 - 带边框和阴影 */
.table-container {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

/* 头部区域 */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.table-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.export-button {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  background: #dbeafe;
  color: #2563eb;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.export-button:hover {
  background: #bfdbfe;
}

.download-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}

/* 表格包装器 */
.table-wrapper {
  overflow-x: auto;
}

/* 表格样式 */
.volunteer-table {
  width: 100%;
  border-collapse: collapse;
}

/* 表头样式 */
.table-header {
  border-bottom: 1px solid #f3f4f6;
}

.table-header th {
  padding: 12px 20px;
  text-align: left;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
}

.checkbox-column {
  width: 48px;
}

/* 表格行样式 */
.table-row {
  border-bottom: 1px solid #f9fafb;
  transition: background-color 0.2s;
}

.table-row:hover {
  background-color: #fafafa;
}

.table-row td {
  padding: 14px 20px;
  vertical-align: middle;
}

/* 复选框样式 */
.table-checkbox {
  width: 16px;
  height: 16px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
}

/* 用户信息区域 */
.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 36px;
  height: 36px;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.avatar-icon {
  width: 18px;
  height: 18px;
  color: #6b7280;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 13px;
  font-weight: 500;
  color: #111827;
  margin-bottom: 2px;
}

.user-id {
  font-size: 11px;
  color: #6b7280;
}

/* 数据单元格样式 */
.score-cell,
.service-cell {
  font-size: 13px;
  font-weight: 500;
  color: #111827;
}

/* 操作链接样式 */
.detail-link {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
  font-size: 13px;
  transition: color 0.2s;
}

.detail-link:hover {
  color: #1d4ed8;
}
</style>

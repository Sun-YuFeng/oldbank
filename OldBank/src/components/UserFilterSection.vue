<!-- 用户管理顶层 -->
 <template>
  <div class="filter-section">
    <div class="filter-container">
      <!-- 搜索框 -->
      <div class="search-box">
        <input 
          type="text" 
          placeholder="搜索用户名或手机号..."
          class="search-input"
          v-model="searchQuery"
        >
        <i class="fas fa-search search-icon"></i>
      </div>

      <!-- 过滤器 -->
      <div class="filters">
        <select class="filter-select" v-model="roleFilter">
          <option value="">所有角色</option>
          <option value="管理员">管理员</option>
          <option value="志愿者">志愿者</option>
          <option value="需求者">需求者</option>
        </select>

        <select class="filter-select" v-model="statusFilter">
          <option value="">所有状态</option>
          <option value="活跃">活跃</option>
          <option value="禁用">禁用</option>
          <option value="待审核">待审核</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserFilterSection',
  data() {
    return {
      searchQuery: '',
      roleFilter: '',
      statusFilter: ''
    }
  }
}
</script>

<style scoped>
.filter-section {
  margin-bottom: 24px;
}

.filter-container {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 300px;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f9fafb;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 14px;
}

.filters {
  display: flex;
  gap: 12px;
}

.filter-select {
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background-color: white;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-select:hover {
  border-color: #9ca3af;
}
</style>

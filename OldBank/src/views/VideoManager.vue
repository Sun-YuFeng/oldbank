<template>
  <div class="video-manager-page">
    <!-- 面包屑导航 -->
    <div class="breadcrumb">
      <span class="breadcrumb-item">首页</span>
      <span class="breadcrumb-separator">></span>
      <span class="breadcrumb-item active">视频管理</span>
    </div>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">库中视频总数</div>
            <div class="stat-value">
              128 
              <span class="trend">↑ 12%</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-label">累计观看次数</div>
            <div class="stat-value">42.5k</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">本月新增观众</div>
            <div class="stat-value">1,402</div>
          </div>
        </div>

        <div class="action-bar">
          <div class="search-area">
            <select>
              <option value="">所有分类</option>
              <option value="1">健康养生</option>
              <option value="2">生活技巧</option>
            </select>
            <input type="text" placeholder="搜索视频标题或描述...">
            <button class="btn btn-ghost">重置</button>
          </div>
          <button class="btn btn-primary">+ 新增视频元数据</button>
        </div>

        <div class="video-card-container">
          <table>
            <thead>
              <tr>
                <th>视频信息</th>
                <th>所属分类</th>
                <th>数据统计</th>
                <th>当前状态</th>
                <th>上传时间</th>
                <th class="actions-header">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div class="video-info">
                    <div class="thumb-wrapper">
                      <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200" class="thumb-img">
                    </div>
                    <div>
                      <span class="video-title-main">老年人晨练健康操</span>
                      <span class="video-duration">10:24 • 48.5 MB</span>
                    </div>
                  </div>
                </td>
                <td><span class="category-text">健康养生</span></td>
                <td>
                  <div class="play-count">8,432</div>
                  <div class="play-label">播放</div>
                </td>
                <td><span class="status-badge published">已发布</span></td>
                <td>2025-12-20</td>
                <td class="actions-cell">
                  <div class="action-btns">
                    <button class="icon-btn" title="编辑">✎</button>
                    <button class="icon-btn" title="下线">⊘</button>
                    <button class="icon-btn delete-btn" title="软删除">🗑</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="video-info">
                    <div class="thumb-wrapper">
                      <div class="no-thumb">无封面</div>
                    </div>
                    <div>
                      <span class="video-title-main">智能手机使用教学 (待补全)</span>
                      <span class="video-duration">05:12 • 22.1 MB</span>
                    </div>
                  </div>
                </td>
                <td><span class="category-text">生活技巧</span></td>
                <td>
                  <div class="play-count">0</div>
                  <div class="play-label">播放</div>
                </td>
                <td><span class="status-badge draft">草稿/未发布</span></td>
                <td>2025-12-21</td>
                <td class="actions-cell">
                  <div class="action-btns">
                    <button class="icon-btn">✎</button>
                    <button class="icon-btn publish-btn">发布</button>
                    <button class="icon-btn delete-btn">🗑</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  </div>
</template>

<script>
export default {
  name: 'VideoManager',
  data() {
    return {
      // 可以在这里添加视频数据
    }
  }
}
</script>

<style scoped>
.video-manager-page {
  padding: 24px;
  width: 100%;
  box-sizing: border-box;
}

.breadcrumb {
  margin-bottom: 24px;
  font-size: 14px;
  color: #6b7280;
}

.breadcrumb-item {
  color: #6b7280;
}

.breadcrumb-item.active {
  color: #1f2937;
  font-weight: 500;
}

.breadcrumb-separator {
  margin: 0 8px;
  color: #9ca3af;
}

/* 统计卡片 */
.stats-grid {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.stat-card {
  flex: 1;
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  min-width: 0;
}

.stat-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.trend {
  font-size: 12px;
  color: #10b981;
  font-weight: normal;
}

/* 操作栏 */
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.search-area {
  display: flex;
  gap: 12px;
  align-items: center;
}

input, select {
  padding: 10px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
  transition: all 0.3s;
  background: #fff;
  color: #1f2937;
}

input:focus, select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

input::placeholder {
  color: #9ca3af;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-primary {
  background: #3b82f6;
  color: #fff;
}

.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-ghost {
  background: #fff;
  border: 1px solid #e2e8f0;
  color: #6b7280;
}

.btn-ghost:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  color: #4b5563;
}

/* 视频列表 */
.video-card-container {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.video-card-container:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: 16px 24px;
  font-size: 12px;
  text-transform: uppercase;
  color: #6b7280;
  background: #f9fafb;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.actions-header {
  text-align: right;
}

td {
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
  vertical-align: middle;
  color: #1f2937;
}

.actions-cell {
  text-align: right;
}

tr:last-child td {
  border-bottom: none;
}

tr:hover td {
  background-color: #fafbfc;
}

/* 视频信息 */
.video-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.thumb-wrapper {
  position: relative;
  width: 100px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-thumb {
  background: #f9fafb;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 12px;
  border: 1px solid #e5e7eb;
}

.video-title-main {
  font-weight: 600;
  color: #1f2937;
  display: block;
  margin-bottom: 4px;
  font-size: 14px;
  line-height: 1.4;
}

.video-duration {
  font-size: 12px;
  color: #6b7280;
}

/* 分类文本 */
.category-text {
  color: #6b7280;
  font-size: 14px;
}

/* 播放数据 */
.play-count {
  font-weight: 600;
  color: #1f2937;
  font-size: 16px;
}

.play-label {
  font-size: 12px;
  color: #6b7280;
}

/* 状态标签 */
.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
  transition: all 0.2s ease;
}

.published {
  background: #dcfce7;
  color: #166534;
}

.published:hover {
  background: #bbf7d0;
}

.draft {
  background: #f3f4f6;
  color: #4b5563;
}

.draft:hover {
  background: #e5e7eb;
}

/* 操作按钮 */
.action-btns {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.icon-btn {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #6b7280;
}

.icon-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: #f0f9ff;
  transform: translateY(-1px);
}

.delete-btn:hover {
  border-color: #ef4444;
  color: #ef4444;
  background: #fef2f2;
}

.publish-btn {
  color: #3b82f6;
}

.publish-btn:hover {
  background: #3b82f6;
  color: #fff;
  border-color: #3b82f6;
}
</style>
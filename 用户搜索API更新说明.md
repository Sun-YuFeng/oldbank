# 用户搜索API更新说明

## 更新概述

后台管理系统已更新用户搜索相关API，采用新的专用搜索接口，提供更精确和高效的用户搜索功能。

## 新增API接口

### 1. 搜索用户
```javascript
// API路径：GET /api/admin/user-search
// 参数：username（可选）, phone（可选）, page（页码）, pageSize（每页数量）
export const searchUsers = (username = '', phone = '', page = 1, pageSize = 10)
```

### 2. 获取用户详细信息  
```javascript
// API路径：GET /api/admin/user-search/{userId}
export const getUserDetail = (userId)
```

## 主要改进

### 1. 搜索功能增强
- ✅ 支持用户名模糊搜索
- ✅ 支持手机号模糊搜索  
- ✅ 支持组合搜索（用户名+手机号）
- ✅ 分页显示搜索结果

### 2. 数据字段优化
- ✅ 返回更完整的用户信息（真实姓名、邮箱、地址等）
- ✅ 统一响应格式（使用`total`而非`totalElements`）
- ✅ 新增用户状态字段（禁用原因、到期时间等）

### 3. 用户界面改进
- ✅ 详情按钮现在可以查看完整用户信息
- ✅ 美观的弹窗显示用户详细信息
- ✅ 兼容旧的筛选功能（前端处理）

## API响应格式

### 搜索用户响应
```json
{
  "code": 200,
  "message": "操作成功", 
  "data": {
    "content": [...], // 用户列表
    "total": 1,       // 总数量
    "totalPages": 1,  // 总页数
    "currentPage": 1, // 当前页
    "pageSize": 10,   // 每页大小
    "isFirst": true,
    "isLast": true,
    "isEmpty": false
  }
}
```

### 用户详情响应
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": 1,
    "username": "zhangsan",
    "realName": "张三",
    "phone": "13800138000",
    "email": "zhangsan@example.com",
    "avatar": "/uploads/avatars/xxx.jpg",
    "address": "北京市朝阳区",
    "age": 65,
    "userIdentity": "需求者",
    "roles": "需求者",
    "banned": false,
    "banReason": null,
    "banExpireTime": null,
    "warmCoin": 100,
    "status": 2,
    "lastLoginTime": "2025-12-02 10:30:00",
    "createTime": "2025-11-01 09:00:00"
  }
}
```

## 兼容性说明

### ✅ 保留兼容
- 旧的`getUserListWithFilters`函数仍然可用
- 现有的搜索筛选功能继续工作
- 分页逻辑保持不变

### ⚠️ 注意事项
- 新API不支持角色和状态筛选，需要在前端处理
- 建议逐步迁移到新的搜索API
- 响应数据字段有所调整，前端代码已适配

## 使用示例

```javascript
// 1. 根据用户名搜索
searchUsers('张三', '', 1, 10)

// 2. 根据手机号搜索  
searchUsers('', '138', 1, 10)

// 3. 组合搜索
searchUsers('张', '138', 1, 10)

// 4. 获取用户详情
getUserDetail(1)
```

## 文件修改记录

1. **src/utils/api.js**
   - 新增 `searchUsers` 函数
   - 新增 `getUserDetail` 函数
   - 更新 `getUserListWithFilters` 以适配新API

2. **src/components/UserListSection.vue**
   - 导入新的API函数
   - 更新 `fetchUserList` 方法
   - 新增 `handleViewUserDetail` 方法
   - 添加详情按钮点击事件
   - 新增弹窗样式

## 后续建议

1. 考虑添加用户头像显示功能
2. 增加用户编辑功能
3. 实现更高级的筛选选项
4. 添加用户活动日志查看功能
# 后台管理系统API接口文档

## 📋 目录

1. [认证与授权](#1-认证与授权)
2. [用户管理](#2-用户管理)
3. [任务管理](#3-任务管理)
4. [投诉管理](#4-投诉管理)
5. [志愿者管理](#5-志愿者管理)
6. [仪表板统计](#6-仪表板统计)
7. [账户管理](#7-账户管理)
8. [文件上传](#8-文件上传)

---

## 接口基本信息

### 基础URL
```
http://localhost:8080/silveragepass
```

### 认证方式
所有后台接口都需要JWT Token认证，在请求头中添加：
```
Authorization: Bearer {token}
```

### 权限要求
大部分接口需要 `ROLE_ADMIN` 权限（管理员角色）

### 响应格式
统一使用以下响应格式：
```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

### 错误码说明
| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未认证或Token无效 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 1. 认证与授权

### 1.1 管理员登录

**接口地址**: `POST /api/auth/admin/login`

**权限要求**: 无需认证

**请求参数**:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "type": "Bearer",
    "username": "admin",
    "roles": ["ROLE_ADMIN"]
  }
}
```

**请求示例**:
```bash
curl -X POST "http://localhost:8080/silveragepass/api/auth/admin/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

---

## 2. 用户管理

### 2.1 获取用户列表

**接口地址**: `GET /api/users`

**权限要求**: `ROLE_ADMIN`

**请求参数**:
| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| page | Integer | 否 | 1 | 页码（从1开始） |
| pageSize | Integer | 否 | 9 | 每页大小 |
| search | String | 否 | - | 搜索关键词（用户名/手机号） |
| role | String | 否 | - | 角色筛选 |
| status | String | 否 | - | 状态筛选 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "content": [
      {
        "id": 1,
        "username": "张三",
        "phone": "13800138000",
        "userIdentity": "需求者",
        "warmCoin": 100,
        "status": 5,
        "banReason": null,
        "registerTime": "2024-01-15"
      }
    ],
    "totalElements": 125,
    "totalPages": 14,
    "currentPage": 0,
    "pageSize": 9,
    "first": true,
    "last": false,
    "empty": false
  }
}
```

**字段说明**:
- `status`: 距离上次登录天数（-1表示从未登录）
- `userIdentity`: 用户身份（需求者/志愿者/管理员）
- `warmCoin`: 暖龄币余额

**请求示例**:
```bash
# 获取第一页用户
curl -X GET "http://localhost:8080/silveragepass/api/users?page=1&pageSize=10" \
  -H "Authorization: Bearer {token}"

# 搜索用户
curl -X GET "http://localhost:8080/silveragepass/api/users?search=张三" \
  -H "Authorization: Bearer {token}"
```

---

### 2.2 获取用户总数

**接口地址**: `GET /api/users/count`

**权限要求**: `ROLE_ADMIN`

**请求参数**:
| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| includeDeleted | Boolean | 否 | false | 是否包含已删除用户 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": 1523
}
```

**请求示例**:
```bash
# 获取活跃用户数
curl -X GET "http://localhost:8080/silveragepass/api/users/count" \
  -H "Authorization: Bearer {token}"

# 获取所有用户数（包括已删除）
curl -X GET "http://localhost:8080/silveragepass/api/users/count?includeDeleted=true" \
  -H "Authorization: Bearer {token}"
```

---

### 2.3 获取用户创建统计

**接口地址**: `GET /api/users/creation-stats`

**权限要求**: `ROLE_ADMIN`

**请求参数**:
| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| days | Integer | 否 | 7 | 统计天数 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "dates": ["10/26", "10/27", "10/28", "10/29", "10/30", "10/31", "11/1"],
    "counts": [5, 8, 12, 7, 15, 10, 6]
  }
}
```

**请求示例**:
```bash
# 获取近7天创号统计
curl -X GET "http://localhost:8080/silveragepass/api/users/creation-stats?days=7" \
  -H "Authorization: Bearer {token}"
```

---

### 2.4 获取用户角色分布

**接口地址**: `GET /api/users/role-stats`

**权限要求**: `ROLE_ADMIN`

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    { "name": "需求者", "value": 856 },
    { "name": "志愿者", "value": 234 },
    { "name": "管理员", "value": 12 }
  ]
}
```

---

### 2.5 获取用户状态分布

**接口地址**: `GET /api/users/status-stats`

**权限要求**: `ROLE_ADMIN`

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    { "name": "活跃", "value": 980 },
    { "name": "禁用", "value": 45 },
    { "name": "待审核", "value": 0 }
  ]
}
```

---

### 2.6 禁用或解禁用户

**接口地址**: `POST /api/users/ban`

**权限要求**: `ROLE_ADMIN`

**请求参数**:
```json
{
  "userId": 123,
  "banned": true,
  "reason": "违规发布虚假信息",
  "days": 7
}
```

**参数说明**:
- `userId`: 用户ID（必填）
- `banned`: true=禁用，false=解禁（必填）
- `reason`: 禁用原因（禁用时建议填写）
- `days`: 禁用天数（null或0表示永久禁用）

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": "用户已被禁用7天，到期时间：2024-11-09 10:30:00，原因：违规发布虚假信息"
}
```

**请求示例**:
```bash
# 临时禁用7天
curl -X POST "http://localhost:8080/silveragepass/api/users/ban" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 123,
    "banned": true,
    "reason": "违规发布虚假信息",
    "days": 7
  }'

# 永久禁用
curl -X POST "http://localhost:8080/silveragepass/api/users/ban" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 123,
    "banned": true,
    "reason": "严重违规"
  }'

# 解禁用户
curl -X POST "http://localhost:8080/silveragepass/api/users/ban" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 123,
    "banned": false
  }'
```

---

### 2.7 删除用户

**接口地址**: `DELETE /api/users/{userId}`

**权限要求**: `ROLE_ADMIN`

**请求参数**:
| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| userId | Long | 是 | - | 用户ID（路径参数） |
| hardDelete | Boolean | 否 | false | 是否硬删除（true=永久删除，false=软删除可恢复） |
| reason | String | 否 | - | 删除原因 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": "用户已删除（软删除，可恢复）"
}
```

**请求示例**:
```bash
# 软删除（可恢复）
curl -X DELETE "http://localhost:8080/silveragepass/api/users/123?hardDelete=false&reason=僵尸账号清理" \
  -H "Authorization: Bearer {token}"

# 硬删除（永久删除）
curl -X DELETE "http://localhost:8080/silveragepass/api/users/123?hardDelete=true&reason=用户申请注销" \
  -H "Authorization: Bearer {token}"
```

**僵尸账号清理**:
```javascript
// 识别僵尸账号：从未登录(status=-1)或180天以上未登录(status>180)
async function cleanupZombieAccounts() {
  const response = await axios.get('/api/users?page=1&pageSize=1000');
  const zombieUsers = response.data.data.content.filter(
    user => user.status === -1 || user.status > 180
  );
  
  for (const user of zombieUsers) {
    await axios.delete(
      `/api/users/${user.id}?hardDelete=false&reason=僵尸账号清理`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
  }
}
```

---

## 3. 任务管理

### 3.1 获取任务列表

**接口地址**: `GET /api/admin/demands`

**权限要求**: `ROLE_ADMIN`

**请求参数**:
| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| page | Integer | 否 | 1 | 页码（从1开始） |
| pageSize | Integer | 否 | 10 | 每页大小 |
| search | String | 否 | - | 搜索关键词（任务标题/描述） |
| status | String | 否 | - | 状态筛选（WAITING/IN_PROGRESS/COMPLETED/CANCELLED） |
| type | String | 否 | - | 类型筛选 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "content": [
      {
        "id": 1,
        "title": "陪同老人购物",
        "publisherName": "张三",
        "publisherPhone": "13800138000",
        "publishTime": "2024-01-15 10:30:00",
        "warmCoin": 50,
        "status": "待接单",
        "statusCode": "WAITING",
        "type": "SHOPPING",
        "volunteerName": "暂无",
        "serviceAddress": "北京市朝阳区XXX街道",
        "acceptTime": null,
        "completeTime": null
      },
      {
        "id": 2,
        "title": "陪同就医",
        "publisherName": "李四",
        "publisherPhone": "13900139000",
        "publishTime": "2024-01-15 09:00:00",
        "warmCoin": 80,
        "status": "进行中",
        "statusCode": "IN_PROGRESS",
        "type": "MEDICAL",
        "volunteerName": "王志愿",
        "serviceAddress": "北京市海淀区医院路1号",
        "acceptTime": "2024-01-15 10:00:00",
        "completeTime": null
      }
    ],
    "totalElements": 125,
    "totalPages": 13,
    "currentPage": 0,
    "pageSize": 10,
    "first": true,
    "last": false,
    "empty": false
  }
}
```

**状态码说明**:
| 状态码 | 中文描述 | 说明 |
|--------|----------|------|
| WAITING | 待接单 | 任务已发布，等待志愿者接单 |
| IN_PROGRESS | 进行中 | 志愿者已接单，正在服务中 |
| COMPLETED | 已完成 | 服务已完成 |
| CANCELLED | 已取消 | 任务已被取消 |

**请求示例**:
```bash
# 获取所有任务
curl -X GET "http://localhost:8080/silveragepass/api/admin/demands?page=1&pageSize=10" \
  -H "Authorization: Bearer {token}"

# 搜索任务
curl -X GET "http://localhost:8080/silveragepass/api/admin/demands?search=购物" \
  -H "Authorization: Bearer {token}"

# 按状态筛选
curl -X GET "http://localhost:8080/silveragepass/api/admin/demands?status=WAITING" \
  -H "Authorization: Bearer {token}"

# 组合查询
curl -X GET "http://localhost:8080/silveragepass/api/admin/demands?page=1&pageSize=20&status=IN_PROGRESS&search=就医" \
  -H "Authorization: Bearer {token}"
```

---

### 3.2 获取任务详情

**接口地址**: `GET /api/admin/demands/{id}`

**权限要求**: `ROLE_ADMIN`

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | Long | 是 | 任务ID（路径参数） |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "title": "陪同老人购物",
    "publisherName": "张三",
    "publisherPhone": "13800138000",
    "publishTime": "2024-01-15 10:30:00",
    "warmCoin": 50,
    "status": "已完成",
    "statusCode": "COMPLETED",
    "type": "SHOPPING",
    "volunteerName": "王志愿",
    "serviceAddress": "北京市朝阳区XXX街道",
    "acceptTime": "2024-01-15 11:00:00",
    "completeTime": "2024-01-15 14:30:00"
  }
}
```

**请求示例**:
```bash
curl -X GET "http://localhost:8080/silveragepass/api/admin/demands/1" \
  -H "Authorization: Bearer {token}"
```

---

## 4. 投诉管理

### 4.1 获取投诉列表

**接口地址**: `GET /api/complaints`

**权限要求**: `ROLE_ADMIN`

**请求参数**:
| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| page | Integer | 否 | 1 | 页码（从1开始） |
| pageSize | Integer | 否 | 10 | 每页大小 |
| search | String | 否 | - | 搜索关键词（标题/描述） |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "content": [
      {
        "id": 1,
        "title": "志愿者服务态度差",
        "description": "服务过程中态度恶劣，不耐烦",
        "author": "张三",
        "phone": "13800138000",
        "time": "2024-01-15 10:30:00",
        "image": "http://example.com/image1.jpg",
        "images": ["http://example.com/image1.jpg", "http://example.com/image2.jpg"],
        "status": "pending",
        "handler": null,
        "handleTime": null,
        "result": null
      }
    ],
    "totalElements": 45,
    "totalPages": 5,
    "currentPage": 0,
    "pageSize": 10,
    "first": true,
    "last": false,
    "empty": false
  }
}
```

**请求示例**:
```bash
# 获取投诉列表
curl -X GET "http://localhost:8080/silveragepass/api/complaints?page=1&pageSize=10" \
  -H "Authorization: Bearer {token}"

# 搜索投诉
curl -X GET "http://localhost:8080/silveragepass/api/complaints?search=服务态度" \
  -H "Authorization: Bearer {token}"
```

---

### 4.2 获取投诉详情

**接口地址**: `GET /api/complaints/{id}`

**权限要求**: `ROLE_ADMIN`

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | Long | 是 | 投诉ID（路径参数） |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "title": "志愿者服务态度差",
    "description": "服务过程中态度恶劣，不耐烦，对老人不尊重",
    "author": "张三",
    "phone": "13800138000",
    "time": "2024-01-15 10:30:00",
    "images": ["http://example.com/image1.jpg", "http://example.com/image2.jpg"],
    "status": "resolved",
    "handler": "管理员A",
    "handleTime": "2024-01-15 14:00:00",
    "result": "经核实，该志愿者确实存在服务态度问题，已对其进行警告处理"
  }
}
```

**请求示例**:
```bash
curl -X GET "http://localhost:8080/silveragepass/api/complaints/1" \
  -H "Authorization: Bearer {token}"
```

---

### 4.3 处理投诉

**接口地址**: `POST /api/complaints/{id}/handle`

**权限要求**: `ROLE_ADMIN`

**请求参数**:
```json
{
  "result": "经核实，该志愿者确实存在服务态度问题，已对其进行警告处理"
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": "投诉已处理"
}
```

**请求示例**:
```bash
curl -X POST "http://localhost:8080/silveragepass/api/complaints/1/handle" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "result": "经核实，该志愿者确实存在服务态度问题，已对其进行警告处理"
  }'
```

---

## 5. 志愿者管理

### 5.1 获取志愿者列表

**接口地址**: `GET /api/volunteers`

**权限要求**: `ROLE_ADMIN`

**请求参数**:
| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| page | Integer | 否 | 1 | 页码 |
| pageSize | Integer | 否 | 10 | 每页大小 |
| search | String | 否 | - | 搜索关键词 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "content": [
      {
        "id": 1,
        "name": "王志愿",
        "phone": "13800138001",
        "totalTasks": 25,
        "completedTasks": 23,
        "warmCoin": 1150,
        "rating": 4.8,
        "status": "活跃"
      }
    ],
    "totalElements": 234,
    "totalPages": 24,
    "currentPage": 0,
    "pageSize": 10,
    "first": true,
    "last": false,
    "empty": false
  }
}
```

---

### 5.2 获取志愿者详情

**接口地址**: `GET /api/volunteers/{id}`

**权限要求**: `ROLE_ADMIN`

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | Long | 是 | 志愿者ID（路径参数） |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "name": "王志愿",
    "phone": "13800138001",
    "email": "volunteer@example.com",
    "address": "北京市朝阳区",
    "totalTasks": 25,
    "completedTasks": 23,
    "warmCoin": 1150,
    "rating": 4.8,
    "status": "活跃",
    "registerTime": "2023-06-15 10:00:00",
    "lastLoginTime": "2024-11-01 15:30:00"
  }
}
```

---

## 6. 仪表板统计

### 6.1 获取仪表板概览数据

**接口地址**: `GET /api/dashboard/overview`

**权限要求**: `ROLE_ADMIN`

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "totalUsers": 1523,
    "totalVolunteers": 234,
    "totalDemands": 856,
    "completedDemands": 645,
    "pendingComplaints": 12,
    "activeVolunteers": 189,
    "todayNewUsers": 8,
    "todayNewDemands": 15
  }
}
```

---

## 7. 账户管理

### 7.1 获取管理员账户列表

**接口地址**: `GET /api/accounts`

**权限要求**: `ROLE_ADMIN`

**请求参数**:
| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| page | Integer | 否 | 1 | 页码 |
| pageSize | Integer | 否 | 10 | 每页大小 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "content": [
      {
        "id": 1,
        "username": "admin",
        "realName": "系统管理员",
        "email": "admin@example.com",
        "phone": "13800138888",
        "level": "SUPER_ADMIN",
        "enabled": true,
        "lastLoginTime": "2024-11-01 10:00:00",
        "createTime": "2023-01-01 00:00:00"
      }
    ],
    "totalElements": 12,
    "totalPages": 2,
    "currentPage": 0,
    "pageSize": 10,
    "first": true,
    "last": false,
    "empty": false
  }
}
```

---

### 7.2 创建管理员账户

**接口地址**: `POST /api/accounts`

**权限要求**: `ROLE_ADMIN`（超级管理员）

**请求参数**:
```json
{
  "username": "admin2",
  "password": "password123",
  "realName": "管理员2",
  "email": "admin2@example.com",
  "phone": "13800138002",
  "level": "ADMIN"
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": "管理员账户创建成功"
}
```

---

## 8. 文件上传

### 8.1 上传文件

**接口地址**: `POST /api/files/upload`

**权限要求**: `ROLE_ADMIN`

**请求方式**: `multipart/form-data`

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| file | File | 是 | 要上传的文件 |
| type | String | 否 | 文件类型（avatar/complaint/proof等） |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "fileName": "avatar_1234567890.jpg",
    "fileUrl": "http://localhost:8080/silveragepass/uploads/avatar_1234567890.jpg",
    "fileSize": 102400,
    "uploadTime": "2024-11-01 10:30:00"
  }
}
```

**请求示例**:
```bash
curl -X POST "http://localhost:8080/silveragepass/api/files/upload" \
  -H "Authorization: Bearer {token}" \
  -F "file=@/path/to/image.jpg" \
  -F "type=avatar"
```

---

## 9. 常见使用场景

### 9.1 完整的用户管理流程

```javascript
// 1. 获取用户列表
const usersResponse = await axios.get('/api/users?page=1&pageSize=10', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// 2. 搜索特定用户
const searchResponse = await axios.get('/api/users?search=张三', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// 3. 禁用用户（7天）
await axios.post('/api/users/ban', {
  userId: 123,
  banned: true,
  reason: '违规发布信息',
  days: 7
}, {
  headers: { 'Authorization': `Bearer ${token}` }
});

// 4. 软删除用户
await axios.delete('/api/users/123?hardDelete=false&reason=用户申请', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

### 9.2 僵尸账号批量清理

```javascript
async function cleanupZombieAccounts(token) {
  // 1. 获取所有用户
  const response = await axios.get('/api/users?page=1&pageSize=1000', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  // 2. 筛选僵尸账号
  const zombieUsers = response.data.data.content.filter(user => 
    user.status === -1 || user.status > 180
  );
  
  console.log(`发现 ${zombieUsers.length} 个僵尸账号`);
  
  // 3. 批量删除
  const results = [];
  for (const user of zombieUsers) {
    try {
      const reason = user.status === -1 
        ? '从未登录' 
        : `${user.status}天未登录`;
      
      await axios.delete(
        `/api/users/${user.id}?hardDelete=false&reason=僵尸账号清理（${reason}）`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      results.push({ userId: user.id, success: true });
      
      // 延迟100ms避免请求过快
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      results.push({ userId: user.id, success: false, error: error.message });
    }
  }
  
  const successCount = results.filter(r => r.success).length;
  console.log(`清理完成：成功 ${successCount} 个，失败 ${results.length - successCount} 个`);
  
  return results;
}
```

---

### 9.3 任务监控和管理

```javascript
async function monitorDemands(token) {
  // 1. 获取待接单任务
  const waitingResponse = await axios.get('/api/admin/demands?status=WAITING', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  // 2. 获取进行中任务
  const inProgressResponse = await axios.get('/api/admin/demands?status=IN_PROGRESS', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  // 3. 获取今日完成任务
  const completedResponse = await axios.get('/api/admin/demands?status=COMPLETED', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  return {
    waiting: waitingResponse.data.data.totalElements,
    inProgress: inProgressResponse.data.data.totalElements,
    completed: completedResponse.data.data.totalElements
  };
}
```

---

### 9.4 投诉处理流程

```javascript
async function handleComplaint(complaintId, result, token) {
  // 1. 获取投诉详情
  const detailResponse = await axios.get(`/api/complaints/${complaintId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const complaint = detailResponse.data.data;
  console.log('投诉详情:', complaint);
  
  // 2. 处理投诉
  await axios.post(`/api/complaints/${complaintId}/handle`, {
    result: result
  }, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  console.log('投诉处理完成');
}

// 注意：后台任务管理接口路径为 /api/admin/demands
// 前端用户任务接口路径为 /api/demands

// 使用示例
handleComplaint(1, '经核实，已对相关人员进行处理', token);
```

---

## 10. 错误处理

### 统一错误响应格式

```json
{
  "code": 400,
  "message": "请求参数错误",
  "data": null
}
```

### 常见错误及解决方案

| 错误码 | 错误信息 | 原因 | 解决方案 |
|--------|----------|------|----------|
| 401 | 认证失败 | Token无效或过期 | 重新登录获取新Token |
| 403 | 无权限访问 | 当前账户没有管理员权限 | 使用管理员账户登录 |
| 404 | 资源不存在 | 请求的用户/任务/投诉不存在 | 检查ID是否正确 |
| 400 | 请求参数错误 | 参数格式不正确或缺少必填参数 | 检查请求参数 |
| 500 | 服务器内部错误 | 服务器异常 | 查看服务器日志，联系技术支持 |

### 前端统一错误处理示例

```javascript
// Axios 拦截器
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Token过期，跳转到登录页
          alert('登录已过期，请重新登录');
          window.location.href = '/login';
          break;
        case 403:
          alert('无权限访问此资源');
          break;
        case 404:
          alert('请求的资源不存在');
          break;
        case 500:
          alert('服务器内部错误，请稍后重试');
          break;
        default:
          alert('请求失败: ' + error.response.data.message);
      }
    }
    return Promise.reject(error);
  }
);
```

---

## 11. 接口测试建议

### Postman 环境配置

1. **创建环境变量**:
   - `baseUrl`: `http://localhost:8080/silveragepass`
   - `token`: 登录后获取的JWT Token

2. **设置请求头**:
   - 在Collection级别设置全局Header:
   ```
   Authorization: Bearer {{token}}
   Content-Type: application/json
   ```

3. **测试流程**:
   - 先调用登录接口获取Token
   - 将Token保存到环境变量
   - 测试其他接口

### 测试用例示例

```javascript
// Postman Tests 脚本示例

// 检查响应状态
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// 检查响应格式
pm.test("Response has correct structure", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('code');
    pm.expect(jsonData).to.have.property('message');
    pm.expect(jsonData).to.have.property('data');
});

// 自动保存Token
if (pm.response.json().data && pm.response.json().data.token) {
    pm.environment.set("token", pm.response.json().data.token);
}
```

---

## 12. 总结

### 接口清单

| 模块 | 接口数量 | 主要功能 |
|------|----------|----------|
| 认证与授权 | 1 | 管理员登录 |
| 用户管理 | 7 | 用户CRUD、统计、禁用、删除 |
| 任务管理 | 2 | 任务查询、详情 |
| 投诉管理 | 3 | 投诉查询、处理 |
| 志愿者管理 | 2 | 志愿者查询、详情 |
| 仪表板统计 | 1 | 概览数据 |
| 账户管理 | 2 | 管理员账户管理 |
| 文件上传 | 1 | 文件上传 |

### 核心功能特性

✅ **完整的用户管理** - 查询、搜索、筛选、禁用、删除  
✅ **僵尸账号清理** - 自动识别和批量清理长期未登录账号  
✅ **任务监控** - 实时查看任务状态和进度  
✅ **投诉处理** - 查看和处理用户投诉  
✅ **数据统计** - 多维度数据统计和可视化  
✅ **权限控制** - 基于JWT的认证和授权  
✅ **软删除支持** - 数据可恢复的软删除机制  

### 最佳实践建议

1. **Token管理**: 定期刷新Token，避免过期
2. **错误处理**: 实现统一的错误处理机制
3. **参数验证**: 前端做好参数验证，减少无效请求
4. **批量操作**: 批量操作时添加延迟，避免服务器压力过大
5. **日志记录**: 重要操作（删除、禁用）应记录日志
6. **数据备份**: 硬删除前确保数据已备份

---

## 附录

### A. 状态码对照表

#### 用户状态
- `-1`: 从未登录
- `0-30`: 活跃用户
- `31-90`: 较活跃用户
- `91-180`: 不活跃用户
- `>180`: 僵尸账号

#### 任务状态
- `WAITING`: 待接单
- `IN_PROGRESS`: 进行中
- `COMPLETED`: 已完成
- `CANCELLED`: 已取消

#### 投诉状态
- `pending`: 待处理
- `resolved`: 已处理

### B. 数据库字段映射

| Entity字段 | 数据库字段 | 类型 | 说明 |
|-----------|-----------|------|------|
| enabled | enabled | BOOLEAN | 账户是否启用 |
| deleted | deleted | BOOLEAN | 是否已删除（软删除标记） |
| lastLoginTime | last_login_time | DATETIME | 最后登录时间 |
| bannedUntil | banned_until | DATETIME | 禁用到期时间 |
| banReason | ban_reason | VARCHAR(500) | 封禁原因 |
| deletedTime | deleted_time | DATETIME | 删除时间 |

---

**文档版本**: v1.0  
**最后更新**: 2024-11-02  
**维护者**: SilverAgePass Team


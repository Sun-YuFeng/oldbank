# 银龄通后台管理系统完整API接口文档

## 📋 目录

1. [接口概览](#1-接口概览)
2. [认证与授权](#2-认证与授权)
3. [用户管理](#3-用户管理)
4. [任务管理](#4-任务管理)
5. [投诉管理](#6-投诉管理)
6. [志愿者管理](#7-志愿者管理)
7. [暖龄币管理](#8-暖龄币管理)
8. [仪表板统计](#9-仪表板统计)
9. [账户管理](#10-账户管理)
10. [文件上传](#11-文件上传)
11. [数据导入](#12-数据导入)
12. [错误处理](#13-错误处理)
13. [测试指南](#14-测试指南)

---

## 1. 接口概览

### 基础信息

| 项目 | 说明 |
|------|------|
| **系统名称** | 银龄通后台管理系统 |
| **版本** | v1.0 |
| **基础URL** | `http://localhost:8080/silveragepass` |
| **认证方式** | JWT Token |
| **数据格式** | JSON |

### 接口统计

| 模块 | 接口数量 | 主要功能 |
|------|----------|----------|
| 认证授权 | 1 | 管理员登录 |
| 用户管理 | 7 | 用户CRUD、统计、禁用、删除 |
| 任务管理 | 2 | 任务查看、管理 |
| 投诉管理 | 3 | 投诉处理、管理 |
| 志愿者管理 | 4 | 志愿者信息、服务量统计 |
| 暖龄币管理 | 3 | 流通记录查询 |
| 仪表板统计 | 1 | 系统概览数据 |
| 账户管理 | 2 | 管理员账户管理 |
| 文件上传 | 1 | 文件上传功能 |
| **总计** | **24个接口** | |

---

## 2. 认证与授权

### 2.1 管理员登录

**接口**: `POST /api/auth/admin/login`

**权限**: 无需认证

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

**使用说明**: 所有后台接口都需要在请求头中添加 `Authorization: Bearer {token}`

---

## 3. 用户管理

### 3.1 获取用户列表

**接口**: `GET /api/users`

**权限**: `ROLE_ADMIN`

**参数**:
- `page` (Integer): 页码，默认1
- `pageSize` (Integer): 每页大小，默认9
- `search` (String): 搜索关键词
- `role` (String): 角色筛选
- `status` (String): 状态筛选

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "content": [
      {
        "id": 1,
        "username": "user001",
        "phone": "13800000001",
        "userIdentity": "需求者",
        "warmCoin": 1500,
        "status": 5,
        "banReason": null,
        "registerTime": "2024-01-15"
      },
      {
        "id": 4,
        "username": "user004",
        "phone": "13800000004",
        "userIdentity": "志愿者",
        "warmCoin": 800,
        "status": 2,
        "banReason": null,
        "registerTime": "2024-01-10"
      }
    ],
    "totalElements": 1523,
    "totalPages": 169,
    "currentPage": 0,
    "pageSize": 9,
    "first": true,
    "last": false,
    "empty": false
  }
}
```

### 3.2 获取用户总数

**接口**: `GET /api/users/count`

**权限**: `ROLE_ADMIN`

**参数**:
- `includeDeleted` (Boolean): 是否包含已删除用户，默认false

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": 1523
}
```

### 3.3 获取用户统计

**接口**: `GET /api/users/creation-stats`

**权限**: `ROLE_ADMIN`

**参数**:
- `days` (Integer): 统计天数，默认7

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

**接口**: `GET /api/users/role-stats`

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

**接口**: `GET /api/users/status-stats`

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

### 3.4 用户操作

**禁用/解禁用户**: `POST /api/users/ban`

**请求参数**:
```json
{
  "userId": 123,
  "banned": true,
  "reason": "违规发布虚假信息",
  "days": 7
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": "用户已被禁用7天，到期时间：2024-11-09 10:30:00，原因：违规发布虚假信息"
}
```

**删除用户**: `DELETE /api/users/{userId}`

**参数**:
- `hardDelete` (Boolean): 是否硬删除，默认false
- `reason` (String): 删除原因

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": "用户已删除（软删除，可恢复）"
}
```

---

## 4. 任务管理

### 4.1 获取任务列表

**接口**: `GET /api/admin/demands`

**权限**: `ROLE_ADMIN`

**参数**:
- `page` (Integer): 页码，默认1
- `pageSize` (Integer): 每页大小，默认10
- `search` (String): 搜索关键词
- `status` (String): 状态筛选
- `type` (String): 类型筛选

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

### 4.2 获取任务详情

**接口**: `GET /api/admin/demands/{id}`

**权限**: `ROLE_ADMIN`

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

---

## 5. 投诉管理

### 5.1 获取投诉列表

**接口**: `GET /api/complaints`

**权限**: `ROLE_ADMIN`

**参数**:
- `page` (Integer): 页码，默认1
- `pageSize` (Integer): 每页大小，默认10
- `search` (String): 搜索关键词

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "content": [
      {
        "id": 1,
        "title": "志愿者服务态度恶劣",
        "description": "志愿者在服务过程中态度非常差，说话不耐烦，对老人不尊重。希望平台能够严肃处理。",
        "author": "张三",
        "phone": "13800138000",
        "time": "2024-01-15 10:30:00",
        "image": "https://picsum.photos/400/300?random=101",
        "images": ["https://picsum.photos/400/300?random=101", "https://picsum.photos/400/300?random=102"],
        "status": "pending",
        "handler": null,
        "handleTime": null,
        "result": null
      },
      {
        "id": 2,
        "title": "服务质量差",
        "description": "志愿者帮忙买菜，但是买的菜品质量很差，而且价格比市场价贵很多。",
        "author": "李四",
        "phone": "13900139000",
        "time": "2024-01-14 15:20:00",
        "image": null,
        "images": [],
        "status": "resolved",
        "handler": "管理员A",
        "handleTime": "2024-01-14 16:00:00",
        "result": "经调查，志愿者在购买时没有仔细核对。已要求志愿者退还差价，并对其进行批评教育。"
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

### 5.2 获取投诉详情

**接口**: `GET /api/complaints/{id}`

**权限**: `ROLE_ADMIN`

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "title": "志愿者服务态度恶劣",
    "description": "志愿者在服务过程中态度非常差，说话不耐烦，对老人不尊重。希望平台能够严肃处理。",
    "author": "张三",
    "phone": "13800138000",
    "time": "2024-01-15 10:30:00",
    "images": ["https://picsum.photos/400/300?random=101", "https://picsum.photos/400/300?random=102"],
    "status": "resolved",
    "handler": "管理员A",
    "handleTime": "2024-01-15 14:00:00",
    "result": "经核实，该志愿者确实存在服务态度问题。我们已对其进行警告处理，并扣除10个信用分。同时已向您补偿20个暖龄币作为道歉。"
  }
}
```

### 5.3 处理投诉

**接口**: `POST /api/complaints/{id}/handle`

**权限**: `ROLE_ADMIN`

**请求参数**:
```json
{
  "result": "处理结果描述"
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

---

## 6. 志愿者管理

### 6.1 获取志愿者列表

**接口**: `GET /api/admin/volunteers`

**权限**: `ROLE_ADMIN`

**参数**:
- `page` (Integer): 页码，默认1
- `pageSize` (Integer): 每页大小，默认10
- `search` (String): 搜索关键词

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "content": [
      {
        "id": 4,
        "username": "user004",
        "phone": "13800000004",
        "realName": "王志愿",
        "age": 25,
        "address": "深圳市南山区科技园",
        "warmCoin": 800,
        "totalTasks": 15,
        "completedTasks": 12,
        "inProgressTasks": 2,
        "cancelledTasks": 1,
        "rating": 4.5,
        "creditScore": 800,
        "lastLoginTime": "2024-01-15 10:30:00",
        "registerTime": "2023-12-01 08:00:00",
        "enabled": true,
        "status": "活跃"
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

### 6.2 获取志愿者详情

**接口**: `GET /api/admin/volunteers/{id}`

**权限**: `ROLE_ADMIN`

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 4,
    "username": "user004",
    "phone": "13800000004",
    "realName": "王志愿",
    "age": 25,
    "address": "深圳市南山区科技园",
    "warmCoin": 800,
    "totalTasks": 15,
    "completedTasks": 12,
    "inProgressTasks": 2,
    "cancelledTasks": 1,
    "rating": 4.5,
    "creditScore": 800,
    "lastLoginTime": "2024-01-15 10:30:00",
    "registerTime": "2023-12-01 08:00:00",
    "enabled": true,
    "status": "活跃"
  }
}
```

### 6.3 获取志愿者排名

**接口**: `GET /api/admin/volunteers/ranking`

**权限**: `ROLE_ADMIN`

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 6,
      "name": "李志愿者",
      "creditScore": 2300,
      "serviceCount": 28
    },
    {
      "id": 8,
      "name": "王志愿",
      "creditScore": 2100,
      "serviceCount": 25
    },
    {
      "id": 4,
      "name": "张三",
      "creditScore": 1800,
      "serviceCount": 22
    }
  ]
}
```

### 6.4 获取本周服务量趋势

**接口**: `GET /api/admin/volunteers/weekly-service-volume`

**权限**: `ROLE_ADMIN`

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "date": "11-04",
      "dayOfWeek": "周一",
      "serviceCount": 25,
      "completedCount": 18,
      "inProgressCount": 5,
      "waitingCount": 2
    },
    {
      "date": "11-05",
      "dayOfWeek": "周二",
      "serviceCount": 32,
      "completedCount": 22,
      "inProgressCount": 7,
      "waitingCount": 3
    },
    {
      "date": "11-06",
      "dayOfWeek": "周三",
      "serviceCount": 28,
      "completedCount": 20,
      "inProgressCount": 6,
      "waitingCount": 2
    }
  ]
}
```

---

## 7. 暖龄币管理

### 7.1 获取暖龄币记录列表

**接口**: `GET /api/admin/warm-coin-records`

**权限**: `ROLE_ADMIN`

**参数**:
- `page` (Integer): 页码，默认1
- `pageSize` (Integer): 每页大小，默认10
- `search` (String): 搜索关键词
- `type` (String): 类型筛选
- `userId` (Long): 用户ID筛选

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "content": [
      {
        "id": 1,
        "userId": 123,
        "username": "张三",
        "phone": "13800138000",
        "amount": 50,
        "balanceAfter": 150,
        "createTime": "2024-01-15 10:30:00",
        "type": "SERVICE_EARN",
        "typeDesc": "服务获得",
        "description": "完成任务：陪同老人购物",
        "demandId": 456,
        "demandTitle": "陪同老人购物",
        "targetUserId": null,
        "targetUsername": null
      },
      {
        "id": 2,
        "userId": 124,
        "username": "李四",
        "phone": "13900139000",
        "amount": -30,
        "balanceAfter": 70,
        "createTime": "2024-01-15 09:00:00",
        "type": "DEMAND_SPEND",
        "typeDesc": "发布需求支出",
        "description": "发布任务：帮忙买菜",
        "demandId": 457,
        "demandTitle": "帮忙买菜",
        "targetUserId": null,
        "targetUsername": null
      },
      {
        "id": 3,
        "userId": 125,
        "username": "王五",
        "phone": "13700137000",
        "amount": -10,
        "balanceAfter": 40,
        "createTime": "2024-01-14 16:20:00",
        "type": "TRANSFER",
        "typeDesc": "转赠他人",
        "description": "转赠暖龄币给好友",
        "demandId": null,
        "demandTitle": null,
        "targetUserId": 126,
        "targetUsername": "赵六"
      }
    ],
    "totalElements": 1523,
    "totalPages": 153,
    "currentPage": 0,
    "pageSize": 10,
    "first": true,
    "last": false,
    "empty": false
  }
}
```

### 7.2 获取记录详情

**接口**: `GET /api/admin/warm-coin-records/{id}`

**权限**: `ROLE_ADMIN`

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "userId": 123,
    "username": "张三",
    "phone": "13800138000",
    "amount": 50,
    "balanceAfter": 150,
    "createTime": "2024-01-15 10:30:00",
    "type": "SERVICE_EARN",
    "typeDesc": "服务获得",
    "description": "完成任务：陪同老人购物",
    "demandId": 456,
    "demandTitle": "陪同老人购物",
    "targetUserId": null,
    "targetUsername": null
  }
}
```

### 7.3 获取用户暖龄币记录

**接口**: `GET /api/admin/warm-coin-records/user/{userId}`

**权限**: `ROLE_ADMIN`

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "content": [
      {
        "id": 1,
        "userId": 123,
        "username": "张三",
        "phone": "13800138000",
        "amount": 50,
        "balanceAfter": 150,
        "createTime": "2024-01-15 10:30:00",
        "type": "SERVICE_EARN",
        "typeDesc": "服务获得",
        "description": "完成任务：陪同老人购物",
        "demandId": 456,
        "demandTitle": "陪同老人购物",
        "targetUserId": null,
        "targetUsername": null
      },
      {
        "id": 5,
        "userId": 123,
        "username": "张三",
        "phone": "13800138000",
        "amount": -20,
        "balanceAfter": 100,
        "createTime": "2024-01-14 15:20:00",
        "type": "DEMAND_SPEND",
        "typeDesc": "发布需求支出",
        "description": "发布任务：帮忙送货",
        "demandId": 458,
        "demandTitle": "帮忙送货",
        "targetUserId": null,
        "targetUsername": null
      }
    ],
    "totalElements": 25,
    "totalPages": 3,
    "currentPage": 0,
    "pageSize": 10,
    "first": true,
    "last": false,
    "empty": false
  }
}
```

---

## 8. 仪表板统计

### 8.1 获取仪表板概览数据

**接口**: `GET /api/dashboard/overview`

**权限**: `ROLE_ADMIN`

**响应**:
```json
{
  "totalUsers": 1523,
  "totalVolunteers": 234,
  "totalDemands": 856,
  "completedDemands": 645,
  "pendingComplaints": 12,
  "activeVolunteers": 189,
  "todayNewUsers": 8,
  "todayNewDemands": 15
}
```

---

## 9. 账户管理

### 9.1 获取管理员账户列表

**接口**: `GET /api/accounts`

**权限**: `ROLE_ADMIN`

**参数**:
- `page` (Integer): 页码，默认1
- `pageSize` (Integer): 每页大小，默认10

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
        "lastLoginTime": "2024-01-15 10:00:00",
        "createTime": "2023-01-01 00:00:00"
      },
      {
        "id": 2,
        "username": "admin2",
        "realName": "管理员A",
        "email": "admin2@example.com",
        "phone": "13800138889",
        "level": "ADMIN",
        "enabled": true,
        "lastLoginTime": "2024-01-14 15:30:00",
        "createTime": "2023-06-15 09:00:00"
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

### 9.2 创建管理员账户

**接口**: `POST /api/accounts`

**权限**: `ROLE_ADMIN`（超级管理员）

**请求参数**:
```json
{
  "username": "admin3",
  "password": "password123",
  "realName": "管理员B",
  "email": "admin3@example.com",
  "phone": "13800138003",
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

## 10. 文件上传

### 10.1 上传文件

**接口**: `POST /api/files/upload`

**权限**: `ROLE_ADMIN`

**请求参数**:
- `file` (MultipartFile): 文件，最大10MB
- `type` (String): 文件类型，可选值：IMAGE, DOCUMENT, OTHER

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "fileId": "file_20240115103000_001",
    "fileName": "complaint_image.jpg",
    "originalName": "投诉图片.jpg",
    "fileSize": 2048576,
    "fileType": "IMAGE",
    "mimeType": "image/jpeg",
    "url": "https://cdn.example.com/files/complaint_image.jpg",
    "uploadTime": "2024-01-15 10:30:00"
  }
}

---

## 11. 数据导入

系统提供了以下测试数据导入脚本：

### 11.1 基础测试数据
- **文件**: `sql/insert_test_data.sql`
- **内容**: 用户、管理员、任务、投诉等基础数据

### 11.2 扩展任务数据
- **文件**: `sql/insert_more_demand_data.sql`
- **内容**: 50+条真实场景的任务数据

### 11.3 投诉测试数据
- **文件**: `sql/insert_complaint_data.sql`
- **内容**: 35条投诉数据（待处理和已处理）

### 11.4 数据库迁移
- **文件**: `database_migration_add_balance_after.sql`
- **用途**: 为暖龄币表添加变动后余额字段

---

## 12. 错误处理

### 统一错误响应格式

```json
{
  "code": 错误码,
  "message": "错误信息",
  "data": null
}
```

### 常见错误码

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| 200 | 成功 | - |
| 400 | 请求参数错误 | 检查参数格式和必填项 |
| 401 | 未认证或Token无效 | 重新登录获取Token |
| 403 | 无权限 | 使用管理员账户登录 |
| 404 | 资源不存在 | 检查ID是否正确 |
| 500 | 服务器内部错误 | 查看服务器日志 |

### 权限错误处理

```javascript
// 前端统一错误处理
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      alert('登录已过期，请重新登录');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      alert('无权限访问此功能');
    } else if (error.response?.status === 404) {
      alert('请求的资源不存在');
    } else {
      alert('请求失败: ' + error.response?.data?.message);
    }
    return Promise.reject(error);
  }
);
```

---

## 13. 测试指南

### 13.1 环境准备

1. **启动应用**
```bash
mvn spring-boot:run
```

2. **导入测试数据**
```bash
# 导入基础数据
mysql -u root -p silveragepass < sql/insert_test_data.sql

# 导入扩展任务数据
mysql -u root -p silveragepass < sql/insert_more_demand_data.sql

# 导入投诉数据
mysql -u root -p silveragepass < sql/insert_complaint_data.sql
```

3. **获取管理员Token**
```bash
curl -X POST "http://localhost:8080/silveragepass/api/auth/admin/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### 13.2 接口测试示例

#### Postman测试

1. **创建环境变量**
   - `baseUrl`: `http://localhost:8080/silveragepass`
   - `token`: 登录后获取的JWT Token

2. **设置请求头**
   ```
   Authorization: Bearer {{token}}
   Content-Type: application/json
   ```

#### 常用测试接口

```bash
# 1. 获取用户列表
curl -X GET "{{baseUrl}}/api/users?page=1&pageSize=10" \
  -H "Authorization: Bearer {{token}}"

# 2. 获取任务列表
curl -X GET "{{baseUrl}}/api/admin/demands?page=1&pageSize=10" \
  -H "Authorization: Bearer {{token}}"

# 3. 获取志愿者列表
curl -X GET "{{baseUrl}}/api/admin/volunteers?page=1&pageSize=10" \
  -H "Authorization: Bearer {{token}}"

# 4. 获取投诉列表
curl -X GET "{{baseUrl}}/api/complaints?page=1&pageSize=10" \
  -H "Authorization: Bearer {{token}}"

# 5. 获取暖龄币记录
curl -X GET "{{baseUrl}}/api/admin/warm-coin-records?page=1&pageSize=10" \
  -H "Authorization: Bearer {{token}}"

# 6. 获取仪表板数据
curl -X GET "{{baseUrl}}/api/dashboard/overview" \
  -H "Authorization: Bearer {{token}}"

# 7. 获取本周服务量趋势
curl -X GET "{{baseUrl}}/api/admin/volunteers/weekly-service-volume" \
  -H "Authorization: Bearer {{token}}"
```

### 13.3 前端集成测试

#### Vue.js 全局配置

```javascript
// main.js
import axios from 'axios'

// 设置基础URL
axios.defaults.baseURL = 'http://localhost:8080/silveragepass'

// 请求拦截器 - 自动添加token
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器 - 统一错误处理
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      alert('登录已过期，请重新登录')
      window.location.href = '/login'
    } else if (error.response?.status === 403) {
      alert('无权限访问此功能')
    }
    return Promise.reject(error)
  }
)
```

#### React 全局配置

```javascript
// App.js
import axios from 'axios'

// 设置基础配置
axios.defaults.baseURL = 'http://localhost:8080/silveragepass'

// 请求拦截器
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      alert('登录已过期，请重新登录')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

---

## 14. 数据字典

### 14.1 用户状态

| 值 | 说明 |
|----|------|
| -1 | 从未登录 |
| 0-30 | 活跃用户 |
| 31-90 | 较活跃用户 |
| 91-180 | 不活跃用户 |
| >180 | 僵尸账号 |

### 14.2 任务状态

| 状态码 | 中文描述 |
|--------|----------|
| WAITING | 待接单 |
| IN_PROGRESS | 进行中 |
| COMPLETED | 已完成 |
| CANCELLED | 已取消 |

### 14.3 投诉状态

| 状态码 | 中文描述 |
|--------|----------|
| pending | 待处理 |
| resolved | 已处理 |

### 14.4 暖龄币变动类型

| 类型码 | 中文描述 | 符号 |
|--------|----------|------|
| SERVICE_EARN | 服务获得 | + |
| DEMAND_SPEND | 发布需求支出 | - |
| TRANSFER | 转赠他人 | - |
| DONATE | 捐赠公益池 | - |

### 14.5 任务类型

| 类型码 | 中文描述 |
|--------|----------|
| LIFE_CARE | 生活照料 |
| HEALTH_SERVICE | 医疗健康 |
| GOVERNMENT_ASSISTANCE | 政务办理 |
| MENTAL_COMFORT | 精神慰藉 |
| TRAVEL_ASSISTANCE | 出行辅助 |
| OTHER | 其他 |

---

## 15. 性能优化建议

### 15.1 分页查询

建议设置合理的分页大小：
```javascript
// 推荐设置
const PAGE_SIZE = 20 // 每页20条数据

// 不推荐
const PAGE_SIZE = 1000 // 数据量过大
```

### 15.2 搜索优化

- 使用关键词长度限制
- 避免过于频繁的搜索请求
- 考虑添加搜索防抖

### 15.3 缓存策略

对于不经常变动的统计数据，可以考虑前端缓存：

```javascript
// 缓存仪表板数据
const CACHE_KEY = 'dashboard_data'
const CACHE_TIME = 5 * 60 * 1000 // 5分钟

function getCachedDashboardData() {
  const cached = localStorage.getItem(CACHE_KEY)
  if (cached) {
    const { data, timestamp } = JSON.parse(cached)
    if (Date.now() - timestamp < CACHE_TIME) {
      return data
    }
  }
  return null
}

function setCachedDashboardData(data) {
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    data,
    timestamp: Date.now()
  }))
}
```

---

## 16. 安全注意事项

### 16.1 Token管理

- Token有过期时间，建议在过期前自动刷新
- 敏感操作需要二次确认
- 退出登录时清除本地Token

### 16.2 输入验证

前端应进行输入验证：
- 用户ID必须为数字
- 搜索关键词长度限制
- 分页参数范围检查

### 16.3 XSS防护

显示用户输入的内容时进行HTML转义：
```javascript
function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}
```

---

## 17. 故障排除

### 17.1 常见问题

#### 问题1: 登录失败
**现象**: POST /api/auth/admin/login 返回401
**原因**: 用户名或密码错误
**解决**: 使用正确的管理员账号（admin/admin123）

#### 问题2: 无权限访问
**现象**: 接口返回403错误
**原因**: 当前账户不是管理员
**解决**: 使用管理员账户登录

#### 问题3: Token过期
**现象**: 接口返回401错误
**原因**: JWT Token已过期
**解决**: 重新登录获取新Token

#### 问题4: 数据为空
**现象**: 查询接口返回空数据
**原因**: 未导入测试数据
**解决**: 执行SQL脚本导入测试数据

### 17.2 日志查看

查看应用日志：
```bash
# 查看控制台输出
tail -f logs/spring.log

# 查看错误日志
tail -f logs/error.log
```

---

## 18. 更新日志

### v1.0 (2024-11-02)
- ✅ 完成所有基础接口开发
- ✅ 添加完整的测试数据
- ✅ 生成完整的API文档
- ✅ 支持分页、搜索、筛选功能
- ✅ 实现权限控制和错误处理

### 未来计划
- [ ] 添加接口版本控制
- [ ] 实现API限流功能
- [ ] 添加接口调用统计
- [ ] 支持批量操作接口
- [ ] 添加数据导出功能

---

## 19. 联系与支持

如有问题或建议，请联系开发团队：

- **项目名称**: 银龄通后台管理系统
- **技术栈**: Spring Boot + JPA + MySQL + JWT
- **前端支持**: Vue.js / React
- **文档版本**: v1.0
- **最后更新**: 2024-11-02

---

**🎉 恭喜！您现在拥有了一个功能完整的后台管理系统API接口文档**

该文档包含了所有24个接口的详细说明、使用示例和最佳实践。祝您开发顺利！

---

**文档版本**: v1.0  
**最后更新**: 2024-11-02  
**维护者**: SilverAgePass Team


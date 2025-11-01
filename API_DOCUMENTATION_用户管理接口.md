# 后台用户管理接口文档

## 更新日期
2025-10-26

## 基本信息
- **Base URL**: `/api`
- **认证方式**: JWT Token (Bearer Token)
- **Content-Type**: `application/json`

---

## 目录
1. [用户列表接口](#1-获取用户列表)
2. [创号统计接口](#2-获取创号统计)
3. [角色分布统计](#3-获取角色分布统计)
4. [状态分布统计](#4-获取状态分布统计)
5. [登录接口（更新说明）](#5-登录接口更新说明)
6. [数据模型](#数据模型)

---

## 接口详情

### 1. 获取用户列表

获取分页的用户列表，支持搜索和筛选功能。

#### 基本信息
- **接口地址**: `/api/users`
- **请求方式**: `GET`
- **权限要求**: `ROLE_ADMIN`
- **认证**: 需要 JWT Token

#### 请求参数 (Query Parameters)

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| page | Integer | 否 | 1 | 页码（从1开始） |
| pageSize | Integer | 否 | 9 | 每页数量 |
| search | String | 否 | - | 搜索关键词（用户名/手机号） |
| role | String | 否 | - | 角色筛选（需求者/志愿者/管理员） |
| status | String | 否 | - | 状态筛选（登录状态描述） |

#### 请求示例

```http
GET /api/users?page=1&pageSize=10&search=张三&role=需求者 HTTP/1.1
Host: example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 响应参数

| 字段名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码（200=成功） |
| message | String | 响应消息 |
| data | Object | 分页数据对象 |
| └─ content | Array | 用户列表数据 |
| &nbsp;&nbsp;&nbsp;&nbsp;└─ id | Long | 用户ID |
| &nbsp;&nbsp;&nbsp;&nbsp;└─ username | String | 用户名 |
| &nbsp;&nbsp;&nbsp;&nbsp;└─ phone | String | 手机号 |
| &nbsp;&nbsp;&nbsp;&nbsp;└─ userIdentity | String | 用户身份（需求者/志愿者/管理员） |
| &nbsp;&nbsp;&nbsp;&nbsp;└─ warmCoin | Integer | 暖龄币数量 |
| &nbsp;&nbsp;&nbsp;&nbsp;└─ status | Integer | 登录状态（多少天没有登录，-1表示从未登录） |
| &nbsp;&nbsp;&nbsp;&nbsp;└─ registerTime | String | 注册时间（格式：yyyy-MM-dd） |
| └─ totalElements | Long | 总记录数 |
| └─ totalPages | Integer | 总页数 |
| └─ pageNumber | Integer | 当前页码（从0开始） |
| └─ pageSize | Integer | 每页大小 |
| └─ first | Boolean | 是否第一页 |
| └─ last | Boolean | 是否最后一页 |
| └─ empty | Boolean | 是否为空 |

#### 响应示例

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
        "warmCoin": 150,
        "status": 3,
        "registerTime": "2024-10-01"
      },
      {
        "id": 2,
        "username": "李四",
        "phone": "13800138001",
        "userIdentity": "志愿者",
        "warmCoin": 500,
        "status": 0,
        "registerTime": "2024-09-15"
      },
      {
        "id": 3,
        "username": "王五",
        "phone": "13800138002",
        "userIdentity": "管理员",
        "warmCoin": 1000,
        "status": -1,
        "registerTime": "2024-08-20"
      }
    ],
    "totalElements": 100,
    "totalPages": 10,
    "pageNumber": 0,
    "pageSize": 10,
    "first": true,
    "last": false,
    "empty": false
  }
}
```

#### status 字段说明

`status` 字段表示用户距离上次登录的天数（Integer类型）：

| 状态值 | 说明 |
|--------|------|
| -1 | 从未登录 |
| 0 | 今天登录过（24小时内） |
| 1 | 1天前登录 |
| 7 | 7天前登录 |
| 30 | 30天前登录 |
| 365 | 365天前登录 |
| ... | 以此类推，任意整数天数 |

**示例**：
- `status: -1` → 从未登录
- `status: 0` → 今天登录过
- `status: 3` → 3天前登录
- `status: 45` → 45天前登录

#### userIdentity 字段说明

| 值 | 说明 |
|----|------|
| 需求者 | 普通用户（ROLE_USER） |
| 志愿者 | 志愿者（ROLE_VOLUNTEER） |
| 管理员 | 管理员（ROLE_ADMIN） |

---

### 2. 获取创号统计

获取近N天的用户创建数量统计。

#### 基本信息
- **接口地址**: `/api/users/creation-stats`
- **请求方式**: `GET`
- **权限要求**: `ROLE_ADMIN`
- **认证**: 需要 JWT Token

#### 请求参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| days | Integer | 否 | 7 | 统计天数 |

#### 请求示例

```http
GET /api/users/creation-stats?days=7 HTTP/1.1
Host: example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 响应参数

| 字段名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码 |
| message | String | 响应消息 |
| data | Object | 统计数据 |
| └─ dates | Array[String] | 日期列表（格式：M/d） |
| └─ counts | Array[Integer] | 对应日期的创号数量 |

#### 响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "dates": ["10/20", "10/21", "10/22", "10/23", "10/24", "10/25", "10/26"],
    "counts": [5, 8, 12, 6, 15, 10, 7]
  }
}
```

---

### 3. 获取角色分布统计

获取用户角色的分布统计。

#### 基本信息
- **接口地址**: `/api/users/role-stats`
- **请求方式**: `GET`
- **权限要求**: `ROLE_ADMIN`
- **认证**: 需要 JWT Token

#### 请求参数

无

#### 请求示例

```http
GET /api/users/role-stats HTTP/1.1
Host: example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 响应参数

| 字段名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码 |
| message | String | 响应消息 |
| data | Array | 角色分布数据列表 |
| └─ name | String | 角色名称 |
| └─ value | Integer | 该角色的用户数量 |

#### 响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "name": "需求者",
      "value": 85
    },
    {
      "name": "志愿者",
      "value": 12
    },
    {
      "name": "管理员",
      "value": 3
    }
  ]
}
```

---

### 4. 获取状态分布统计

获取用户状态的分布统计。

#### 基本信息
- **接口地址**: `/api/users/status-stats`
- **请求方式**: `GET`
- **权限要求**: `ROLE_ADMIN`
- **认证**: 需要 JWT Token

#### 请求参数

无

#### 请求示例

```http
GET /api/users/status-stats HTTP/1.1
Host: example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 响应参数

| 字段名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 状态码 |
| message | String | 响应消息 |
| data | Array | 状态分布数据列表 |
| └─ name | String | 状态名称 |
| └─ value | Integer | 该状态的用户数量 |

#### 响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "name": "活跃",
      "value": 78
    },
    {
      "name": "禁用",
      "value": 5
    },
    {
      "name": "待审核",
      "value": 0
    }
  ]
}
```

---

### 5. 登录接口更新说明

以下登录接口在后端逻辑上有更新，现在会自动更新用户的 `lastLoginTime`（最后登录时间），但接口的请求和响应格式**没有变化**。

#### 5.1 用户名密码登录

- **接口地址**: `/api/auth/login`
- **请求方式**: `POST`
- **更新内容**: 登录成功后自动更新用户的最后登录时间

**请求体示例**:
```json
{
  "username": "张三",
  "password": "password123"
}
```

#### 5.2 手机号密码登录

- **接口地址**: `/api/auth/phone-password-login`
- **请求方式**: `POST`
- **更新内容**: 登录成功后自动更新用户的最后登录时间

**请求体示例**:
```json
{
  "phone": "13800138000",
  "password": "password123"
}
```

#### 5.3 手机号验证码登录

- **接口地址**: `/api/auth/phone-login`
- **请求方式**: `POST`
- **更新内容**: 登录成功后自动更新用户的最后登录时间

**请求体示例**:
```json
{
  "phone": "13800138000",
  "verificationCode": "123456"
}
```

**共同响应格式**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": 1,
  "username": "张三",
  "realName": "张三",
  "phone": "13800138000",
  "roles": ["ROLE_USER"]
}
```

---

## 数据模型

### UserListDTO

用户列表数据传输对象

```typescript
interface UserListDTO {
  id: number;              // 用户ID
  username: string;        // 用户名
  phone: string;           // 手机号
  userIdentity: string;    // 用户身份：需求者/志愿者/管理员
  warmCoin: number;        // 暖龄币数量
  status: number;          // 登录状态：距离上次登录的天数（-1表示从未登录）
  registerTime: string;    // 注册时间 (格式: yyyy-MM-dd)
}
```

### PageResponse\<T\>

分页响应对象

```typescript
interface PageResponse<T> {
  content: T[];            // 数据列表
  totalElements: number;   // 总记录数
  totalPages: number;      // 总页数
  pageNumber: number;      // 当前页码（从0开始）
  pageSize: number;        // 每页大小
  first: boolean;          // 是否第一页
  last: boolean;           // 是否最后一页
  empty: boolean;          // 是否为空
}
```

### CreationStatsDTO

创号统计数据对象

```typescript
interface CreationStatsDTO {
  dates: string[];         // 日期列表（格式：M/d）
  counts: number[];        // 对应日期的创号数量
}
```

### DistributionDTO

分布统计数据对象

```typescript
interface DistributionDTO {
  name: string;            // 分类名称
  value: number;           // 该分类的数量
}
```

### ApiResponse\<T\>

标准API响应对象

```typescript
interface ApiResponse<T> {
  code: number;            // 状态码（200=成功）
  message: string;         // 响应消息
  data: T;                 // 响应数据
}
```

---

## 错误码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未认证或Token无效 |
| 403 | 无权限访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 变更记录

### v2.0 (2025-10-26)

#### 新增功能
- 添加最后登录时间追踪功能，用于识别僵尸账号
- 所有登录接口自动更新用户的最后登录时间

#### 接口变更
**用户列表接口 (`GET /api/users`) 返回数据结构变更**:

| 操作 | 字段名 | 说明 |
|------|--------|------|
| 重命名 | `role` → `userIdentity` | 用户身份/角色名称 |
| 重命名 | `credit` → `warmCoin` | 暖龄币数量 |
| 类型变更 | `status` | 从String改为Integer，表示距离上次登录的天数（-1表示从未登录） |
| 移除 | `avatar` | 头像字段已移除 |

#### 前端兼容性提示
⚠️ **Breaking Changes**: 用户列表接口的数据结构有不兼容变更，前端需要更新以下代码：

```javascript
// ❌ 旧代码
user.role        // 需要改为 user.userIdentity
user.credit      // 需要改为 user.warmCoin
user.avatar      // 字段已移除
user.status      // 类型从String改为Integer

// ✅ 新代码
user.userIdentity  // 用户身份（String）
user.warmCoin      // 暖龄币（Integer）
// avatar 已移除
user.status        // 登录状态（Integer，单位：天，-1表示从未登录）

// 前端展示示例
if (user.status === -1) {
  console.log("从未登录");
} else if (user.status === 0) {
  console.log("今天登录过");
} else if (user.status === 1) {
  console.log("1天前登录");
} else {
  console.log(`${user.status}天前登录`);
}
```

---

## 附录

### 僵尸账号判断标准建议

基于新的 `status` 字段（Integer类型，单位：天），可以使用以下标准判断账号活跃度：

| 类型 | 标准 | 建议操作 |
|------|------|----------|
| 活跃用户 | `status >= 0 && status <= 7` | 正常 |
| 不活跃用户 | `status >= 8 && status <= 30` | 发送提醒通知 |
| 僵尸账号 | `status > 30` | 考虑清理或冻结 |
| 未激活账号 | `status === -1` | 发送激活邮件/短信 |

**代码示例**：
```javascript
function getUserActivityLevel(status) {
  if (status === -1) return "未激活";
  if (status >= 0 && status <= 7) return "活跃";
  if (status >= 8 && status <= 30) return "不活跃";
  if (status > 30) return "僵尸账号";
}
```

### 数据库变更

需要执行以下SQL迁移脚本添加新字段：

```sql
-- 添加最后登录时间字段
ALTER TABLE users ADD COLUMN last_login_time DATETIME DEFAULT NULL COMMENT '最后登录时间';

-- 创建索引以提高查询性能
CREATE INDEX idx_last_login_time ON users(last_login_time);
```

---

## 技术支持

如有问题，请联系后端开发团队。


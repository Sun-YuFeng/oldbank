# Netlify 部署指南

## 问题修复总结

已修复以下Netlify部署问题：

### 1. 路由配置问题
- 修改了 `vite.config.js` 添加了正确的base路径配置
- 更新了路由配置以兼容生产环境

### 2. SPA路由重定向
- 创建了 `netlify.toml` 配置文件
- 添加了 `public/_redirects` 文件处理客户端路由

### 3. 应用级路由处理
- 在 `App.vue` 中添加了路由重定向逻辑

## 部署到Netlify的步骤

### 方法一：通过Git仓库部署（推荐）
1. 将代码推送到GitHub/GitLab等Git仓库
2. 登录Netlify，选择"New site from Git"
3. 选择你的代码仓库
4. 配置构建设置：
   - Build command: `npm run build`
   - Publish directory: `dist`
5. 点击"Deploy site"

### 方法二：手动拖拽部署
1. 运行 `npm run build` 生成dist文件夹
2. 将整个dist文件夹拖拽到Netlify的部署区域

## 重要配置文件

### netlify.toml
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### public/_redirects
```
/*    /index.html   200
```

## 环境变量配置（如果需要）

在Netlify的站点设置中，可以添加环境变量：
- 进入 Site settings > Environment variables
- 添加生产环境所需的变量

## 验证部署

部署完成后，访问你的Netlify域名，应该能看到应用正常加载，路由也能正常工作。

## 常见问题排查

1. **空白页面**：检查控制台错误，通常是路由或资源加载问题
2. **404错误**：确保重定向规则正确配置
3. **资源加载失败**：检查资源路径是否正确

## 构建命令
```bash
npm run build  # 构建生产版本
npm run preview  # 预览构建结果
```

部署成功！🎉
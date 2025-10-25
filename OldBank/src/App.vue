<template>
  <div class="app-container">
    <!-- 登录/注册页面不显示侧边栏 -->
    <SidebarView v-if="showSidebar" />
    
    <!-- 主内容区域 -->
    <div class="main-content" :class="{ 'full-width': !showSidebar }">
      <router-view /> 
    </div>
    
    <!-- 右下角浮动按钮（仅在登录后显示） -->
    <div v-if="showSidebar" class="floating-button fixed bottom-6 right-6 bg-blue-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors z-20">
      <i class="fas fa-comment"></i>
    </div>
  </div>
</template>

<script>
import SidebarView from './components/SidebarView.vue';

export default {
  name: 'App',
  components: {
    SidebarView,
  },
  computed: {
    showSidebar() {
      // 在登录和注册页面不显示侧边栏
      return this.$route.path !== '/login' && this.$route.path !== '/register'
    }
  },
  mounted() {
    // 检查登录状态
    const token = localStorage.getItem('adminToken')
    
    if (this.$route.path === '/login' || this.$route.path === '/register') {
      // 如果在登录/注册页面且有token，跳转到首页
      if (token) {
        this.$router.push('/')
      }
    } else {
      // 如果在其他页面且没有token，跳转到登录页
      if (!token) {
        this.$router.push('/login')
      }
    }
  },
  created() {
    // 确保在Netlify上路由正常工作
    if (window.location.pathname !== '/' && !window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
      this.$router.push(window.location.pathname)
    }
  }
};
</script>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f8fafc;
}

/* 应用容器样式 */
.app-container {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

/* 确保主内容区域正确偏移并铺满剩余空间 */
.main-content {
  position: absolute; /* 使用绝对定位确保铺满 */
  left: 240px; /* 与侧边栏宽度一致 */
  right: 0; /* 确保延伸到右边界 */
  top: 0;
  bottom: 0;
  padding: 0; /* 移除水平内边距，让内容完全铺满 */
  min-height: 100vh;
  overflow-x: hidden; /* 防止水平滚动条 */
}

.main-content.full-width {
  left: 0; /* 登录/注册页面铺满整个宽度 */
}
</style>

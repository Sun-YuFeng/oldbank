import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(process.env.NODE_ENV === 'production' ? '/' : '/'),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'Register',
      // 懒加载注册页面
      component: () => import('../views/RegisterView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'DashBoard',
      // 懒加载仪表盘页面
      component: () => import('../views/DashBoardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/user-management',
      name: 'UserManagement',
      // 懒加载用户管理页面
      component: () => import('../views/UserManagementPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/task-approval',
      name: 'TaskApproval',
      // 懒加载任务审核页面
      component: () => import('../views/TaskApprovalPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/points-management',
      name: 'PointsManagement',
      // 懒加载积分管理页面
      component: () => import('../views/PointsManagementPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/system-settings',
      name: 'SystemSettings',
      // 懒加载系统设置页面
      component: () => import('../views/SystemSettingsPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/complaint-management',
      name: 'ComplaintManagement',
      // 懒加载投诉管理页面
      component: () => import('../views/ComplaintManagementPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/complaint-management/:id',
      name: 'ComplaintDetail',
      // 懒加载投诉详情页面
      component: () => import('../views/ComplaintDetailPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/account-management',
      name: 'AccountManagement',
      // 懒加载账号管理页面
      component: () => import('../views/AccountManagementPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/public-welfare-pool',
      name: 'PublicWelfarePool',
      // 懒加载公益池管理页面
      component: () => import('../views/PublicWelfarePoolPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/video-manager',
      name: 'VideoManager',
      // 懒加载视频管理页面
      component: () => import('../views/VideoManager.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/volunteer/:id',
      name: 'VolunteerDetail',
      // 懒加载志愿者详情页面
      component: () => import('../views/VolunteerDetailPage.vue'),
      meta: { requiresAuth: true }
    }
  ],
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 检查路由是否需要认证
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('adminToken')
    
    if (token) {
      // 有token，允许访问
      next()
    } else {
      // 没有token，跳转到登录页
      next('/login')
    }
  } else {
    // 不需要认证的路由，直接放行
    next()
  }
})

export default router


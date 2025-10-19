import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(process.env.NODE_ENV === 'production' ? '/' : '/'),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'Register',
      // 懒加载注册页面
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/',
      name: 'DashBoard',
      // 懒加载仪表盘页面
      component: () => import('../views/DashBoardView.vue'),
    },
    {
      path: '/user-management',
      name: 'UserManagement',
      // 懒加载用户管理页面
      component: () => import('../views/UserManagementPage.vue'),
    },
    {
      path: '/task-approval',
      name: 'TaskApproval',
      // 懒加载任务审核页面
      component: () => import('../views/TaskApprovalPage.vue'),
    },
    {
      path: '/points-management',
      name: 'PointsManagement',
      // 懒加载积分管理页面
      component: () => import('../views/PointsManagementPage.vue'),
    },
    {
      path: '/system-settings',
      name: 'SystemSettings',
      // 懒加载系统设置页面
      component: () => import('../views/SystemSettingsPage.vue'),
    },
    {
      path: '/complaint-management',
      name: 'ComplaintManagement',
      // 懒加载投诉管理页面
      component: () => import('../views/ComplaintManagementPage.vue'),
    },
    {
      path: '/complaint-management/:id',
      name: 'ComplaintDetail',
      // 懒加载投诉详情页面
      component: () => import('../views/ComplaintDetailPage.vue'),
    },
    {
      path: '/account-management',
      name: 'AccountManagement',
      // 懒加载账号管理页面
      component: () => import('../views/AccountManagementPage.vue'),
    }
  ],
})

export default router


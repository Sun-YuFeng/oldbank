import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
    }
  ],
})

export default router


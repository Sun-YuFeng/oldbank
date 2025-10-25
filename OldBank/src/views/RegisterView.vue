<template>
  <div class="register-container">
    <div class="register-box">
      <div class="register-header">
        <h2>申请后台管理账号</h2>
        <p>请填写以下信息申请账号</p>
      </div>
      
      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="account">账号</label>
          <input 
            type="text" 
            id="account"
            v-model="registerForm.account"
            placeholder="请输入账号"
            class="rounded-input"
            required
          >
        </div>
        
        <div class="form-group">
          <label for="phone">电话</label>
          <input 
            type="tel" 
            id="phone"
            v-model="registerForm.phone"
            placeholder="请输入电话号码"
            class="rounded-input"
            required
          >
        </div>
        
        <div class="form-group">
          <label for="password">密码</label>
          <input 
            type="password" 
            id="password"
            v-model="registerForm.password"
            placeholder="请输入密码"
            class="rounded-input"
            required
          >
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">确认密码</label>
          <input 
            type="password" 
            id="confirmPassword"
            v-model="registerForm.confirmPassword"
            placeholder="请再次输入密码"
            class="rounded-input"
            required
          >
        </div>
        
        <button type="submit" class="register-button" :disabled="isLoading">
          {{ isLoading ? '注册中...' : '注册' }}
        </button>
      </form>
      
      <div class="login-link">
        <a href="#" @click.prevent="goToLogin">已有账号？返回登录</a>
      </div>
      
      <!-- 成功消息弹窗 -->
      <div v-if="showSuccess" class="success-message">
        <div class="success-content">
          <div class="success-icon">✓</div>
          <div class="success-text">申请账号成功，等待审核</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { register } from '@/utils/api'

export default {
  name: 'RegisterView',
  data() {
    return {
      registerForm: {
        account: '',
        phone: '',
        password: '',
        confirmPassword: ''
      },
      showSuccess: false,
      isLoading: false
    }
  },
  methods: {
    async handleRegister() {
      // 验证密码是否一致
      if (this.registerForm.password !== this.registerForm.confirmPassword) {
        alert('两次输入的密码不一致')
        return
      }
      
      // 验证手机号格式
      const phoneRegex = /^1[3-9]\d{9}$/
      if (!phoneRegex.test(this.registerForm.phone)) {
        alert('请输入正确的手机号码')
        return
      }
      
      // 验证账号长度
      if (this.registerForm.account.length < 3 || this.registerForm.account.length > 50) {
        alert('账号长度应为3-50个字符')
        return
      }
      
      // 验证密码长度
      if (this.registerForm.password.length < 6 || this.registerForm.password.length > 120) {
        alert('密码长度应为6-120个字符')
        return
      }
      
      // 显示确认提示
      if (!confirm('确定注册吗？密码不可修改，请记住！')) {
        return
      }
      
      this.isLoading = true
      
      try {
        // 调用注册API
        const response = await register(
          this.registerForm.account,
          this.registerForm.password,
          this.registerForm.phone
        )
        
        // 显示成功消息
        this.showSuccess = true
        setTimeout(() => {
          this.showSuccess = false
          this.$router.push('/login')
        }, 2000)
        
      } catch (error) {
        console.error('注册失败:', error)
        alert(error.message || '注册失败，请稍后重试')
      } finally {
        this.isLoading = false
      }
    },
    goToLogin() {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url('@/assets/background.png') no-repeat center center;
  background-size: cover;
  padding: 20px;
}

.register-box {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  position: relative;
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-header h2 {
  color: #333;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.register-header p {
  color: #666;
  font-size: 14px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

.rounded-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  outline: none;
}

.rounded-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.register-button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.register-button:hover {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.register-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.register-button:disabled:hover {
  background: #9ca3af;
  transform: none;
  box-shadow: none;
}

.register-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.register-button:disabled:hover {
  background: #9ca3af;
  transform: none;
  box-shadow: none;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.login-link a {
  color: #3b82f6;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.login-link a:hover {
  color: #2563eb;
  text-decoration: underline;
}

/* 成功消息样式 */
.success-message {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  z-index: 10;
}

.success-content {
  text-align: center;
  padding: 20px;
}

.success-icon {
  font-size: 48px;
  color: #10b981;
  margin-bottom: 16px;
}

.success-text {
  color: #047857;
  font-size: 18px;
  font-weight: 600;
}
</style>
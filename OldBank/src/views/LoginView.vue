<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h2>用户登录</h2>
        <p>欢迎使用银龄通管理系统</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">账号</label>
          <input 
            type="text" 
            id="username"
            v-model="loginForm.username"
            placeholder="请输入账号"
            class="rounded-input"
            required
          >
        </div>
        
        <div class="form-group">
          <label for="password">密码</label>
          <input 
            type="password" 
            id="password"
            v-model="loginForm.password"
            placeholder="请输入密码"
            class="rounded-input"
            required
          >
        </div>
        
        <!-- 协议同意选项 -->
        <div class="agreement-group">
          <label class="agreement-label">
            <input 
              type="checkbox" 
              v-model="loginForm.agreed"
              class="agreement-checkbox"
            >
            <span class="agreement-text">
              我已阅读并同意银龄通
              <a href="#" @click.prevent="showPrivacyPolicy" class="agreement-link">《隐私政策》</a>
              和
              <a href="#" @click.prevent="showUserAgreement" class="agreement-link">《用户协议》</a>
            </span>
          </label>
        </div>
        
        <button 
          type="submit" 
          class="login-button"
          :disabled="!loginForm.agreed"
          :class="{ 'login-button-disabled': !loginForm.agreed }"
        >登录</button>
      </form>
      
      <!-- 协议弹窗 -->
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>{{ modalTitle }}</h3>
            <button class="modal-close" @click="closeModal">×</button>
          </div>
          <div class="modal-body">
            <p>协议内容</p>
          </div>
        </div>
      </div>
      
      <div class="register-link">
        <a href="#" @click.prevent="goToRegister">申请后台管理账号</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        agreed: false
      },
      showModal: false,
      modalTitle: '',
      modalContent: ''
    }
  },
  methods: {
    handleLogin() {
      if (!this.loginForm.agreed) {
        alert('请先阅读并同意用户协议和隐私政策')
        return
      }
      
      // 临时绕过API验证，直接跳转到主页面
      // TODO: 后续需要调用登录API进行验证
      console.log('登录信息:', this.loginForm)
      this.$router.push('/')
    },
    goToRegister() {
      this.$router.push('/register')
    },
    showPrivacyPolicy() {
      this.modalTitle = '隐私政策'
      this.modalContent = '协议内容'
      this.showModal = true
    },
    showUserAgreement() {
      this.modalTitle = '用户协议'
      this.modalContent = '协议内容'
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.modalTitle = ''
      this.modalContent = ''
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url('@/assets/background.png') no-repeat center center;
  background-size: cover;
  padding: 20px;
}

.login-box {
  background: white;
  padding: 50px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  color: #333;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.login-header p {
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

.login-button {
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

.login-button:hover {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.register-link {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.register-link a {
  color: #3b82f6;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.register-link a:hover {
  color: #2563eb;
  text-decoration: underline;
}

/* 协议同意样式 */
.agreement-group {
  margin: 15px 0;
  padding: 10px 0;
}

.agreement-label {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

.agreement-checkbox {
  margin-right: 8px;
  margin-top: 2px;
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.agreement-text {
  flex: 1;
}

.agreement-link {
  color: #3b82f6;
  text-decoration: none;
  transition: color 0.3s ease;
}

.agreement-link:hover {
  color: #2563eb;
  text-decoration: underline;
}

/* 禁用按钮样式 */
.login-button-disabled {
  background: #cbd5e1 !important;
  cursor: not-allowed !important;
  transform: none !important;
  box-shadow: none !important;
}

.login-button-disabled:hover {
  background: #cbd5e1 !important;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #64748b;
  transition: color 0.3s ease;
}

.modal-close:hover {
  color: #334155;
}

.modal-body {
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.modal-body p {
  margin: 0;
  color: #666;
  line-height: 1.6;
}
</style>
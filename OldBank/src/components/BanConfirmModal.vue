<template>
  <div v-if="visible" class="modal-overlay" @click="handleClose">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">
          <i :class="['modal-icon', action === 'ban' ? 'fa-ban' : 'fa-check-circle']"></i>
          {{ action === 'ban' ? '确认封禁' : '确认解封' }}用户
        </h3>
        <button class="modal-close" @click="handleClose">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="modal-body">
        <div class="user-info">
          <div class="user-avatar">
            <i class="fas fa-user"></i>
          </div>
          <div class="user-details">
            <div class="user-name">{{ user.username || user.name || '未知用户' }}</div>
            <div class="user-phone">{{ user.phone || user.phoneNumber || '未知手机号' }}</div>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">
            {{ action === 'ban' ? '封禁' : '解封' }}原因
            <span class="required">*</span>
          </label>
          <textarea 
            v-model="reason" 
            class="reason-input" 
            :placeholder="action === 'ban' ? '请输入封禁原因（必填）' : '请输入解封原因（必填）'"
            rows="3"
          ></textarea>
        </div>
        
        <div v-if="action === 'ban'" class="form-group">
          <label class="form-label">封禁时长</label>
          <div class="duration-options">
            <label class="duration-option">
              <input 
                type="radio" 
                v-model="days" 
                value="1"
                class="duration-radio"
              >
              <span class="duration-label">1天</span>
            </label>
            <label class="duration-option">
              <input 
                type="radio" 
                v-model="days" 
                value="7"
                class="duration-radio"
                checked
              >
              <span class="duration-label">7天</span>
            </label>
            <label class="duration-option">
              <input 
                type="radio" 
                v-model="days" 
                value="30"
                class="duration-radio"
              >
              <span class="duration-label">30天</span>
            </label>
            <label class="duration-option">
              <input 
                type="radio" 
                v-model="days" 
                value="365"
                class="duration-radio"
              >
              <span class="duration-label">永久</span>
            </label>
          </div>
        </div>
        
        <div class="warning-message" v-if="action === 'ban'">
          <i class="fas fa-exclamation-triangle"></i>
          封禁后将限制用户的部分功能使用，请谨慎操作！
        </div>
        
        <div class="success-message" v-else>
          <i class="fas fa-check-circle"></i>
          解封后用户将恢复正常使用权限。
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="btn-cancel" @click="handleClose">取消</button>
        <button 
          class="btn-confirm" 
          :class="{ 'btn-ban': action === 'ban', 'btn-unban': action === 'unban' }"
          @click="handleConfirm"
          :disabled="!reason.trim()"
        >
          {{ action === 'ban' ? '确认封禁' : '确认解封' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { banUser } from '@/utils/api'

export default {
  name: 'BanConfirmModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    user: {
      type: Object,
      default: () => ({})
    },
    action: {
      type: String,
      default: 'ban',
      validator: (value) => ['ban', 'unban'].includes(value)
    }
  },
  data() {
    return {
      reason: '',
      days: '7'
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.reason = ''
        this.days = '7'
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
      this.$emit('cancel')
    },
    
    async handleConfirm() {
      if (!this.reason.trim()) {
        this.$message.error('请输入原因')
        return
      }
      
      try {
        const banned = this.action === 'ban'
        const days = banned ? parseInt(this.days) : 0
        
        await banUser(this.user.id, banned, this.reason, days)
        
        this.$message.success(banned ? '用户封禁成功' : '用户解封成功')
        this.$emit('confirm', {
          userId: this.user.id,
          action: this.action,
          reason: this.reason,
          days: days
        })
        this.handleClose()
      } catch (error) {
        console.error('操作失败:', error)
        this.$message.error(error.message || '操作失败')
      }
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.modal-icon {
  font-size: 16px;
}

.modal-icon.fa-ban {
  color: #ef4444;
}

.modal-icon.fa-check-circle {
  color: #10b981;
}

.modal-close {
  background: none;
  border: none;
  font-size: 16px;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background-color: #f1f5f9;
  color: #374151;
}

.modal-body {
  padding: 24px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f8fafc;
  border-radius: 8px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.user-phone {
  font-size: 14px;
  color: #64748b;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.required {
  color: #ef4444;
}

.reason-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.reason-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.duration-options {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.duration-option {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.duration-radio {
  margin: 0;
}

.duration-label {
  font-size: 14px;
  color: #374151;
}

.warning-message, .success-message {
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
}

.warning-message {
  background-color: #fef3c7;
  color: #92400e;
  border: 1px solid #fbbf24;
}

.success-message {
  background-color: #d1fae5;
  color: #065f46;
  border: 1px solid #34d399;
}

.modal-footer {
  padding: 20px 24px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-cancel, .btn-confirm {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 80px;
}

.btn-cancel {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-cancel:hover {
  background-color: #e5e7eb;
}

.btn-confirm {
  color: white;
}

.btn-confirm:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.btn-confirm:not(:disabled):hover {
  transform: translateY(-1px);
}

.btn-ban {
  background-color: #ef4444;
}

.btn-ban:not(:disabled):hover {
  background-color: #dc2626;
}

.btn-unban {
  background-color: #10b981;
}

.btn-unban:not(:disabled):hover {
  background-color: #059669;
}
</style>
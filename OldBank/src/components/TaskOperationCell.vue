<!-- 任务操作列组件（处理 "通过 / 拒绝 / 详情" 按钮） -->
 <template>
  <div class="operation-buttons">
    <button 
      class="btn btn-detail"
      @click="handleDetail"
    >
      详情
    </button>
    <button 
      v-if="task.status === 'pending'"
      class="btn btn-approve"
      @click="handleApprove"
    >
      通过
    </button>
    <button 
      v-if="task.status === 'pending'"
      class="btn btn-reject"
      @click="handleReject"
    >
      拒绝
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['detail', 'approve', 'reject'])

const handleDetail = () => {
  emit('detail', props.task)
}

const handleApprove = () => {
  emit('approve', props.task)
}

const handleReject = () => {
  emit('reject', props.task)
}
</script>

<style scoped>
.operation-buttons {
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: nowrap;
  min-width: 120px;
}

.btn {
  padding: 4px 8px;
  border: none;
  border-radius: 3px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}

.btn-detail {
  background: #3b82f6;
  color: white;
}

.btn-detail:hover {
  background: #2563eb;
}

.btn-approve {
  background: #10b981;
  color: white;
}

.btn-approve:hover {
  background: #059669;
}

.btn-reject {
  background: #ef4444;
  color: white;
}

.btn-reject:hover {
  background: #dc2626;
}
</style>

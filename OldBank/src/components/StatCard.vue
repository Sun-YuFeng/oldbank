<template>
  <!-- Replaced Tailwind classes with custom CSS using box model approach -->
  <div class="stat-card">
    <div class="card-content">
      <div class="text-section">
        <p class="card-title">{{ title }}</p>
        <h3 class="card-value" :class="valueClass">{{ value }}</h3>
      </div>
      <div class="icon-section" :class="iconBgClass"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatCard',
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    iconClass: {
      type: String,
      required: true
    },
    iconBgClass: {
      type: String,
      default: 'bg-blue'
    },
    valueClass: {
      type: String,
      default: 'text-dark'
    }
  }
}
</script>

<style scoped>
/* Custom CSS using box model - small card boxes */
.stat-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
  padding: 24px;
  height: 120px;
  min-height: 120px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  height: 100%;
}

.text-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-title {
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 8px 0;
}

.card-value {
  font-size: 28px;
  font-weight: bold;
  margin: 0;
}

.card-value.text-dark {
  color: #1e293b;
}

.card-value.text-red {
  color: #dc2626;
}

.icon-section {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  flex-shrink: 0;
}

.bg-blue {
  background-color: #3b82f6;
}

.bg-green {
  background-color: #10b981;
}

.bg-red {
  background-color: #ef4444;
}
</style>

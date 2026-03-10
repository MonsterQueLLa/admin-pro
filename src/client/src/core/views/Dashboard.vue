<script setup lang="ts">
import { ref } from 'vue'

const stats = ref([
  { title: '总用户数', value: '1,234', icon: 'User', color: '#409EFF' },
  { title: '总订单数', value: '5,678', icon: 'ShoppingCart', color: '#67C23A' },
  { title: '总销售额', value: '¥98,765', icon: 'Money', color: '#E6A23C' },
  { title: '系统消息', value: '12', icon: 'Bell', color: '#F56C6C' }
])

const recentActivities = ref([
  { user: '张三', action: '登录系统', time: '2分钟前' },
  { user: '李四', action: '创建了新订单', time: '15分钟前' },
  { user: '王五', action: '修改了个人资料', time: '1小时前' },
  { user: '赵六', action: '删除了一个用户', time: '2小时前' }
])
</script>

<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <el-row :gutter="20">
      <el-col :span="6" v-for="item in stats" :key="item.title">
        <el-card class="stat-card" :body-style="{ padding: '20px' }">
          <div class="stat-content">
            <div class="stat-icon" :style="{ backgroundColor: item.color + '20', color: item.color }">
              <el-icon :size="32">
                <component :is="item.icon" />
              </el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-title">{{ item.title }}</div>
              <div class="stat-value">{{ item.value }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近活动 -->
    <el-card class="activity-card" style="margin-top: 20px">
      <template #header>
        <span>最近活动</span>
      </template>
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in recentActivities"
          :key="index"
          :type="index === 0 ? 'primary' : ''"
        >
          <p>{{ activity.user }} {{ activity.action }}</p>
          <p class="activity-time">{{ activity.time }}</p>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<style scoped>
.stat-card {
  margin-bottom: 20px;
}

.stat-content {
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.stat-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.activity-time {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}
</style>

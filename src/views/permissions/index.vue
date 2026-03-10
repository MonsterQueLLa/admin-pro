<script setup lang="ts">
import { ref } from 'vue'

const defaultProps = {
  children: 'children',
  label: 'name'
}

const permissionTree = ref([
  {
    id: 1,
    name: '系统管理',
    children: [
      { id: 11, name: '用户管理' },
      { id: 12, name: '角色管理' },
      { id: 13, name: '权限管理' }
    ]
  },
  {
    id: 2,
    name: '业务管理',
    children: [
      { id: 21, name: '订单管理' },
      { id: 22, name: '商品管理' },
      { id: 23, name: '客户管理' }
    ]
  },
  {
    id: 3,
    name: '系统设置',
    children: [
      { id: 31, name: '基础设置' },
      { id: 32, name: '日志管理' }
    ]
  }
])

const handleNodeClick = (data: any) => {
  console.log('点击节点:', data)
}
</script>

<template>
  <div class="permission-management">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>权限树</span>
          </template>
          <el-tree
            :data="permissionTree"
            :props="defaultProps"
            @node-click="handleNodeClick"
            default-expand-all
            highlight-current
          />
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card>
          <template #header>
            <span>权限详情</span>
          </template>
          <el-empty description="请选择左侧权限节点查看详情" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

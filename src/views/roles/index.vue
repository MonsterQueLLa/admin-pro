<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)
const tableData = ref([
  { id: 1, name: '管理员', code: 'admin', description: '系统管理员', userCount: 5 },
  { id: 2, name: '普通用户', code: 'user', description: '普通用户角色', userCount: 100 },
  { id: 3, name: '访客', code: 'guest', description: '访客角色', userCount: 50 }
])

const handleAdd = () => {
  // TODO: 打开新增对话框
}

const handleEdit = (row: any) => {
  // TODO: 打开编辑对话框
}

const handleDelete = (row: any) => {
  // TODO: 调用删除 API
}

const handleAssignPermission = (row: any) => {
  // TODO: 打开权限分配对话框
}
</script>

<template>
  <div class="role-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>角色列表</span>
          <el-button type="primary" @click="handleAdd">新增角色</el-button>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="角色名称" />
        <el-table-column prop="code" label="角色编码" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="userCount" label="用户数量" width="100" />
        <el-table-column label="操作" width="250">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="warning" size="small" @click="handleAssignPermission(row)">分配权限</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

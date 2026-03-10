<script setup lang="ts">
import { ref } from 'vue'

const searchForm = ref({
  username: '',
  email: '',
  status: ''
})

const loading = ref(false)
const tableData = ref([
  { id: 1, username: '张三', email: 'zhangsan@example.com', phone: '13800138001', status: 'active', createTime: '2024-01-01' },
  { id: 2, username: '李四', email: 'lisi@example.com', phone: '13800138002', status: 'inactive', createTime: '2024-01-02' },
  { id: 3, username: '王五', email: 'wangwu@example.com', phone: '13800138003', status: 'active', createTime: '2024-01-03' }
])

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

const handleSearch = () => {
  // TODO: 调用搜索 API
  console.log('搜索条件:', searchForm.value)
}

const handleReset = () => {
  searchForm.value = { username: '', email: '', status: '' }
}

const handleAdd = () => {
  // TODO: 打开新增对话框
}

const handleEdit = (row: any) => {
  // TODO: 打开编辑对话框
  console.log('编辑:', row)
}

const handleDelete = (row: any) => {
  // TODO: 调用删除 API
  console.log('删除:', row)
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  // TODO: 重新加载数据
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  // TODO: 重新加载数据
}
</script>

<template>
  <div class="user-management">
    <!-- 搜索栏 -->
    <el-card class="search-card" :body-style="{ padding: '20px' }">
      <el-form :model="searchForm" inline>
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="searchForm.email" placeholder="请输入邮箱" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="启用" value="active" />
            <el-option label="禁用" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card" style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <span>用户列表</span>
          <el-button type="primary" @click="handleAdd">新增用户</el-button>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="margin-top: 20px; justify-content: flex-end"
      />
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

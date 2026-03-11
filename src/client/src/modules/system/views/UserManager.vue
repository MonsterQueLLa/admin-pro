<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserListApi, createUserApi, updateUserApi, deleteUserApi, resetPasswordApi } from '../api/user'
import type { User, CreateUserData } from '../api/user'
import { getRoleListApi } from '../api/role'
import type { Role } from '../api/role'

const loading = ref(false)
const tableData = ref<User[]>([])
const roleList = ref<Role[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增用户')
const formRef = ref<any>(null)
const isEdit = ref(false)

const form = reactive<CreateUserData & { id?: string }>({
  username: '',
  password: '',
  nickname: '',
  email: '',
  phone: '',
  roleIds: [],
  status: 1
})

const searchForm = reactive({
  keyword: '',
  page: 1,
  pageSize: 10
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    const res = await getUserListApi({
      page: pagination.page,
      pageSize: pagination.pageSize,
      keyword: searchForm.keyword
    })
    // data returned from server uses `_id` and `roleIds`; normalize here
    tableData.value = res.list.map(u => {
      const roles = (u.roleIds || []).map((r: any) => ({
        id: r._id || r.id,
        name: r.name,
        code: r.code
      }))
      return {
        ...u,
        id: u._id || u.id,
        roles,
        roleIds: (u.roleIds || []).map((r: any) => r._id || r.id)
      }
    })
    pagination.total = res.pagination.total
  } finally {
    loading.value = false
  }
}

// 获取角色列表
const fetchRoles = async () => {
  const res = await getRoleListApi()
  roleList.value = res
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

// 新增
const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增用户'
  Object.assign(form, {
    username: '',
    password: '',
    nickname: '',
    email: '',
    phone: '',
    roleIds: [],
    status: 1
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: User) => {
  isEdit.value = true
  dialogTitle.value = '编辑用户'
  Object.assign(form, {
    id: row.id,
    username: row.username,
    nickname: row.nickname,
    email: row.email,
    phone: row.phone,
    roleIds: row.roleIds || [],
    status: row.status
  })
  dialogVisible.value = true
}

// 保存
const handleSave = async () => {
  await formRef.value.validate()
  try {
    if (isEdit.value && form.id) {
      const { password, ...updateData } = form
      await updateUserApi(form.id, updateData)
    } else {
      await createUserApi(form)
    }
    ElMessage.success('保存成功')
    dialogVisible.value = false
    fetchData()
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

// 删除
const handleDelete = async (row: User) => {
  try {
    await ElMessageBox.confirm('确定删除该用户吗？', '提示', { type: 'warning' })
    await deleteUserApi(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    // 取消
  }
}

// 重置密码
const handleResetPassword = async (row: User) => {
  try {
    const { value } = await ElMessageBox.prompt('请输入新密码', '重置密码', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /^.{6,}$/,
      inputErrorMessage: '密码至少6位'
    })
    await resetPasswordApi(row.id, value)
    ElMessage.success('密码重置成功')
  } catch (error) {
    // 取消
  }
}

// 分页
const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  fetchData()
}

const handleCurrentChange = (val: number) => {
  pagination.page = val
  fetchData()
}

fetchData()
fetchRoles()
</script>

<template>
  <div class="user-management">
    <el-card class="search-card" :body-style="{ padding: '20px' }">
      <el-form :model="searchForm" inline>
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="用户名/昵称/手机号" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <span>用户列表</span>
          <el-button type="primary" @click="handleAdd">新增用户</el-button>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" border>
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="roles" label="角色">
          <template #default="{ row }">
            <el-tag v-for="role in row.roles" :key="role.id" size="small" style="margin-right: 5px">
              {{ role.name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="warning" size="small" @click="handleResetPassword(row)">重置密码</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :current-page="pagination.page"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="margin-top: 20px; justify-content: flex-end"
      />
    </el-card>

    <!-- 对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!isEdit">
          <el-input v-model="form.password" type="password" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.nickname" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.roleIds" multiple placeholder="请选择角色">
            <el-option v-for="role in roleList" :key="role._id" :label="role.name" :value="role._id" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

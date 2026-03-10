<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getRoleListApi, createRoleApi, updateRoleApi, deleteRoleApi, type Role } from '@/api/role'
import { getMenuTreeApi, type Menu } from '@/api/menu'

const loading = ref(false)
const tableData = ref<Role[]>([])
const menuTree = ref<Menu[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增角色')
const formRef = ref()
const isEdit = ref(false)
const activeTab = ref('basic')

const form = reactive<Partial<Role> & { id?: string }>({
  name: '',
  code: '',
  description: '',
  permissions: [],
  menuIds: [],
  dataScope: 'self'
})

const permissionList = [
  { label: '图片管理', children: [
    { label: '查看图片', value: 'image:view' },
    { label: '上传图片', value: 'image:upload' },
    { label: '编辑图片', value: 'image:update' },
    { label: '删除图片', value: 'image:delete' }
  ]},
  { label: '系统管理', children: [
    { label: '查看用户', value: 'system:user:view' },
    { label: '新增用户', value: 'system:user:create' },
    { label: '编辑用户', value: 'system:user:update' },
    { label: '删除用户', value: 'system:user:delete' },
    { label: '查看角色', value: 'system:role:view' },
    { label: '新增角色', value: 'system:role:create' },
    { label: '编辑角色', value: 'system:role:update' },
    { label: '删除角色', value: 'system:role:delete' },
    { label: '查看菜单', value: 'system:menu:view' },
    { label: '新增菜单', value: 'system:menu:create' },
    { label: '编辑菜单', value: 'system:menu:update' },
    { label: '删除菜单', value: 'system:menu:delete' }
  ]}
]

const rules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入角色编码', trigger: 'blur' }]
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    const res = await getRoleListApi()
    tableData.value = res
  } finally {
    loading.value = false
  }
}

// 获取菜单树
const fetchMenus = async () => {
  const res = await getMenuTreeApi()
  menuTree.value = res
}

// 新增
const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增角色'
  Object.assign(form, {
    name: '',
    code: '',
    description: '',
    permissions: [],
    menuIds: [],
    dataScope: 'self'
  })
  activeTab.value = 'basic'
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: Role) => {
  isEdit.value = true
  dialogTitle.value = '编辑角色'
  Object.assign(form, {
    id: row._id,
    name: row.name,
    code: row.code,
    description: row.description,
    permissions: row.permissions || [],
    menuIds: row.menuIds || [],
    dataScope: row.dataScope || 'self'
  })
  activeTab.value = 'basic'
  dialogVisible.value = true
}

// 保存
const handleSave = async () => {
  await formRef.value.validate()
  try {
    if (isEdit.value && form.id) {
      await updateRoleApi(form.id, form)
    } else {
      await createRoleApi(form)
    }
    ElMessage.success('保存成功')
    dialogVisible.value = false
    fetchData()
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

// 删除
const handleDelete = async (row: Role) => {
  try {
    await ElMessageBox.confirm('确定删除该角色吗？', '提示', { type: 'warning' })
    await deleteRoleApi(row._id)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    // 取消
  }
}

fetchData()
fetchMenus()
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
        <el-table-column prop="name" label="角色名称" />
        <el-table-column prop="code" label="角色编码" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="dataScope" label="数据权限">
          <template #default="{ row }">
            {{ { all: '全部数据', dept: '部门数据', self: '仅本人数据', custom: '自定义' }[row.dataScope] }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="700px">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本信息" name="basic">
          <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="角色名称" prop="name">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="角色编码" prop="code">
              <el-input v-model="form.code" :disabled="isEdit" />
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="form.description" type="textarea" :rows="3" />
            </el-form-item>
            <el-form-item label="数据权限">
              <el-radio-group v-model="form.dataScope">
                <el-radio label="all">全部数据</el-radio>
                <el-radio label="dept">部门数据</el-radio>
                <el-radio label="self">仅本人数据</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="权限配置" name="permission">
          <el-checkbox-group v-model="form.permissions">
            <div v-for="group in permissionList" :key="group.label" class="permission-group">
              <h4>{{ group.label }}</h4>
              <el-checkbox v-for="item in group.children" :key="item.value" :label="item.value">
                {{ item.label }}
              </el-checkbox>
            </div>
          </el-checkbox-group>
        </el-tab-pane>

        <el-tab-pane label="菜单配置" name="menu">
          <el-tree
            :data="menuTree"
            :props="{ label: 'name', children: 'children' }"
            show-checkbox
            node-key="_id"
            :default-checked-keys="form.menuIds"
            @check="(data, checked) => form.menuIds = checked.checkedKeys"
          />
        </el-tab-pane>
      </el-tabs>

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

.permission-group {
  margin-bottom: 20px;
}

.permission-group h4 {
  margin-bottom: 10px;
  color: #606266;
}

.permission-group .el-checkbox {
  margin-right: 20px;
  margin-bottom: 10px;
}
</style>

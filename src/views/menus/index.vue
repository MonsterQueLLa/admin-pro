<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMenuTreeApi, createMenuApi, updateMenuApi, deleteMenuApi, type Menu } from '@/api/menu'

const loading = ref(false)
const tableData = ref<Menu[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增菜单')
const formRef = ref()
const isEdit = ref(false)

const form = reactive<Partial<Menu> & { id?: string }>({
  name: '',
  path: '',
  component: '',
  icon: '',
  type: 'menu',
  permission: '',
  parentId: null,
  sort: 0,
  status: 1
})

const menuTypeOptions = [
  { label: '目录', value: 'directory' },
  { label: '菜单', value: 'menu' },
  { label: '按钮', value: 'button' }
]

const iconOptions = [
  'HomeFilled', 'PictureFilled', 'UserFilled', 'Avatar', 'Menu', 'Setting',
  'Lock', 'Document', 'Folder', 'FolderOpened'
]

const rules = {
  name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }]
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    const res = await getMenuTreeApi()
    tableData.value = res
  } finally {
    loading.value = false
  }
}

// 新增
const handleAdd = (parentId: string | null = null) => {
  isEdit.value = false
  dialogTitle.value = '新增菜单'
  Object.assign(form, {
    name: '',
    path: '',
    component: '',
    icon: '',
    type: 'menu',
    permission: '',
    parentId,
    sort: 0,
    status: 1
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: Menu) => {
  isEdit.value = true
  dialogTitle.value = '编辑菜单'
  Object.assign(form, {
    id: row._id,
    name: row.name,
    path: row.path,
    component: row.component,
    icon: row.icon,
    type: row.type,
    permission: row.permission,
    parentId: row.parentId,
    sort: row.sort,
    status: row.status
  })
  dialogVisible.value = true
}

// 保存
const handleSave = async () => {
  await formRef.value.validate()
  try {
    if (isEdit.value && form.id) {
      await updateMenuApi(form.id, form)
    } else {
      await createMenuApi(form)
    }
    ElMessage.success('保存成功')
    dialogVisible.value = false
    fetchData()
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

// 删除
const handleDelete = async (row: Menu) => {
  try {
    await ElMessageBox.confirm('确定删除该菜单吗？', '提示', { type: 'warning' })
    await deleteMenuApi(row._id)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    // 取消
  }
}

fetchData()
</script>

<template>
  <div class="menu-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>菜单列表</span>
          <el-button type="primary" @click="handleAdd()">新增菜单</el-button>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" row-key="_id" default-expand-all border>
        <el-table-column prop="name" label="菜单名称" />
        <el-table-column prop="path" label="路由路径" />
        <el-table-column prop="component" label="组件路径" />
        <el-table-column prop="icon" label="图标" width="80">
          <template #default="{ row }">
            <el-icon v-if="row.icon"><component :is="row.icon" /></el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 'directory' ? 'primary' : row.type === 'menu' ? 'success' : 'warning'">
              {{ { directory: '目录', menu: '菜单', button: '按钮' }[row.type] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '显示' : '隐藏' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="success" size="small" @click="handleAdd(row._id)">添加子项</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="菜单类型">
          <el-radio-group v-model="form.type">
            <el-radio-button v-for="item in menuTypeOptions" :key="item.value" :label="item.value">
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="路由路径" v-if="form.type !== 'button'">
          <el-input v-model="form.path" placeholder="如: /system/users" />
        </el-form-item>
        <el-form-item label="组件路径" v-if="form.type === 'menu'">
          <el-input v-model="form.component" placeholder="如: users/index" />
        </el-form-item>
        <el-form-item label="图标" v-if="form.type !== 'button'">
          <el-select v-model="form.icon" clearable>
            <el-option v-for="icon in iconOptions" :key="icon" :label="icon" :value="icon">
              <el-icon style="margin-right: 8px"><component :is="icon" /></el-icon>
              {{ icon }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限标识" v-if="form.type === 'button' || form.type === 'menu'">
          <el-input v-model="form.permission" placeholder="如: system:user:view" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="0">隐藏</el-radio>
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

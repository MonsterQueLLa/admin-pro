<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getLogListApi, clearOldLogsApi, type LogItem } from '../api/log'

const loading = ref(false)
const tableData = ref<LogItem[]>([])
const detailDialogVisible = ref(false)
const currentLog = ref<LogItem | null>(null)

const searchForm = reactive({
  module: '',
  action: '',
  startTime: '',
  endTime: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const moduleOptions = [
  { label: '用户管理', value: '用户管理' },
  { label: '角色管理', value: '角色管理' },
  { label: '菜单管理', value: '菜单管理' },
  { label: '图片管理', value: '图片管理' },
  { label: '日志管理', value: '日志管理' },
  { label: '认证', value: '认证' }
]

const actionOptions = [
  { label: '登录', value: '登录' },
  { label: '登出', value: '登出' },
  { label: '查询', value: '查询' },
  { label: '新增', value: '新增' },
  { label: '更新', value: '更新' },
  { label: '删除', value: '删除' }
]

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    const res = await getLogListApi({
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm
    })
    tableData.value = res.list
    pagination.total = res.pagination.total
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

// 重置
const handleReset = () => {
  searchForm.module = ''
  searchForm.action = ''
  searchForm.startTime = ''
  searchForm.endTime = ''
  handleSearch()
}

// 查看详情
const handleViewDetail = (row: LogItem) => {
  currentLog.value = row
  detailDialogVisible.value = true
}

// 清理旧日志
const handleClear = async () => {
  try {
    await ElMessageBox.confirm('确定清理30天前的日志吗？', '提示', { type: 'warning' })
    await clearOldLogsApi(30)
    ElMessage.success('清理成功')
    fetchData()
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

// 获取状态类型
const getStatusType = (status: number) => {
  if (status >= 200 && status < 300) return 'success'
  if (status >= 400 && status < 500) return 'warning'
  return 'danger'
}

fetchData()
</script>

<template>
  <div class="log-management">
    <el-card class="search-card" :body-style="{ padding: '20px' }">
      <el-form :model="searchForm" inline>
        <el-form-item label="模块">
          <el-select v-model="searchForm.module" placeholder="请选择" clearable>
            <el-option v-for="item in moduleOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作">
          <el-select v-model="searchForm.action" placeholder="请选择" clearable>
            <el-option v-for="item in actionOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="searchForm.startTime"
            type="datetime"
            placeholder="开始时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
          <span style="margin: 0 10px">至</span>
          <el-date-picker
            v-model="searchForm.endTime"
            type="datetime"
            placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <span>操作日志</span>
          <el-button type="danger" @click="handleClear">清理旧日志</el-button>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" border>
        <el-table-column prop="createdAt" label="时间" width="180">
          <template #default="{ row }">
            {{ new Date(row.createdAt).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户" width="120" />
        <el-table-column prop="module" label="模块" width="120" />
        <el-table-column prop="action" label="操作" width="100" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="method" label="方法" width="80" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="耗时(ms)" width="100" />
        <el-table-column prop="ip" label="IP地址" width="140" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleViewDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="margin-top: 20px; justify-content: flex-end"
      />
    </el-card>

    <!-- 详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="日志详情" width="600px">
      <el-descriptions :column="2" border v-if="currentLog">
        <el-descriptions-item label="用户">{{ currentLog.username }}</el-descriptions-item>
        <el-descriptions-item label="时间">{{ new Date(currentLog.createdAt).toLocaleString() }}</el-descriptions-item>
        <el-descriptions-item label="模块">{{ currentLog.module }}</el-descriptions-item>
        <el-descriptions-item label="操作">{{ currentLog.action }}</el-descriptions-item>
        <el-descriptions-item label="描述" :span="2">{{ currentLog.description }}</el-descriptions-item>
        <el-descriptions-item label="请求方法">{{ currentLog.method }}</el-descriptions-item>
        <el-descriptions-item label="请求URL">{{ currentLog.url }}</el-descriptions-item>
        <el-descriptions-item label="状态码">
          <el-tag :type="getStatusType(currentLog.status)">{{ currentLog.status }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="耗时">{{ currentLog.duration }}ms</el-descriptions-item>
        <el-descriptions-item label="IP地址">{{ currentLog.ip }}</el-descriptions-item>
        <el-descriptions-item label="UserAgent" :span="2">{{ currentLog.userAgent }}</el-descriptions-item>
      </el-descriptions>
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

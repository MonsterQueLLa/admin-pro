<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getImageListApi, deleteImageApi, batchDeleteImagesApi, uploadImageApi, updateImageApi, type ImageItem } from '../api/image'

const loading = ref(false)
const tableData = ref<ImageItem[]>([])
const selectedIds = ref<string[]>([])
const uploadDialogVisible = ref(false)
const editDialogVisible = ref(false)
const currentImage = ref<Partial<ImageItem>>({})

const searchForm = reactive({
  keyword: '',
  subjects: '',
  type: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0,
  totalPages: 0
})

// 获取列表
const fetchData = async () => {
  loading.value = true
  try {
    const res = await getImageListApi({
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm
    })
    tableData.value = res.list
    pagination.total = res.pagination.total
    pagination.totalPages = res.pagination.totalPages
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
  searchForm.keyword = ''
  searchForm.subjects = ''
  searchForm.type = ''
  handleSearch()
}

// 选择变化
const handleSelectionChange = (selection: ImageItem[]) => {
  selectedIds.value = selection.map(item => item._id)
}

// 上传
const handleUpload = async (file: any) => {
  try {
    await uploadImageApi(file.raw)
    ElMessage.success('上传成功')
    fetchData()
    uploadDialogVisible.value = false
  } catch (error) {
    ElMessage.error('上传失败')
  }
}

// 编辑
const handleEdit = (row: ImageItem) => {
  currentImage.value = { ...row }
  editDialogVisible.value = true
}

// 保存编辑
const handleSaveEdit = async () => {
  try {
    await updateImageApi(currentImage.value._id!, {
      title: currentImage.value.title,
      description: currentImage.value.description,
      subjects: currentImage.value.subjects,
      type: currentImage.value.type,
      date: currentImage.value.date,
      device: currentImage.value.device,
      location: currentImage.value.location
    })
    ElMessage.success('更新成功')
    editDialogVisible.value = false
    fetchData()
  } catch (error) {
    ElMessage.error('更新失败')
  }
}

// 删除
const handleDelete = async (row: ImageItem) => {
  try {
    await ElMessageBox.confirm('确定删除这张图片吗？', '提示', { type: 'warning' })
    await deleteImageApi(row._id)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    // 取消删除
  }
}

// 批量删除
const handleBatchDelete = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请先选择图片')
    return
  }
  try {
    await ElMessageBox.confirm(`确定删除选中的 ${selectedIds.value.length} 张图片吗？`, '提示', { type: 'warning' })
    await batchDeleteImagesApi(selectedIds.value)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    // 取消删除
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

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

fetchData()
</script>

<template>
  <div class="image-manager">
    <!-- 搜索栏 -->
    <el-card class="search-card" :body-style="{ padding: '20px' }">
      <el-form :model="searchForm" inline>
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="标题/描述" clearable />
        </el-form-item>
        <el-form-item label="主角">
          <el-input v-model="searchForm.subjects" placeholder="主角名称" clearable />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="searchForm.type" placeholder="请选择" clearable>
            <el-option label="风景" value="风景" />
            <el-option label="人像" value="人像" />
            <el-option label="美食" value="美食" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作栏 -->
    <el-card class="table-card" style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <span>图片列表</span>
          <div>
            <el-button type="primary" @click="uploadDialogVisible = true">上传图片</el-button>
            <el-button type="danger" @click="handleBatchDelete" :disabled="selectedIds.length === 0">
              批量删除
            </el-button>
          </div>
        </div>
      </template>

      <!-- 图片表格 -->
      <el-table :data="tableData" v-loading="loading" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column label="缩略图" width="120">
          <template #default="{ row }">
            <el-image
              :src="row.thumbnailPath"
              :preview-src-list="[row.originalPath]"
              fit="cover"
              style="width: 80px; height: 80px; border-radius: 4px; cursor: pointer"
              :preview-teleported="true"
              hide-on-click-modal
            >
              <template #error>
                <div class="image-error">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="subjects" label="主角">
          <template #default="{ row }">
            <el-tag v-for="subject in row.subjects" :key="subject" size="small" style="margin-right: 5px">
              {{ subject }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="size" label="大小" width="100">
          <template #default="{ row }">
            {{ formatFileSize(row.size) }}
          </template>
        </el-table-column>
        <el-table-column prop="creatorName" label="上传者" width="120" />
        <el-table-column prop="createdAt" label="上传时间" width="180">
          <template #default="{ row }">
            {{ new Date(row.createdAt).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
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

    <!-- 上传对话框 -->
    <el-dialog v-model="uploadDialogVisible" title="上传图片" width="500px">
      <el-upload
        drag
        action=""
        :auto-upload="false"
        :on-change="handleUpload"
        accept="image/*"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          拖拽文件到此处或 <em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            支持 jpg/png/gif/webp 格式，单个文件不超过 10MB
          </div>
        </template>
      </el-upload>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog v-model="editDialogVisible" title="编辑图片信息" width="600px">
      <el-form :model="currentImage" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="currentImage.title" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="currentImage.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="主角">
          <el-select v-model="currentImage.subjects" multiple allow-create filterable placeholder="输入主角名称">
            <el-option v-for="item in currentImage.subjects" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="currentImage.type" placeholder="请选择">
            <el-option label="风景" value="风景" />
            <el-option label="人像" value="人像" />
            <el-option label="美食" value="美食" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="拍摄日期">
          <el-date-picker v-model="currentImage.date" type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="设备">
          <el-input v-model="currentImage.device" placeholder="如: iPhone 15" />
        </el-form-item>
        <el-form-item label="地点">
          <el-input v-model="currentImage.location" placeholder="如: 北京" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveEdit">保存</el-button>
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

.image-error {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  color: #909399;
  font-size: 24px;
}

/* 图片预览自定义样式 */
:deep(.el-image-viewer__wrapper) {
  background-color: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
}

:deep(.el-image-viewer__img) {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

:deep(.el-image-viewer__btn) {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  font-size: 24px;
  transition: all 0.3s ease;
}

:deep(.el-image-viewer__btn:hover) {
  background-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

:deep(.el-image-viewer__close) {
  top: 20px;
  right: 20px;
}

:deep(.el-image-viewer__actions) {
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 30px;
  padding: 10px 20px;
}

:deep(.el-image-viewer__actions__inner) {
  color: #fff;
  font-size: 18px;
}

:deep(.el-image-viewer__prev) {
  left: 20px;
}

:deep(.el-image-viewer__next) {
  right: 20px;
}

/* 缩略图悬停效果 */
:deep(.el-image img) {
  transition: all 0.3s ease;
}

:deep(.el-image:hover img) {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
</style>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { ImageItem } from '../api/image'
import { getImageListApi, deleteImageApi, batchDeleteImagesApi, uploadImageApi, updateImageApi } from '../api/image'

const loading = ref(false)
const tableData = ref<ImageItem[]>([])
const selectedIds = ref<string[]>([])
const uploadDialogVisible = ref(false)
const editDialogVisible = ref(false)
const currentImage = ref<Partial<ImageItem>>({})

// upload 相关状态
const uploadPreview = ref('')          // 缩略图显示
const uploadPreviewFull = ref('')      // 用于预览大图
const uploadFiles = ref<File[]>([])
const uploadRef = ref<any>(null)

// 当用户选择文件时自动提取标题（不包括扩展名）
const uploadTitle = computed(() => {
  if (uploadFiles.value.length === 0) return ''
  // show first file's derived title
  return uploadFiles.value[0].name.replace(/\.[^/.]+$/, '')
})

// 编辑时新文件和预览
const editImageFile = ref<File | null>(null)
const editImagePreview = ref('')
// 原始缩略图地址，用于重置
const originalThumbnail = ref('')
// 原始大图地址
const originalFull = ref('') 
const editUploadRef = ref<any>(null)

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

// no thumbnail generation; we'll display full image scaled by CSS

// 上传文件选择回调，支持多选，生成预览与列表
const handleUpload = (file: any) => {
  if (!file || !file.raw) return
  const f: File = file.raw
  uploadFiles.value.push(f)
  // set preview to first
  if (uploadFiles.value.length === 1) {
    uploadPreviewFull.value = URL.createObjectURL(f)
    uploadPreview.value = uploadPreviewFull.value
  }
}

// 提交上传（点击上传按钮后执行）
const submitUpload = async () => {
  if (uploadFiles.value.length === 0) {
    openUploadPicker()
    return
  }
  // sequentially upload
  for (const file of uploadFiles.value) {
    const title = file.name.replace(/\.[^/.]+$/, '')
    try {
      const res = await getImageListApi({ keyword: title, pageSize: 1 })
      if (res.list.some(img => img.title === title)) {
        ElMessage.error(`名称 ${title} 已存在，跳过`)
        continue
      }
    } catch {}
    try {
      await uploadImageApi(file)
    } catch (error) {
      const msg = error?.response?.data?.message || '上传失败'
      ElMessage.error(`${title} 上传失败: ${msg}`)
    }
  }
  ElMessage.success('批量上传完成')
  fetchData()
  uploadDialogVisible.value = false
  // clear
  uploadFiles.value = []
  uploadPreview.value = ''
  uploadPreviewFull.value && URL.revokeObjectURL(uploadPreviewFull.value)
  uploadPreviewFull.value = ''
}

// 打开文件选择
const openUploadPicker = () => {
  // ElementPlus upload exposes an input element; click it directly
  const el = uploadRef.value?.$el as HTMLElement | undefined
  const input = el?.querySelector('input[type=file]') as HTMLInputElement | null
  if (input) {
    input.click()
  }
}

// 打开编辑对话框中的选择
const openEditPicker = () => {
  const el = editUploadRef.value?.$el as HTMLElement | undefined
  const input = el?.querySelector('input[type=file]') as HTMLInputElement | null
  if (input) {
    input.click()
  }
}

// 删除 upload 选择
const clearUpload = () => {
  uploadFiles.value = []
  uploadPreview.value = ''
  uploadPreviewFull.value && URL.revokeObjectURL(uploadPreviewFull.value)
  uploadPreviewFull.value = ''
}

// 修改选择（重新触发文件对话框）
const triggerUploadChange = () => {
  clearUpload()
  // open file picker
  openUploadPicker()
}

// 清空编辑选择，恢复原图
const clearEdit = () => {
  editImageFile.value = null
  editImagePreview.value = originalThumbnail.value
}

// 编辑时重新选图
const triggerEditChange = () => {
  clearEdit()
  openEditPicker()
}

// 编辑对话框中选择新图片
const handleEditImageChange = (file: any) => {
  if (!file || !file.raw) return
  editImageFile.value = file.raw
  editImagePreview.value = URL.createObjectURL(file.raw)
}


// 编辑
const handleEdit = (row: ImageItem) => {
  currentImage.value = { ...row }
  // 初始化编辑图片预览与原图地址
  originalThumbnail.value = getImageUrl(row.thumbnailPath)
  originalFull.value = getImageUrl(row.originalPath)
  editImagePreview.value = originalThumbnail.value
  editImageFile.value = null
  editDialogVisible.value = true
}

// 保存编辑
const handleSaveEdit = async () => {
  try {
    const payload: Partial<ImageItem> = {
      title: currentImage.value.title,
      description: currentImage.value.description,
      subjects: currentImage.value.subjects,
      type: currentImage.value.type,
      date: currentImage.value.date,
      device: currentImage.value.device,
      location: currentImage.value.location
    }

    if (editImageFile.value) {
      // 提交带文件的表单
      await updateImageApi(currentImage.value._id!, payload, editImageFile.value)
    } else {
      await updateImageApi(currentImage.value._id!, payload)
    }

    ElMessage.success('更新成功')
    editDialogVisible.value = false
    // 重置编辑状态
    editImageFile.value = null
    editImagePreview.value = ''
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

// 将相对路径转换为完整 URL（开发环境可能需要代理）
const getImageUrl = (path: string) => {
  if (!path) return ''
  // tsconfig 可能没有 esnext module，这里用 any 绕开类型检查
  // @ts-ignore
  const env: any = (import.meta as any).env || {}
  const base = env.VITE_API_BASE_URL || ''
  // 避免重复的斜杠
  return base.replace(/\/$/, '') + path
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
              :src="getImageUrl(row.thumbnailPath)"
              :preview-src-list="[getImageUrl(row.originalPath)]"
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
        <el-table-column prop="title" label="标题" width="150"/>
        <el-table-column prop="description" label="描述" width="200"/>
        <el-table-column prop="subjects" label="主角">
          <template #default="{ row }">
            <el-tag v-for="subject in row.subjects" :key="subject" size="small" style="margin-right: 5px">
              {{ subject }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="date" label="拍摄日期" width="120">
          <template #default="{ row }">
            {{ row.date ? new Date(row.date).toLocaleDateString() : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="device" label="设备" width="120" />
        <el-table-column prop="location" label="地点" width="120" />
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
        :current-page="pagination.page"
        :page-size="pagination.pageSize"
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
      <!-- 初始状态和预览状态切换 -->
      <div v-if="!uploadPreview" class="initial-upload-state">
        <div class="initial-box" @click="openUploadPicker">
          点击上传图片
        </div>
        <div class="initial-hint">支持JPG/PNG格式，最大20MB</div>
      </div>

      <div v-else class="upload-preview-card">
        <div style="margin-bottom:6px;">
          已选择 {{ uploadFiles.length }} 张图片
        </div>
        <el-image
          :src="uploadPreview"
          fit="contain"
          class="preview-img"
          :preview-src-list="[uploadPreviewFull || uploadPreview]"
          :preview-teleported="true"
          style="cursor: pointer; max-width:200px; max-height:200px;"
        />
        <div class="preview-label">已上传预览</div>
        <div class="preview-actions">
          <el-button size="mini" @click="triggerUploadChange">修改图片</el-button>
          <el-button size="mini" type="danger" @click="clearUpload">删除图片</el-button>
        </div>
      </div>

      <!-- 固定上传按钮 -->
      <div style="text-align: center; margin-top: 10px;">
        <div v-if="uploadTitle" style="margin-bottom: 6px; color: #606266; font-size: 14px;">
          标题：<strong>{{ uploadTitle }}</strong>（不可修改）
        </div>
        <el-button type="primary" @click="submitUpload">上传</el-button>
      </div>

      <!-- 隐藏的上传控件，用于触发文件选择 -->
      <el-upload
        ref="uploadRef"
        style="display: none;"
        action=""
        :auto-upload="false"
        :on-change="handleUpload"
        accept="image/*"
        multiple
      />
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog v-model="editDialogVisible" title="编辑图片信息" width="600px">
      <el-form :model="currentImage" label-width="80px">
        <el-form-item label="图片">
          <div v-if="!editImagePreview" class="initial-upload-state" style="margin-bottom:10px;">
            <div class="initial-box" @click="openEditPicker">
              点击上传图片
            </div>
            <div class="initial-hint">支持JPG/PNG格式，最大20MB</div>
          </div>
          <div v-else class="upload-preview-card" style="margin-bottom:10px;">
            <el-image
              :src="editImagePreview"
              fit="contain"
              class="preview-img"
              :preview-src-list="[ editImageFile ? editImagePreview : originalFull ]"
              :preview-teleported="true"
              style="cursor: pointer; max-width:200px; max-height:200px;"
            />
            <div class="preview-label">当前图片</div>
            <div class="preview-actions">
              <el-button size="mini" @click="triggerEditChange">修改图片</el-button>
              <el-button size="mini" type="danger" @click="clearEdit">恢复原图</el-button>
            </div>
          </div>
          <!-- 隐藏编辑上传控件 -->
          <el-upload
            ref="editUploadRef"
            style="display:none;"
            action=""
            :auto-upload="false"
            :on-change="handleEditImageChange"
            accept="image/*"
          />
        </el-form-item>
        <el-form-item label="标题">
          <!-- title is immutable according to requirements -->
          <el-input v-model="currentImage.title" disabled />
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

/* 上传预览卡片 */
.upload-preview-card {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 10px;
  text-align: center;
  margin-bottom: 10px;
}
.upload-preview-card .preview-img {
  max-width: 100%;
  max-height: 200px;
  display: block;
  margin: 0 auto 5px;
}
.upload-preview-card .preview-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 5px;
}
.upload-preview-card .preview-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}

/* 初始上传状态 */
.initial-upload-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px 0;
}
.initial-upload-state .initial-box {
  width: 120px;
  height: 120px;
  border: 2px dashed #c0c4cc;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  cursor: pointer;
}
.initial-upload-state .initial-hint {
  font-size: 12px;
  color: #909399;
}

</style>

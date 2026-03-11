<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getImageListApi } from '../api/image'
import Carousel3D from '@/shared/components/Carousel3D.vue'
import type { ImageItem, ImageParams } from '../api/image'

const loading = ref(false)
const images = ref<ImageItem[]>([])

const filters = reactive({
  subjects: '',
  type: '',
  date: '',
  device: '',
  location: ''
})

// same helper as elsewhere
const getImageUrl = (path: string) => {
  if (!path) return ''
  // @ts-ignore
  const env: any = (import.meta as any).env || {}
  const base = env.VITE_API_BASE_URL || ''
  return base.replace(/\/$/, '') + path
}

const pagination = reactive({ page: 1, pageSize: 50, total: 0 })

const fetchData = async () => {
  loading.value = true
  try {
    const params: ImageParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      subjects: filters.subjects,
      type: filters.type,
      date: filters.date ? new Date(filters.date).toISOString().slice(0,10) : undefined,
      device: filters.device,
      location: filters.location
    }
    const res = await getImageListApi(params)
    images.value = res.list
    pagination.total = res.pagination.total
  } catch (err) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

const handleReset = () => {
  filters.subjects = ''
  filters.type = ''
  filters.date = ''
  filters.device = ''
  filters.location = ''
  handleSearch()
}

// preview logic
// preview state and zoom
const previewVisible = ref(false)
const currentIndex = ref(0)
const zoomLevel = ref(1)

const currentImage = computed(() => images.value[currentIndex.value])

const openPreview = (index: number) => {
  currentIndex.value = index
  zoomLevel.value = 1
  imgPos.x = 0
  imgPos.y = 0
  previewVisible.value = true
}

const showNext = () => {
  if (currentIndex.value < images.value.length - 1) {
    currentIndex.value++
    zoomLevel.value = 1
    imgPos.x = 0
    imgPos.y = 0
  }
}
const showPrev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    zoomLevel.value = 1
    imgPos.x = 0
    imgPos.y = 0
  }
}

// 鼠标滚轮放大/缩小
const handleWheel = (e: WheelEvent) => {
  if (!previewVisible.value) return
  e.preventDefault()
  zoomLevel.value = Math.min(Math.max(0.5, zoomLevel.value + (e.deltaY < 0 ? 0.1 : -0.1)), 3)
}

// 拖动查看大图
let isDragging = false
let dragStartX = 0
let dragStartY = 0
let origX = 0
let origY = 0
const imgPos = reactive({ x: 0, y: 0 })

const handleMouseDown = (e: MouseEvent) => {
  // allow dragging even when zoomLevel <= 1, useful for repositioning
  isDragging = true
  dragStartX = e.clientX
  dragStartY = e.clientY
  origX = imgPos.x
  origY = imgPos.y
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
}
const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging) return
  imgPos.x = origX + (e.clientX - dragStartX)
  imgPos.y = origY + (e.clientY - dragStartY)
}
const handleMouseUp = () => {
  isDragging = false
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
}

// 展示模式
const mode = ref<'grid'|'waterfall'|'carousel'>('grid')
const switchMode = (m: typeof mode.value) => {
  mode.value = m
  // 轮播模式由 Carousel3D 组件自己处理，不需要在这里启动
}

// 自动轮播
let carouselTimer: any = null
const startAutoCarousel = () => {
  carouselTimer = setInterval(() => {
    if (currentIndex.value < images.value.length - 1) {
      currentIndex.value++
    } else {
      currentIndex.value = 0
    }
  }, 2000)
}
const stopAutoCarousel = () => {
  if (carouselTimer) {
    clearInterval(carouselTimer)
    carouselTimer = null
  }
}

// 键盘导航
const handleKeyDown = (e: KeyboardEvent) => {
  if (!previewVisible.value) return
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    showPrev()
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    showNext()
  }
}

const getCarouselStyle = (index: number) => {
  const diff = index - currentIndex.value
  const abs = Math.abs(diff)
  if (diff === 0) {
    return { transform: 'translateZ(0) rotateY(0deg) scale(1.2)', opacity: 1, zIndex: 2 }
  }
  const angle = diff < 0 ? -60 : 60
  const z = -300 - abs * 100
  const opacity = Math.max(0, 1 - abs * 0.3)
  return { transform: `translateZ(${z}px) rotateY(${angle}deg)`, opacity, zIndex: 1 }
}

// 轮播点击处理
const handleCarouselClick = (index: number) => {
  openPreview(index)
}

const handlePageChange = (page: number) => {
  pagination.page = page
  fetchData()
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  fetchData()
}

fetchData()
// 注册键盘事件
window.addEventListener('keydown', handleKeyDown)
// 页面卸载时清理
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    stopAutoCarousel()
    window.removeEventListener('keydown', handleKeyDown)
  })
}
</script>

<template>
  <div class="image-preview">
    <el-card class="search-card" :body-style="{ padding: '20px' }">
      <el-form :model="filters" inline>
        <el-form-item label="主角">
          <el-input v-model="filters.subjects" placeholder="主角" clearable />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="filters.type" placeholder="请选择" clearable>
            <el-option label="风景" value="风景" />
            <el-option label="人像" value="人像" />
            <el-option label="美食" value="美食" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="拍摄日期">
          <el-date-picker v-model="filters.date" type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="设备">
          <el-input v-model="filters.device" placeholder="设备" clearable />
        </el-form-item>
        <el-form-item label="地点">
          <el-input v-model="filters.location" placeholder="地点" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">筛选</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="mode-buttons" style="margin-bottom:10px">
      <el-button size="mini" :type="mode==='grid'?'primary':''" @click="switchMode('grid')">网格</el-button>
      <el-button size="mini" :type="mode==='waterfall'?'primary':''" @click="switchMode('waterfall')">瀑布流</el-button>
      <el-button size="mini" :type="mode==='carousel'?'primary':''" @click="switchMode('carousel')">3D 轮播</el-button>
    </div>
    <div class="gallery" :class="mode" v-loading="loading">
      <template v-if="mode==='grid'">
        <div
          v-for="(img, index) in images"
          :key="img._id"
          class="thumb"
          @click="openPreview(index)"
        >
          <el-image :src="getImageUrl(img.thumbnailPath)" fit="cover" />
        </div>
      </template>
      <template v-else-if="mode==='waterfall'">
        <div class="thumb" v-for="(img,index) in images" :key="img._id" @click="openPreview(index)">
          <el-image :src="getImageUrl(img.thumbnailPath)" fit="cover" />
        </div>
      </template>
      <template v-else>
        <Carousel3D :items="images" :getImageUrl="getImageUrl" @click="handleCarouselClick" />
      </template>
    </div>

    <el-pagination
      :current-page="pagination.page"
      :page-size="pagination.pageSize"
      :total="pagination.total"
      :page-sizes="[20,50,100]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
      style="margin-top:20px; text-align:right;"
    />

    <div v-if="previewVisible" class="preview-overlay" @click.self="previewVisible=false" @wheel.prevent="handleWheel">
      <div class="preview-container" :class="{ animate: true }">
        <img
          v-img-fix="currentImage ? currentImage.originalPath : ''"
          :src="getImageUrl(currentImage ? currentImage.originalPath : '')"
          class="preview-img"
          :style="{ transform: `scale(${zoomLevel}) translate(${imgPos.x}px, ${imgPos.y}px)` }"
          @mousedown.prevent="handleMouseDown"
        />
        <button class="prev-btn" @click.stop="showPrev" :disabled="currentIndex===0">‹</button>
        <button class="next-btn" @click.stop="showNext" :disabled="currentIndex===images.length-1">›</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-card { margin-bottom: 20px }
.gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  min-height: 400px;
}
.gallery.carousel {
  flex-wrap: nowrap;
  justify-content: center;
}
.gallery.waterfall {
  display: block;
  column-count: 4;
  column-gap: 10px;
}
.gallery.waterfall .thumb {
  width: 100%;
  display: inline-block;
  margin: 0 0 10px;
}
.thumb {
  width: 150px;
  height: 150px;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  perspective: 1000px;
}
.thumb img,
.thumb .el-image__inner {
  transition: transform 0.5s;
}
.thumb:hover img {
  transform: scale(1.1) rotateY(15deg);
}
.preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.preview-container {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  transform-style: preserve-3d;
  animation: pop 0.3s ease-out;
}
.preview-img {
  max-width: 100%;
  max-height: 100%;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0,0,0,0.5);
  user-select: none;
  cursor: grab;
}
.preview-img:active {
  cursor: grabbing;
}
.prev-btn, .next-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.5);
  color: #fff;
  border: none;
  font-size: 24px;
  padding: 10px;
  cursor: pointer;
  border-radius: 50%;
}
.prev-btn { left: -50px }
.next-btn { right: -50px }
.prev-btn:disabled, .next-btn:disabled { opacity: 0.3; cursor: default }

@keyframes pop {
  from { transform: scale(0.7) rotateY(90deg); opacity:0 }
  to { transform: scale(1) rotateY(0); opacity:1 }
}
</style>

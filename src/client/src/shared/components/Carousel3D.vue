<script>
export default {
  name: 'Carousel3D',
  props: {
    items: {
      type: Array,
      required: true
    },
    getImageUrl: {
      type: Function,
      default: (path) => path
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    autoplayInterval: {
      type: Number,
      default: 3000
    },
    radius: {
      type: Number,
      default: 320
    },
    visibleItems: {
      type: Number,
      default: 5
    }
  },
  emits: ['click'],
  data() {
    return {
      currentIndex: 0,
      carouselTimer: null,
      _keydownHandler: null
    }
  },
  computed: {
    getCarouselStyle() {
      return (index) => {
        const itemCount = this.items.length;
        let diff = index - this.currentIndex;
        
        if (diff > itemCount / 2) diff -= itemCount;
        if (diff < -itemCount / 2) diff += itemCount;

        const absDiff = Math.abs(diff);
        
        if (absDiff > Math.floor(this.visibleItems / 2)) {
          return { visibility: 'hidden', opacity: 0, transform: 'scale(0)' };
        }

        const angle = diff * (360 / (this.visibleItems * 2));
        const radian = (angle * Math.PI) / 180;
        
        const x = Math.sin(radian) * this.radius;
        const z = Math.cos(radian) * this.radius;
        
        const scale = 1 - (absDiff * 0.15);
        const opacity = 1 - (absDiff * 0.25);
        
        return {
          transform: `translateX(${x}px) translateZ(${z}px) scale(${scale})`,
          opacity,
          zIndex: 10 - absDiff,
          visibility: 'visible'
        };
      };
    }
  },
  methods: {
    startAutoCarousel() {
      if (!this.autoplay || this.items.length <= 1) return;
      this.carouselTimer = setInterval(() => {
        this.handleNext();
      }, this.autoplayInterval);
    },
    stopAutoCarousel() {
      if (this.carouselTimer) {
        clearInterval(this.carouselTimer);
        this.carouselTimer = null;
      }
    },
    handleNext() {
      this.currentIndex = (this.currentIndex + 1) % this.items.length;
    },
    handlePrev() {
      this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    },
    handleKeyDown(e) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.handleNext();
      }
    },
    handleItemClick(index) {
      this.currentIndex = index;
      this.$emit('click', index);
    }
  },
  mounted() {
    console.log('Carousel3D mounted:', {
      itemsCount: this.items?.length || 0,
      autoplay: this.autoplay,
      interval: this.autoplayInterval,
      radius: this.radius,
      visibleItems: this.visibleItems
    });
    this.startAutoCarousel();
    this._keydownHandler = this.handleKeyDown.bind(this);
    window.addEventListener('keydown', this._keydownHandler);
  },
  beforeUnmount() {
    this.stopAutoCarousel();
    if (this._keydownHandler) {
      window.removeEventListener('keydown', this._keydownHandler);
    }
  },
  watch: {
    items: {
      handler() {
        this.stopAutoCarousel();
        this.startAutoCarousel();
      },
      deep: true
    },
    autoplay(newVal) {
      if (newVal) {
        this.startAutoCarousel();
      } else {
        this.stopAutoCarousel();
      }
    }
  }
};
</script>

<template>
  <div class="carousel-3d">
    <div class="carousel-container">
      <div class="carousel">
        <div
          v-for="(item, index) in items"
          :key="item._id || index"
          class="carousel-item"
          :class="{ active: index === currentIndex }"
          :style="getCarouselStyle(index)"
          @click="handleItemClick(index)"
        >
          <!-- 新增边框包裹层，实现立体边框 -->
          <div class="border-wrapper">
            <img 
              :src="getImageUrl(item.originalPath)" 
              class="carousel-img" 
              :alt="item.title || `Item ${index + 1}`"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>

    <button 
      class="carousel-nav-btn prev-btn" 
      @click="handlePrev"
      :disabled="items.length <= 1"
    >
      ‹
    </button>
    <button 
      class="carousel-nav-btn next-btn" 
      @click="handleNext"
      :disabled="items.length <= 1"
    >
      ›
    </button>
  </div>
</template>

<style scoped>
.carousel-3d {
  position: relative;
  width: 100%;
  height: 550px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
  overflow: hidden;
}

.carousel-container {
  perspective: 1800px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 轮播项基础样式 - 强化立体效果 */
.carousel-item {
  position: absolute;
  width: 420px;
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 16px; /* 增大圆角，配合立体边框 */
  overflow: hidden;
  cursor: pointer;
  /* 基础立体阴影 - 非激活项 */
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.1),
    0 12px 24px rgba(0, 0, 0, 0.15),
    0 20px 40px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.8); /* 内发光模拟边框高光 */
}

/* 激活项：强化立体边框 + 无外部阴影 */
.carousel-item.active {
  box-shadow: 
    inset 0 0 0 2px rgba(255, 255, 255, 0.9), /* 内层高亮边框 */
    inset 0 1px 3px rgba(0, 0, 0, 0.1),       /* 内阴影增强立体感 */
    0 0 0 1px rgba(0, 0, 0, 0.1);             /* 细外边框 */
  /* 激活项高清优化 */
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  /* 轻微3D抬升效果 */
  transform: translateZ(10px);
}

/* 立体边框包裹层 - 核心立体效果 */
.border-wrapper {
  width: 100%;
  height: 100%;
  border-radius: 14px; /* 比外层小2px，模拟边框厚度 */
  overflow: hidden;
  position: relative;
  /* 立体边框的光影层次 */
  box-shadow: 
    inset 0 0 0 1px rgba(0, 0, 0, 0.05),
    inset 0 2px 0 rgba(255, 255, 255, 0.6),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
}

/* 给非激活项添加渐变边框效果 */
.carousel-item:not(.active) .border-wrapper {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.2) 0%, 
    rgba(0, 0, 0, 0.1) 100%);
}

/* 激活项边框强化 */
.carousel-item.active .border-wrapper {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.9) 0%, 
    rgba(255, 255, 255, 0.4) 100%);
  box-shadow: 
    inset 0 0 0 1px rgba(255, 255, 255, 0.8),
    inset 0 1px 5px rgba(255, 255, 255, 0.9),
    inset 0 -1px 2px rgba(0, 0, 0, 0.1);
}

/* 高清图片样式 */
.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  transform: translateZ(0);
  /* 图片与边框之间的细微间距，增强立体层次感 */
  margin: 1px;
  border-radius: 12px;
}

/* 导航按钮样式优化 */
.carousel-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  border: none;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  transition: all 0.3s ease;
  /* 按钮也强化立体效果 */
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
}

.carousel-nav-btn:hover {
  background: #fff;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 
    0 6px 12px rgba(0, 0, 0, 0.15),
    0 12px 24px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
}

.carousel-nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  transform: translateY(-50%);
}

.prev-btn {
  left: 30px;
}

.next-btn {
  right: 30px;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .carousel-3d {
    height: 400px;
  }
  .carousel-item {
    width: 300px;
    height: 240px;
    border-radius: 14px;
  }
  .border-wrapper {
    border-radius: 12px;
  }
  .carousel-img {
    border-radius: 10px;
  }
  .carousel-nav-btn {
    width: 50px;
    height: 50px;
    font-size: 24px;
  }
  .prev-btn {
    left: 20px;
  }
  .next-btn {
    right: 20px;
  }
}

@media (min-width: 769px) and (max-width: 1200px) {
  .carousel-3d {
    height: 480px;
  }
  .carousel-item {
    width: 360px;
    height: 280px;
  }
}
</style>
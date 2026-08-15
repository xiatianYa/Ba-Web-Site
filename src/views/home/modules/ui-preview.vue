<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import homeImg from '@/assets/home/home.png';
import groupImg from '@/assets/home/group.png';
import keyBindImg from '@/assets/home/key_bind.png';
import mapOrderImg from '@/assets/home/map_order.png';
import mapRecordImg from '@/assets/home/map_record.png';
import perfViewImg from '@/assets/home/perf-view.png';
import serverImg from '@/assets/home/server.png';
import toolImg from '@/assets/home/tool.png';

defineOptions({ name: 'UiPreview' });

/** 预览图配置（标题翻译键 + 启动器实机截图） */
const PREVIEWS = [
  { key: 'home', img: homeImg },
  { key: 'group', img: groupImg },
  { key: 'keyBind', img: keyBindImg },
  { key: 'mapOrder', img: mapOrderImg },
  { key: 'mapRecord', img: mapRecordImg },
  { key: 'perfView', img: perfViewImg },
  { key: 'serverList', img: serverImg },
  { key: 'toolbox', img: toolImg }
];

/** 当前预览索引 */
const activeIndex = ref(0);

const prev = () => {
  if (activeIndex.value > 0) activeIndex.value--;
};

const next = () => {
  if (activeIndex.value < PREVIEWS.length - 1) activeIndex.value++;
};
</script>

<template>
  <section class="story-section preview-story">
    <div class="story-content">
      <!-- 区块标题 -->
      <div class="preview-title-area text-center" v-reveal="0" data-reveal="up">
        <h2 class="section-title justify-center">{{ $t('home.preview.title') }}</h2>
        <p class="section-desc">{{ $t('home.preview.desc') }}</p>
      </div>

      <!-- 预览卡片（单卡展示 + 左右切换） -->
      <div class="preview-viewport mt-6" v-reveal="80" data-reveal="up">
        <button
          type="button"
          class="preview-arrow preview-arrow--prev"
          :disabled="activeIndex === 0"
          :aria-label="$t('home.preview.prev')"
          @click="prev"
        >
          <Icon icon="heroicons:chevron-left" class="h-5 w-5" />
        </button>

        <div class="preview-stage">
          <div
            v-for="(item, i) in PREVIEWS"
            :key="item.key"
            class="preview-card"
            :class="{ active: i === activeIndex }"
          >
            <div class="preview-img-wrap">
              <img :src="item.img" :alt="$t(`home.preview.${item.key}`)" loading="lazy" />
            </div>
            <div class="preview-caption">
              <Icon icon="heroicons:photo" class="h-4 w-4 text-sky-500" />
              <span>{{ $t(`home.preview.${item.key}`) }}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          class="preview-arrow preview-arrow--next"
          :disabled="activeIndex === PREVIEWS.length - 1"
          :aria-label="$t('home.preview.next')"
          @click="next"
        >
          <Icon icon="heroicons:chevron-right" class="h-5 w-5" />
        </button>
      </div>

      <!-- 指示点 -->
      <div class="preview-dots mt-4" v-reveal="140" data-reveal="up">
        <button
          v-for="(item, i) in PREVIEWS"
          :key="item.key"
          type="button"
          class="preview-dot"
          :class="{ active: i === activeIndex }"
          :aria-label="$t(`home.preview.${item.key}`)"
          @click="activeIndex = i"
        />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.preview-viewport {
  position: relative;
  max-width: 920px;
  margin: 0 auto;
}

.preview-stage {
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid color-mix(in oklab, var(--color-base-content) 8%, transparent);
  background: color-mix(in oklab, var(--color-base-200) 55%, transparent);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

.preview-card {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.35s ease;

  &.active {
    opacity: 1;
    visibility: visible;
  }

  .preview-img-wrap {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    background: color-mix(in oklab, var(--color-base-300) 40%, transparent);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .preview-caption {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 12px 14px;
    font-size: 13px;
    font-weight: 600;
    color: color-mix(in oklab, var(--color-base-content) 75%, transparent);
    background: color-mix(in oklab, var(--color-base-100) 80%, transparent);
  }
}

/* 激活卡片切换动画 */
.preview-card.active {
  animation: preview-card-in 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes preview-card-in {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.985);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

.preview-arrow {
  position: absolute;
  top: 50%;
  z-index: 2;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: color-mix(in oklab, var(--color-base-content) 70%, transparent);
  background: color-mix(in oklab, var(--color-base-100) 85%, transparent);
  border: 1px solid color-mix(in oklab, var(--color-base-content) 12%, transparent);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  transform: translateY(-50%);
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;

  &:hover:not(:disabled) {
    color: #fff;
    background: linear-gradient(135deg, #0ea5e9, #2563eb);
    border-color: transparent;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.preview-arrow--prev {
  left: -20px;
}

.preview-arrow--next {
  right: -20px;
}

.preview-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.preview-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  border: none;
  padding: 0;
  background: color-mix(in oklab, var(--color-base-content) 22%, transparent);
  cursor: pointer;
  transition:
    width 0.25s ease,
    background-color 0.25s ease;

  &.active {
    width: 22px;
    background: linear-gradient(135deg, #0ea5e9, #2563eb);
  }
}

@media (max-width: 640px) {
  .preview-arrow--prev {
    left: 8px;
  }

  .preview-arrow--next {
    right: 8px;
  }
}
</style>

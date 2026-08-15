/**
 * 视口入场动画指令
 *
 * 用法：
 *   <div v-reveal>              仅淡入（带默认 120ms 延迟）
 *   <div v-reveal="120">        淡入 + 120ms 延迟（用于列表交错入场）
 *   <div v-reveal data-reveal="up">  淡入并从上方位移（up|down|left|right|zoom）
 *
 * 元素需要较大面积进入视口（30%）才触发，避免还没滚动到位就开始播放动画。
 * 进入视口后添加 .reveal-visible，配合页面内 .reveal / .reveal-init 样式实现动画。
 */
import type { Directive, DirectiveBinding } from 'vue';

/** 默认延迟（ms），让动画在元素进入视口后稍作停顿再播放 */
const DEFAULT_DELAY = 120;

const observers = new Map<HTMLElement, IntersectionObserver>();

const vReveal: Directive<HTMLElement, number | string | undefined> = {
  mounted(el, binding: DirectiveBinding) {
    el.classList.add('reveal', 'reveal-init');

    if (binding.value !== undefined && binding.value !== null) {
      el.style.transitionDelay = `${binding.value}ms`;
    } else {
      el.style.transitionDelay = `${DEFAULT_DELAY}ms`;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            el.classList.remove('reveal-init');
            el.classList.add('reveal-visible');
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.3, rootMargin: '0px 0px -72px 0px' }
    );

    observer.observe(el);
    observers.set(el, observer);
  },
  unmounted(el) {
    const observer = observers.get(el);
    if (observer) {
      observer.disconnect();
      observers.delete(el);
    }
  }
};

export { vReveal };
export default vReveal;

/**
 * 视口入场动画指令
 *
 * 用法：
 *   <div v-reveal>              仅淡入
 *   <div v-reveal="120">        淡入 + 120ms 延迟（用于列表交错入场）
 *   <div v-reveal data-reveal="up">  淡入并从上方位移（up|down|left|right|zoom）
 *
 * 元素进入视口后添加 .reveal-visible，配合页面内 .reveal / .reveal-init 样式实现动画。
 */
import type { Directive, DirectiveBinding } from 'vue';

const observers = new Map<HTMLElement, IntersectionObserver>();

const vReveal: Directive<HTMLElement, number | string | undefined> = {
  mounted(el, binding: DirectiveBinding) {
    el.classList.add('reveal', 'reveal-init');

    if (binding.value !== undefined && binding.value !== null) {
      el.style.transitionDelay = `${binding.value}ms`;
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
      { threshold: 0.12, rootMargin: '0px 0px -36px 0px' }
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

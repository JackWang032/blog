import { useEffect, useState, useRef } from 'react';

interface ScrollAnimationOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * 滚动触发动画 Hook
 * 当元素进入视口时触发动画
 */
export function useScrollAnimation<T extends HTMLElement>(
  options: ScrollAnimationOptions = {}
) {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce) {
            setHasAnimated(true);
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );

    // 如果已经动画过且只触发一次，则不再观察
    if (hasAnimated && triggerOnce) {
      return;
    }

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce, hasAnimated]);

  return { ref, isInView, hasAnimated };
}

/**
 * 多元素滚动动画 Hook
 * 为多个元素提供交错动画效果
 */
export function useStaggeredScrollAnimation<T extends HTMLElement>(
  itemCount: number,
  options: ScrollAnimationOptions & { staggerDelay?: number } = {}
) {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true, staggerDelay = 0.1 } = options;
  const containerRef = useRef<T>(null);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // 交错显示元素
          for (let i = 0; i < itemCount; i++) {
            setTimeout(() => {
              setVisibleItems((prev) => new Set(prev).add(i));
            }, i * staggerDelay * 1000);
          }
          
          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          setVisibleItems(new Set());
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [itemCount, threshold, rootMargin, triggerOnce, staggerDelay]);

  return { containerRef, visibleItems, isItemVisible: (index: number) => visibleItems.has(index) };
}

/**
 * 滚动进度动画 Hook
 * 根据滚动进度返回动画值
 */
export function useScrollProgressAnimation<T extends HTMLElement>(
  options: {
    startOffset?: number;
    endOffset?: number;
    defaultValue?: number;
  } = {}
) {
  const { startOffset = 0, endOffset = 1, defaultValue = 0 } = options;
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(defaultValue);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = element.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          
          // 计算元素在视口中的进度
          const elementTop = rect.top;
          const elementHeight = rect.height;
          
          // 0: 元素刚进入视口底部
          // 1: 元素刚离开视口顶部
          const totalDistance = windowHeight + elementHeight;
          const currentProgress = 1 - (elementTop + elementHeight) / totalDistance;
          
          // 映射到指定的范围
          const mappedProgress = Math.max(
            0,
            Math.min(1, (currentProgress - startOffset) / (endOffset - startOffset))
          );
          
          setProgress(mappedProgress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 初始计算

    return () => window.removeEventListener('scroll', handleScroll);
  }, [startOffset, endOffset]);

  return { ref, progress };
}

/**
 * 视差变换 Hook
 * 根据滚动位置计算元素的变换属性
 */
export function useParallaxTransform(
  options: {
    speed?: number;
    direction?: 'vertical' | 'horizontal';
    scale?: boolean;
    rotate?: boolean;
    opacity?: boolean;
  } = {}
) {
  const {
    speed = 0.5,
    direction = 'vertical',
    scale = false,
    rotate = false,
    opacity = false,
  } = options;

  const scrollY = useRef(0);
  const [transform, setTransform] = useState({
    translateX: 0,
    translateY: 0,
    scale: 1,
    rotate: 0,
    opacity: 1,
  });

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          scrollY.current = window.scrollY;
          
          const offset = scrollY.current * speed;
          
          setTransform({
            translateX: direction === 'horizontal' ? offset : 0,
            translateY: direction === 'vertical' ? offset : 0,
            scale: scale ? 1 + Math.abs(offset) * 0.0005 : 1,
            rotate: rotate ? offset * 0.02 : 0,
            opacity: opacity ? Math.max(0, 1 - Math.abs(offset) * 0.001) : 1,
          });
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, direction, scale, rotate, opacity]);

  return transform;
}

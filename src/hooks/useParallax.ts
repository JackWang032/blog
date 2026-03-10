import { useEffect, useState } from 'react';

/**
 * 视差滚动 Hook
 * 监听滚动事件并计算视差偏移
 */
export function useParallax(speed = 0.5, enabled = true) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setOffset(window.scrollY * speed);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, enabled]);

  return offset;
}

/**
 * 多层视差 Hook
 * 返回不同速度的偏移值
 */
export function useMultiLayerParallax(layers: number[] = [0.1, 0.3, 0.5]) {
  const [offsets, setOffsets] = useState(layers.map(() => 0));

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setOffsets(layers.map(speed => scrollY * speed));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [layers]);

  return offsets;
}

/**
 * 元素视差 Hook
 * 计算元素相对于视口的视差偏移
 */
export function useElementParallax(ref: React.RefObject<HTMLElement>, speed = 0.5) {
  const [offset, setOffset] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = element.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          
          // 检查元素是否在视口中
          const isInView = rect.top < windowHeight && rect.bottom > 0;
          setInView(isInView);

          if (isInView) {
            // 计算元素中心相对于视口中心的偏移
            const elementCenter = rect.top + rect.height / 2;
            const viewportCenter = windowHeight / 2;
            const parallaxOffset = (viewportCenter - elementCenter) * speed;
            setOffset(parallaxOffset);
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 初始计算
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ref, speed]);

  return { offset, inView };
}

/**
 * 滚动进度 Hook
 * 返回当前滚动进度 (0-1)
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const scrollProgress = docHeight > 0 ? scrollTop / docHeight : 0;
          setProgress(Math.min(1, Math.max(0, scrollProgress)));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}

/**
 * 滚动方向 Hook
 * 返回滚动方向 ('up' | 'down' | null)
 */
export function useScrollDirection() {
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          if (currentScrollY > lastScrollY) {
            setDirection('down');
          } else if (currentScrollY < lastScrollY) {
            setDirection('up');
          }
          
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return direction;
}

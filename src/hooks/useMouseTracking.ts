import { useEffect, useState, useCallback } from 'react';

interface MousePosition {
  x: number;
  y: number;
  normalizedX: number; // -1 到 1
  normalizedY: number; // -1 到 1
}

interface ElementMousePosition {
  x: number;
  y: number;
  relativeX: number; // 相对于元素的 x (0-1)
  relativeY: number; // 相对于元素的 y (0-1)
}

/**
 * 全局鼠标跟踪 Hook
 * 跟踪鼠标在窗口中的位置
 */
export function useMouseTracking(enabled = true) {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });

  useEffect(() => {
    if (!enabled) return;

    let ticking = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const x = e.clientX;
          const y = e.clientY;
          const normalizedX = (x / window.innerWidth) * 2 - 1;
          const normalizedY = (y / window.innerHeight) * 2 - 1;

          setMousePosition({
            x,
            y,
            normalizedX,
            normalizedY,
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enabled]);

  return mousePosition;
}

/**
 * 元素鼠标跟踪 Hook
 * 跟踪鼠标相对于特定元素的位置
 */
export function useElementMouseTracking<T extends HTMLElement>(
  elementRef: React.RefObject<T>,
  enabled = true
) {
  const [position, setPosition] = useState<ElementMousePosition>({
    x: 0,
    y: 0,
    relativeX: 0.5,
    relativeY: 0.5,
  });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const relativeX = Math.max(0, Math.min(1, x / rect.width));
      const relativeY = Math.max(0, Math.min(1, y / rect.height));

      setPosition({
        x,
        y,
        relativeX,
        relativeY,
      });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    element.addEventListener('mousemove', handleMouseMove, { passive: true });
    element.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    element.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [elementRef, enabled]);

  return { ...position, isHovering };
}

/**
 * 鼠标跟踪光效 Hook
 * 用于创建鼠标跟踪的光照效果
 */
export function useGlowEffect<T extends HTMLElement>(
  elementRef: React.RefObject<T>,
  options: {
    enabled?: boolean;
    glowSize?: number;
    glowColor?: string;
  } = {}
) {
  const { enabled = true, glowSize = 200, glowColor = 'rgba(0, 255, 255, 0.15)' } = options;

  const updateGlow = useCallback(
    (x: number, y: number) => {
      const element = elementRef.current;
      if (!element || !enabled) return;

      element.style.setProperty('--glow-x', `${x}px`);
      element.style.setProperty('--glow-y', `${y}px`);
      element.style.setProperty('--glow-size', `${glowSize}px`);
      element.style.setProperty('--glow-color', glowColor);
    },
    [elementRef, enabled, glowSize, glowColor]
  );

  const { x, y, isHovering } = useElementMouseTracking(elementRef, enabled);

  useEffect(() => {
    if (isHovering) {
      updateGlow(x, y);
    }
  }, [x, y, isHovering, updateGlow]);

  return { x, y, isHovering, updateGlow };
}

/**
 * 多元素鼠标跟踪 Hook
 * 用于在多个元素上创建协调的鼠标跟踪效果
 */
export function useMultiElementTracking<T extends HTMLElement>(
  elementsRef: React.RefObject<T>[],
  enabled = true
) {
  const mousePosition = useMouseTracking(enabled);

  const getElementPositions = useCallback(() => {
    return elementsRef.map((ref) => {
      const element = ref.current;
      if (!element) return null;

      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // 计算鼠标相对于元素中心的角度和距离
      const deltaX = mousePosition.x - centerX;
      const deltaY = mousePosition.y - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const angle = Math.atan2(deltaY, deltaX);

      return {
        element,
        rect,
        distance,
        angle,
        deltaX,
        deltaY,
      };
    }).filter(Boolean);
  }, [elementsRef, mousePosition]);

  return {
    mousePosition,
    getElementPositions,
  };
}

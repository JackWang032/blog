import { useEffect, useRef, useCallback } from "react";

const COLORS = [
  "#FF6B6B", // 红
  "#4ECDC4", // 青
  "#FFE66D", // 黄
  "#95E1D3", // 绿
  "#F38181", // 粉
  "#AA96DA", // 紫
  "#FCBAD3", // 粉红
  "#A8E6CF", // 薄荷
];

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

export function MouseTrail() {
  const particlesRef = useRef<Particle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const animationRef = useRef<number>(0);
  const idRef = useRef(0);

  const createParticle = useCallback((x: number, y: number): Particle => {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2 + 1;
    return {
      id: idRef.current++,
      x,
      y,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 6 + 4,
      speedX: Math.cos(angle) * speed,
      speedY: Math.sin(angle) * speed,
      opacity: 1,
    };
  }, []);

  const updateParticles = useCallback(() => {
    particlesRef.current = particlesRef.current
      .map((p) => ({
        ...p,
        x: p.x + p.speedX,
        y: p.y + p.speedY,
        opacity: p.opacity - 0.02,
        size: p.size * 0.98,
      }))
      .filter((p) => p.opacity > 0);

    // 在鼠标位置生成新粒子
    if (mouseRef.current.x > 0) {
      for (let i = 0; i < 2; i++) {
        particlesRef.current.push(
          createParticle(mouseRef.current.x, mouseRef.current.y)
        );
      }
    }

    animationRef.current = requestAnimationFrame(updateParticles);
  }, [createParticle]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -100, y: -100 };
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    animationRef.current = requestAnimationFrame(updateParticles);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationRef.current);
    };
  }, [updateParticles]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
    >
      {particlesRef.current.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: particle.x - particle.size / 2,
            top: particle.y - particle.size / 2,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
        />
      ))}
    </div>
  );
}

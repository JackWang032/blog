import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

// 粒子数据类型
interface Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
    hue: number;
}

// 简化的粒子动画 - 高性能版本
function ParticleField() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const frameCountRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // 设置 canvas 尺寸
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        // 极少的粒子数量
        const particleCount = 15;
        particlesRef.current = Array.from({ length: particleCount }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 0.1,
            speedY: (Math.random() - 0.5) * 0.1,
            opacity: Math.random() * 0.25 + 0.15,
            hue: Math.random() * 60 + 160,
        }));

        // 直接更新鼠标位置
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });

        let rafId: number;
        const animate = () => {
            frameCountRef.current++;
            
            // 每2帧渲染一次，减少CPU负载（30fps效果）
            if (frameCountRef.current % 2 !== 0) {
                rafId = requestAnimationFrame(animate);
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const mouseX = mouseRef.current.x;
            const mouseY = mouseRef.current.y;
            const particles = particlesRef.current;

            // 批量绘制粒子
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // 基础运动
                p.x += p.speedX;
                p.y += p.speedY;

                // 边界循环
                if (p.x < -30) p.x = canvas.width + 30;
                if (p.x > canvas.width + 30) p.x = -30;
                if (p.y < -30) p.y = canvas.height + 30;
                if (p.y > canvas.height + 30) p.y = -30;

                // 简化的鼠标交互 - 只在鼠标靠近时轻微位移
                const dx = mouseX - p.x;
                const dy = mouseY - p.y;
                const distSq = dx * dx + dy * dy;
                
                if (distSq < 10000) { // 100px 范围
                    const dist = Math.sqrt(distSq);
                    const push = (100 - dist) * 0.15;
                    p.x -= (dx / dist) * push;
                    p.y -= (dy / dist) * push;
                }

                // 绘制粒子
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, ${p.opacity})`;
                ctx.fill();
            }

            rafId = requestAnimationFrame(animate);
        };
        
        rafId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ 
                opacity: 0.5,
                willChange: 'transform', // 提示浏览器使用硬件加速
            }}
        />
    );
}

// 视差层
function ParallaxLayer({
    children,
    speed = 0.5,
    className = "",
}: {
    children: React.ReactNode;
    speed?: number;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);

    return (
        <motion.div
            ref={ref}
            style={{ y }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// 主背景组件
export function ParallaxBackground() {
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 500], [1, 0]);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {/* 渐变背景 */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted" />
            
            {/* 网格背景 */}
            <div 
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `
                        linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                        linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
                    `,
                    backgroundSize: "60px 60px",
                }}
            />

            {/* 浮动光晕 */}
            <motion.div
                style={{ opacity }}
                className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full"
            >
                <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent blur-3xl animate-pulse-slow" />
            </motion.div>
            
            <motion.div
                style={{ opacity }}
                className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full"
            >
                <div className="absolute inset-0 bg-gradient-radial from-secondary/15 via-transparent to-transparent blur-3xl animate-pulse-slow animation-delay-2000" />
            </motion.div>
            
            <motion.div
                style={{ opacity }}
                className="absolute bottom-0 left-1/2 w-[700px] h-[400px] rounded-full"
            >
                <div className="absolute inset-0 bg-gradient-radial from-accent/10 via-transparent to-transparent blur-3xl animate-pulse-slow animation-delay-4000" />
            </motion.div>

            {/* 粒子效果 */}
            <ParticleField />
        </div>
    );
}

export { ParallaxLayer };

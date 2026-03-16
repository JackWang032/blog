import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

// 粒子数据类型
interface Particle {
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
    hue: number;
}

// 粒子动画背景 - 优化版
function ParticleField() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const animationRef = useRef<number>();

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

        // 减少粒子数量，提高响应速度
        const particleCount = 25;
        particlesRef.current = Array.from({ length: particleCount }, () => {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            return {
                x,
                y,
                baseX: x,
                baseY: y,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.15,
                speedY: (Math.random() - 0.5) * 0.15,
                opacity: Math.random() * 0.3 + 0.15,
                hue: Math.random() * 60 + 160,
            };
        });

        // 直接同步更新鼠标位置 - 无延迟
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
        };

        const handleMouseLeave = () => {
            mouseRef.current.x = -1000;
            mouseRef.current.y = -1000;
        };

        // 使用 { passive: true } 提高滚动性能
        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        document.addEventListener("mouseleave", handleMouseLeave);

        // 动画循环
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const mouseX = mouseRef.current.x;
            const mouseY = mouseRef.current.y;
            const particles = particlesRef.current;

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // 基础漂移
                p.baseX += p.speedX;
                p.baseY += p.speedY;

                // 边界循环
                if (p.baseX < -50) p.baseX = canvas.width + 50;
                if (p.baseX > canvas.width + 50) p.baseX = -50;
                if (p.baseY < -50) p.baseY = canvas.height + 50;
                if (p.baseY > canvas.height + 50) p.baseY = -50;

                // 实时计算与鼠标的距离
                const dx = mouseX - p.baseX;
                const dy = mouseY - p.baseY;
                const distSq = dx * dx + dy * dy;
                const interactRadius = 120;
                const interactRadiusSq = interactRadius * interactRadius;

                // 鼠标交互 - 直接实时响应
                if (distSq < interactRadiusSq && distSq > 0) {
                    const dist = Math.sqrt(distSq);
                    const force = (interactRadius - dist) / interactRadius;
                    // 直接位移，无缓动
                    const pushX = -(dx / dist) * force * 25;
                    const pushY = -(dy / dist) * force * 25;
                    p.x = p.baseX + pushX;
                    p.y = p.baseY + pushY;
                } else {
                    // 无鼠标影响时直接回到原位
                    p.x = p.baseX;
                    p.y = p.baseY;
                }

                // 绘制粒子
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, ${p.opacity})`;
                ctx.fill();

                // 简化的连接线 - 只连接最近的3个
                let connections = 0;
                for (let j = i + 1; j < particles.length && connections < 3; j++) {
                    const other = particles[j];
                    const cdx = other.x - p.x;
                    const cdy = other.y - p.y;
                    const cdistSq = cdx * cdx + cdy * cdy;
                    if (cdistSq < 6400) { // 80px
                        const cdist = Math.sqrt(cdistSq);
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.strokeStyle = `hsla(${p.hue}, 100%, 60%, ${0.06 * (1 - cdist / 80)})`;
                        ctx.stroke();
                        connections++;
                    }
                }
            }

            animationRef.current = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseleave", handleMouseLeave);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ opacity: 0.5 }}
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

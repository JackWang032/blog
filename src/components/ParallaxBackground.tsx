import { useEffect, useRef } from "react";

interface Particle {
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    vx: number;
    vy: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
    hue: number;
    layer: "far" | "mid" | "near";
}

const LAYER_CONFIG = {
    far: { count: 20, speed: 0.05, size: 1, opacity: 0.2 },
    mid: { count: 30, speed: 0.1, size: 1.5, opacity: 0.3 },
    near: { count: 20, speed: 0.2, size: 2, opacity: 0.4 },
};

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

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        // 创建三层粒子
        const particles: Particle[] = [];

        Object.entries(LAYER_CONFIG).forEach(([layerName, config]) => {
            for (let i = 0; i < config.count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    baseX: Math.random() * canvas.width,
                    baseY: Math.random() * canvas.height,
                    vx: 0,
                    vy: 0,
                    size: config.size + Math.random() * 0.5,
                    speedX: (Math.random() - 0.5) * config.speed,
                    speedY: (Math.random() - 0.5) * config.speed,
                    opacity: config.opacity + Math.random() * 0.1,
                    hue: 185 + Math.random() * 25,
                    layer: layerName as "far" | "mid" | "near",
                });
            }
        });

        particlesRef.current = particles;

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });

        let rafId: number;
        const animate = () => {
            frameCountRef.current++;

            if (frameCountRef.current % 2 !== 0) {
                rafId = requestAnimationFrame(animate);
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const mouseX = mouseRef.current.x;
            const mouseY = mouseRef.current.y;
            const particles = particlesRef.current;

            // 绘制粒子
            particles.forEach((p) => {
                p.x += p.speedX;
                p.y += p.speedY;

                if (p.x < -30) p.x = canvas.width + 30;
                if (p.x > canvas.width + 30) p.x = -30;
                if (p.y < -30) p.y = canvas.height + 30;
                if (p.y > canvas.height + 30) p.y = -30;

                // 鼠标交互 - 近景和中断粒子受影响
                if (p.layer !== "far") {
                    const dx = mouseX - p.x;
                    const dy = mouseY - p.y;
                    const distSq = dx * dx + dy * dy;
                    const maxDist = p.layer === "near" ? 150 : 100;

                    if (distSq < maxDist * maxDist) {
                        const dist = Math.sqrt(distSq);
                        const push = (maxDist - dist) * 0.3;
                        p.x -= (dx / dist) * push;
                        p.y -= (dy / dist) * push;
                    }
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, ${p.opacity})`;
                ctx.fill();
            });

            // 绘制连线
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const p1 = particles[i];
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < 150 * 150) {
                        const dist = Math.sqrt(distSq);
                        const opacity = (1 - dist / 150) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `hsla(200, 100%, 60%, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
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
                opacity: 0.6,
                willChange: "transform",
            }}
        />
    );
}

function MouseGlow() {
    const glowRef = useRef<HTMLDivElement>(null);
    const posRef = useRef({ x: 0, y: 0 });
    const targetRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const glow = glowRef.current;
        if (!glow) return;

        const handleMouseMove = (e: MouseEvent) => {
            targetRef.current.x = e.clientX;
            targetRef.current.y = e.clientY;
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });

        let rafId: number;
        const animate = () => {
            const lerp = 0.15;
            posRef.current.x += (targetRef.current.x - posRef.current.x) * lerp;
            posRef.current.y += (targetRef.current.y - posRef.current.y) * lerp;

            glow.style.transform = `translate3d(${posRef.current.x - 150}px, ${posRef.current.y - 150}px, 0)`;

            rafId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <div
            ref={glowRef}
            className="fixed top-0 left-0 w-[300px] h-[300px] rounded-full pointer-events-none z-0"
            style={{
                background:
                    "radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, hsl(var(--secondary) / 0.08) 40%, transparent 70%)",
                filter: "blur(40px)",
                willChange: "transform",
            }}
        />
    );
}

export function ParallaxBackground() {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted" />

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

            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full">
                <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent blur-3xl animate-pulse-slow" />
            </div>

            <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full">
                <div className="absolute inset-0 bg-gradient-radial from-secondary/15 via-transparent to-transparent blur-3xl animate-pulse-slow animation-delay-2000" />
            </div>

            <ParticleField />
            <MouseGlow />
        </div>
    );
}

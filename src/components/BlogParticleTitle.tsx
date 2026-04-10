import { useEffect, useRef, useState } from "react";

interface TitleParticle {
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    originX: number;
    originY: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    alpha: number;
    delay: number;
}

interface BlogParticleTitleProps {
    text: string;
    className?: string;
}

export function BlogParticleTitle({ text, className = "" }: BlogParticleTitleProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<TitleParticle[]>([]);
    const animationRef = useRef<number>();
    const mouseRef = useRef({ x: -1000, y: -1000, active: false });
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const startTimeRef = useRef<number>(0);

    const initParticles = () => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rect = container.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        canvas.width = width;
        canvas.height = height;
        setDimensions({ width, height });

        // 根据容器宽度动态调整字体大小
        const fontSize = Math.min(width * 0.08, 48);
        const font = `bold ${fontSize}px Inter, system-ui, sans-serif`;

        ctx.font = font;
        ctx.fillStyle = "#00d9ff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, width / 2, height / 2);

        const imageData = ctx.getImageData(0, 0, width, height);
        ctx.clearRect(0, 0, width, height);

        const particles: TitleParticle[] = [];
        const gap = 2; // 更小的间距以获得更细腻的效果

        for (let y = 0; y < height; y += gap) {
            for (let x = 0; x < width; x += gap) {
                const index = (y * width + x) * 4;
                if (imageData.data[index + 3] > 128) {
                    particles.push({
                        x: Math.random() * width,
                        y: Math.random() * height,
                        targetX: x,
                        targetY: y,
                        originX: x,
                        originY: y,
                        vx: 0,
                        vy: 0,
                        size: 1 + Math.random() * 1,
                        color: `hsl(${185 + Math.random() * 25}, 100%, ${55 + Math.random() * 15}%)`,
                        alpha: 0,
                        delay: Math.random() * 300,
                    });
                }
            }
        }

        particlesRef.current = particles;
        startTimeRef.current = performance.now();
    };

    const animate = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const { width, height } = dimensions;
        ctx.clearRect(0, 0, width, height);

        const mouse = mouseRef.current;
        const particles = particlesRef.current;
        const elapsed = performance.now() - startTimeRef.current;

        particles.forEach((particle) => {
            // 鼠标交互
            if (mouse.active) {
                const dx = mouse.x - particle.x;
                const dy = mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 100;

                if (distance < maxDistance) {
                    const force = (maxDistance - distance) / maxDistance;
                    const angle = Math.atan2(dy, dx);
                    particle.vx -= Math.cos(angle) * force * 6;
                    particle.vy -= Math.sin(angle) * force * 6;
                }
            }

            particle.x += particle.vx;
            particle.y += particle.vy;

            particle.vx *= 0.92;
            particle.vy *= 0.92;

            const dx = particle.targetX - particle.x;
            const dy = particle.targetY - particle.y;
            particle.vx += dx * 0.08;
            particle.vy += dy * 0.08;

            // 渐入效果
            const progress = Math.min(1, (elapsed - particle.delay) / 1500);
            particle.alpha = Math.min(1, progress);

            if (particle.alpha > 0) {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color.replace(")", `, ${particle.alpha})`).replace("hsl", "hsla");
                ctx.fill();

                // 发光效果
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size * 1.5, 0, Math.PI * 2);
                const gradient = ctx.createRadialGradient(
                    particle.x,
                    particle.y,
                    0,
                    particle.x,
                    particle.y,
                    particle.size * 1.5
                );
                gradient.addColorStop(
                    0,
                    particle.color.replace(")", `, ${particle.alpha * 0.2})`).replace("hsl", "hsla")
                );
                gradient.addColorStop(1, "transparent");
                ctx.fillStyle = gradient;
                ctx.fill();
            }
        });

        animationRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        // 等待容器渲染完成
        const timer = setTimeout(() => {
            initParticles();
        }, 100);

        const handleResize = () => {
            initParticles();
        };

        const handleMouseMove = (e: MouseEvent) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            mouseRef.current.x = e.clientX - rect.left;
            mouseRef.current.y = e.clientY - rect.top;
            mouseRef.current.active = true;
        };

        const handleMouseLeave = () => {
            mouseRef.current.active = false;
        };

        window.addEventListener("resize", handleResize);
        const container = containerRef.current;
        if (container) {
            container.addEventListener("mousemove", handleMouseMove);
            container.addEventListener("mouseleave", handleMouseLeave);
        }

        return () => {
            clearTimeout(timer);
            window.removeEventListener("resize", handleResize);
            if (container) {
                container.removeEventListener("mousemove", handleMouseMove);
                container.removeEventListener("mouseleave", handleMouseLeave);
            }
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [text]);

    useEffect(() => {
        if (dimensions.width > 0) {
            animationRef.current = requestAnimationFrame(animate);
        }
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [dimensions]);

    return (
        <div ref={containerRef} className={`blog-particle-title ${className}`}>
            <canvas
                ref={canvasRef}
                style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                }}
            />
        </div>
    );
}

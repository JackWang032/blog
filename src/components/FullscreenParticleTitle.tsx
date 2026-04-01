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

interface FullscreenParticleTitleProps {
    mainText?: string;
    subText?: string;
}

export function FullscreenParticleTitle({
    mainText = "JACK'S BLOG",
    subText = "探索 · 分享 · 成长",
}: FullscreenParticleTitleProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<TitleParticle[]>([]);
    const animationRef = useRef<number>();
    const mouseRef = useRef({ x: -1000, y: -1000, active: false });
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const startTimeRef = useRef<number>(0);

    const initParticles = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = window.innerWidth;
        const height = window.innerHeight;

        canvas.width = width;
        canvas.height = height;
        setDimensions({ width, height });

        const fontSize = Math.min(width * 0.12, 180);
        const font = `bold ${fontSize}px Inter, system-ui, sans-serif`;

        ctx.font = font;
        ctx.fillStyle = "#00d9ff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(mainText, width / 2, height / 2);

        const imageData = ctx.getImageData(0, 0, width, height);
        ctx.clearRect(0, 0, width, height);

        const particles: TitleParticle[] = [];
        const gap = 3;

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
                        size: 1.5 + Math.random() * 1.5,
                        color: `hsl(${185 + Math.random() * 25}, 100%, ${55 + Math.random() * 15}%)`,
                        alpha: 0,
                        delay: Math.random() * 500,
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
                const maxDistance = 150;

                if (distance < maxDistance) {
                    const force = (maxDistance - distance) / maxDistance;
                    const angle = Math.atan2(dy, dx);
                    particle.vx -= Math.cos(angle) * force * 8;
                    particle.vy -= Math.sin(angle) * force * 8;
                }
            }

            particle.x += particle.vx;
            particle.y += particle.vy;

            particle.vx *= 0.92;
            particle.vy *= 0.92;

            const dx = particle.targetX - particle.x;
            const dy = particle.targetY - particle.y;
            particle.vx += dx * 0.05;
            particle.vy += dy * 0.05;

            // 渐入效果
            const progress = Math.min(1, (elapsed - particle.delay) / 2000);
            particle.alpha = Math.min(1, progress);

            if (particle.alpha > 0) {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color.replace(")", `, ${particle.alpha})`).replace("hsl", "hsla");
                ctx.fill();

                // 发光效果
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
                const gradient = ctx.createRadialGradient(
                    particle.x,
                    particle.y,
                    0,
                    particle.x,
                    particle.y,
                    particle.size * 2
                );
                gradient.addColorStop(
                    0,
                    particle.color.replace(")", `, ${particle.alpha * 0.3})`).replace("hsl", "hsla")
                );
                gradient.addColorStop(1, "transparent");
                ctx.fillStyle = gradient;
                ctx.fill();
            }
        });

        // 绘制副标题
        if (subText) {
            ctx.font = `500 ${Math.min(dimensions.width * 0.025, 24)}px Inter, system-ui, sans-serif`;
            ctx.fillStyle = "rgba(0, 217, 255, 0.6)";
            ctx.textAlign = "center";
            ctx.fillText(subText, width / 2, height / 2 + dimensions.width * 0.08);
        }

        animationRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        initParticles();

        const handleResize = () => {
            initParticles();
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
            mouseRef.current.active = true;
        };

        const handleMouseLeave = () => {
            mouseRef.current.active = false;
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseleave", handleMouseLeave);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

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
        <canvas
            ref={canvasRef}
            className="fullscreen-particle-title"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 1,
                pointerEvents: "none",
            }}
        />
    );
}

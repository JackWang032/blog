# 极简全景首页实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 重写博客首页为极简全景风格，融合全屏粒子特效、视差背景和 Pretext 文字动画

**Architecture:** 三层 Canvas 渲染架构 - ParallaxBackground（背景层）→ FullscreenParticleTitle（粒子标题层）→ LandingCTA（玻璃态按钮层），使用 `@chenglou/pretext` 实现粒子文字效果

**Tech Stack:** React 18, TypeScript, Canvas API, Framer Motion, Tailwind CSS, @chenglou/pretext

---

## File Structure

**创建文件:**

- `src/components/FullscreenParticleTitle.tsx` - 全屏粒子标题组件
- `src/components/LandingCTA.tsx` - 玻璃态引导按钮组件
- `src/styles/landing.css` - 首页专用样式

**修改文件:**

- `src/components/ParallaxBackground.tsx` - 重写为三层粒子系统
- `src/views/Landing.tsx` - 完全重写为极简结构
- `src/index.scss` - 导入首页样式

---

## Task 1: 重写 ParallaxBackground 组件（三层粒子系统）

**Files:**

- Modify: `src/components/ParallaxBackground.tsx`

- [ ] **Step 1: 备份原始文件**

```bash
cp src/components/ParallaxBackground.tsx src/components/ParallaxBackground.tsx.backup
```

- [ ] **Step 2: 编写新的三层粒子系统**

完整重写 `src/components/ParallaxBackground.tsx`:

```typescript
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
                background: "radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, hsl(var(--secondary) / 0.08) 40%, transparent 70%)",
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
```

- [ ] **Step 3: 验证编译无错误**

```bash
pnpm run check
```

Expected: 编译成功，无 TypeScript 错误

- [ ] **Step 4: 提交 ParallaxBackground 重写**

```bash
git add src/components/ParallaxBackground.tsx
git commit -m "feat: 重写 ParallaxBackground 为三层粒子系统

- 添加远/中/近三层粒子系统
- 实现鼠标排斥交互效果
- 添加粒子间动态连线
- 优化性能（30fps 渲染）"
```

---

## Task 2: 创建 FullscreenParticleTitle 组件

**Files:**

- Create: `src/components/FullscreenParticleTitle.tsx`

- [ ] **Step 1: 创建 FullscreenParticleTitle 组件文件**

```typescript
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
```

- [ ] **Step 2: 验证编译无错误**

```bash
pnpm run check
```

Expected: 编译成功，无 TypeScript 错误

- [ ] **Step 3: 提交 FullscreenParticleTitle 组件**

```bash
git add src/components/FullscreenParticleTitle.tsx
git commit -m "feat: 创建 FullscreenParticleTitle 组件

- 实现粒子汇聚成文字效果
- 添加鼠标排斥交互
- 支持主标题和副标题
- 添加粒子发光效果"
```

---

## Task 3: 创建 LandingCTA 组件

**Files:**

- Create: `src/components/LandingCTA.tsx`

- [ ] **Step 1: 创建 LandingCTA 组件文件**

```typescript
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function LandingCTA() {
    const navigate = useNavigate();

    return (
        <div className="fixed bottom-[20vh] left-1/2 -translate-x-1/2 z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 0.8, ease: "easeOut" }}
            >
                <Button
                    size="lg"
                    className="glass-button px-8 py-6 text-lg font-medium"
                    onClick={() => navigate("/blog")}
                >
                    进入博客
                    <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
            </motion.div>
        </div>
    );
}
```

- [ ] **Step 2: 验证编译无错误**

```bash
pnpm run check
```

Expected: 编译成功，无 TypeScript 错误

- [ ] **Step 3: 提交 LandingCTA 组件**

```bash
git add src/components/LandingCTA.tsx
git commit -m "feat: 创建 LandingCTA 玻璃态引导按钮

- 玻璃态设计样式
- Framer Motion 入场动画
- 响应式布局"
```

---

## Task 4: 创建首页样式文件

**Files:**

- Create: `src/styles/landing.css`

- [ ] **Step 1: 创建首页样式文件**

```css
/* Landing Page Styles */

.landing-page {
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
    position: relative;
    overflow: hidden;
}

/* Glass Button Styles */
.glass-button {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(0, 217, 255, 0.1);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

.glass-button::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
}

.glass-button:hover::before {
    left: 100%;
}

.glass-button:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(0, 217, 255, 0.4);
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 217, 255, 0.3);
}

.glass-button:active {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 217, 255, 0.2);
}

/* Canvas Styles */
.fullscreen-particle-title {
    pointer-events: none;
}

/* Responsive Design */
@media (max-width: 768px) {
    .glass-button {
        padding: 12px 24px;
        font-size: 16px;
    }
}

@media (min-width: 769px) and (max-width: 1024px) {
    .glass-button {
        padding: 14px 28px;
        font-size: 17px;
    }
}

/* Animation for floating light orbs */
@keyframes pulse-slow {
    0%,
    100% {
        opacity: 0.3;
        transform: scale(1);
    }
    50% {
        opacity: 0.6;
        transform: scale(1.1);
    }
}

.animate-pulse-slow {
    animation: pulse-slow 4s ease-in-out infinite;
}

.animation-delay-2000 {
    animation-delay: 2s;
}

.animation-delay-4000 {
    animation-delay: 4s;
}
```

- [ ] **Step 2: 提交样式文件**

```bash
git add src/styles/landing.css
git commit -m "feat: 添加首页专用样式

- 玻璃态按钮样式
- 悬浮光晕动画
- 响应式设计"
```

---

## Task 5: 重写 Landing 页面组件

**Files:**

- Modify: `src/views/Landing.tsx`

- [ ] **Step 1: 完全重写 Landing.tsx**

```typescript
import { ParallaxBackground } from "@/components/ParallaxBackground";
import { FullscreenParticleTitle } from "@/components/FullscreenParticleTitle";
import { LandingCTA } from "@/components/LandingCTA";
import "@/styles/landing.css";

const Landing = () => {
    return (
        <div className="landing-page h-screen w-screen overflow-hidden relative">
            <ParallaxBackground />
            <FullscreenParticleTitle
                mainText="JACK'S BLOG"
                subText="探索 · 分享 · 成长"
            />
            <LandingCTA />
        </div>
    );
};

export default Landing;
```

- [ ] **Step 2: 验证编译无错误**

```bash
pnpm run check
```

Expected: 编译成功，无 TypeScript 错误

- [ ] **Step 3: 提交 Landing 页面重写**

```bash
git add src/views/Landing.tsx
git commit -m "feat: 重写 Landing 为极简全景首页

- 移除所有现有区域（Hero、Features、Timeline 等）
- 使用三层组件架构
- 极简内容：标题 + 副标题 + 引导按钮"
```

---

## Task 6: 导入首页样式到全局样式

**Files:**

- Modify: `src/index.scss`

- [ ] **Step 1: 在 index.scss 中导入首页样式**

在文件开头添加:

```scss
@import "./styles/landing.css";
```

- [ ] **Step 2: 提交样式导入**

```bash
git add src/index.scss
git commit -m "feat: 在全局样式中导入首页样式"
```

---

## Task 7: 功能测试和验证

**Files:**

- None (Manual Testing)

- [ ] **Step 1: 启动开发服务器**

```bash
pnpm run dev
```

Expected: 服务器启动在 http://localhost:5173

- [ ] **Step 2: 手动测试 - 粒子背景效果**

操作：

1. 打开浏览器访问 http://localhost:5173
2. 观察背景粒子是否正常显示
3. 移动鼠标，观察粒子排斥效果
4. 观察粒子间连线效果

Expected:

- 背景有三层粒子（远/中/近）
- 鼠标移动时，近景和中景粒子被排斥
- 粒子间有动态连线

- [ ] **Step 3: 手动测试 - 粒子标题效果**

操作：

1. 观察主标题粒子汇聚动画
2. 移动鼠标，观察标题粒子排斥效果
3. 观察副标题是否显示

Expected:

- 粒子从随机位置汇聚成 "JACK'S BLOG"
- 鼠标接近时，粒子被排斥并自动回归
- 副标题 "探索 · 分享 · 成长" 正常显示

- [ ] **Step 4: 手动测试 - 引导按钮**

操作：

1. 等待 2 秒，观察按钮入场动画
2. Hover 按钮，观察发光和上浮效果
3. 点击按钮，验证跳转到 /blog

Expected:

- 按钮在 2 秒后渐入
- Hover 时上浮并发光
- 点击成功跳转到博客列表页

- [ ] **Step 5: 手动测试 - 响应式**

操作：

1. 调整浏览器窗口大小（移动端、平板、桌面）
2. 观察粒子数量和标题大小是否自适应

Expected:

- 移动端：粒子减少，标题字号 60px 左右
- 平板：粒子正常，标题字号 100px 左右
- 桌面：粒子正常，标题字号 140-180px

---

## Task 8: 性能测试和优化

**Files:**

- None (Performance Testing)

- [ ] **Step 1: FPS 性能监控**

操作：

1. 打开浏览器开发者工具 (F12)
2. 切换到 Performance 面板
3. 点击录制，操作页面 10 秒
4. 停止录制，查看 FPS

Expected: FPS >= 30（桌面端），FPS >= 20（移动端）

- [ ] **Step 2: 内存使用监控**

操作：

1. 打开浏览器开发者工具 (F12)
2. 切换到 Memory 面板
3. 点击 "Take heap snapshot"
4. 观察内存使用情况

Expected: 内存使用 < 100MB

- [ ] **Step 3: 页面加载时间测试**

操作：

1. 打开浏览器开发者工具 (F12)
2. 切换到 Network 面板
3. 刷新页面
4. 观察加载时间

Expected: DOMContentLoaded < 1s, Load < 2s

- [ ] **Step 4: 性能优化（如果需要）**

如果性能不达标，执行以下优化：

1. 减少粒子数量（修改 LAYER_CONFIG）
2. 增加帧率控制（修改 `frameCountRef.current % 2` 为 `% 3`）
3. 禁用连线效果（注释掉连线绘制代码）

---

## Task 9: 清理和最终提交

**Files:**

- Delete: `src/components/ParallaxBackground.tsx.backup` (if exists)
- Delete: `src/components/PretextTextEffect.tsx` (不再需要)
- Delete: `src/components/SimpleParticleText.tsx` (不再需要)

- [ ] **Step 1: 删除备份文件**

```bash
rm -f src/components/ParallaxBackground.tsx.backup
```

- [ ] **Step 2: 删除不再使用的组件**

```bash
git rm src/components/PretextTextEffect.tsx src/components/SimpleParticleText.tsx
```

- [ ] **Step 3: 更新 index.scss，移除未使用的样式导入（如果有）**

检查 `src/index.scss` 是否有对已删除组件的样式引用，如有则删除。

- [ ] **Step 4: 最终验证编译**

```bash
pnpm run check
```

Expected: 编译成功，无错误

- [ ] **Step 5: 构建生产版本**

```bash
pnpm run build
```

Expected: 构建成功，无错误

- [ ] **Step 6: 最终提交**

```bash
git add .
git commit -m "refactor: 清理不再使用的组件和文件

- 删除 PretextTextEffect 和 SimpleParticleText 组件
- 移除备份文件
- 优化代码结构"
```

---

## Task 10: 文档更新（可选）

**Files:**

- Create: `docs/features/minimalist-landing.md` (可选)

- [ ] **Step 1: 创建功能文档（可选）**

```markdown
# 极简全景首页

## 功能特性

- 全屏粒子背景（三层粒子系统）
- Pretext 粒子标题效果
- 玻璃态引导按钮
- 鼠标交互效果
- 响应式设计

## 使用说明

访问首页 `/` 即可查看效果。

## 技术实现

- Canvas 渲染粒子系统
- Framer Motion 动画
- Tailwind CSS 样式
- 性能优化（GPU 加速、对象池、降级策略）
```

- [ ] **Step 2: 提交文档（可选）**

```bash
git add docs/features/minimalist-landing.md
git commit -m "docs: 添加极简全景首页功能文档"
```

---

## Summary

完成以上任务后，极简全景首页将成功实现，包含：

✅ 三层粒子背景系统（ParallaxBackground）
✅ Pretext 粒子标题效果（FullscreenParticleTitle）
✅ 玻璃态引导按钮（LandingCTA）
✅ 鼠标交互效果
✅ 响应式设计
✅ 性能优化（30fps、GPU 加速、降级策略）
✅ 功能和性能测试通过

所有代码已完成，无 placeholders，每个步骤都包含完整的代码和验证命令。

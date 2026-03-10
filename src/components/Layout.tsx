import Navigation from "./Navigation";
import ThemeToggler from "./ThemeToggler";
import { useMultiLayerParallax } from "@/hooks/useParallax";
import { useMouseTracking } from "@/hooks/useMouseTracking";

interface LayoutProps {
    children: React.ReactNode;
}

// 动态粒子组件
function FloatingParticles({ count = 50 }: { count?: number }) {
    const particles = Array.from({ length: count }, (_, i) => ({
        id: i,
        size: Math.random() * 4 + 1,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 10,
    }));

    return (
        <div className="particles-container">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="particle"
                    style={{
                        width: p.size,
                        height: p.size,
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        animationDuration: `${p.duration}s`,
                        animationDelay: `${p.delay}s`,
                    }}
                />
            ))}
        </div>
    );
}

// 视差背景组件
function ParallaxBackground() {
    const [layer1, layer2, layer3] = useMultiLayerParallax([0.1, 0.2, 0.4]);
    const mousePosition = useMouseTracking();

    return (
        <div className="parallax-container">
            {/* 最远层 - 网格 */}
            <div
                className="parallax-layer layer-grid"
                style={{ transform: `translateY(${layer1}px)` }}
            />

            {/* 中层 - 光点粒子 */}
            <div
                className="parallax-layer"
                style={{ transform: `translateY(${layer2}px)` }}
            >
                <FloatingParticles count={30} />
            </div>

            {/* 近层 - 光晕 */}
            <div
                className="parallax-layer layer-glow"
                style={{
                    transform: `translateY(${layer3}px) translateX(${mousePosition.normalizedX * 20}px)`,
                }}
            >
                <div className="glow-orb glow-1" />
                <div className="glow-orb glow-2" />
                <div className="glow-orb glow-3" />
            </div>

            {/* 鼠标跟随光效 */}
            <div
                className="mouse-glow"
                style={{
                    left: `calc(${mousePosition.x}px)`,
                    top: `calc(${mousePosition.y}px)`,
                }}
            />
        </div>
    );
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
            {/* 视差背景 */}
            <ParallaxBackground />

            {/* 玻璃态导航栏 */}
            <header className="sticky top-0 z-40 glass-nav">
                <div className="container mx-auto px-4 py-4 flex items-center">
                    <div className="flex items-center gap-2 md:absolute left-8">
                        <div className="logo-icon">
                            <span className="logo-text">{"</>"}</span>
                        </div>
                        <div id="sticky-title" className="whitespace-nowrap h-10" />
                    </div>
                    <div className="flex-1 flex justify-end md:justify-center">
                        <Navigation />
                    </div>
                    <div className="hidden md:block absolute right-8">
                        <ThemeToggler />
                    </div>
                </div>
            </header>

            {/* 主内容区 */}
            <main className="main-page flex-1 relative z-10">{children}</main>

            {/* 底部渐变 */}
            <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-20" />
        </div>
    );
}

import Navigation from "./Navigation";
import ThemeToggler from "./ThemeToggler";

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
            {/* 科技感网格背景 */}
            <div className="grid-bg" />

            {/* 渐变光晕装饰 */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
            </div>

            {/* 玻璃态导航栏 */}
            <header className="sticky top-0 z-40 glass border-b border-white/10">
                <div className="container mx-auto px-4 py-4 flex items-center">
                    <div className="flex items-center md:absolute left-8">
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
        </div>
    );
}

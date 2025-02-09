import Navigation from "./Navigation";
import ThemeToggler from "./ThemeToggler";

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="sticky top-0 z-40 bg-background border-b">
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
            <main className="main-page flex-1">{children}</main>
        </div>
    );
}

import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/utils";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import ThemeToggler from "./ThemeToggler";

interface NavigationItem {
    id: string;
    label: string;
    link: string;
}

export default function Navigation() {
    const [active, setActive] = useState("blog");
    const [isOpen, setIsOpen] = useState(false);

    const items: NavigationItem[] = [
        { id: "blog", label: "博客", link: "/" },
        { id: "notes", label: "随记", link: "/notes" },
        { id: "workspace", label: "工作区", link: "/workspace" },
    ];

    const location = useLocation();

    useEffect(() => {
        setActive(items.find((item) => item.link === location.pathname)?.id || "blog");
    }, []);

    const handleClick = (navItem: NavigationItem) => {
        setActive(navItem.id);
        setIsOpen(false);
    };

    const NavigationItems = () => (
        <>
            {items.map((item) => (
                <NavigationMenuItem key={item.id} className="w-full">
                    <NavLink
                        className={cn(
                            "text-nowrap block w-full select-none cursor-pointer rounded-lg px-4 py-3 leading-none no-underline outline-none transition-all duration-300 relative overflow-hidden group",
                            "hover:text-primary hover:bg-primary/10 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)]",
                            "focus:text-primary focus:bg-primary/10 focus:shadow-[0_0_15px_rgba(0,255,255,0.2)]",
                            active === item.id && "text-primary font-medium"
                        )}
                        onClick={() => handleClick(item)}
                        to={item.link}
                    >
                        {/* 激活状态的渐变背景 */}
                        {active === item.id && (
                            <span className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-lg animate-gradient" />
                        )}
                        {/* 发光边框效果 */}
                        {active === item.id && (
                            <span className="absolute inset-0 rounded-lg border border-primary/50 shadow-[0_0_10px_rgba(0,255,255,0.3)]" />
                        )}
                        {/* 文本内容 */}
                        <span className="relative z-10">{item.label}</span>
                    </NavLink>
                </NavigationMenuItem>
            ))}
        </>
    );

    return (
        <>
            {/* 桌面端导航 */}
            <div className="hidden md:block">
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationItems />
                    </NavigationMenuList>
                </NavigationMenu>
            </div>

            {/* 移动端导航 */}
            <div className="md:hidden">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[240px] p-0">
                        <div className="flex h-full flex-col">
                            <div className="border-b px-6 py-4">
                                <SheetHeader>
                                    <SheetTitle className="text-left">菜单</SheetTitle>
                                </SheetHeader>
                            </div>
                            <div className="flex-1 overflow-auto px-6 py-4">
                                <NavigationMenu>
                                    <NavigationMenuList className="flex-col items-stretch space-y-1">
                                        <NavigationItems />
                                    </NavigationMenuList>
                                </NavigationMenu>
                            </div>
                            <div className="border-t px-6 py-4">
                                <ThemeToggler />
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}

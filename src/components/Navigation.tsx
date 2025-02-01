import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/utils";
import { useState } from "react";
import { NavLink } from "react-router-dom";
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
        { id: "workspace", label: "工作区", link: "/workspace" },
    ];

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
                            "text-nowrap block w-full select-none cursor-pointer rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            active === item.id && "bg-accent text-accent-foreground"
                        )}
                        onClick={() => handleClick(item)}
                        to={item.link}
                    >
                        {item.label}
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

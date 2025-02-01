import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Theme, useTheme } from "@/ThemeProvider";

export default function ThemeToggler() {
    const { setTheme } = useTheme();

    const changeTheme = (e: React.MouseEvent<HTMLDivElement>, theme: Theme) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        if (document.startViewTransition) {
            document.startViewTransition(() => {
                document.documentElement.style.setProperty("--mouse-x", `${mouseX}px`);
                document.documentElement.style.setProperty("--mouse-y", `${mouseY}px`);
                setTheme(theme);
            });
        } else {
            setTheme(theme);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">切换主题</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => changeTheme(e, "light")}>浅色</DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => changeTheme(e, "dark")}>深色</DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => changeTheme(e, "system")}>系统</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

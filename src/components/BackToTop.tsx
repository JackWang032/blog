import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ArrowUp } from "lucide-react";
import { cn } from "../utils";

export const BackToTop = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShow(window.scrollY > 200);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <Button
            variant="outline"
            size="icon"
            className={cn(
                "fixed bottom-8 right-8 z-50 rounded-full opacity-0 transition-all duration-300 hover:translate-y-[-2px]",
                show && "opacity-100"
            )}
            onClick={scrollToTop}
        >
            <ArrowUp className="h-4 w-4" />
        </Button>
    );
};

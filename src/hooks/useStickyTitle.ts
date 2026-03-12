import { useState, useRef, useEffect } from "react";
import { useScroll } from "motion/react";

const TRIGGER_POINT = 88;

export const useStickyTitle = () => {
    const [isSticky, setIsSticky] = useState(false);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const { scrollY } = useScroll();

    // 使用 Motion 监听滚动
    useEffect(() => {
        const unsubscribe = scrollY.on("change", (currentScrollY) => {
            const previousScrollY = scrollY.getPrevious() ?? 0;
            const direction = currentScrollY > previousScrollY ? "down" : "up";

            if (currentScrollY > TRIGGER_POINT && !isSticky && direction === "down") {
                setIsSticky(true);
            } else if (currentScrollY <= TRIGGER_POINT && isSticky && direction === "up") {
                setIsSticky(false);
            }
        });
        return () => unsubscribe();
    }, [scrollY, isSticky]);

    return { titleRef, isSticky };
};

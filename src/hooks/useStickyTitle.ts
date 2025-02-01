import { useRef, useState } from "react";
import { useAnimate, useMotionValueEvent, useScroll } from "motion/react";

const TRIGGER_POINT = 88;

export const useStickyTitle = () => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const memorizedOriginPosition = useRef({
        x: 0,
        y: 0,
    });
    const [titleRef, animate] = useAnimate();
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (currentScrollY) => {
        if (!titleRef.current || isAnimating) return;

        const direction = currentScrollY - (scrollY.getPrevious() || 0) > 0 ? "down" : "up";

        const stickyTitle = document.getElementById("sticky-title");

        if (!stickyTitle) return;

        const titleRect = titleRef.current.getBoundingClientRect();
        const targetRect = stickyTitle.getBoundingClientRect();
        const backBtnWidth = 56;

        if (currentScrollY > TRIGGER_POINT && !isSticky && direction === "down") {
            titleRef.current.style.position = "fixed";
            titleRef.current.style.left = 0;
            titleRef.current.style.top = 0;
            titleRef.current.style.transform = `translate(${titleRect.left}px, ${titleRect.top}px)`;

            setIsAnimating(true);
            setIsSticky(true);

            memorizedOriginPosition.current = {
                x: titleRect.left,
                y: titleRect.top + currentScrollY,
            };

            animate(
                titleRef.current,
                {
                    x: [titleRect.left, targetRect.left + backBtnWidth],
                    y: [titleRect.top, targetRect.top],
                },
                {
                    duration: 0.3,
                }
            ).then(() => {
                setIsAnimating(false);
            });
        }

        if (currentScrollY <= TRIGGER_POINT && isSticky && direction === "up") {
            titleRef.current.style.position = "fixed";
            titleRef.current.style.left = 0;
            titleRef.current.style.top = 0;
            titleRef.current.style.transform = `translate(${targetRect.left + backBtnWidth}px, ${targetRect.top}px)`;

            setIsAnimating(true);
            setIsSticky(false);

            animate(
                titleRef.current,
                {
                    x: [targetRect.left + backBtnWidth, memorizedOriginPosition.current.x],
                    y: [targetRect.top, memorizedOriginPosition.current.y],
                },
                {
                    duration: 0.2,
                }
            ).then(() => {
                titleRef.current.style.position = "";
                titleRef.current.style.left = "";
                titleRef.current.style.top = "";
                titleRef.current.style.transform = "";

                setIsAnimating(false);
            });
        }
    });

    return { titleRef, isSticky, isAnimating };
};

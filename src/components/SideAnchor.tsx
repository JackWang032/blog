import { useEffect, useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { generateCustomId, throttle } from "@/utils";

interface TocItem {
    id: string;
    text: string;
    level: number;
}

interface SideAnchorProps {
    containerRef: React.RefObject<HTMLElement>;
    content?: string;
}

const SideAnchor = ({ containerRef, content }: SideAnchorProps) => {
    const [headings, setHeadings] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>("");
    const throttledSetActiveId = useRef(throttle(setActiveId, 100));

    const onScroll = useCallback(() => {
        if (!containerRef.current) return;

        let currentActiveId = "";
        const headingElements = containerRef.current.querySelectorAll("h1, h2, h3, h4, h5, h6");

        headingElements.forEach((heading) => {
            const rect = heading.getBoundingClientRect();
            if (rect.top <= 100) {
                currentActiveId = heading.id;
            }
        });

        if (!currentActiveId) {
            currentActiveId = headingElements[0]?.id;
        }

        throttledSetActiveId.current(currentActiveId);
    }, [containerRef]);

    const throttledOnScroll = useRef(throttle(onScroll, 250));

    useEffect(() => {
        if (!containerRef.current || !content) return;

        const timer = setTimeout(() => {
            const elements = containerRef.current?.querySelectorAll("h1, h2, h3, h4, h5, h6");
            if (!elements) return;

            const items: TocItem[] = Array.from(elements)
                .filter((element) => element.textContent)
                .map((element) => {
                    if (!element.id) {
                        element.id = generateCustomId();
                    }
                    return {
                        id: element.id,
                        text: element.textContent || "",
                        level: parseInt(element.tagName[1]),
                    };
                });

            setHeadings(items);
            onScroll();
        }, 100);

        return () => clearTimeout(timer);
    }, [content, containerRef, onScroll]);

    useEffect(() => {
        window.addEventListener("scroll", throttledOnScroll.current, { passive: true });
        return () => window.removeEventListener("scroll", throttledOnScroll.current);
    }, []);

    if (headings.length === 0) return null;

    return (
        <div className="fixed left-[max(0px,calc(50%-45rem))] top-[3.8125rem] h-[calc(100vh-3.8125rem)] w-[19rem] overflow-y-auto py-10 px-8 hidden lg:block">
            <nav className="w-full">
                <ol className="space-y-2 text-sm">
                    {headings.map((heading) => (
                        <li
                            key={heading.id}
                            className={cn(
                                "cursor-pointer hover:text-foreground transition-colors",
                                {
                                    "text-foreground": activeId === heading.id,
                                    "text-muted-foreground": activeId !== heading.id,
                                },
                                {
                                    "pl-0": heading.level === 1,
                                    "pl-4": heading.level === 2,
                                    "pl-8": heading.level === 3,
                                    "pl-12": heading.level === 4,
                                    "pl-16": heading.level === 5,
                                    "pl-20": heading.level === 6,
                                }
                            )}
                            onClick={() => {
                                const target = document.getElementById(heading.id);
                                if (target) {
                                    const yOffset = -100;
                                    const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
                                    window.scrollTo({ top: y, behavior: "smooth" });
                                    setActiveId(heading.id);
                                }
                            }}
                        >
                            {heading.text}
                        </li>
                    ))}
                </ol>
            </nav>
        </div>
    );
};

export default SideAnchor;

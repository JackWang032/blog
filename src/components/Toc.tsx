import { useEffect, useState } from "react";
import { cn } from "@/utils";

interface TocItem {
    id: string;
    text: string;
    level: number;
}

interface TocProps {
    containerRef: React.RefObject<HTMLElement>;
}

const TableOfContents = ({ containerRef }: TocProps) => {
    const [headings, setHeadings] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        if (!containerRef.current) return;

        // 获取所有标题元素
        const elements = containerRef.current.querySelectorAll("h1, h2, h3, h4, h5, h6");
        const items: TocItem[] = Array.from(elements).map((element) => {
            // 确保每个标题都有 id
            if (!element.id) {
                element.id = element.textContent?.toLowerCase().replace(/\s+/g, "-") || "";
            }
            return {
                id: element.id,
                text: element.textContent || "",
                level: parseInt(element.tagName[1]),
            };
        });

        setHeadings(items);

        // 设置 Intersection Observer 来追踪活动标题
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "-20% 0% -35% 0%" }
        );

        elements.forEach((elem) => observer.observe(elem));

        return () => observer.disconnect();
    }, [containerRef]);

    return (
        <nav className="fixed top-20 right-4 w-64 hidden xl:block">
            <div className="space-y-2 p-4">
                <h4 className="font-medium mb-4">目录</h4>
                {headings.map((heading) => (
                    <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        className={cn(
                            "block text-sm py-1 hover:text-primary transition-colors",
                            "pl-" + (heading.level - 1) * 4,
                            activeId === heading.id ? "text-primary font-medium" : "text-muted-foreground"
                        )}
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(heading.id)?.scrollIntoView({
                                behavior: "smooth",
                            });
                        }}
                    >
                        {heading.text}
                    </a>
                ))}
            </div>
        </nav>
    );
};

export default TableOfContents;

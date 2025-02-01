import React, { useEffect, useRef, useState } from "react";
import { Copy, ChevronDown, ChevronUp, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";
import { codeToHtml } from "shiki";
import { useTheme } from "../ThemeProvider";

interface CodeBlockProps extends React.HTMLAttributes<HTMLElement> {
    language: string;
    children: React.ReactNode;
}

const CodeBlock = ({ language, children, ...restProps }: CodeBlockProps) => {
    const codeRef = useRef<HTMLDivElement>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [isCodePasing, setIsCodePasing] = useState(false);

    const { toast } = useToast();
    const { theme } = useTheme();

    useEffect(() => {
        const code = codeRef.current?.textContent || "";
        setIsCodePasing(true);
        codeToHtml(code.trim(), {
            lang: language,
            themes: {
                dark: "github-dark-high-contrast",
                light: "github-light",
            },
            colorReplacements: {
                "github-light": {
                    "#fff": "#fbfbfb",
                },
            },
        })
            .then((html) => {
                if (!codeRef.current) return;
                codeRef.current.innerHTML = html;
            })
            .finally(() => {
                setIsCodePasing(false);
            });
    }, [theme]);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(codeRef.current?.textContent || "");
            setIsCopied(true);
            toast({
                description: "代码已复制到剪贴板",
            });
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            toast({
                variant: "destructive",
                description: "复制失败",
            });
        }
    };

    const mergedProps = {
        ...restProps,
        style: {
            ...restProps.style,
            display: isCodePasing ? "none" : "block",
        },
    };

    return (
        <div className="relative group code-block-wrapper">
            <div className="w-full pl-4 pr-4 rounded-t-sm flex h-10 dark:bg-zinc-900 bg-zinc-100 items-center gap-2 group-hover:opacity-100 transition-opacity">
                <div className="w-full flex items-center justify-between">
                    <span className="px-2 py-1 text-xs rounded bg-muted">{language}</span>
                    <div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 mr-2 inline-grid"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                        >
                            {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 inline-grid" onClick={copyToClipboard}>
                            {isCopied ? <ThumbsUp className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
            </div>
            <div className={cn("transition-all duration-200 overflow-auto", isCollapsed ? "max-h-0" : "max-h-[70vh]")}>
                {isCodePasing && <Loading description="loading..." className="h-40" />}
                <div ref={codeRef} {...mergedProps}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default CodeBlock;

import React, { memo, useEffect, useRef, useState } from "react";
import { Copy, ChevronDown, ChevronUp, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { cn } from "@/utils";
import { useToast } from "@/hooks/useToast";
import { codeToHtml } from "shiki";
import { useTheme } from "../ThemeProvider";

interface CodeBlockProps extends React.HTMLAttributes<HTMLElement> {
    language: string;
    codeText: string;
    showParseLoading?: boolean;
}

const CodeBlock = ({ language, codeText, showParseLoading = true, ...restProps }: CodeBlockProps) => {
    const codeRef = useRef<HTMLDivElement>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [isCodeParsing, setIsCodeParsing] = useState(true);

    const { toast } = useToast();
    const { theme } = useTheme();

    useEffect(() => {
        const code = codeText.trim();
        setIsCodeParsing(true);
        codeToHtml(code, {
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
                setIsCodeParsing(false);
            });
    }, [theme, language, codeText]);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(codeRef.current?.textContent || "");
            setIsCopied(true);
            toast({
                description: "代码已复制到剪贴板",
            });
            setTimeout(() => setIsCopied(false), 2000);
        } catch (_) {
            toast({
                variant: "destructive",
                description: "复制失败",
            });
        }
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
                {isCodeParsing && showParseLoading && <Loading description="loading..." className="h-40" />}
                <div ref={codeRef} {...restProps}></div>
            </div>
        </div>
    );
};

export default memo(CodeBlock);

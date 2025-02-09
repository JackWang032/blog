import React, { memo, useMemo } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import CodeBlock from "@/components/CodeBlock";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { BASE_URL } from "@/consts";
import { cn } from "@/utils";
import { bundledLanguagesInfo } from "shiki";

const SUPPORT_LANGUAGES = new Set(bundledLanguagesInfo.map((item) => [item.name, ...(item.aliases || [])]).flat());

interface MarkdownContentProps {
    content: string;
    className?: string;
    showCodeParseLoading?: boolean;
    canImgZoom?: boolean;
}

function getTextContent(node: any): string {
    return node.children?.map((item: any) => (item.type !== "text" ? getTextContent(item) : item.value)).join("") || "";
}

const MarkdownContent = memo(
    ({ content, showCodeParseLoading = true, canImgZoom = true, className }: MarkdownContentProps) => {
        const components: Components = useMemo(() => {
            return {
                pre: ({ className, children, node, ...props }) => {
                    const includeCode = (children as React.ReactElement)?.type === "code";
                    const match =
                        includeCode && /language-(\w+)/.exec((children as React.ReactElement).props.className || "");
                    if (
                        match &&
                        (SUPPORT_LANGUAGES.has(match[1].toLowerCase()) || SUPPORT_LANGUAGES.has(match[1].toUpperCase()))
                    ) {
                        const language = match[1];
                        const codeText = getTextContent(node);
                        return (
                            <CodeBlock
                                language={language}
                                codeText={codeText}
                                showParseLoading={showCodeParseLoading}
                                className={className}
                                {...props}
                            />
                        );
                    }
                    return (
                        <pre className={className} {...props}>
                            {children}
                        </pre>
                    );
                },
                a: ({ href, children }) => {
                    if (href?.startsWith("http")) {
                        return (
                            <a href={href} target="_blank" rel="noopener noreferrer">
                                {children}
                            </a>
                        );
                    }
                    return <a href={href}>{children}</a>;
                },
                img: ({ src, alt }) =>
                    canImgZoom ? (
                        <Zoom wrapElement="div">
                            <img src={src} alt={alt} loading="lazy" className="max-w-full" />
                        </Zoom>
                    ) : (
                        <img src={src} alt={alt} loading="lazy" className="max-w-full" />
                    ),
            };
        }, []);

        return (
            <ReactMarkdown
                className={cn("prose dark:prose-invert max-w-none", className)}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                urlTransform={(url, key, node) => {
                    if (
                        node.tagName === "img" &&
                        key === "src" &&
                        !url.startsWith("blob:") &&
                        !url.startsWith("data:image")
                    ) {
                        return `${BASE_URL}images/${url}`;
                    }
                    return url;
                }}
                components={components}
            >
                {content}
            </ReactMarkdown>
        );
    }
);

export default MarkdownContent;

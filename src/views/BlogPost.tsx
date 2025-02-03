import React, { useRef, useMemo, memo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import CodeBlock from "@/components/CodeBlock";
import SideAnchor from "@/components/SideAnchor";
import { useBlogs } from "@/hooks/useBlogs";
import { usePost } from "@/hooks/usePost";
import { useStickyTitle } from "@/hooks/useStickyTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { useTheme } from "@/ThemeProvider";
import { cn } from "@/utils";
import { motion } from "motion/react";
import { BASE_URL } from "@/consts";
import Zoom from "react-medium-image-zoom";
import rehypeRaw from "rehype-raw";
import "react-medium-image-zoom/dist/styles.css";

const DEFAULT_MARKDOWN_THEMES = {
    dark: "juejin-dark",
    light: "juejin-light",
};

const MemorizedPostContent = memo(({ postContent }: { postContent?: string }) => {
    return (
        <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            components={{
                pre: ({ className, children, ...props }) => {
                    const includeCode = (children as React.ReactElement)?.type === "code";

                    const match =
                        includeCode && /language-(\w+)/.exec((children as React.ReactElement).props.className || "");
                    if (match) {
                        const language = match[1];
                        return (
                            <CodeBlock language={language} className={className} {...props}>
                                {children}
                            </CodeBlock>
                        );
                    }
                    return (
                        <pre className={className} {...props}>
                            {children}
                        </pre>
                    );
                },
                a: ({ href, children }) => (
                    <a target="_blank" href={href}>
                        {children}
                    </a>
                ),
                img: ({ src, alt }) => (
                    <Zoom wrapElement="span">
                        <img src={src} alt={alt} loading="lazy" />
                    </Zoom>
                ),
            }}
            urlTransform={(url, key, node) => {
                if (node.tagName === "img" && key === "src") {
                    return `${BASE_URL}images/${url}`;
                }
                return url;
            }}
        >
            {postContent}
        </ReactMarkdown>
    );
});

const BlogPost = () => {
    const postRef = useRef<HTMLDivElement>(null);
    const { id } = useParams();
    const { titleRef, isSticky, isAnimating } = useStickyTitle();
    const { realTheme } = useTheme();

    const { data: blogPosts = [] } = useBlogs({ revalidateIfStale: false });

    const postMetaInfo = useMemo(() => {
        return blogPosts.find((post) => post.id === id);
    }, [blogPosts, id]);
    const { data: postContent, isLoading } = usePost(postMetaInfo);

    const markdownTheme = postMetaInfo?.themes?.[realTheme]
        ? `md-theme-${postMetaInfo.themes[realTheme]}`
        : DEFAULT_MARKDOWN_THEMES[realTheme];

    const navigate = useNavigate();

    const goBack = () => {
        navigate("/");
        if (document.startViewTransition) {
            document.startViewTransition();
        }
    };

    return (
        <div className="relative post-wrapper">
            <SideAnchor containerRef={postRef} content={postContent} />
            <div className="w-full max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-2">
                    <Button size="icon" variant="outline" className="mr-4" onClick={goBack}>
                        <ArrowLeft className="h-[1.2rem] w-[1.2rem]" />
                    </Button>
                    <span className="flex items-center gap-1">
                        <CalendarDays className="w-4 h-4" />
                        {postMetaInfo?.date}
                    </span>
                </div>
                <div className="flex items-center h-10">
                    <h1
                        ref={titleRef}
                        className="w-fit h-10 mx-auto relative text-2xl font-semibold text-center z-50 whitespace-nowrap leading-[40px]"
                    >
                        {isSticky && !isAnimating && (
                            <Button
                                size="icon"
                                variant="outline"
                                className="absolute -left-[56px] top-0"
                                asChild
                                onClick={goBack}
                            >
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ArrowLeft className="h-[1.2rem] w-[1.2rem]" />
                                </motion.button>
                            </Button>
                        )}
                        {postMetaInfo?.title}
                    </h1>
                </div>
                {isLoading ? (
                    <Loading description="loading..." className="h-80" />
                ) : (
                    <Card className="mt-6 border-none">
                        <CardContent className="px-0 lg:px-6 lg:py-4">
                            <div ref={postRef} className={cn("md-content", markdownTheme)}>
                                <MemorizedPostContent postContent={postContent} />
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default BlogPost;

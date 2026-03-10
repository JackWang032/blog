import { useNavigate } from "react-router-dom";
import { useBlogs } from "@/hooks/useBlogs";
import type { IBlogPost } from "@/types";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useRef } from "react";
import { useElementMouseTracking } from "@/hooks/useMouseTracking";

// Hero 组件
function Hero() {
    return (
        <section className="hero-section">
            <motion.h1
                className="hero-title"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                探索技术的边界
            </motion.h1>
            <motion.p
                className="hero-subtitle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                记录学习、分享思考、探索前沿技术。在这里，每一篇文章都是一次思想的旅程。
            </motion.p>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
            >
                <Button className="hero-cta">
                    开始阅读
                </Button>
            </motion.div>
            <div className="hero-scroll-hint">
                <span>向下滚动</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
            </div>
        </section>
    );
}

// 博客卡片组件
function BlogCard({ post, index }: { post: IBlogPost; index: number }) {
    const navigate = useNavigate();
    const cardRef = useRef<HTMLDivElement>(null);
    useElementMouseTracking(cardRef);
    const { ref: scrollRef, isInView } = useScrollAnimation<HTMLDivElement>({
        threshold: 0.1,
        triggerOnce: true,
    });

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = cardRef.current?.getBoundingClientRect();
        if (rect) {
            cardRef.current?.style.setProperty('--glow-x', `${e.clientX - rect.left}px`);
            cardRef.current?.style.setProperty('--glow-y', `${e.clientY - rect.top}px`);
        }
    };

    const readMore = () => {
        navigate(`/post/${post.id}`);
    };

    return (
        <motion.div
            ref={scrollRef}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
        >
            <div
                ref={cardRef}
                className="blog-card cursor-pointer p-6"
                onClick={readMore}
                onMouseMove={handleMouseMove}
            >
                {/* 顶部装饰线 */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                
                {/* 左侧装饰条 */}
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary/50 via-secondary/30 to-transparent" />

                <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-3 group-hover:text-gradient transition-all duration-300">
                        {post.title}
                    </h2>
                    <p className="text-sm text-muted-foreground flex items-center gap-2 mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        {post.date}
                    </p>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{post.description}</p>
                    <Button
                        className="relative overflow-hidden group"
                        onClick={(e) => {
                            e.stopPropagation();
                            readMore();
                        }}
                    >
                        <span className="relative z-10">阅读更多</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}

const BlogList = () => {
    const { data: blogPosts = [] } = useBlogs();

    return (
        <div className="relative">
            {/* Hero 区域 */}
            <Hero />

            {/* 博客列表 */}
            <div className="container space-y-8 mx-auto px-4 md:px-8 lg:px-16 xl:px-32 py-12">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h2 className="text-2xl font-bold mb-2 text-gradient">最新文章</h2>
                    <p className="text-muted-foreground">探索我最近的技术分享</p>
                </motion.div>

                <div className="grid gap-6">
                    {blogPosts.map((post, index) => (
                        <BlogCard key={post.id} post={post} index={index} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogList;

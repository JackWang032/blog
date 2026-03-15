import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useBlogs } from "@/hooks/useBlogs";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useRef } from "react";
import { useElementMouseTracking } from "@/hooks/useMouseTracking";
import type { IBlogPost } from "@/types";
import {
    Code2,
    Sparkles,
    BookOpen,
    Zap,
    ArrowRight,
    Github,
    Mail,
    MapPin,
} from "lucide-react";

// ===== Hero 区域 =====
function Hero() {
    const navigate = useNavigate();

    return (
        <section className="landing-hero">
            <div className="hero-content">
                <motion.div
                    className="hero-badge"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Sparkles className="w-4 h-4" />
                    <span>探索技术的无限可能</span>
                </motion.div>

                <motion.h1
                    className="hero-title-lg"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                >
                    你好，我是
                    <span className="text-gradient block mt-2">Jack Wang</span>
                </motion.h1>

                <motion.p
                    className="hero-desc"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    全栈开发者 · 技术探索者 · 终身学习者
                    <br />
                    在这里记录学习、分享思考、探索前沿技术
                </motion.p>

                <motion.div
                    className="hero-actions"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    <Button
                        className="btn-primary-lg"
                        onClick={() => navigate("/blog")}
                    >
                        <BookOpen className="w-5 h-5 mr-2" />
                        阅读博客
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button
                        variant="outline"
                        className="btn-outline-lg"
                        onClick={() => {
                            document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
                        }}
                    >
                        了解更多
                    </Button>
                </motion.div>

                {/* 技术标签云 */}
                <motion.div
                    className="tech-tags"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.7 }}
                >
                    {["React", "TypeScript", "Node.js", "Python", "AI", "Web3"].map(
                        (tag, i) => (
                            <span
                                key={tag}
                                className="tech-tag"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                {tag}
                            </span>
                        )
                    )}
                </motion.div>
            </div>

            {/* 滚动提示 */}
            <motion.div
                className="scroll-indicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
            >
                <span>向下探索</span>
                <div className="scroll-arrow">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M19 12l-7 7-7-7" />
                    </svg>
                </div>
            </motion.div>
        </section>
    );
}

// ===== 特性卡片 =====
function FeatureCard({
    icon: Icon,
    title,
    description,
    delay,
}: {
    icon: React.ElementType;
    title: string;
    description: string;
    delay: number;
}) {
    const { ref, isInView } = useScrollAnimation<HTMLDivElement>({
        threshold: 0.2,
        triggerOnce: true,
    });

    return (
        <motion.div
            ref={ref}
            className="feature-card"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay }}
        >
            <div className="feature-icon">
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="feature-title">{title}</h3>
            <p className="feature-desc">{description}</p>
        </motion.div>
    );
}

// ===== 特性区域 =====
function Features() {
    const features = [
        {
            icon: Code2,
            title: "技术深度",
            description: "深入探讨前端、后端、AI 等技术领域，分享实战经验与最佳实践",
        },
        {
            icon: Sparkles,
            title: "创新探索",
            description: "关注前沿技术趋势，探索 AI、Web3、云原生等新兴领域",
        },
        {
            icon: Zap,
            title: "快速迭代",
            description: "持续学习、持续输出，记录成长路上的每一步",
        },
        {
            icon: BookOpen,
            title: "系统总结",
            description: "将碎片化知识系统化整理，构建完整的知识体系",
        },
    ];

    const { ref, isInView } = useScrollAnimation<HTMLElement>({
        threshold: 0.1,
        triggerOnce: true,
    });

    return (
        <section ref={ref} className="section-features">
            <motion.div
                className="section-header"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
            >
                <h2 className="section-title">
                    <span className="text-gradient">为什么写博客？</span>
                </h2>
                <p className="section-subtitle">
                    记录、分享、成长
                </p>
            </motion.div>

            <div className="features-grid">
                {features.map((feature, i) => (
                    <FeatureCard
                        key={feature.title}
                        {...feature}
                        delay={i * 0.1}
                    />
                ))}
            </div>
        </section>
    );
}

// ===== 最新文章卡片 =====
function PostCard({ post, index }: { post: IBlogPost; index: number }) {
    const navigate = useNavigate();
    const cardRef = useRef<HTMLDivElement>(null);
    useElementMouseTracking(cardRef);

    const { ref: scrollRef, isInView } = useScrollAnimation<HTMLDivElement>({
        threshold: 0.1,
        triggerOnce: true,
    });

    return (
        <motion.div
            ref={scrollRef}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <div
                ref={cardRef}
                className="post-card"
                onClick={() => navigate(`/post/${post.id}`)}
            >
                <div className="post-card-header">
                    <span className="post-date">{post.date}</span>
                </div>
                <h3 className="post-title">{post.title}</h3>
                <p className="post-excerpt">{post.description}</p>
                <div className="post-footer">
                    <span className="read-more">
                        阅读全文
                        <ArrowRight className="w-4 h-4 ml-1" />
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

// ===== 最新文章区域 =====
function LatestPosts() {
    const { data: posts = [] } = useBlogs();
    const latestPosts = posts.slice(0, 3);

    const { ref, isInView } = useScrollAnimation<HTMLElement>({
        threshold: 0.1,
        triggerOnce: true,
    });

    const navigate = useNavigate();

    return (
        <section ref={ref} className="section-posts">
            <motion.div
                className="section-header"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
            >
                <h2 className="section-title">
                    <span className="text-gradient">最新文章</span>
                </h2>
                <p className="section-subtitle">
                    探索我最近的技术分享
                </p>
            </motion.div>

            <div className="posts-grid">
                {latestPosts.map((post, i) => (
                    <PostCard key={post.id} post={post} index={i} />
                ))}
            </div>

            <motion.div
                className="view-all-wrapper"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
            >
                <Button
                    variant="outline"
                    className="btn-view-all"
                    onClick={() => navigate("/blog")}
                >
                    查看全部文章
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </motion.div>
        </section>
    );
}

// ===== 关于我区域 =====
function About() {
    const { ref, isInView } = useScrollAnimation<HTMLElement>({
        threshold: 0.1,
        triggerOnce: true,
    });

    return (
        <section id="about" ref={ref} className="section-about">
            <motion.div
                className="about-content"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
            >
                <div className="about-avatar">
                    <div className="avatar-ring">
                        <div className="avatar-inner">
                            <Code2 className="w-16 h-16 text-primary" />
                        </div>
                    </div>
                </div>

                <h2 className="about-title">
                    关于<span className="text-gradient">我</span>
                </h2>

                <p className="about-desc">
                    我是一名热爱技术的全栈开发者，专注于 Web 开发和人工智能领域。
                    相信技术的力量可以改变世界，享受用代码解决问题的过程。
                    在这个博客里，我会分享我的学习心得、项目经验和技术探索。
                </p>

                <div className="about-info">
                    <div className="info-item">
                        <MapPin className="w-4 h-4" />
                        <span>中国</span>
                    </div>
                    <div className="info-item">
                        <Mail className="w-4 h-4" />
                        <span>hello@jackwang.dev</span>
                    </div>
                    <div className="info-item">
                        <Github className="w-4 h-4" />
                        <a
                            href="https://github.com/JackWang032"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary transition-colors"
                        >
                            GitHub
                        </a>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}

// ===== CTA 区域 =====
function CTA() {
    const navigate = useNavigate();
    const { ref, isInView } = useScrollAnimation<HTMLElement>({
        threshold: 0.2,
        triggerOnce: true,
    });

    return (
        <section ref={ref} className="section-cta">
            <motion.div
                className="cta-content"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6 }}
            >
                <h2 className="cta-title">
                    准备好开始探索了吗？
                </h2>
                <p className="cta-desc">
                    浏览我的技术文章，一起探索技术的无限可能
                </p>
                <Button
                    className="btn-cta"
                    onClick={() => navigate("/blog")}
                >
                    <BookOpen className="w-5 h-5 mr-2" />
                    开始阅读
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </motion.div>
        </section>
    );
}

// ===== Footer =====
function Footer() {
    return (
        <footer className="landing-footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <div className="logo-icon">
                        <span className="logo-text">{"</>"}</span>
                    </div>
                    <span className="footer-name">Jack Wang</span>
                </div>
                <p className="footer-copyright">
                    © {new Date().getFullYear()} All rights reserved.
                </p>
            </div>
        </footer>
    );
}

// ===== 主组件 =====
const Landing = () => {
    return (
        <div className="landing-page">
            <Hero />
            <Features />
            <LatestPosts />
            <About />
            <CTA />
            <Footer />
        </div>
    );
};

export default Landing;

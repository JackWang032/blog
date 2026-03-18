import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useBlogs } from "@/hooks/useBlogs";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useState, useEffect } from "react";
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
    Rocket,
    Brain,
    Coffee,
    Heart,
    ExternalLink,
} from "lucide-react";
import { ParallaxBackground } from "@/components/ParallaxBackground";
import { BackgroundGame } from "@/components/BackgroundGame";

// ===== 技能数据 =====
const skills = [
    { name: "React", level: 95, color: "#61DAFB" },
    { name: "TypeScript", level: 90, color: "#3178C6" },
    { name: "Node.js", level: 85, color: "#339933" },
    { name: "Python", level: 80, color: "#3776AB" },
    { name: "AI/ML", level: 75, color: "#FF6F61" },
    { name: "Web3", level: 70, color: "#8B5CF6" },
];

// ===== 经历数据 =====
const timeline = [
    {
        year: "2024",
        title: "AI 探索者",
        desc: "深入研究 AI 应用开发，探索 LLM 与前端的结合",
        icon: Brain,
    },
    {
        year: "2023",
        title: "全栈进阶",
        desc: "掌握云原生技术，构建大规模分布式系统",
        icon: Rocket,
    },
    {
        year: "2022",
        title: "前端深耕",
        desc: "精通 React 生态，深入 TypeScript 类型系统",
        icon: Code2,
    },
];

// ===== Hero 区域 =====
function Hero() {
    const navigate = useNavigate();
    const [typedText, setTypedText] = useState("");
    const fullText = "探索技术的无限可能";

    useEffect(() => {
        let index = 0;
        const timer = setInterval(() => {
            if (index <= fullText.length) {
                setTypedText(fullText.slice(0, index));
                index++;
            } else {
                clearInterval(timer);
            }
        }, 100);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="landing-hero">
            <div className="hero-content">
                {/* 状态徽章 */}
                <motion.div
                    className="hero-badge glass"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="status-dot" />
                    <span>开放合作中</span>
                </motion.div>

                {/* 主标题 */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <h1 className="hero-title">
                        你好，我是
                        <span className="hero-name block">Jack Wang</span>
                    </h1>
                    
                    <div className="hero-typing">
                        <span className="typing-text">{typedText}</span>
                        <span className="cursor">|</span>
                    </div>
                </motion.div>

                {/* 描述 */}
                <motion.p
                    className="hero-desc"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    全栈开发者 · 技术探索者 · 终身学习者
                </motion.p>

                {/* 技能条 */}
                <motion.div
                    className="skill-bars"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    {skills.slice(0, 4).map((skill, i) => (
                        <div key={skill.name} className="skill-item">
                            <span className="skill-name">{skill.name}</span>
                            <div className="skill-bar">
                                <motion.div
                                    className="skill-fill"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${skill.level}%` }}
                                    transition={{ duration: 1, delay: 0.8 + i * 0.1 }}
                                    style={{ backgroundColor: skill.color }}
                                />
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* 行动按钮 */}
                <motion.div
                    className="hero-actions"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                >
                    <Button
                        className="btn-primary-lg glass"
                        onClick={() => navigate("/blog")}
                    >
                        <BookOpen className="w-5 h-5" />
                        <span>探索博客</span>
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="btn-outline-lg glass"
                        onClick={() => window.open("https://github.com/JackWang032", "_blank")}
                    >
                        <Github className="w-5 h-5" />
                        <span>GitHub</span>
                    </Button>
                </motion.div>

                {/* 统计数据 */}
                <motion.div
                    className="hero-stats glass"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                >
                    <div className="stat-item">
                        <span className="stat-value">50+</span>
                        <span className="stat-label">技术文章</span>
                    </div>
                    <div className="stat-divider" />
                    <div className="stat-item">
                        <span className="stat-value">3+</span>
                        <span className="stat-label">年经验</span>
                    </div>
                    <div className="stat-divider" />
                    <div className="stat-item">
                        <span className="stat-value">∞</span>
                        <span className="stat-label">热情</span>
                    </div>
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
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M19 12l-7 7-7-7" />
                    </svg>
                </motion.div>
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
    gradient,
}: {
    icon: React.ElementType;
    title: string;
    description: string;
    delay: number;
    gradient: string;
}) {
    const { ref } = useScrollAnimation<HTMLDivElement>({
        threshold: 0.2,
        triggerOnce: true,
    });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay }}
            className="feature-card glass-hover"
        >
            <div 
                className="feature-icon"
                style={{ background: gradient }}
            >
                <Icon className="w-6 h-6 text-white" />
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
            description: "深入探讨前端、后端、AI 等技术领域，分享实战经验",
            gradient: "linear-gradient(135deg, #00d9ff, #00ff88)",
        },
        {
            icon: Sparkles,
            title: "创新探索",
            description: "关注前沿技术趋势，探索 AI、Web3 等新兴领域",
            gradient: "linear-gradient(135deg, #a855f7, #6366f1)",
        },
        {
            icon: Zap,
            title: "快速迭代",
            description: "持续学习、持续输出，记录成长路上的每一步",
            gradient: "linear-gradient(135deg, #fbbf24, #f97316)",
        },
        {
            icon: BookOpen,
            title: "系统总结",
            description: "将碎片化知识系统化整理，构建完整的知识体系",
            gradient: "linear-gradient(135deg, #22c55e, #10b981)",
        },
    ];

    const { ref } = useScrollAnimation<HTMLElement>({
        threshold: 0.1,
        triggerOnce: true,
    });

    return (
        <section ref={ref} className="section-features">
            <motion.div
                className="section-header"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6 }}
            >
                <span className="section-tag">Why Blog</span>
                <h2 className="section-title">
                    写作的<span className="text-gradient">意义</span>
                </h2>
                <p className="section-subtitle">
                    在这里，我记录学习、分享思考、探索未知
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

// ===== 时间线 =====
function Timeline() {
    const { ref } = useScrollAnimation<HTMLElement>({
        threshold: 0.1,
        triggerOnce: true,
    });

    return (
        <section ref={ref} className="section-timeline">
            <motion.div
                className="section-header"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6 }}
            >
                <span className="section-tag">Journey</span>
                <h2 className="section-title">
                    成长<span className="text-gradient">轨迹</span>
                </h2>
            </motion.div>

            <div className="timeline-container">
                {timeline.map((item, i) => {
                    const Icon = item.icon;

                    return (
                        <motion.div
                            key={item.year}
                            className="timeline-item"
                            initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6, delay: i * 0.2 }}
                        >
                            <div className="timeline-dot">
                                <Icon className="w-4 h-4" />
                            </div>
                            <div className="timeline-content glass">
                                <span className="timeline-year">{item.year}</span>
                                <h3 className="timeline-title">{item.title}</h3>
                                <p className="timeline-desc">{item.desc}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}

// ===== 最新文章卡片 =====
function PostCard({ post, index }: { post: IBlogPost; index: number }) {
    const navigate = useNavigate();
    const { ref } = useScrollAnimation<HTMLDivElement>({
        threshold: 0.1,
        triggerOnce: true,
    });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="post-card-wrapper"
        >
            <div
                className="post-card glass-hover"
                onClick={() => navigate(`/post/${post.id}`)}
            >
                <div className="post-header">
                    <span className="post-date">{post.date}</span>
                    <span className="post-read-time">5 min read</span>
                </div>
                <h3 className="post-title">{post.title}</h3>
                <p className="post-excerpt">{post.description}</p>
                <div className="post-footer">
                    <span className="read-more">
                        阅读全文
                        <ArrowRight className="w-4 h-4" />
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

    const { ref } = useScrollAnimation<HTMLElement>({
        threshold: 0.1,
        triggerOnce: true,
    });

    const navigate = useNavigate();

    return (
        <section ref={ref} className="section-posts">
            <motion.div
                className="section-header"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6 }}
            >
                <span className="section-tag">Latest</span>
                <h2 className="section-title">
                    最新<span className="text-gradient">文章</span>
                </h2>
                <p className="section-subtitle">
                    探索我最近的技术分享与思考
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
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
            >
                <Button
                    variant="outline"
                    className="btn-view-all glass"
                    onClick={() => navigate("/blog")}
                >
                    查看全部文章
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </motion.div>
        </section>
    );
}

// ===== 技能展示区域 =====
function SkillsSection() {
    const { ref } = useScrollAnimation<HTMLElement>({
        threshold: 0.1,
        triggerOnce: true,
    });

    return (
        <section ref={ref} className="section-skills">
            <motion.div
                className="section-header"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6 }}
            >
                <span className="section-tag">Skills</span>
                <h2 className="section-title">
                    技术<span className="text-gradient">栈</span>
                </h2>
            </motion.div>

            <div className="skills-grid">
                {skills.map((skill, i) => (
                    <motion.div
                        key={skill.name}
                        className="skill-card glass"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                    >
                        <div className="skill-header">
                            <span className="skill-name-lg">{skill.name}</span>
                            <span className="skill-percent" style={{ color: skill.color }}>
                                {skill.level}%
                            </span>
                        </div>
                        <div className="skill-bar-lg">
                            <motion.div
                                className="skill-fill-lg"
                                initial={{ width: 0 }}
                                whileInView={{ width: `${skill.level}%` }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 1, delay: i * 0.1 + 0.3 }}
                                style={{ backgroundColor: skill.color }}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

// ===== 关于我区域 =====
function About() {
    const { ref } = useScrollAnimation<HTMLElement>({
        threshold: 0.1,
        triggerOnce: true,
    });

    return (
        <section id="about" ref={ref} className="section-about">
            <motion.div
                className="about-content glass"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6 }}
            >
                <div className="about-avatar">
                    <div className="avatar-ring">
                        <div className="avatar-inner">
                            <Code2 className="w-20 h-20 text-primary" />
                        </div>
                    </div>
                </div>

                <h2 className="about-title">
                    关于<span className="text-gradient">我</span>
                </h2>

                <p className="about-desc">
                    我是一名热爱技术的全栈开发者，专注于 Web 开发和人工智能领域。
                    <br />
                    相信技术的力量可以改变世界，享受用代码解决问题的过程。
                    <br />
                    在这个博客里，我会分享我的学习心得、项目经验和技术探索。
                </p>

                <div className="about-tags">
                    <span className="about-tag">
                        <Coffee className="w-4 h-4" />
                        Coffee Lover
                    </span>
                    <span className="about-tag">
                        <Heart className="w-4 h-4" />
                        Open Source
                    </span>
                    <span className="about-tag">
                        <Rocket className="w-4 h-4" />
                        Always Learning
                    </span>
                </div>

                <div className="about-links">
                    <a href="https://github.com/JackWang032" target="_blank" rel="noopener noreferrer" className="about-link glass-hover">
                        <Github className="w-5 h-5" />
                        <span>GitHub</span>
                        <ExternalLink className="w-3 h-3" />
                    </a>
                    <a href="mailto:hello@jackwang.dev" className="about-link glass-hover">
                        <Mail className="w-5 h-5" />
                        <span>Email</span>
                    </a>
                    <span className="about-link glass-hover">
                        <MapPin className="w-5 h-5" />
                        <span>China</span>
                    </span>
                </div>
            </motion.div>
        </section>
    );
}

// ===== CTA 区域 =====
function CTA() {
    const navigate = useNavigate();
    const { ref } = useScrollAnimation<HTMLElement>({
        threshold: 0.2,
        triggerOnce: true,
    });

    return (
        <section ref={ref} className="section-cta">
            <motion.div
                className="cta-content glass"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
            >
                <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
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
                    <BookOpen className="w-5 h-5" />
                    <span>开始阅读</span>
                    <ArrowRight className="w-4 h-4" />
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
                    <div className="logo-icon glass">
                        <span className="logo-text">{"</>"}</span>
                    </div>
                    <span className="footer-name">Jack Wang</span>
                </div>
                <p className="footer-copyright">
                    © {new Date().getFullYear()} All rights reserved. Made with ❤️
                </p>
            </div>
        </footer>
    );
}

// ===== 主组件 =====
const Landing = () => {
    return (
        <div className="landing-page">
            <ParallaxBackground />
            <BackgroundGame />
            <Hero />
            <Features />
            <Timeline />
            <LatestPosts />
            <SkillsSection />
            <About />
            <CTA />
            <Footer />
        </div>
    );
};

export default Landing;

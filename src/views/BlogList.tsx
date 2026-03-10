import { useNavigate } from "react-router-dom";
import { useBlogs } from "@/hooks/useBlogs";
import type { IBlogPost } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { motion } from "motion/react";

const BlogList = () => {
    const { data: blogPosts = [] } = useBlogs();

    const navigate = useNavigate();

    const readMore = (post: IBlogPost) => {
        navigate(`/post/${post.id}`);
    };

    return (
        <div className="container space-y-6 mx-auto px-4 md:px-8 lg:px-32 xl:px-64 py-8">
            {blogPosts.map((post, index) => (
                <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                    <Card
                        className="post-list-card cursor-pointer transition-all duration-300 relative group overflow-hidden"
                    >
                        {/* 科技感装饰线条 */}
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent" />

                        <CardHeader>
                            <CardTitle className="text-2xl post-title group-hover:text-gradient transition-all duration-300">
                                {post.title}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                {post.date}
                            </p>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">{post.description}</p>
                            <Button asChild onClick={() => readMore(post)}>
                                <motion.button
                                    initial={{ scale: 1 }}
                                    whileHover={{ scale: 1.05 }}
                                    className="relative overflow-hidden"
                                >
                                    阅读更多
                                </motion.button>
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
};

export default BlogList;

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
        <div className="space-y-6">
            {blogPosts.map((post) => (
                <motion.div
                    key={post.id}
                    initial={{ opacity: 0.1 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card
                        className="post-list-card cursor-pointer hover:shadow-lg transition-shadow"
                        style={{ transitionDuration: "0.4s" }}
                    >
                        <CardHeader>
                            <CardTitle className="text-2xl post-title">{post.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">{post.date}</p>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">{post.description}</p>
                            <Button asChild onClick={() => readMore(post)}>
                                <motion.button initial={{ scale: 1 }} whileHover={{ scale: 1.05 }}>
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

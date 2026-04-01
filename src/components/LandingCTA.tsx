import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function LandingCTA() {
    const navigate = useNavigate();

    return (
        <div className="fixed bottom-[20vh] left-1/2 -translate-x-1/2 z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 0.8, ease: "easeOut" }}
            >
                <Button
                    size="lg"
                    className="glass-button px-8 py-6 text-lg font-medium"
                    onClick={() => navigate("/blog")}
                >
                    进入博客
                    <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
            </motion.div>
        </div>
    );
}

import { ParallaxBackground } from "@/components/ParallaxBackground";
import { FullscreenParticleTitle } from "@/components/FullscreenParticleTitle";
import { LandingCTA } from "@/components/LandingCTA";
import "@/styles/landing.css";

const Landing = () => {
    return (
        <div className="landing-page h-screen w-screen overflow-hidden relative">
            <ParallaxBackground />
            <FullscreenParticleTitle mainText="JACK'S BLOG" subText="探索 · 分享 · 成长" />
            <LandingCTA />
        </div>
    );
};

export default Landing;

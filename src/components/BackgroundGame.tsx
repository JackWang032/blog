import { useEffect, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Rocket, Gamepad2, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

// 游戏状态类型
type GameState = "idle" | "playing" | "paused";

// 游戏对象接口
interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  active: boolean;
}

interface Bullet extends GameObject {}
interface Enemy extends GameObject {
  hp: number;
  maxHp: number;
}
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

// 游戏配置 - 调整为背景模式
const GAME_WIDTH = typeof window !== 'undefined' ? window.innerWidth : 1920;
const GAME_HEIGHT = typeof window !== 'undefined' ? window.innerHeight : 1080;
const PLAYER_SIZE = 30;
const BULLET_SIZE = 4;
const ENEMY_SIZE = 25;
const BULLET_SPEED = 8;
const ENEMY_BASE_SPEED = 1.5;
const AUTO_SHOOT_INTERVAL = 200; // 自动射击间隔

interface BackgroundGameProps {
  enabled?: boolean;
  onToggle?: (enabled: boolean) => void;
}

export function BackgroundGame({ enabled: propEnabled, onToggle }: BackgroundGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [gameState, setGameState] = useState<GameState>("idle");
  const [enabled, setEnabled] = useState(propEnabled ?? false);
  const [score, setScore] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [muted, setMuted] = useState(true);
  const [dimensions, setDimensions] = useState({ width: GAME_WIDTH, height: GAME_HEIGHT });

  // 游戏状态引用
  const gameStateRef = useRef({
    player: { x: dimensions.width / 2, y: dimensions.height - 100 },
    bullets: [] as Bullet[],
    enemies: [] as Enemy[],
    particles: [] as Particle[],
    stars: [] as Array<{ x: number; y: number; size: number; speed: number; opacity: number }>,
    lastShot: 0,
    enemySpawnTimer: 0,
    score: 0,
    mouseX: dimensions.width / 2,
    mouseY: dimensions.height - 100,
    frameCount: 0,
  });

  // 初始化星星背景
  const initStars = useCallback(() => {
    const stars: Array<{ x: number; y: number; size: number; speed: number; opacity: number }> = [];
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: Math.random() * 2,
        speed: 0.5 + Math.random() * 1.5,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
    gameStateRef.current.stars = stars;
  }, [dimensions]);

  // 创建粒子爆炸效果
  const createExplosion = useCallback((x: number, y: number, color: string = "#FF6B6B") => {
    const particles: Particle[] = [];
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const speed = 1 + Math.random() * 2;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 20,
        maxLife: 20,
        color,
        size: 1 + Math.random() * 2,
      });
    }
    gameStateRef.current.particles.push(...particles);
  }, []);

  // 生成敌人
  const spawnEnemy = useCallback(() => {
    const enemy: Enemy = {
      x: Math.random() * (dimensions.width - ENEMY_SIZE),
      y: -ENEMY_SIZE,
      width: ENEMY_SIZE,
      height: ENEMY_SIZE,
      speed: ENEMY_BASE_SPEED + Math.random() + Math.floor(gameStateRef.current.score / 1000) * 0.2,
      active: true,
      hp: 1 + Math.floor(gameStateRef.current.score / 2000),
      maxHp: 1 + Math.floor(gameStateRef.current.score / 2000),
    };
    gameStateRef.current.enemies.push(enemy);
  }, [dimensions]);

  // 射击
  const shoot = useCallback(() => {
    const now = Date.now();
    if (now - gameStateRef.current.lastShot > AUTO_SHOOT_INTERVAL) {
      gameStateRef.current.bullets.push({
        x: gameStateRef.current.player.x,
        y: gameStateRef.current.player.y - PLAYER_SIZE / 2,
        width: BULLET_SIZE,
        height: 10,
        speed: BULLET_SPEED,
        active: true,
      });
      gameStateRef.current.lastShot = now;
    }
  }, []);

  // 碰撞检测
  const checkCollision = (a: GameObject, b: GameObject): boolean => {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  };

  // 游戏主循环
  const gameLoop = useCallback(() => {
    if (!enabled || gameState !== "playing") {
      animationRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const state = gameStateRef.current;
    state.frameCount++;

    // 清空画布 - 使用完全透明
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // 绘制星星背景
    state.stars.forEach((star) => {
      star.y += star.speed;
      if (star.y > dimensions.height) {
        star.y = 0;
        star.x = Math.random() * dimensions.width;
      }
      
      ctx.globalAlpha = star.opacity * 0.5; // 降低透明度
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(star.x, star.y, star.size, star.size);
    });
    ctx.globalAlpha = 1;

    // 玩家跟随鼠标（平滑移动）
    const targetX = state.mouseX;
    const targetY = Math.max(dimensions.height * 0.6, Math.min(state.mouseY, dimensions.height - 50));
    state.player.x += (targetX - state.player.x) * 0.08;
    state.player.y += (targetY - state.player.y) * 0.08;

    // 自动射击
    shoot();

    // 绘制玩家飞船（半透明）
    ctx.save();
    ctx.translate(state.player.x, state.player.y);
    ctx.globalAlpha = 0.4; // 半透明
    
    // 飞船主体
    ctx.fillStyle = "#00D9FF";
    ctx.beginPath();
    ctx.moveTo(0, -PLAYER_SIZE / 2);
    ctx.lineTo(-PLAYER_SIZE / 3, PLAYER_SIZE / 2);
    ctx.lineTo(0, PLAYER_SIZE / 3);
    ctx.lineTo(PLAYER_SIZE / 3, PLAYER_SIZE / 2);
    ctx.closePath();
    ctx.fill();
    
    // 引擎火焰
    ctx.fillStyle = "#FF6B35";
    ctx.beginPath();
    ctx.moveTo(-PLAYER_SIZE / 4, PLAYER_SIZE / 3);
    ctx.lineTo(0, PLAYER_SIZE / 2 + Math.sin(state.frameCount * 0.2) * 5);
    ctx.lineTo(PLAYER_SIZE / 4, PLAYER_SIZE / 3);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();

    // 更新和绘制子弹（半透明）
    state.bullets = state.bullets.filter((bullet) => {
      bullet.y -= bullet.speed;
      
      if (bullet.active && bullet.y > -bullet.height) {
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = "#00FF88";
        ctx.fillRect(bullet.x - bullet.width / 2, bullet.y, bullet.width, bullet.height);
        ctx.globalAlpha = 1;
        return true;
      }
      return false;
    });

    // 生成敌人
    state.enemySpawnTimer++;
    const spawnRate = Math.max(40, 80 - Math.floor(state.score / 500));
    if (state.enemySpawnTimer > spawnRate) {
      spawnEnemy();
      state.enemySpawnTimer = 0;
    }

    // 更新和绘制敌人（半透明）
    state.enemies = state.enemies.filter((enemy) => {
      enemy.y += enemy.speed;

      // 检查子弹击中
      state.bullets.forEach((bullet) => {
        if (bullet.active && checkCollision(bullet, enemy)) {
          bullet.active = false;
          enemy.hp--;
          
          if (enemy.hp <= 0) {
            createExplosion(enemy.x + ENEMY_SIZE / 2, enemy.y + ENEMY_SIZE / 2, "#FF6B6B");
            state.score += 10;
            if (state.score % 100 === 0) {
              setScore(state.score);
            }
          }
        }
      });

      if (enemy.active && enemy.hp > 0 && enemy.y < dimensions.height) {
        ctx.save();
        ctx.translate(enemy.x + ENEMY_SIZE / 2, enemy.y + ENEMY_SIZE / 2);
        ctx.globalAlpha = 0.35;
        
        ctx.fillStyle = "#FF4757";
        ctx.beginPath();
        ctx.moveTo(0, ENEMY_SIZE / 2);
        ctx.lineTo(-ENEMY_SIZE / 3, -ENEMY_SIZE / 2);
        ctx.lineTo(0, -ENEMY_SIZE / 3);
        ctx.lineTo(ENEMY_SIZE / 3, -ENEMY_SIZE / 2);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
        return true;
      }
      
      return false;
    });

    // 更新和绘制粒子
    state.particles = state.particles.filter((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      
      if (p.life > 0) {
        ctx.globalAlpha = (p.life / p.maxLife) * 0.4;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        ctx.globalAlpha = 1;
        return true;
      }
      return false;
    });

    // 偶尔更新分数显示
    if (state.frameCount % 60 === 0) {
      setScore(state.score);
    }

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [enabled, gameState, dimensions, shoot, spawnEnemy, createExplosion]);

  // 鼠标跟踪
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      gameStateRef.current.mouseX = e.clientX;
      gameStateRef.current.mouseY = e.clientY;
    };

    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    if (enabled) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      window.addEventListener("resize", handleResize);
      handleResize();
      initStars();
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [enabled, initStars]);

  // 游戏循环
  useEffect(() => {
    animationRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameLoop]);

  // 开始/停止游戏
  const toggleGame = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    if (newEnabled) {
      setGameState("playing");
      initStars();
    } else {
      setGameState("idle");
    }
    onToggle?.(newEnabled);
  };

  // 暂停/继续
  const togglePause = () => {
    setGameState((prev) => (prev === "playing" ? "paused" : "playing"));
  };

  return (
    <>
      {/* 背景游戏画布 */}
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ 
          opacity: enabled ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      />

      {/* 控制按钮 - 固定在左下角，避免与回到顶部按钮重叠 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-8 left-8 z-50 flex items-center gap-2"
      >
        {/* 分数显示 */}
        {enabled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass px-3 py-1.5 rounded-full text-sm font-medium mr-2"
          >
            Score: {score}
          </motion.div>
        )}

        {/* 设置面板 */}
        <AnimatePresence>
          {showControls && enabled && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2"
            >
              <Button
                size="sm"
                variant="outline"
                onClick={() => setMuted(!muted)}
                className="rounded-full w-10 h-10 p-0"
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={togglePause}
                className="rounded-full w-10 h-10 p-0"
              >
                {gameState === "playing" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 主开关按钮 */}
        <Button
          onClick={toggleGame}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
          className={`rounded-full w-12 h-12 p-0 transition-all duration-300 ${
            enabled 
              ? 'bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/30' 
              : 'bg-background/80 hover:bg-background'
          }`}
        >
          {enabled ? <Gamepad2 className="w-5 h-5" /> : <Rocket className="w-5 h-5" />}
        </Button>
      </motion.div>

      {/* 提示文字 */}
      <AnimatePresence>
        {enabled && gameState === "playing" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-24 left-8 z-40 text-xs text-muted-foreground glass px-3 py-1.5 rounded-full pointer-events-none"
          >
            移动鼠标控制飞船 · 自动射击
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

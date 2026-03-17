import { useEffect, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Rocket, Target, Zap, Trophy, X, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

// 游戏状态类型
type GameState = "idle" | "playing" | "paused" | "gameOver";

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

// 游戏配置
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PLAYER_SIZE = 40;
const BULLET_SIZE = 6;
const ENEMY_SIZE = 35;
const PLAYER_SPEED = 8;
const BULLET_SPEED = 12;
const ENEMY_BASE_SPEED = 2;

export function SpaceShooterGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [gameState, setGameState] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("spaceShooterHighScore") || "0");
  });
  const [showGame, setShowGame] = useState(false);

  // 游戏状态引用（用于在事件循环中访问最新状态）
  const gameStateRef = useRef({
    player: { x: GAME_WIDTH / 2, y: GAME_HEIGHT - 80 },
    bullets: [] as Bullet[],
    enemies: [] as Enemy[],
    particles: [] as Particle[],
    keys: {} as Record<string, boolean>,
    lastShot: 0,
    enemySpawnTimer: 0,
    score: 0,
    gameOver: false,
  });

  // 创建粒子爆炸效果
  const createExplosion = useCallback((x: number, y: number, color: string = "#FF6B6B") => {
    const particles: Particle[] = [];
    for (let i = 0; i < 15; i++) {
      const angle = (Math.PI * 2 * i) / 15;
      const speed = 2 + Math.random() * 4;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 30,
        maxLife: 30,
        color,
        size: 2 + Math.random() * 4,
      });
    }
    gameStateRef.current.particles.push(...particles);
  }, []);

  // 生成敌人
  const spawnEnemy = useCallback(() => {
    const enemy: Enemy = {
      x: Math.random() * (GAME_WIDTH - ENEMY_SIZE),
      y: -ENEMY_SIZE,
      width: ENEMY_SIZE,
      height: ENEMY_SIZE,
      speed: ENEMY_BASE_SPEED + Math.random() * 2 + Math.floor(gameStateRef.current.score / 500),
      active: true,
      hp: 1 + Math.floor(gameStateRef.current.score / 1000),
      maxHp: 1 + Math.floor(gameStateRef.current.score / 1000),
    };
    gameStateRef.current.enemies.push(enemy);
  }, []);

  // 射击
  const shoot = useCallback(() => {
    const now = Date.now();
    if (now - gameStateRef.current.lastShot > 150) {
      gameStateRef.current.bullets.push({
        x: gameStateRef.current.player.x + PLAYER_SIZE / 2 - BULLET_SIZE / 2,
        y: gameStateRef.current.player.y,
        width: BULLET_SIZE,
        height: 15,
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
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const state = gameStateRef.current;

    // 清空画布
    ctx.fillStyle = "rgba(15, 23, 42, 0.3)";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // 绘制星空背景
    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < 50; i++) {
      const x = (Math.sin(i * 123.45 + Date.now() * 0.001) * 0.5 + 0.5) * GAME_WIDTH;
      const y = ((Date.now() * 0.05 + i * 37) % GAME_HEIGHT);
      const size = Math.random() * 2;
      ctx.globalAlpha = Math.random() * 0.5 + 0.2;
      ctx.fillRect(x, y, size, size);
    }
    ctx.globalAlpha = 1;

    // 玩家移动
    if (state.keys["ArrowLeft"] || state.keys["a"]) {
      state.player.x = Math.max(0, state.player.x - PLAYER_SPEED);
    }
    if (state.keys["ArrowRight"] || state.keys["d"]) {
      state.player.x = Math.min(GAME_WIDTH - PLAYER_SIZE, state.player.x + PLAYER_SPEED);
    }
    if (state.keys["ArrowUp"] || state.keys["w"]) {
      state.player.y = Math.max(GAME_HEIGHT / 2, state.player.y - PLAYER_SPEED);
    }
    if (state.keys["ArrowDown"] || state.keys["s"]) {
      state.player.y = Math.min(GAME_HEIGHT - PLAYER_SIZE, state.player.y + PLAYER_SPEED);
    }
    if (state.keys[" "] || state.keys["Space"]) {
      shoot();
    }

    // 绘制玩家飞船
    ctx.save();
    ctx.translate(state.player.x + PLAYER_SIZE / 2, state.player.y + PLAYER_SIZE / 2);
    
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
    ctx.lineTo(0, PLAYER_SIZE / 2 + Math.random() * 10);
    ctx.lineTo(PLAYER_SIZE / 4, PLAYER_SIZE / 3);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();

    // 更新和绘制子弹
    state.bullets = state.bullets.filter((bullet) => {
      bullet.y -= bullet.speed;
      
      if (bullet.active && bullet.y > -bullet.height) {
        // 子弹发光效果
        ctx.shadowColor = "#00FF88";
        ctx.shadowBlur = 10;
        ctx.fillStyle = "#00FF88";
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        ctx.shadowBlur = 0;
        return true;
      }
      return false;
    });

    // 生成敌人
    state.enemySpawnTimer++;
    const spawnRate = Math.max(30, 60 - Math.floor(state.score / 200));
    if (state.enemySpawnTimer > spawnRate) {
      spawnEnemy();
      state.enemySpawnTimer = 0;
    }

    // 更新和绘制敌人
    state.enemies = state.enemies.filter((enemy) => {
      enemy.y += enemy.speed;

      // 检查与玩家碰撞
      if (checkCollision(enemy, { ...state.player, width: PLAYER_SIZE, height: PLAYER_SIZE, speed: 0, active: true })) {
        createExplosion(state.player.x + PLAYER_SIZE / 2, state.player.y + PLAYER_SIZE / 2, "#00D9FF");
        state.gameOver = true;
        return false;
      }

      // 检查子弹击中
      state.bullets.forEach((bullet) => {
        if (bullet.active && checkCollision(bullet, enemy)) {
          bullet.active = false;
          enemy.hp--;
          
          if (enemy.hp <= 0) {
            createExplosion(enemy.x + ENEMY_SIZE / 2, enemy.y + ENEMY_SIZE / 2, "#FF6B6B");
            state.score += 10 * enemy.maxHp;
            setScore(state.score);
          }
        }
      });

      if (enemy.active && enemy.hp > 0 && enemy.y < GAME_HEIGHT) {
        // 绘制敌人
        ctx.save();
        ctx.translate(enemy.x + ENEMY_SIZE / 2, enemy.y + ENEMY_SIZE / 2);
        
        // 敌人主体
        ctx.fillStyle = "#FF4757";
        ctx.beginPath();
        ctx.moveTo(0, ENEMY_SIZE / 2);
        ctx.lineTo(-ENEMY_SIZE / 3, -ENEMY_SIZE / 2);
        ctx.lineTo(0, -ENEMY_SIZE / 3);
        ctx.lineTo(ENEMY_SIZE / 3, -ENEMY_SIZE / 2);
        ctx.closePath();
        ctx.fill();
        
        // HP 条
        if (enemy.maxHp > 1) {
          ctx.fillStyle = "#333";
          ctx.fillRect(-ENEMY_SIZE / 2, -ENEMY_SIZE / 2 - 8, ENEMY_SIZE, 4);
          ctx.fillStyle = "#FF6B6B";
          ctx.fillRect(-ENEMY_SIZE / 2, -ENEMY_SIZE / 2 - 8, ENEMY_SIZE * (enemy.hp / enemy.maxHp), 4);
        }
        
        ctx.restore();
        return true;
      }
      
      // 敌人到达底部
      if (enemy.y >= GAME_HEIGHT) {
        state.score = Math.max(0, state.score - 5);
        setScore(state.score);
      }
      
      return false;
    });

    // 更新和绘制粒子
    state.particles = state.particles.filter((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      
      if (p.life > 0) {
        ctx.globalAlpha = p.life / p.maxLife;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        ctx.globalAlpha = 1;
        return true;
      }
      return false;
    });

    // 绘制分数
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px system-ui";
    ctx.fillText(`Score: ${state.score}`, 20, 40);

    // 检查游戏结束
    if (state.gameOver) {
      setGameState("gameOver");
      if (state.score > highScore) {
        setHighScore(state.score);
        localStorage.setItem("spaceShooterHighScore", String(state.score));
      }
      return;
    }

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, highScore, shoot, spawnEnemy, createExplosion]);

  // 键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      gameStateRef.current.keys[e.key] = true;
      if (e.key === " " || e.key === "Space") {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      gameStateRef.current.keys[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // 游戏循环
  useEffect(() => {
    if (gameState === "playing") {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, gameLoop]);

  // 开始游戏
  const startGame = () => {
    gameStateRef.current = {
      player: { x: GAME_WIDTH / 2, y: GAME_HEIGHT - 80 },
      bullets: [],
      enemies: [],
      particles: [],
      keys: {},
      lastShot: 0,
      enemySpawnTimer: 0,
      score: 0,
      gameOver: false,
    };
    setScore(0);
    setGameState("playing");
  };

  // 暂停/继续
  const togglePause = () => {
    setGameState((prev) => (prev === "playing" ? "paused" : "playing"));
  };

  return (
    <>
      {/* 触发按钮 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <Button
          onClick={() => setShowGame(true)}
          className="rounded-full w-14 h-14 bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg"
        >
          <Rocket className="w-6 h-6" />
        </Button>
      </motion.div>

      {/* 游戏弹窗 */}
      <AnimatePresence>
        {showGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setShowGame(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-card rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 关闭按钮 */}
              <button
                onClick={() => setShowGame(false)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* 游戏标题 */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <span className="font-bold text-lg">太空射击</span>
                {highScore > 0 && (
                  <span className="text-sm text-muted-foreground ml-2">
                    最高分: {highScore}
                  </span>
                )}
              </div>

              {/* 游戏画布 */}
              <canvas
                ref={canvasRef}
                width={GAME_WIDTH}
                height={GAME_HEIGHT}
                className="block bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"
              />

              {/* 游戏状态覆盖层 */}
              {gameState !== "playing" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                  {gameState === "idle" && (
                    <div className="text-center">
                      <Rocket className="w-16 h-16 mx-auto mb-4 text-primary" />
                      <h3 className="text-2xl font-bold mb-2">太空射击</h3>
                      <p className="text-muted-foreground mb-6">
                        WASD / 方向键移动，空格射击
                      </p>
                      <Button onClick={startGame} className="gap-2">
                        <Play className="w-4 h-4" />
                        开始游戏
                      </Button>
                    </div>
                  )}

                  {gameState === "paused" && (
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-4">游戏暂停</h3>
                      <Button onClick={togglePause} className="gap-2">
                        <Play className="w-4 h-4" />
                        继续游戏
                      </Button>
                    </div>
                  )}

                  {gameState === "gameOver" && (
                    <div className="text-center">
                      <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                      <h3 className="text-2xl font-bold mb-2">游戏结束</h3>
                      <p className="text-xl mb-2">最终得分: {score}</p>
                      {score === highScore && score > 0 && (
                        <p className="text-yellow-500 mb-4">🎉 新纪录！</p>
                      )}
                      <div className="flex gap-3">
                        <Button onClick={startGame} variant="default">
                          再玩一次
                        </Button>
                        <Button onClick={() => setShowGame(false)} variant="outline">
                          退出
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 控制按钮 */}
              {gameState === "playing" && (
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Zap className="w-4 h-4" />
                    <span>得分: {score}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={togglePause}
                    className="gap-2"
                  >
                    <Pause className="w-4 h-4" />
                    暂停
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

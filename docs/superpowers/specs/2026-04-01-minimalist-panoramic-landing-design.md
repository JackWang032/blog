# 极简全景首页重写设计文档

## 概述

将博客首页重写为极简全景风格，融合全屏粒子特效、视差背景和 Pretext 文字动画，移除所有冗余内容，只保留最基本的博客标题和引导按钮。

## 需求分析

### 核心需求

1. **全景特效**：全屏粒子全景 + 视差全景背景 + 全屏文字动画
2. **极简结构**：移除所有现有区域（Hero、Features、Timeline、Latest Posts、Skills、About、CTA、Footer）
3. **Pretext 创意**：使用 `@chenglou/pretext` 实现粒子标题效果
4. **内容精简**：只包含博客大标题、副标题（可选）和引导按钮

### 用户期望

- 视觉震撼的全屏粒子效果
- 流畅的鼠标交互体验
- 极简但富有创意的首页
- 高性能，流畅运行

## 架构设计

### 组件层次结构

```
Landing (新)
├── ParallaxBackground (重写 - 视差背景层)
│   ├── GradientBackground (渐变背景)
│   ├── ParticleField (粒子场)
│   │   ├── 远景粒子层
│   │   ├── 中景粒子层
│   │   └── 近景粒子层
│   └── ConnectionLines (动态连线)
│
├── FullscreenParticleTitle (新建 - 全屏粒子标题层)
│   ├── MainTitle (主标题粒子)
│   └── SubTitle (副标题粒子)
│
└── LandingCTA (新建 - 引导按钮层)
    └── GlassButton (玻璃态按钮)
```

### 页面布局

```
┌─────────────────────────────────────────┐
│ ParallaxBackground (z-index: 0)        │
│ ┌─────────────────────────────────────┐ │
│ │ [渐变背景 + 网格背景]              │ │
│ │ [三层粒子系统]                     │ │
│ │ [动态连线效果]                     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ FullscreenParticleTitle (z-index: 1)   │
│ ┌─────────────────────────────────────┐ │
│ │        JACK'S BLOG                  │ │
│ │     探索 · 分享 · 成长              │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ LandingCTA (z-index: 2)                │
│ ┌─────────────────────────────────────┐ │
│ │         [进入博客 →]               │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## 组件设计

### 1. ParallaxBackground (重写)

**目标**：创建沉浸式的视差粒子背景

**功能特性**：

- 三层粒子系统（远/中/近景）
- 粒子数量：总计 50-80 个
- 鼠标交互：吸引和排斥效果
- 动态连线：距离近的粒子间显示连线
- 性能优化：降级处理、GPU 加速

**技术实现**：

```typescript
interface Particle {
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    vx: number;
    vy: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
    hue: number;
    layer: "far" | "mid" | "near"; // 远/中/近景
}

// 粒子层次配置
const LAYER_CONFIG = {
    far: { count: 20, speed: 0.05, size: 1, opacity: 0.2 },
    mid: { count: 30, speed: 0.1, size: 1.5, opacity: 0.3 },
    near: { count: 20, speed: 0.2, size: 2, opacity: 0.4 },
};
```

**交互逻辑**：

1. 鼠标移动时，近景粒子被排斥，中景粒子轻微排斥，远景粒子无影响
2. 粒子间距离 < 150px 时显示连线，线条透明度随距离增加而降低
3. 鼠标静止时，粒子缓慢回到初始位置

### 2. FullscreenParticleTitle (新建)

**目标**：使用 Pretext 创建震撼的全屏粒子标题

**功能特性**：

- 使用 `@chenglou/pretext` 测量和布局文字
- 粒子从随机位置汇聚成文字
- 鼠标交互：粒子被排斥后自动回归
- 支持主标题和副标题
- 入场动画效果

**技术实现**：

```typescript
import { prepareWithSegments, layoutWithLines } from "@chenglou/pretext";

interface TitleParticle {
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    originX: number;
    originY: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    alpha: number;
    delay: number;
}

// 标题配置
const TITLE_CONFIG = {
    mainText: "JACK'S BLOG",
    subText: "探索 · 分享 · 成长",
    fontSize: Math.min(window.innerWidth * 0.12, 180),
    particleSize: 2,
    gap: 3,
    animationDuration: 2000,
};
```

**渲染流程**：

1. 使用 Pretext 测量文字尺寸
2. 在 Canvas 上绘制文字并采样像素点
3. 为每个采样点创建粒子对象
4. 粒子从随机位置动画汇聚到目标位置
5. 添加波动效果和鼠标交互

**性能优化**：

- 预渲染 gradient 对象，避免每帧创建
- 批量绘制粒子，减少状态切换
- 使用对象池复用粒子对象

### 3. LandingCTA (新建)

**目标**：创建玻璃态引导按钮

**功能特性**：

- 玻璃态设计（glassmorphism）
- Framer Motion 动画效果
- Hover 状态：发光 + 上浮
- 响应式布局

**技术实现**：

```typescript
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function LandingCTA() {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-[20vh] left-1/2 -translate-x-1/2 z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <Button
          className="glass-button"
          onClick={() => navigate("/blog")}
        >
          进入博客
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>
    </div>
  );
}
```

**样式设计**：

```css
.glass-button {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 16px 32px;
    font-size: 18px;
    transition: all 0.3s ease;
}

.glass-button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 217, 255, 0.3);
}
```

### 4. Landing (重写)

**目标**：组合所有组件，创建极简全景首页

**实现**：

```typescript
function Landing() {
  return (
    <div className="landing-page h-screen w-screen overflow-hidden relative">
      <ParallaxBackground />
      <FullscreenParticleTitle
        mainText="JACK'S BLOG"
        subText="探索 · 分享 · 成长"
      />
      <LandingCTA />
    </div>
  );
}
```

**移除的内容**：

- Hero 区域
- Features 区域
- Timeline 区域
- LatestPosts 区域
- SkillsSection 区域
- About 区域
- CTA 区域
- Footer 区域

## 视觉设计

### 配色方案

**主题色**：

- 背景：深色系 `#0a0a0a` → `#1a1a2e` 渐变
- 主色调：青色 `#00d9ff`
- 辅助色：紫色 `#a855f7`
- 强调色：品红 `#ec4899`

**粒子颜色**：

- 青色系：`hsl(185-210, 100%, 50-70%)`
- 紫色系：`hsl(270-290, 80%, 60-70%)`

**玻璃态按钮**：

- 背景：`rgba(255, 255, 255, 0.1)`
- 边框：`rgba(255, 255, 255, 0.2)`
- 模糊：`blur(20px)`

### 动画设计

**粒子入场**：

1. 粒子从随机位置出现
2. 延迟序列汇聚到目标位置（duration: 2000ms）
3. 使用 ease-out 缓动函数

**粒子交互**：

1. 鼠标接近时，粒子被排斥（force: 50px）
2. 粒子速度衰减（damping: 0.92）
3. 粒子缓慢回归（spring: 0.08）

**背景粒子**：

1. 持续缓慢移动（speed: 0.05-0.2）
2. 鼠标跟随光晕（lerp: 0.15）
3. 粒子间动态连线（distance: 150px）

**按钮动画**：

1. 延迟入场（delay: 2000ms）
2. Hover 上浮（translateY: -4px）
3. 发光效果（box-shadow）

### 响应式设计

**断点**：

- 移动端（< 768px）：粒子数量减半，标题字号 60px
- 平板（768px - 1024px）：粒子数量正常，标题字号 100px
- 桌面（> 1024px）：粒子数量增加，标题字号 140-180px

## 性能优化

### Canvas 渲染优化

**GPU 加速**：

- 使用 `will-change: transform`
- 使用 `transform: translate3d()` 触发硬件加速
- Canvas 使用 `image-rendering: crisp-edges`

**渲染优化**：

- 批量绘制粒子，减少 `beginPath()` 调用
- 预渲染 gradient 对象，避免每帧创建
- 使用离屏 Canvas 缓存静态元素
- 降低帧率：30fps（每 2 帧渲染一次）

**内存优化**：

- 粒子对象池，复用对象
- 及时清理事件监听器
- 使用 `useRef` 避免不必要重渲染

### 交互优化

**事件优化**：

- 鼠标事件使用 `passive: true`
- 使用 `requestAnimationFrame` 节流
- 降低交互检测频率

**计算优化**：

- 使用距离平方代替距离（避免 `Math.sqrt`）
- 空间分区优化连线检测
- 提前退出条件判断

### 降级策略

**低性能设备**：

- 检测设备性能（`navigator.hardwareConcurrency`）
- 减少粒子数量（50%）
- 禁用连线效果
- 禁用副标题粒子

**性能监控**：

```typescript
let frameCount = 0;
let lastTime = performance.now();
let fps = 60;

function checkPerformance() {
    frameCount++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastTime = now;

        // 如果 FPS < 30，启用降级模式
        if (fps < 30) {
            enableLowPerformanceMode();
        }
    }
}
```

## 实现计划

### 阶段 1：核心组件开发（2-3 小时）

**任务 1.1：重写 ParallaxBackground**

- [ ] 创建三层粒子系统
- [ ] 实现鼠标交互
- [ ] 添加动态连线效果
- [ ] 性能优化

**任务 1.2：创建 FullscreenParticleTitle**

- [ ] 使用 Pretext 测量文字
- [ ] 实现粒子汇聚动画
- [ ] 添加鼠标交互
- [ ] 支持副标题

**任务 1.3：创建 LandingCTA**

- [ ] 玻璃态按钮样式
- [ ] Framer Motion 动画
- [ ] 响应式布局

### 阶段 2：Landing 页面重写（1 小时）

**任务 2.1：重写 Landing 组件**

- [ ] 移除所有现有内容
- [ ] 组合三个新组件
- [ ] 调整 z-index 和布局
- [ ] 移除未使用的 imports

**任务 2.2：样式调整**

- [ ] 添加全局样式
- [ ] 响应式媒体查询
- [ ] 暗色模式适配

### 阶段 3：测试和优化（1-2 小时）

**任务 3.1：功能测试**

- [ ] 粒子效果测试
- [ ] 鼠标交互测试
- [ ] 按钮跳转测试

**任务 3.2：性能测试**

- [ ] FPS 监控
- [ ] 内存使用监控
- [ ] 低性能设备测试

**任务 3.3：兼容性测试**

- [ ] Chrome 测试
- [ ] Firefox 测试
- [ ] Safari 测试
- [ ] 移动端测试

**任务 3.4：优化调整**

- [ ] 根据测试结果优化性能
- [ ] 调整粒子数量和效果
- [ ] 完善降级策略

## 风险和缓解

### 风险 1：性能问题

**风险**：大量粒子可能导致性能下降

**缓解措施**：

- 严格的性能优化策略
- 降级处理机制
- 移动端减少粒子数量

### 风险 2：兼容性问题

**风险**：某些浏览器不支持特定特性

**缓解措施**：

- 使用标准 Canvas API
- 检测特性支持情况
- 提供回退方案

### 风险 3：Pretext 库兼容性

**风险**：`@chenglou/pretext` 库可能不稳定或功能有限

**缓解措施**：

- 充分测试库的功能
- 准备备用方案（手动测量文字）
- 必要时可以不使用 pretext

## 成功标准

### 功能标准

- ✅ 全屏粒子背景正常工作
- ✅ Pretext 粒子标题正常显示
- ✅ 鼠标交互流畅响应
- ✅ 引导按钮功能正常

### 性能标准

- ✅ FPS >= 30（桌面端）
- ✅ FPS >= 20（移动端）
- ✅ 内存使用 < 100MB
- ✅ 首次加载时间 < 2s

### 视觉标准

- ✅ 粒子效果震撼
- ✅ 动画流畅自然
- ✅ 响应式布局完美
- ✅ 暗色模式适配良好

## 后续优化

### 短期优化（可选）

- 添加粒子颜色主题切换
- 添加更多交互效果
- 优化移动端体验

### 长期优化（可选）

- 使用 WebGL 提升性能
- 添加 3D 粒子效果
- 添加音效反馈

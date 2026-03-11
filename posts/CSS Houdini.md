> Houdini 是一组CSS引擎相关的底层 API，让开发者能够访问浏览器的核心，从而让开发者参与创新过程，并给予更高的开发自由度。

## 它为何出现？

    对于一个新的css特性的出现，从起稿到各个浏览器都支持需要花费很长的时间，往往需要好几年，并且各个浏览器厂商对该特性的表现方式可能也会有差异，那我想提前使用或者兼容这些差异该如何做？ 使用polyfill去兼容？ 相比js polyfill ，css的polyfill的实现非常困难，仅通过DOM和CSSOM提供的部分api可能还无法实现，并且会带来性能问题。

页面绘制的过程我们可以分解为下面几个阶段：

- 第一阶段是解析，浏览器读取和解析 HTML 和 CSS 文件
- 浏览器从中构建出DOM和CSSOM
- 根据DOM和CSSOM合并成渲染树
- 然后，浏览器通过 3 个步骤绘制页面中的每个元素：
    - _layout_，浏览器应用布局规则（display、大小、边距等）
    - _Paint_，浏览器应用绘制规则（背景、边框、图像等）
    - _Composite_，一个合成阶段，它将根据特定 CSS 属性（转换、不透明度等）创建的层堆叠在一起。通常由 GPU 在单独的线程中执行。

从下图中可以看到，我们只能访问DOM和和部分的CSSOM API

![](baa5918637403e01a150615adac0149d.png)

，CSS Houdini 将为我们开放了下面所有的步骤（但目前只实现了一部分）

![](a33f6a1efd2cba22e45639ccf40e7839.png)

## 它带来了什么哪些API？

### CSS Typed OM

CSS Typed OM可以看作有类型的CSS，它将属性的类型和值进行分离。

当我们使用js去操控css时，经常需要自己去进行类型转换，比如下面这段代码

```js
el.style.opacity = 0.1;
typeof el.style.opacity; // string

// 当我想要让不透明度增加时
el.style.opacity = Number((el.style.opacity = "0.1")) + 0.1;
```

使用Typed OM后

```js
el.attributeStyleMap.get("opacity"); // CSSUnitValue {value: 0.1, unit: 'number'}
el.attributeStyleMap.set("opacity", 0.2);

// 复杂点的属性
// CSSOM
el.style.setProperty("transform", "translate(" + x + "px, " + y + "px)");
// Typed OM
el.attributeStyleMap.set("transform", new CSSTranslate(CSS.px(1), CSS.px(2)));
// calc(1px + 10%) => new CSSMathSum(CSS.px(1), CSS.percent(10))
```

**带来的好处**

1. 更少的 bug，正如前面所展示的操作，通过 TypedOM 进行操作减少此类型的问题；
2. 更好的性能，由于减少了字符串操作，对于 CSSOM 的操作性能得到了更进一步的提升，由 Tab Akins 提供的[测试](https://link.juejin.im/?target=https%3A%2F%2Fgithub.com%2Fw3c%2Fcss-houdini-drafts%2Fissues%2F634%23issuecomment-366358609)表明，操作 Typed OM 比直接操作 CSSOM 字符串带来了大约 30% 的速度提升；
3. 键名与常规 CSS 写法保持一致，不用在 backgroundColor 和 background-color 的边缘试探；
4. 由于 `attributeStyleMap` 以及 `computedStyleMap` 对象是个 `map`，这样意味着我们可以使用标准 `map` 中提供的所有方法。

### 自定义属性 [@property ](/property)

我们平常使用 `--` 开头的属性 如 --my-padding， 你可以给它赋予任何的值，并使用var去引用该属性的值

```css
::root {
    --my-padding: 16px;
}

.app {
    padding: var(--my-padding);
}
```

这样就会带来一个问题，我定义的这个属性它到底是什么类型的？这对于CSS引擎来说它是无法得知的

```css
::root {
	--my-padding: 16;
}

.app {
  padding: var(--my-padding)px;
  // 因为不知道是什么类型，CSS引擎不知道如何去过渡
  transtion: --my-padding 1s;
}

.app: hover {
  --my-padding: 18;
}
```

[@property ](/property) 允许我们指定类型来注册新的自定义属性

```css
@property --property-name {
  syntax: '<color>';
  inherits: false;
  initial-value: #c0ffee;
}

// 也可以使用js注册
CSS.registerProperty({
  name: '--my-color',
  syntax: '<color>',
  inherits: false,
  initialValue: '#c0ffee',
});
```

syntax可取值如下

- length   长度 如16px, 20vm
- number 数字
- percentage 百分比
- length-percentage 长度或百分比
- color
- image  图像引用如 url(a.png)，linear-gradient()
- url
- integer
- angle
- time
- resolution
- transform-list
- transform-function
- custom-ident

详细的类型定义可参考[mdn](https://developer.mozilla.org/zh-CN/docs/Web/CSS/custom-ident)

使用了@property后的一个很大好处是我们可以将任意的自定义属性添加过渡效果了

不支持过渡的渐变色使用自定义属性后也能实现过渡了

```css
:root {
    --depth: 10px;
    --color: #000;
}
div {
    width: 300px;
    height: 300px;
    border: 1px solid #eee;
    background: repeating-radial-gradient(
        var(--color),
        var(--color) calc(var(--depth) / 2),
        white 5px,
        white var(--depth)
    );
    transition:
        --depth 3s,
        --color 3s;
}

div:hover {
    --depth: 100px;
    --color: purple;
}

@property --depth {
    syntax: "<length>";
    inherits: false;
    initial-value: 10px;
}
@property --color {
    syntax: "<color>";
    inherits: false;
    initial-value: #000;
}
```

![](215894eea277273a1b0a0536143c812a.gif)

### Worklets

**Worklets**是轻量级的 **Web Workers**，它提供了让开发者接触底层渲染机制的API，Worklets的工作线程独立于主线程之外，适用于做一些高性能的图形渲染工作, Worklets会在适当的时候被CSS渲染引擎调用，下面的几种API都依赖于worklet。

### Paint API

CSS Paint API旨在使开发人员能够以编程方式定义图像，然后可以在任何可以调用 CSS 图像的地方使用这些图像，例如 CSS 、background-image、border-image等mask-image。

要使用Paint API，我们需要完成几个步骤：

1. 使用registerPaint()自定义一个paint worklet
2. 注册我们在第一步定义的worklet，CSS.paintWorklet.addModule('paintWorklet.js')
3. 在css属性中使用paint() css函数

新建一个文件paintWorklet.js

```js
registerPaint(
    "blockBg",
    class {
        paint(ctx, geom, props) {
            const colors = ["red", "green", "blue"];
            const size = 32;
            for (let y = 0; y < geom.height / size; y++) {
                for (let x = 0; x < geom.width / size; x++) {
                    const color = colors[(x + y) % colors.length];
                    ctx.beginPath();
                    ctx.fillStyle = color;
                    ctx.rect(x * size, y * size, size, size);
                    ctx.fill();
                }
            }
        }
    }
);
```

在主函数中注册worklet

```js
if (CSS.paintWorklet) {
    CSS.paintWorklet.addModule("./paintWorklet.js");
}
```

在css中使用paint

```js
.app {
  width: 200px;
  height: 80px;
  border-radius: 10px;
  text-align: center;
  line-height: 80px;
  background: paint(blockBg);
}
```

我们通过canvas自己实现了一套背景效果

![](30f417a14264e9127ba646a84ee47c9a.png)

通过paint的第三个参数，我还能与自定义属性相结合，我们再实现个复杂点的案例

我们先创建一个圆, 建一个circleWorklet

```js
registerPaint(
    "circle",
    class {
        paint(ctx, geom, props) {
            // 获取圆心
            const x = geom.width / 2;
            const y = geom.height / 2;
            const radius = Math.min(x, y);

            ctx.fillStyle = "skyblue";
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
);
```

![](43bc1ae28902f0ae89f6d7ff52259512.png)

我们加入自定义属性来定义圆的颜色

```js
.circle {
    ...
    --circle-color: pink;
    background-image: paint(circle);
}

@property --circle-color {
    syntax: "<color>";
    inherits: false;
    initial-value: currentcolor;
}


// worklet
registerPaint("circle", class {
  	// 接受参数
    static get inputProperties() {
      return ["--circle-color"];
    }
    paint(ctx, geom, props) {
      ...
			// props.get返回的是用Typed CSSOM定义的属性值
      ctx.fillStyle = props.get("--circle-color").toString();
      ...
    }
  }
);
```

颜色变为粉红色了

![](1a4bcf13b37290b170aff6292baafba1.png)

紧接着，我们再把圆的圆心和坐标也提取为css变量

```js
registerPaint("circle", class {
    static get inputProperties() {
      return ['--circle-color', '--circle-radius', '--circle-x', '--circle-y'];
    }
    paint(ctx, geom, props) {
      // 获取圆心
      const x = props.get("--circle-x").value;
      const y = props.get("--circle-y").value;
      const radius = props.get("--circle-radius").value;
      ctx.fillStyle = props.get("--circle-color").toString();

      ...
    }
  }
);


// 添加动画效果
.circle {
    width: 300px;
    height: 200px;
    border: 1px solid #eee;
    margin: 0 500px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    resize: both;
    overflow: auto;
    --circle-color: pink;
    --circle-radius: 0;
    background-image: paint(circle);
}

.circle.animating {
    transition: --circle-radius 1s, --circle-color 1s;
    --circle-radius: 300;
    --circle-color: transparent;
}

@property --circle-color {
    syntax: "<color>";
    inherits: false;
    initial-value: currentcolor;
}

@property --circle-radius {
    syntax: "<number>";
    inherits: false;
    initial-value: 0;
}

@property --circle-x {
    syntax: "<number>";
    inherits: false;
    initial-value: 0;
}

@property --circle-y {
    syntax: "<number>";
    inherits: false;
    initial-value: 0;
}
```

然后在元素点击时获取光标位置，并添加动画

```js
el.addEventListener("click", (e) => {
    el.classList.add("animating");
    el.attributeStyleMap.set("--circle-x", e.offsetX);
    el.attributeStyleMap.set("--circle-y", e.offsetY);
    el.addEventListener("transitionend", () => {
        el.classList.remove("animating");
    });
});
```

最后实现了一种点击后产生涟漪的效果

![](dad7cd2061b7f06781ce25262817f24e.gif)

Paint API所能做到的远不止此，更多的创意可以看 [https://houdini.how/](https://houdini.how/)

### Layout API

Layout API 允许开发人员通过定义可在`display`CSS 属性中使用的新布局模式来扩展浏览器的布局渲染过程。Layout API 引入了新概念，非常复杂，并为开发自定义布局算法提供了很多选项。

与其他Worklet类似，布局Worklet需要先注册和定义

```js
// layoutWorklet.js
registerLayout('myLayout', class {
  static get inputProperties() { return ['--exampleVariable']; }

  static get childrenInputProperties() { return ['--exampleChildVariable']; }

  intrinsicSizes(children, edges, styleMap) {
    /* ... */
  }

  layout(children, edges, constraints, styleMap, breakToken) {
    /* ... */
  }
});


// index.js
CSS.layoutWorklet.addModule('layoutWorklet.js');

// css
.exampleElement {
  display: layout(myLayout);
}
```

让我们来实现一个简单的随机布局

```js
registerLayout(
    "randomLayout",
    class {
        async intrinsicSizes() {}
        async layout(children, edges, constraintSpace, styleMap) {
            const childFragments = [];
            for (const child of children) {
                const childFragment = await child.layoutNextFragment();
                childFragment.inlineOffset = Math.random() * constraintSpace.fixedInlineSize;
                childFragment.blockOffset = Math.random() * constraintSpace.fixedBlockSize;
                childFragments.push(childFragment);
            }

            return {
                childFragments,
            };
        }
    }
);
```

![](ab99f43e213557018d2f2f51967ad5a9.png)

该API仍在提案中 [w3c提案](https://www.w3.org/TR/2018/WD-css-layout-api-1-20180412/)  ， 文档目前还没有，要在浏览器中使用也需要先在chrome://flags中开启实验功能, 感兴趣的同学可以参考这篇文章 [https://www.zhangxinxu.com/wordpress/2020/09/houdini-css-layout-api/](https://www.zhangxinxu.com/wordpress/2020/09/houdini-css-layout-api/)

**那么最后，Houdini可以用了吗？**

建议还是暂时观望下，目前也许只有PaintAPI是能被浏览器广泛支持的(通过css-paint-polyfill)，兼容性可以参考下图, safari和firefox出来挨打.

![](085e5578bb847645be8f342eb8878f06.png)

参考

[更高效、更安全地操作 CSSOM ：CSS Typed OM](https://www.miaoroom.com/resource/code/cssom-css-typed-om)

[CSS Polyfill的痛楚](https://www.w3ctech.com/topic/1979)

[https://ishoudinireadyyet.com/](https://ishoudinireadyyet.com/)

[https://developer.mozilla.org/zh-CN/docs/Web/Guide/Houdini](https://developer.mozilla.org/zh-CN/docs/Web/Guide/Houdini)

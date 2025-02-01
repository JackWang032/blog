## React跨路由组件动画

### 回顾传统React动画

对于普通的React动画，我们大多使用官方推荐的**react-transition-group**，其提供了四个基本组件**Transition、CSSTransition、SwitchTransition、TransitionGroup**

#### **Transition**

Transition组件允许您使用简单的声明式 API来描述组件的状态变化，默认情况下，Transition组件不会改变它呈现的组件的行为，它只跟踪组件的“进入”和“退出”状态，我们需要做的是赋予这些状态意义。

其一共提供了四种状态,当组件感知到 **in** prop变化时就会进行相应的状态过渡

- `'entering'`
- `'entered'`
- `'exiting'`
- `'exited'`

```jsx
const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 0,
};

const transitionStyles = {
    entering: { opacity: 1 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
};

const Fade = ({ in: inProp }) => (
    <Transition in={inProp} timeout={duration}>
        {(state) => (
            <div
                style={{
                    ...defaultStyle,
                    ...transitionStyles[state],
                }}
            >
                I'm a fade Transition!
            </div>
        )}
    </Transition>
);
```

#### CSSTransition

此组件主要用来做CSS样式过渡，它能够在组件各个状态变化的时候给我们要过渡的标签添加上不同的类名。所以参数和平时的className不同，参数为：`classNames`

```jsx
<CSSTransition
  in={inProp}
  timeout={300}
  classNames="fade"
  unmountOnExit
>
  <div className="star">⭐</div>
</CSSTransition>

// 定义过渡样式类
.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  opacity: 1;
  transition: opacity 200ms;
}
.fade-exit {
  opacity: 1;
}
.fade-exit-active {
  opacity: 0;
  transition: opacity 200ms;
}
```

#### SwitchTransition

SwitchTransition用来做组件切换时的过渡，其会缓存传入的children，并在过渡结束后渲染新的children

```tsx
function App() {
    const [state, setState] = useState(false);
    return (
        <SwitchTransition>
            <CSSTransition key={state ? "Goodbye, world!" : "Hello, world!"} classNames="fade">
                <button onClick={() => setState((state) => !state)}>
                    {state ? "Goodbye, world!" : "Hello, world!"}
                </button>
            </CSSTransition>
        </SwitchTransition>
    );
}
```

#### TransitionGroup

如果有一组CSSTransition需要我们去过渡，那么我们需要管理每一个CSSTransition的in状态，这样会很麻烦。

TransitionGroup 可以帮我们管理一组Transition或CSSTransition组件，为此我们不再需要给Transition组件传入in属性来标识过渡状态，转用key属性来代替 in

```jsx
<TransitionGroup>
  {
      this.state.list.map((item, index) => {
          return (
            <CSSTransition
                key = {item.id}
                timeout  = {1000}
                classNames = 'fade'
                unmountOnExit
              >
                <TodoItem />
              </CSSTransition>
          )
        }
  }
</TransitionGroup>
```

TransitionGroup会监测其children的变化，将新的children与原有的children使用key进行比较，就能得出哪些children是新增的与删除的，从而为他们注入进场动画或离场动画。

![](001f74cd9cf81f34e352194587d75c92.jpg)

### FLIP 动画

**FLIP**是什么?

**FLIP**是 `First`、`Last`、`Invert`和 `Play`四个单词首字母的缩写

`First`， 元素过渡前开始位置信息

`Last`：执行一段代码，使元素位置发生变化，记录最后状态的位置等信息.

`Invert`：根据First和Last的位置信息，计算出位置差值，使用transform: translate(x,y) 将元素移动到First的位置。

`Play`:  给元素加上transition过渡属性，再讲transform置为none，这时候因为transition的存在，开始播放丝滑的动画。

> Flip动画可以看成是一种编写动画的范式，方法论，对于开始或结束状态未知的复杂动画，可以使用Flip快速实现

位置过渡效果

![](62774c468d67f7d5b448b3d95716e060.gif)

代码实现：

```javascript
const container = document.querySelector(".flip-container");
const btnAdd = document.querySelector("#add-btn");
const btnDelete = document.querySelector("#delete-btn");
let rectList = [];

function addItem() {
    const el = document.createElement("div");
    el.className = "flip-item";
    el.innerText = rectList.length + 1;
    el.style.width = Math.random() * 300 + 100 + "px";

    // 加入新元素前重新记录起始位置信息
    recordFirst();

    // 加入新元素
    container.prepend(el);
    rectList.unshift({
        top: undefined,
        left: undefined,
    });

    // 触发FLIP
    update();
}

function removeItem() {
    const children = container.children;
    if (children.length > 0) {
        recordFirst();
        container.removeChild(children[0]);
        rectList.shift();
        update();
    }
}

// 记录位置
function recordFirst() {
    const items = container.children;
    for (let i = 0; i < items.length; i++) {
        const rect = items[i].getBoundingClientRect();
        rectList[i] = {
            left: rect.left,
            top: rect.top,
        };
    }
}

function update() {
    const items = container.children;
    for (let i = 0; i < items.length; i++) {
        // Last
        const rect = items[i].getBoundingClientRect();
        if (rectList[i].left !== undefined) {
            // Invert
            const transformX = rectList[i].left - rect.left;
            const transformY = rectList[i].top - rect.top;

            items[i].style.transform = `translate(${transformX}px, ${transformY}px)`;
            items[i].style.transition = "none";

            // Play
            requestAnimationFrame(() => {
                items[i].style.transform = `none`;
                items[i].style.transition = "all .5s";
            });
        }
    }
}

btnAdd.addEventListener("click", () => {
    addItem();
});
btnDelete.addEventListener("click", () => {
    removeItem();
});
```

使用flip实现的动画demo

乱序动画：

![](0030e936d5527d50a18fba7604c9f312.gif)

缩放动画：

![](fdb5a495726b739dc6a54b0629450fcb.webp)

### React跨路由组件动画

在React中路由之前的切换动画可以使用react-transition-group来实现，但对于不同路由上的组件如何做到动画过渡是个很大的难题，目前社区中也没有一个成熟的方案。

![](83ab426b0e2ddca2c7319be9e517635c.gif)

#### 使用flip来实现

在路由A中组件的大小与位置状态可以当成**First**, 在路由B中组件的大小与位置状态可以当成**Last**，

从路由A切换至路由B时，向B页面传递First状态，B页面中需要过渡的组件再进行Flip动画。

为此我们可以抽象出一个组件来帮我们实现Flip动画，并且能够在切换路由时保存组件的状态。

对需要进行过渡的组件进行包裹, 使用相同的**flipId**来标识他们需要在不同的路由中过渡。

```jsx
<FlipRouteAnimate className="about-profile" flipId="avatar" animateStyle={{ borderRadius: "15px" }}>
    <img src={require("./touxiang.jpg")} alt="" />
</FlipRouteAnimate>
```

完整代码：

```jsx
import React, { createRef } from "react";
import withRouter from "./utils/withRouter";
class FlipRouteAnimate extends React.Component {
    constructor(props) {
        super(props);
        this.flipRef = createRef();
    }
    // 用来存放所有实例的rect
    static flipRectMap = new Map();
    componentDidMount() {
        const {
            flipId,
            location: { pathname },
            animateStyle: lastAnimateStyle,
        } = this.props;

        const lastEl = this.flipRef.current;

        // 没有上一个路由中组件的rect，说明不用进行动画过渡
        if (!FlipRouteAnimate.flipRectMap.has(flipId) || flipId === undefined) return;

        // 读取缓存的rect
        const first = FlipRouteAnimate.flipRectMap.get(flipId);
        if (first.route === pathname) return;

        // 开始FLIP动画
        const firstRect = first.rect;
        const lastRect = lastEl.getBoundingClientRect();

        const transformOffsetX = firstRect.left - lastRect.left;
        const transformOffsetY = firstRect.top - lastRect.top;

        const scaleRatioX = firstRect.width / lastRect.width;
        const scaleRatioY = firstRect.height / lastRect.height;

        lastEl.style.transform = `translate(${transformOffsetX}px, ${transformOffsetY}px) scale(${scaleRatioX}, ${scaleRatioY})`;
        lastEl.style.transformOrigin = "left top";

        for (const styleName in first.animateStyle) {
            lastEl.style[styleName] = first.animateStyle[styleName];
        }

        setTimeout(() => {
            lastEl.style.transition = "all 2s";
            lastEl.style.transform = `translate(0, 0) scale(1)`;
            // 可能有其他属性也需要过渡
            for (const styleName in lastAnimateStyle) {
                lastEl.style[styleName] = lastAnimateStyle[styleName];
            }
        }, 0);
    }

    componentWillUnmount() {
        const {
            flipId,
            location: { pathname },
            animateStyle = {},
        } = this.props;
        const el = this.flipRef.current;
        // 组件卸载时保存自己的位置等状态
        const rect = el.getBoundingClientRect();

        FlipRouteAnimate.flipRectMap.set(flipId, {
            // 当前路由路径
            route: pathname,
            // 组件的大小位置
            rect: rect,
            // 其他需要过渡的样式
            animateStyle,
        });
    }
    render() {
        return (
            <div
                className={this.props.className}
                style={{ display: "inline-block", ...this.props.style, ...this.props.animateStyle }}
                ref={this.flipRef}
            >
                {this.props.children}
            </div>
        );
    }
}
```

实现效果：

![](287576ba8bce3ed7df32de6d20b94316.gif)

#### 共享组件的方式实现

要想在不同的路由共用同一个组件实例，并不现实，树形的Dom树并不允许我们这么做。

![](cc019286392491534c79f7fc779ec5e7.png)

我们可以换个思路，把组件提取到路由容器的外部，然后通过某种方式将该组件与路由页面相关联。

![](da0a80f9710cb6c79ad05193320d9e7e.png)

我们将Float组件提升至根组件，然后在每个路由中使用Proxy组件进行占位，当路由切换时，每个Proxy将其位置信息与其他props传递给Float组件，Float组件再根据接收到的状态信息，将自己移动到对应位置。

我们先封装一个Proxy组件,  使用PubSub 发布元信息。

```tsx
// FloatProxy.tsx
const FloatProxy: React.FC<any> = (props: any) => {
    const el = useRef();

    // 保存代理元素引用，方便获取元素的位置信息
    useEffect(() => {
        PubSub.publish("proxyElChange", el);
        return () => {
            PubSub.publish("proxyElChange", null);
        };
    }, []);

    useEffect(() => {
        PubSub.publish("metadataChange", props);
    }, [props]);

    const computedStyle = useMemo(() => {
        const propStyle = props.style || {};
        return {
            border: "dashed 1px #888",
            transition: "all .2s ease-in",
            ...propStyle,
        };
    }, [props.style]);

    return <div {...props} style={computedStyle} ref={el}></div>;
};
```

在路由中使用, 将样式信息进行传递

```tsx
class Bar extends React.Component {
    render() {
        return (
            <div className="container">
                <p>bar</p>
                <div style={{ marginTop: "140px" }}>
                    <FloatProxy style={{ width: 120, height: 120, borderRadius: 15, overflow: "hidden" }} />
                </div>
            </div>
        );
    }
}
```

创建全局变量用于保存代理信息

```typescript
// floatData.ts
type ProxyElType = {
    current: HTMLElement | null;
};
type MetaType = {
    attrs: any;
    props: any;
};

export const metadata: MetaType = {
    attrs: {
        hideComponent: true,
        left: 0,
        top: 0,
    },
    props: {},
};

export const proxyEl: ProxyElType = {
    current: null,
};
```

创建一个FloatContainer容器组件，用于监听代理数据的变化,  数据变动时驱动组件进行移动

```tsx
import { metadata, proxyEl } from "./floatData";
class FloatContainer extends React.Component<any, any> {
    componentDidMount() {
        // 将代理组件上的props绑定到Float组件上
        PubSub.subscribe("metadataChange", (msg, props) => {
            metadata.props = props;
            this.forceUpdate();
        });

        // 切换路由后代理元素改变,保存代理元素的位置信息
        PubSub.subscribe("proxyElChange", (msg, el) => {
            if (!el) {
                metadata.attrs.hideComponent = true;
                // 在下一次tick再更新dom
                setTimeout(() => {
                    this.forceUpdate();
                }, 0);
                return;
            } else {
                metadata.attrs.hideComponent = false;
            }
            proxyEl.current = el.current;
            const rect = proxyEl.current?.getBoundingClientRect()!;
            metadata.attrs.left = rect.left;
            metadata.attrs.top = rect.top;
            this.forceUpdate();
        });
    }

    render() {
        const { timeout = 500 } = this.props;
        const wrapperStyle: React.CSSProperties = {
            position: "fixed",
            left: metadata.attrs.left,
            top: metadata.attrs.top,
            transition: `all ${timeout}ms ease-in`,
            // 当前路由未注册Proxy时进行隐藏
            display: metadata.attrs.hideComponent ? "none" : "block",
        };

        const propStyle = metadata.props.style || {};

        // 注入过渡样式属性
        const computedProps = {
            ...metadata.props,
            style: {
                transition: `all ${timeout}ms ease-in`,
                ...propStyle,
            },
        };
        console.log(metadata.attrs.hideComponent);

        return (
            <div className="float-element" style={wrapperStyle}>
                {this.props.render(computedProps)}{" "}
            </div>
        );
    }
}
```

将组件提取到路由容器外部，并使用FloatContainer包裹

```tsx
function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <NavLink to={"/"}>/foo</NavLink>
                <NavLink to={"/bar"}>/bar</NavLink>
                <NavLink to={"/baz"}>/baz</NavLink>
                <FloatContainer render={(attrs: any) => <MyImage {...attrs} />}></FloatContainer>
                <Routes>
                    <Route path="/" element={<Foo />}></Route>
                    <Route path="/bar" element={<Bar />}></Route>
                    <Route path="/baz" element={<Baz />}></Route>
                </Routes>
            </div>
        </BrowserRouter>
    );
}
```

实现效果：

![](2189c8dd09005a1592af760c0ffd1faf.gif)

目前我们实现了一个单例的组件，我们将组件改造一下，让其可以被复用

首先我们将元数据更改为一个元数据map，以layoutId为键，元数据为值

```tsx
// floatData.tsx
type ProxyElType = {
    current: HTMLElement | null;
};
type MetaType = {
    attrs: {
        hideComponent: boolean;
        left: number;
        top: number;
    };
    props: any;
};

type floatType = {
    metadata: MetaType;
    proxyEl: ProxyElType;
};

export const metadata: MetaType = {
    attrs: {
        hideComponent: true,
        left: 0,
        top: 0,
    },
    props: {},
};

export const proxyEl: ProxyElType = {
    current: null,
};

export const floatMap = new Map<string, floatType>();
```

在代理组件中传递layoutId 来通知注册了相同layoutId的floatContainer做出相应变更

```tsx
// FloatProxy.tsx

// 保存代理元素引用，方便获取元素的位置信息
useEffect(() => {
    const float = floatMap.get(props.layoutId);
    if (float) {
        float.proxyEl.current = el.current;
    } else {
        floatMap.set(props.layoutId, {
            metadata: {
                attrs: {
                    hideComponent: true,
                    left: 0,
                    top: 0,
                },
                props: {},
            },
            proxyEl: {
                current: el.current,
            },
        });
    }
    PubSub.publish("proxyElChange", props.layoutId);
    return () => {
        if (float) {
            float.proxyEl.current = null;
            PubSub.publish("proxyElChange", props.layoutId);
        }
    };
}, []);

// 在路由中使用
<FloatProxy layoutId="layout1" style={{ width: 200, height: 200 }} />;
```

在FloatContainer组件上也加上layoutId来标识同一组

```tsx
// FloatContainer.tsx

// 监听到自己同组的Proxy发送消息时进行rerender
PubSub.subscribe("metadataChange", (msg, layoutId) => {
    if (layoutId === this.props.layoutId) {
        this.forceUpdate();
    }
});

// 页面中使用
<FloatContainer layoutId="layout1" render={(attrs: any) => <MyImage imgSrc={img} {...attrs} />}></FloatContainer>;
```

实现多组过渡的效果

![](858d305b0e3c0f6354bb66c669907a78.gif)

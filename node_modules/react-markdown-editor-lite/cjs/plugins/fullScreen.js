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
    default: ()=>FullScreen
});
const external_react_namespaceObject = require("react");
var external_react_default = /*#__PURE__*/ __webpack_require__.n(external_react_namespaceObject);
const index_js_namespaceObject = require("../components/Icon/index.js");
var index_js_default = /*#__PURE__*/ __webpack_require__.n(index_js_namespaceObject);
const external_i18n_index_js_namespaceObject = require("../i18n/index.js");
var external_i18n_index_js_default = /*#__PURE__*/ __webpack_require__.n(external_i18n_index_js_namespaceObject);
const external_Plugin_js_namespaceObject = require("./Plugin.js");
class FullScreen extends external_Plugin_js_namespaceObject.PluginComponent {
    static pluginName = 'full-screen';
    static align = 'right';
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            enable: this.editor.isFullScreen()
        };
    }
    handleClick() {
        this.editor.fullScreen(!this.state.enable);
    }
    handleChange(enable) {
        this.setState({
            enable
        });
    }
    componentDidMount() {
        this.editor.on('fullscreen', this.handleChange);
    }
    componentWillUnmount() {
        this.editor.off('fullscreen', this.handleChange);
    }
    render() {
        if (this.editorConfig.canView && this.editorConfig.canView.fullScreen) {
            const { enable } = this.state;
            return /*#__PURE__*/ external_react_default().createElement("span", {
                className: "button button-type-fullscreen",
                title: external_i18n_index_js_default().get(enable ? 'btnExitFullScreen' : 'btnFullScreen'),
                onClick: this.handleClick
            }, /*#__PURE__*/ external_react_default().createElement(index_js_default(), {
                type: enable ? 'fullscreen-exit' : 'fullscreen'
            }));
        }
        return null;
    }
}
exports["default"] = __webpack_exports__["default"];
for(var __rspack_i in __webpack_exports__)if (-1 === [
    "default"
].indexOf(__rspack_i)) exports[__rspack_i] = __webpack_exports__[__rspack_i];
Object.defineProperty(exports, '__esModule', {
    value: true
});

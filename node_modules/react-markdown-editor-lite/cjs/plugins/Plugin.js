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
    PluginComponent: ()=>PluginComponent
});
const external_react_namespaceObject = require("react");
var external_react_default = /*#__PURE__*/ __webpack_require__.n(external_react_namespaceObject);
class PluginComponent extends external_react_default().Component {
    static pluginName = '';
    static align = 'left';
    static defaultConfig = {};
    get editor() {
        return this.props.editor;
    }
    get editorConfig() {
        return this.props.editorConfig;
    }
    get config() {
        return this.props.config;
    }
    getConfig(key, defaultValue) {
        return void 0 !== this.props.config[key] && null !== this.props.config[key] ? this.props.config[key] : defaultValue;
    }
}
exports.PluginComponent = __webpack_exports__.PluginComponent;
for(var __rspack_i in __webpack_exports__)if (-1 === [
    "PluginComponent"
].indexOf(__rspack_i)) exports[__rspack_i] = __webpack_exports__[__rspack_i];
Object.defineProperty(exports, '__esModule', {
    value: true
});

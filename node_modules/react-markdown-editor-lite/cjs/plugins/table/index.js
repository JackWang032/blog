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
    default: ()=>Table
});
const external_react_namespaceObject = require("react");
var external_react_default = /*#__PURE__*/ __webpack_require__.n(external_react_namespaceObject);
const index_js_namespaceObject = require("../../components/DropList/index.js");
var index_js_default = /*#__PURE__*/ __webpack_require__.n(index_js_namespaceObject);
const Icon_index_js_namespaceObject = require("../../components/Icon/index.js");
var Icon_index_js_default = /*#__PURE__*/ __webpack_require__.n(Icon_index_js_namespaceObject);
const external_i18n_index_js_namespaceObject = require("../../i18n/index.js");
var external_i18n_index_js_default = /*#__PURE__*/ __webpack_require__.n(external_i18n_index_js_namespaceObject);
const external_Plugin_js_namespaceObject = require("../Plugin.js");
const external_table_js_namespaceObject = require("./table.js");
var external_table_js_default = /*#__PURE__*/ __webpack_require__.n(external_table_js_namespaceObject);
class Table extends external_Plugin_js_namespaceObject.PluginComponent {
    static pluginName = 'table';
    static defaultConfig = {
        maxRow: 6,
        maxCol: 6
    };
    constructor(props){
        super(props);
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.state = {
            show: false
        };
    }
    show() {
        this.setState({
            show: true
        });
    }
    hide() {
        this.setState({
            show: false
        });
    }
    render() {
        const config = this.editorConfig.table || this.props.config;
        return /*#__PURE__*/ external_react_default().createElement("span", {
            className: "button button-type-table",
            title: external_i18n_index_js_default().get('btnTable'),
            onMouseEnter: this.show,
            onMouseLeave: this.hide
        }, /*#__PURE__*/ external_react_default().createElement(Icon_index_js_default(), {
            type: "grid"
        }), /*#__PURE__*/ external_react_default().createElement(index_js_default(), {
            show: this.state.show,
            onClose: this.hide
        }, /*#__PURE__*/ external_react_default().createElement(external_table_js_default(), {
            visibility: this.state.show,
            maxRow: config.maxRow,
            maxCol: config.maxCol,
            onSetTable: (option)=>this.editor.insertMarkdown('table', option)
        })));
    }
}
exports["default"] = __webpack_exports__["default"];
for(var __rspack_i in __webpack_exports__)if (-1 === [
    "default"
].indexOf(__rspack_i)) exports[__rspack_i] = __webpack_exports__[__rspack_i];
Object.defineProperty(exports, '__esModule', {
    value: true
});

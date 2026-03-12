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
    default: ()=>tabInsert_TabMapList
});
const external_classnames_namespaceObject = require("classnames");
var external_classnames_default = /*#__PURE__*/ __webpack_require__.n(external_classnames_namespaceObject);
const external_react_namespaceObject = require("react");
var external_react_default = /*#__PURE__*/ __webpack_require__.n(external_react_namespaceObject);
const index_js_namespaceObject = require("../../i18n/index.js");
var index_js_default = /*#__PURE__*/ __webpack_require__.n(index_js_namespaceObject);
class TabMapList extends external_react_default().Component {
    handleSelectMapValue(mapValue) {
        const { onSelectMapValue } = this.props;
        if ('function' == typeof onSelectMapValue) onSelectMapValue(mapValue);
    }
    render() {
        const { value } = this.props;
        return /*#__PURE__*/ external_react_default().createElement("ul", {
            className: "tab-map-list"
        }, [
            1,
            2,
            4,
            8
        ].map((it)=>/*#__PURE__*/ external_react_default().createElement("li", {
                key: it,
                className: external_classnames_default()('list-item', {
                    active: value === it
                })
            }, /*#__PURE__*/ external_react_default().createElement("div", {
                onClick: this.handleSelectMapValue.bind(this, it)
            }, 1 === it ? index_js_default().get('tab') : `${it} ${index_js_default().get('spaces')}`))));
    }
}
const tabInsert_TabMapList = TabMapList;
exports["default"] = __webpack_exports__["default"];
for(var __rspack_i in __webpack_exports__)if (-1 === [
    "default"
].indexOf(__rspack_i)) exports[__rspack_i] = __webpack_exports__[__rspack_i];
Object.defineProperty(exports, '__esModule', {
    value: true
});

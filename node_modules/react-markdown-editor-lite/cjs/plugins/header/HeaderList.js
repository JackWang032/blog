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
    default: ()=>header_HeaderList
});
const external_react_namespaceObject = require("react");
var external_react_default = /*#__PURE__*/ __webpack_require__.n(external_react_namespaceObject);
class HeaderList extends external_react_default().Component {
    handleHeader(header) {
        const { onSelectHeader } = this.props;
        if ('function' == typeof onSelectHeader) onSelectHeader(header);
    }
    render() {
        return /*#__PURE__*/ external_react_default().createElement("ul", {
            className: "header-list"
        }, /*#__PURE__*/ external_react_default().createElement("li", {
            className: "list-item"
        }, /*#__PURE__*/ external_react_default().createElement("h1", {
            onClick: this.handleHeader.bind(this, 'h1')
        }, "H1")), /*#__PURE__*/ external_react_default().createElement("li", {
            className: "list-item"
        }, /*#__PURE__*/ external_react_default().createElement("h2", {
            onClick: this.handleHeader.bind(this, 'h2')
        }, "H2")), /*#__PURE__*/ external_react_default().createElement("li", {
            className: "list-item"
        }, /*#__PURE__*/ external_react_default().createElement("h3", {
            onClick: this.handleHeader.bind(this, 'h3')
        }, "H3")), /*#__PURE__*/ external_react_default().createElement("li", {
            className: "list-item"
        }, /*#__PURE__*/ external_react_default().createElement("h4", {
            onClick: this.handleHeader.bind(this, 'h4')
        }, "H4")), /*#__PURE__*/ external_react_default().createElement("li", {
            className: "list-item"
        }, /*#__PURE__*/ external_react_default().createElement("h5", {
            onClick: this.handleHeader.bind(this, 'h5')
        }, "H5")), /*#__PURE__*/ external_react_default().createElement("li", {
            className: "list-item"
        }, /*#__PURE__*/ external_react_default().createElement("h6", {
            onClick: this.handleHeader.bind(this, 'h6')
        }, "H6")));
    }
}
const header_HeaderList = HeaderList;
exports["default"] = __webpack_exports__["default"];
for(var __rspack_i in __webpack_exports__)if (-1 === [
    "default"
].indexOf(__rspack_i)) exports[__rspack_i] = __webpack_exports__[__rspack_i];
Object.defineProperty(exports, '__esModule', {
    value: true
});

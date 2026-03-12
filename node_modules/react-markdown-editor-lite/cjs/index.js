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
    Plugins: ()=>Plugins,
    default: ()=>src,
    PluginComponent: ()=>Plugin_js_namespaceObject.PluginComponent,
    getDecorated: ()=>decorate_js_default(),
    DropList: ()=>index_js_default()
});
const index_js_namespaceObject = require("./components/DropList/index.js");
var index_js_default = /*#__PURE__*/ __webpack_require__.n(index_js_namespaceObject);
const external_editor_index_js_namespaceObject = require("./editor/index.js");
var external_editor_index_js_default = /*#__PURE__*/ __webpack_require__.n(external_editor_index_js_namespaceObject);
const autoResize_js_namespaceObject = require("./plugins/autoResize.js");
var autoResize_js_default = /*#__PURE__*/ __webpack_require__.n(autoResize_js_namespaceObject);
const code_block_js_namespaceObject = require("./plugins/block/code-block.js");
var code_block_js_default = /*#__PURE__*/ __webpack_require__.n(code_block_js_namespaceObject);
const code_inline_js_namespaceObject = require("./plugins/block/code-inline.js");
var code_inline_js_default = /*#__PURE__*/ __webpack_require__.n(code_inline_js_namespaceObject);
const quote_js_namespaceObject = require("./plugins/block/quote.js");
var quote_js_default = /*#__PURE__*/ __webpack_require__.n(quote_js_namespaceObject);
const wrap_js_namespaceObject = require("./plugins/block/wrap.js");
var wrap_js_default = /*#__PURE__*/ __webpack_require__.n(wrap_js_namespaceObject);
const clear_js_namespaceObject = require("./plugins/clear.js");
var clear_js_default = /*#__PURE__*/ __webpack_require__.n(clear_js_namespaceObject);
const bold_js_namespaceObject = require("./plugins/font/bold.js");
var bold_js_default = /*#__PURE__*/ __webpack_require__.n(bold_js_namespaceObject);
const italic_js_namespaceObject = require("./plugins/font/italic.js");
var italic_js_default = /*#__PURE__*/ __webpack_require__.n(italic_js_namespaceObject);
const strikethrough_js_namespaceObject = require("./plugins/font/strikethrough.js");
var strikethrough_js_default = /*#__PURE__*/ __webpack_require__.n(strikethrough_js_namespaceObject);
const underline_js_namespaceObject = require("./plugins/font/underline.js");
var underline_js_default = /*#__PURE__*/ __webpack_require__.n(underline_js_namespaceObject);
const fullScreen_js_namespaceObject = require("./plugins/fullScreen.js");
var fullScreen_js_default = /*#__PURE__*/ __webpack_require__.n(fullScreen_js_namespaceObject);
const header_index_js_namespaceObject = require("./plugins/header/index.js");
var header_index_js_default = /*#__PURE__*/ __webpack_require__.n(header_index_js_namespaceObject);
const Image_index_js_namespaceObject = require("./plugins/Image/index.js");
var Image_index_js_default = /*#__PURE__*/ __webpack_require__.n(Image_index_js_namespaceObject);
const link_js_namespaceObject = require("./plugins/link.js");
var link_js_default = /*#__PURE__*/ __webpack_require__.n(link_js_namespaceObject);
const ordered_js_namespaceObject = require("./plugins/list/ordered.js");
var ordered_js_default = /*#__PURE__*/ __webpack_require__.n(ordered_js_namespaceObject);
const unordered_js_namespaceObject = require("./plugins/list/unordered.js");
var unordered_js_default = /*#__PURE__*/ __webpack_require__.n(unordered_js_namespaceObject);
const logger_index_js_namespaceObject = require("./plugins/logger/index.js");
var logger_index_js_default = /*#__PURE__*/ __webpack_require__.n(logger_index_js_namespaceObject);
const modeToggle_js_namespaceObject = require("./plugins/modeToggle.js");
var modeToggle_js_default = /*#__PURE__*/ __webpack_require__.n(modeToggle_js_namespaceObject);
const Plugin_js_namespaceObject = require("./plugins/Plugin.js");
const tabInsert_index_js_namespaceObject = require("./plugins/tabInsert/index.js");
var tabInsert_index_js_default = /*#__PURE__*/ __webpack_require__.n(tabInsert_index_js_namespaceObject);
const table_index_js_namespaceObject = require("./plugins/table/index.js");
var table_index_js_default = /*#__PURE__*/ __webpack_require__.n(table_index_js_namespaceObject);
const decorate_js_namespaceObject = require("./utils/decorate.js");
var decorate_js_default = /*#__PURE__*/ __webpack_require__.n(decorate_js_namespaceObject);
external_editor_index_js_default().use(header_index_js_default());
external_editor_index_js_default().use(bold_js_default());
external_editor_index_js_default().use(italic_js_default());
external_editor_index_js_default().use(underline_js_default());
external_editor_index_js_default().use(strikethrough_js_default());
external_editor_index_js_default().use(unordered_js_default());
external_editor_index_js_default().use(ordered_js_default());
external_editor_index_js_default().use(quote_js_default());
external_editor_index_js_default().use(wrap_js_default());
external_editor_index_js_default().use(code_inline_js_default());
external_editor_index_js_default().use(code_block_js_default());
external_editor_index_js_default().use(table_index_js_default());
external_editor_index_js_default().use(Image_index_js_default());
external_editor_index_js_default().use(link_js_default());
external_editor_index_js_default().use(clear_js_default());
external_editor_index_js_default().use(logger_index_js_default());
external_editor_index_js_default().use(modeToggle_js_default());
external_editor_index_js_default().use(fullScreen_js_default());
const Plugins = {
    Header: header_index_js_default(),
    FontBold: bold_js_default(),
    FontItalic: italic_js_default(),
    FontUnderline: underline_js_default(),
    FontStrikethrough: strikethrough_js_default(),
    ListUnordered: unordered_js_default(),
    ListOrdered: ordered_js_default(),
    BlockQuote: quote_js_default(),
    BlockWrap: wrap_js_default(),
    BlockCodeInline: code_inline_js_default(),
    BlockCodeBlock: code_block_js_default(),
    Table: table_index_js_default(),
    Image: Image_index_js_default(),
    Link: link_js_default(),
    Clear: clear_js_default(),
    Logger: logger_index_js_default(),
    ModeToggle: modeToggle_js_default(),
    FullScreen: fullScreen_js_default(),
    AutoResize: autoResize_js_default(),
    TabInsert: tabInsert_index_js_default()
};
const src = external_editor_index_js_default();
exports.DropList = __webpack_exports__.DropList;
exports.PluginComponent = __webpack_exports__.PluginComponent;
exports.Plugins = __webpack_exports__.Plugins;
exports["default"] = __webpack_exports__["default"];
exports.getDecorated = __webpack_exports__.getDecorated;
for(var __rspack_i in __webpack_exports__)if (-1 === [
    "DropList",
    "PluginComponent",
    "Plugins",
    "default",
    "getDecorated"
].indexOf(__rspack_i)) exports[__rspack_i] = __webpack_exports__[__rspack_i];
Object.defineProperty(exports, '__esModule', {
    value: true
});

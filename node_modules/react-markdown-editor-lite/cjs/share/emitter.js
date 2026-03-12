"use strict";
var __webpack_require__ = {};
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
    default: ()=>emitter,
    globalEmitter: ()=>globalEmitter
});
const external_eventemitter3_namespaceObject = require("eventemitter3");
class Emitter extends external_eventemitter3_namespaceObject.EventEmitter {
    EVENT_CHANGE = 'a1';
    EVENT_FULL_SCREEN = 'a2';
    EVENT_VIEW_CHANGE = 'a3';
    EVENT_KEY_DOWN = 'a4';
    EVENT_EDITOR_KEY_DOWN = 'a5';
    EVENT_FOCUS = 'a5';
    EVENT_BLUR = 'a6';
    EVENT_SCROLL = 'a7';
    EVENT_LANG_CHANGE = 'b1';
}
const globalEmitter = new Emitter();
const emitter = Emitter;
exports["default"] = __webpack_exports__["default"];
exports.globalEmitter = __webpack_exports__.globalEmitter;
for(var __rspack_i in __webpack_exports__)if (-1 === [
    "default",
    "globalEmitter"
].indexOf(__rspack_i)) exports[__rspack_i] = __webpack_exports__[__rspack_i];
Object.defineProperty(exports, '__esModule', {
    value: true
});

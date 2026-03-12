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
    default: ()=>__rspack_default_export
});
const defaultConfig = {
    theme: 'default',
    view: {
        menu: true,
        md: true,
        html: true
    },
    canView: {
        menu: true,
        md: true,
        html: true,
        both: true,
        fullScreen: true,
        hideMenu: true
    },
    htmlClass: '',
    markdownClass: '',
    syncScrollMode: [
        'rightFollowLeft',
        'leftFollowRight'
    ],
    imageUrl: '',
    imageAccept: '',
    linkUrl: '',
    loggerMaxSize: 100,
    loggerInterval: 600,
    table: {
        maxRow: 4,
        maxCol: 6
    },
    allowPasteImage: true,
    onImageUpload: void 0,
    onCustomImageUpload: void 0,
    shortcuts: true,
    onChangeTrigger: 'both'
};
const __rspack_default_export = defaultConfig;
exports["default"] = __webpack_exports__["default"];
for(var __rspack_i in __webpack_exports__)if (-1 === [
    "default"
].indexOf(__rspack_i)) exports[__rspack_i] = __webpack_exports__[__rspack_i];
Object.defineProperty(exports, '__esModule', {
    value: true
});

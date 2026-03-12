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
function mergeObject(obj1, obj2) {
    const result = {};
    Object.keys(obj1).forEach((k)=>{
        if (void 0 === obj2[k]) {
            result[k] = obj1[k];
            return;
        }
        if ('object' == typeof obj2[k]) {
            if (Array.isArray(obj2[k])) result[k] = [
                ...obj2[k]
            ];
            else result[k] = mergeObject(obj1[k], obj2[k]);
            return;
        }
        result[k] = obj2[k];
    });
    return result;
}
function __rspack_default_export(defaultConfig, ...configs) {
    let res = {
        ...defaultConfig
    };
    configs.forEach((conf)=>{
        if ('object' != typeof conf) return;
        res = mergeObject(res, conf);
    });
    return res;
}
exports["default"] = __webpack_exports__["default"];
for(var __rspack_i in __webpack_exports__)if (-1 === [
    "default"
].indexOf(__rspack_i)) exports[__rspack_i] = __webpack_exports__[__rspack_i];
Object.defineProperty(exports, '__esModule', {
    value: true
});

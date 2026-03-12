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
    deepClone: ()=>deepClone,
    getLineAndCol: ()=>getLineAndCol,
    isEmpty: ()=>isEmpty,
    isKeyMatch: ()=>isKeyMatch,
    isPromise: ()=>isPromise,
    repeat: ()=>repeat
});
function deepClone(obj) {
    if (!obj || 'object' != typeof obj) return obj;
    const objArray = Array.isArray(obj) ? [] : {};
    if (obj && 'object' == typeof obj) {
        for(const key in obj)if (Object.prototype.hasOwnProperty.call(obj, key)) if (obj[key] && 'object' == typeof obj[key]) objArray[key] = deepClone(obj[key]);
        else objArray[key] = obj[key];
    }
    return objArray;
}
function isEmpty(obj) {
    return null == obj || '' === obj;
}
function isPromise(obj) {
    return obj && (obj instanceof Promise || ('object' == typeof obj || 'function' == typeof obj) && 'function' == typeof obj.then);
}
function repeat(str, num) {
    let result = '';
    let n = num;
    while(n--)result += str;
    return result;
}
function isKeyMatch(event, cond) {
    const { withKey, keyCode, key, aliasCommand } = cond;
    const e = {
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
        altKey: event.altKey,
        shiftKey: event.shiftKey,
        keyCode: event.keyCode,
        key: event.key
    };
    if (aliasCommand) e.ctrlKey = e.ctrlKey || e.metaKey;
    if (withKey && withKey.length > 0) {
        for (const it of withKey)if (void 0 !== e[it] && !e[it]) return false;
    } else if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
    if (e.key) return e.key === key;
    return e.keyCode === keyCode;
}
function getLineAndCol(text, pos) {
    const lines = text.split('\n');
    const beforeLines = text.substr(0, pos).split('\n');
    const line = beforeLines.length;
    const col = beforeLines[beforeLines.length - 1].length;
    const curLine = lines[beforeLines.length - 1];
    const prevLine = beforeLines.length > 1 ? beforeLines[beforeLines.length - 2] : null;
    const nextLine = lines.length > beforeLines.length ? lines[beforeLines.length] : null;
    return {
        line,
        col,
        beforeText: text.substr(0, pos),
        afterText: text.substr(pos),
        curLine,
        prevLine,
        nextLine
    };
}
exports.deepClone = __webpack_exports__.deepClone;
exports.getLineAndCol = __webpack_exports__.getLineAndCol;
exports.isEmpty = __webpack_exports__.isEmpty;
exports.isKeyMatch = __webpack_exports__.isKeyMatch;
exports.isPromise = __webpack_exports__.isPromise;
exports.repeat = __webpack_exports__.repeat;
for(var __rspack_i in __webpack_exports__)if (-1 === [
    "deepClone",
    "getLineAndCol",
    "isEmpty",
    "isKeyMatch",
    "isPromise",
    "repeat"
].indexOf(__rspack_i)) exports[__rspack_i] = __webpack_exports__[__rspack_i];
Object.defineProperty(exports, '__esModule', {
    value: true
});

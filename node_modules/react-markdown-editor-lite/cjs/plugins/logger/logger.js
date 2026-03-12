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
const MAX_LOG_SIZE = 100;
class Logger {
    record = [];
    recycle = [];
    maxSize;
    initValue = '';
    constructor(props = {}){
        const { maxSize = MAX_LOG_SIZE } = props;
        this.maxSize = maxSize;
    }
    push(val) {
        const result = this.record.push(val);
        while(this.record.length > this.maxSize)this.record.shift();
        return result;
    }
    get() {
        return this.record;
    }
    getLast() {
        const { length } = this.record;
        return this.record[length - 1];
    }
    undo(skipText) {
        const current = this.record.pop();
        if (void 0 === current) return this.initValue;
        if (current !== skipText) {
            this.recycle.push(current);
            return current;
        }
        const last = this.record.pop();
        if (void 0 === last) {
            this.recycle.push(current);
            return this.initValue;
        }
        this.recycle.push(current);
        return last;
    }
    redo() {
        const history = this.recycle.pop();
        if (void 0 !== history) {
            this.push(history);
            return history;
        }
    }
    cleanRedo() {
        this.recycle = [];
    }
    getUndoCount() {
        return this.undo.length;
    }
    getRedoCount() {
        return this.recycle.length;
    }
}
const __rspack_default_export = Logger;
exports["default"] = __webpack_exports__["default"];
for(var __rspack_i in __webpack_exports__)if (-1 === [
    "default"
].indexOf(__rspack_i)) exports[__rspack_i] = __webpack_exports__[__rspack_i];
Object.defineProperty(exports, '__esModule', {
    value: true
});

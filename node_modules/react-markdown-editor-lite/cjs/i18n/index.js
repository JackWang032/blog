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
    default: ()=>src_i18n
});
const emitter_js_namespaceObject = require("../share/emitter.js");
const en_US_js_namespaceObject = require("./lang/en-US.js");
var en_US_js_default = /*#__PURE__*/ __webpack_require__.n(en_US_js_namespaceObject);
const zh_CN_js_namespaceObject = require("./lang/zh-CN.js");
var zh_CN_js_default = /*#__PURE__*/ __webpack_require__.n(zh_CN_js_namespaceObject);
class I18n {
    langs = {
        enUS: en_US_js_default(),
        zhCN: zh_CN_js_default()
    };
    current = 'enUS';
    constructor(){
        this.setUp();
    }
    setUp() {
        if ("u" < typeof window) return;
        let locale = 'enUS';
        if (navigator.language) {
            const it = navigator.language.split('-');
            locale = it[0];
            if (1 !== it.length) locale += it[it.length - 1].toUpperCase();
        }
        if (navigator.browserLanguage) {
            const it = navigator.browserLanguage.split('-');
            locale = it[0];
            if (it[1]) locale += it[1].toUpperCase();
        }
        if (this.current !== locale && this.isAvailable(locale)) {
            this.current = locale;
            emitter_js_namespaceObject.globalEmitter.emit(emitter_js_namespaceObject.globalEmitter.EVENT_LANG_CHANGE, this, locale, this.langs[locale]);
        }
    }
    isAvailable(langName) {
        return void 0 !== this.langs[langName];
    }
    add(langName, lang) {
        this.langs[langName] = lang;
    }
    setCurrent(langName) {
        if (!this.isAvailable(langName)) throw new Error(`Language ${langName} is not exists`);
        if (this.current !== langName) {
            this.current = langName;
            emitter_js_namespaceObject.globalEmitter.emit(emitter_js_namespaceObject.globalEmitter.EVENT_LANG_CHANGE, this, langName, this.langs[langName]);
        }
    }
    get(key, placeholders) {
        let str = this.langs[this.current][key] || '';
        if (placeholders) Object.keys(placeholders).forEach((k)=>{
            str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), placeholders[k]);
        });
        return str;
    }
    getCurrent() {
        return this.current;
    }
}
const i18n = new I18n();
const src_i18n = i18n;
exports["default"] = __webpack_exports__["default"];
for(var __rspack_i in __webpack_exports__)if (-1 === [
    "default"
].indexOf(__rspack_i)) exports[__rspack_i] = __webpack_exports__[__rspack_i];
Object.defineProperty(exports, '__esModule', {
    value: true
});

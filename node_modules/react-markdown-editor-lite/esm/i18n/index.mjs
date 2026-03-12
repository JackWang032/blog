import { globalEmitter } from "../share/emitter.mjs";
import en_US from "./lang/en-US.mjs";
import zh_CN from "./lang/zh-CN.mjs";
class I18n {
    langs = {
        enUS: en_US,
        zhCN: zh_CN
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
            globalEmitter.emit(globalEmitter.EVENT_LANG_CHANGE, this, locale, this.langs[locale]);
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
            globalEmitter.emit(globalEmitter.EVENT_LANG_CHANGE, this, langName, this.langs[langName]);
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
export { src_i18n as default };

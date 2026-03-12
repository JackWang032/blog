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
    default: ()=>modeToggle
});
const external_react_namespaceObject = require("react");
var external_react_default = /*#__PURE__*/ __webpack_require__.n(external_react_namespaceObject);
const index_js_namespaceObject = require("../components/Icon/index.js");
var index_js_default = /*#__PURE__*/ __webpack_require__.n(index_js_namespaceObject);
const external_i18n_index_js_namespaceObject = require("../i18n/index.js");
var external_i18n_index_js_default = /*#__PURE__*/ __webpack_require__.n(external_i18n_index_js_namespaceObject);
const external_Plugin_js_namespaceObject = require("./Plugin.js");
class ModeToggle extends external_Plugin_js_namespaceObject.PluginComponent {
    static pluginName = 'mode-toggle';
    static align = 'right';
    get isDisplay() {
        const { canView } = this.editorConfig;
        if (canView) return [
            canView.html,
            canView.md,
            canView.both
        ].filter((it)=>it).length >= 2;
        return false;
    }
    get next() {
        const { canView } = this.editorConfig;
        const { view } = this.state;
        const actions = [
            0,
            1,
            2
        ];
        if (canView) {
            if (!canView.both) actions.splice(actions.indexOf(0), 1);
            if (!canView.md) actions.splice(actions.indexOf(1), 1);
            if (!canView.html) actions.splice(actions.indexOf(2), 1);
        }
        let current = 1;
        if (view.html) current = 2;
        if (view.html && view.md) current = 0;
        if (0 === actions.length) return current;
        if (1 === actions.length) return actions[0];
        const index = actions.indexOf(current);
        return index < actions.length - 1 ? actions[index + 1] : actions[0];
    }
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            view: this.editor.getView()
        };
    }
    handleClick() {
        switch(this.next){
            case 0:
                this.editor.setView({
                    html: true,
                    md: true
                });
                break;
            case 2:
                this.editor.setView({
                    html: true,
                    md: false
                });
                break;
            case 1:
                this.editor.setView({
                    html: false,
                    md: true
                });
                break;
        }
    }
    handleChange(view) {
        this.setState({
            view
        });
    }
    componentDidMount() {
        this.editor.on('viewchange', this.handleChange);
    }
    componentWillUnmount() {
        this.editor.off('viewchange', this.handleChange);
    }
    getDisplayInfo() {
        const { next } = this;
        switch(next){
            case 0:
                return {
                    icon: 'view-split',
                    title: 'All'
                };
            case 2:
                return {
                    icon: 'visibility',
                    title: 'Preview'
                };
            default:
                return {
                    icon: 'keyboard',
                    title: 'Editor'
                };
        }
    }
    render() {
        if (this.isDisplay) {
            const display = this.getDisplayInfo();
            return /*#__PURE__*/ external_react_default().createElement("span", {
                className: "button button-type-mode",
                title: external_i18n_index_js_default().get(`btnMode${display.title}`),
                onClick: this.handleClick
            }, /*#__PURE__*/ external_react_default().createElement(index_js_default(), {
                type: display.icon
            }));
        }
        return null;
    }
}
const modeToggle = ModeToggle;
exports["default"] = __webpack_exports__["default"];
for(var __rspack_i in __webpack_exports__)if (-1 === [
    "default"
].indexOf(__rspack_i)) exports[__rspack_i] = __webpack_exports__[__rspack_i];
Object.defineProperty(exports, '__esModule', {
    value: true
});

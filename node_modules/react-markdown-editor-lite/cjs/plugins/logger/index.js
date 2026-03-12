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
    default: ()=>Logger
});
const external_react_namespaceObject = require("react");
var external_react_default = /*#__PURE__*/ __webpack_require__.n(external_react_namespaceObject);
const index_js_namespaceObject = require("../../components/Icon/index.js");
var index_js_default = /*#__PURE__*/ __webpack_require__.n(index_js_namespaceObject);
const external_i18n_index_js_namespaceObject = require("../../i18n/index.js");
var external_i18n_index_js_default = /*#__PURE__*/ __webpack_require__.n(external_i18n_index_js_namespaceObject);
const external_Plugin_js_namespaceObject = require("../Plugin.js");
const external_logger_js_namespaceObject = require("./logger.js");
var external_logger_js_default = /*#__PURE__*/ __webpack_require__.n(external_logger_js_namespaceObject);
class Logger extends external_Plugin_js_namespaceObject.PluginComponent {
    static pluginName = 'logger';
    logger;
    timerId;
    handleKeyboards = [];
    lastPop = null;
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleRedo = this.handleRedo.bind(this);
        this.handleUndo = this.handleUndo.bind(this);
        this.handleKeyboards = [
            {
                key: 'y',
                keyCode: 89,
                withKey: [
                    'ctrlKey'
                ],
                callback: this.handleRedo
            },
            {
                key: 'z',
                keyCode: 90,
                withKey: [
                    'metaKey',
                    'shiftKey'
                ],
                callback: this.handleRedo
            },
            {
                key: 'z',
                keyCode: 90,
                aliasCommand: true,
                withKey: [
                    'ctrlKey'
                ],
                callback: this.handleUndo
            }
        ];
        this.logger = new (external_logger_js_default())({
            maxSize: this.editorConfig.loggerMaxSize
        });
        this.editor.registerPluginApi('undo', this.handleUndo);
        this.editor.registerPluginApi('redo', this.handleRedo);
    }
    handleUndo() {
        const last = this.logger.undo(this.editor.getMdValue());
        if (void 0 !== last) {
            this.pause();
            this.lastPop = last;
            this.editor.setText(last);
            this.forceUpdate();
        }
    }
    handleRedo() {
        const last = this.logger.redo();
        if (void 0 !== last) {
            this.lastPop = last;
            this.editor.setText(last);
            this.forceUpdate();
        }
    }
    handleChange(value, e, isNotInput) {
        if (this.logger.getLast() === value || null !== this.lastPop && this.lastPop === value) return;
        this.logger.cleanRedo();
        if (isNotInput) {
            this.logger.push(value);
            this.lastPop = null;
            this.forceUpdate();
            return;
        }
        if (this.timerId) {
            window.clearTimeout(this.timerId);
            this.timerId = 0;
        }
        this.timerId = window.setTimeout(()=>{
            if (this.logger.getLast() !== value) {
                this.logger.push(value);
                this.lastPop = null;
                this.forceUpdate();
            }
            window.clearTimeout(this.timerId);
            this.timerId = 0;
        }, this.editorConfig.loggerInterval);
    }
    componentDidMount() {
        this.editor.on('change', this.handleChange);
        this.handleKeyboards.forEach((it)=>this.editor.onKeyboard(it));
        this.logger.initValue = this.editor.getMdValue();
        this.forceUpdate();
    }
    componentWillUnmount() {
        if (this.timerId) window.clearTimeout(this.timerId);
        this.editor.off('change', this.handleChange);
        this.editor.unregisterPluginApi('undo');
        this.editor.unregisterPluginApi('redo');
        this.handleKeyboards.forEach((it)=>this.editor.offKeyboard(it));
    }
    pause() {
        if (this.timerId) {
            window.clearTimeout(this.timerId);
            this.timerId = void 0;
        }
    }
    render() {
        const hasUndo = this.logger.getUndoCount() > 1 || this.logger.initValue !== this.editor.getMdValue();
        const hasRedo = this.logger.getRedoCount() > 0;
        return /*#__PURE__*/ external_react_default().createElement(external_react_default().Fragment, null, /*#__PURE__*/ external_react_default().createElement("span", {
            className: `button button-type-undo ${hasUndo ? '' : 'disabled'}`,
            title: external_i18n_index_js_default().get('btnUndo'),
            onClick: this.handleUndo
        }, /*#__PURE__*/ external_react_default().createElement(index_js_default(), {
            type: "undo"
        })), /*#__PURE__*/ external_react_default().createElement("span", {
            className: `button button-type-redo ${hasRedo ? '' : 'disabled'}`,
            title: external_i18n_index_js_default().get('btnRedo'),
            onClick: this.handleRedo
        }, /*#__PURE__*/ external_react_default().createElement(index_js_default(), {
            type: "redo"
        })));
    }
}
exports["default"] = __webpack_exports__["default"];
for(var __rspack_i in __webpack_exports__)if (-1 === [
    "default"
].indexOf(__rspack_i)) exports[__rspack_i] = __webpack_exports__[__rspack_i];
Object.defineProperty(exports, '__esModule', {
    value: true
});

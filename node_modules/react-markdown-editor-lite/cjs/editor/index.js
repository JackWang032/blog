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
    default: ()=>editor
});
const external_nanoid_namespaceObject = require("nanoid");
const external_react_namespaceObject = require("react");
var external_react_default = /*#__PURE__*/ __webpack_require__.n(external_react_namespaceObject);
const index_js_namespaceObject = require("../components/Icon/index.js");
var index_js_default = /*#__PURE__*/ __webpack_require__.n(index_js_namespaceObject);
const NavigationBar_index_js_namespaceObject = require("../components/NavigationBar/index.js");
var NavigationBar_index_js_default = /*#__PURE__*/ __webpack_require__.n(NavigationBar_index_js_namespaceObject);
const ToolBar_index_js_namespaceObject = require("../components/ToolBar/index.js");
var ToolBar_index_js_default = /*#__PURE__*/ __webpack_require__.n(ToolBar_index_js_namespaceObject);
const external_i18n_index_js_namespaceObject = require("../i18n/index.js");
var external_i18n_index_js_default = /*#__PURE__*/ __webpack_require__.n(external_i18n_index_js_namespaceObject);
const divider_index_js_namespaceObject = require("../plugins/divider/index.js");
var divider_index_js_default = /*#__PURE__*/ __webpack_require__.n(divider_index_js_namespaceObject);
const emitter_js_namespaceObject = require("../share/emitter.js");
var emitter_js_default = /*#__PURE__*/ __webpack_require__.n(emitter_js_namespaceObject);
const var_js_namespaceObject = require("../share/var.js");
const decorate_js_namespaceObject = require("../utils/decorate.js");
var decorate_js_default = /*#__PURE__*/ __webpack_require__.n(decorate_js_namespaceObject);
const mergeConfig_js_namespaceObject = require("../utils/mergeConfig.js");
var mergeConfig_js_default = /*#__PURE__*/ __webpack_require__.n(mergeConfig_js_namespaceObject);
const tool_js_namespaceObject = require("../utils/tool.js");
const uploadPlaceholder_js_namespaceObject = require("../utils/uploadPlaceholder.js");
var uploadPlaceholder_js_default = /*#__PURE__*/ __webpack_require__.n(uploadPlaceholder_js_namespaceObject);
const external_defaultConfig_js_namespaceObject = require("./defaultConfig.js");
var external_defaultConfig_js_default = /*#__PURE__*/ __webpack_require__.n(external_defaultConfig_js_namespaceObject);
const external_preview_js_namespaceObject = require("./preview.js");
class Editor extends external_react_default().Component {
    static plugins = [];
    static use(comp, config = {}) {
        for(let i = 0; i < Editor.plugins.length; i++)if (Editor.plugins[i][0] === comp) return void Editor.plugins.splice(i, 1, [
            comp,
            config
        ]);
        Editor.plugins.push([
            comp,
            config
        ]);
    }
    static register = Editor.use.bind(Editor);
    static unuse(comp) {
        for(let i = 0; i < Editor.plugins.length; i++)if (Editor.plugins[i][0] === comp) return void Editor.plugins.splice(i, 1);
    }
    static unregister = Editor.unuse.bind(Editor);
    static unuseAll() {
        Editor.plugins = [];
    }
    static addLocale = external_i18n_index_js_default().add.bind(external_i18n_index_js_default());
    static useLocale = external_i18n_index_js_default().setCurrent.bind(external_i18n_index_js_default());
    static getLocale = external_i18n_index_js_default().getCurrent.bind(external_i18n_index_js_default());
    config;
    emitter;
    nodeMdText = /*#__PURE__*/ external_react_default().createRef();
    nodeMdPreview = /*#__PURE__*/ external_react_default().createRef();
    nodeMdPreviewWrapper = /*#__PURE__*/ external_react_default().createRef();
    hasContentChanged = true;
    composing = false;
    pluginApis = new Map();
    handleInputScroll;
    handlePreviewScroll;
    constructor(props){
        super(props);
        this.emitter = new (emitter_js_default())();
        this.config = mergeConfig_js_default()(external_defaultConfig_js_default(), this.props.config, this.props);
        this.state = {
            text: (this.props.value || this.props.defaultValue || '').replace(/↵/g, '\n'),
            html: '',
            view: this.config.view || external_defaultConfig_js_default().view,
            fullScreen: false,
            plugins: this.getPlugins()
        };
        if (this.config.canView && !this.config.canView.menu) this.state.view.menu = false;
        this.nodeMdText = /*#__PURE__*/ external_react_default().createRef();
        this.nodeMdPreviewWrapper = /*#__PURE__*/ external_react_default().createRef();
        this.handleChange = this.handleChange.bind(this);
        this.handlePaste = this.handlePaste.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
        this.handleToggleMenu = this.handleToggleMenu.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleEditorKeyDown = this.handleEditorKeyDown.bind(this);
        this.handleLocaleUpdate = this.handleLocaleUpdate.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleInputScroll = this.handleSyncScroll.bind(this, 'md');
        this.handlePreviewScroll = this.handleSyncScroll.bind(this, 'html');
    }
    componentDidMount() {
        const { text } = this.state;
        this.renderHTML(text);
        emitter_js_namespaceObject.globalEmitter.on(emitter_js_namespaceObject.globalEmitter.EVENT_LANG_CHANGE, this.handleLocaleUpdate);
        external_i18n_index_js_default().setUp();
    }
    componentWillUnmount() {
        emitter_js_namespaceObject.globalEmitter.off(emitter_js_namespaceObject.globalEmitter.EVENT_LANG_CHANGE, this.handleLocaleUpdate);
    }
    componentDidUpdate(prevProps) {
        if (void 0 !== this.props.value && this.props.value !== this.state.text) {
            let { value } = this.props;
            if ('string' != typeof value) value = String(value).toString();
            value = value.replace(/↵/g, '\n');
            if (this.state.text !== value) {
                this.setState({
                    text: value
                });
                this.renderHTML(value);
            }
        }
        if (prevProps.plugins !== this.props.plugins) this.setState({
            plugins: this.getPlugins()
        });
    }
    isComposing() {
        return this.composing;
    }
    getPlugins() {
        let plugins = [];
        if (this.props.plugins) {
            const addToPlugins = (name)=>{
                if (name === divider_index_js_default().pluginName) return void plugins.push([
                    divider_index_js_default(),
                    {}
                ]);
                for (const it of Editor.plugins)if (it[0].pluginName === name) return void plugins.push(it);
            };
            for (const name of this.props.plugins)if ('fonts' === name) {
                addToPlugins('font-bold');
                addToPlugins('font-italic');
                addToPlugins('font-underline');
                addToPlugins('font-strikethrough');
                addToPlugins('list-unordered');
                addToPlugins('list-ordered');
                addToPlugins('block-quote');
                addToPlugins('block-wrap');
                addToPlugins('block-code-inline');
                addToPlugins('block-code-block');
            } else addToPlugins(name);
        } else plugins = [
            ...Editor.plugins
        ];
        const result = {};
        plugins.forEach((it)=>{
            const { align = 'left', pluginName = '' } = it[0];
            if (void 0 === result[align]) result[align] = [];
            const key = 'divider' === pluginName ? (0, external_nanoid_namespaceObject.nanoid)() : pluginName;
            result[align].push(/*#__PURE__*/ external_react_default().createElement(it[0], {
                editor: this,
                editorConfig: this.config,
                config: {
                    ...it[0].defaultConfig || {},
                    ...it[1] || {},
                    ...this.props.pluginConfig?.[pluginName] || {}
                },
                key
            }));
        });
        return result;
    }
    scrollScale = 1;
    isSyncingScroll = false;
    shouldSyncScroll = 'md';
    handleSyncScroll(type, e) {
        if (type !== this.shouldSyncScroll) return;
        if (this.props.onScroll) this.props.onScroll(e, type);
        this.emitter.emit(this.emitter.EVENT_SCROLL, e, type);
        const { syncScrollMode = [] } = this.config;
        if (!syncScrollMode.includes('md' === type ? 'rightFollowLeft' : 'leftFollowRight')) return;
        if (this.hasContentChanged && this.nodeMdText.current && this.nodeMdPreviewWrapper.current) {
            this.scrollScale = this.nodeMdText.current.scrollHeight / this.nodeMdPreviewWrapper.current.scrollHeight;
            this.hasContentChanged = false;
        }
        if (!this.isSyncingScroll) {
            this.isSyncingScroll = true;
            requestAnimationFrame(()=>{
                if (this.nodeMdText.current && this.nodeMdPreviewWrapper.current) if ('md' === type) this.nodeMdPreviewWrapper.current.scrollTop = this.nodeMdText.current.scrollTop / this.scrollScale;
                else this.nodeMdText.current.scrollTop = this.nodeMdPreviewWrapper.current.scrollTop * this.scrollScale;
                this.isSyncingScroll = false;
            });
        }
    }
    renderHTML(markdownText) {
        if (!this.props.renderHTML) {
            console.error('renderHTML props is required!');
            return Promise.resolve();
        }
        const res = this.props.renderHTML(markdownText);
        if ((0, tool_js_namespaceObject.isPromise)(res)) return res.then((r)=>this.setHtml(r));
        if ('function' == typeof res) return this.setHtml(res());
        return this.setHtml(res);
    }
    setHtml(html) {
        return new Promise((resolve)=>{
            this.setState({
                html
            }, resolve);
        });
    }
    handleToggleMenu() {
        this.setView({
            menu: !this.state.view.menu
        });
    }
    handleFocus(e) {
        const { onFocus } = this.props;
        if (onFocus) onFocus(e);
        this.emitter.emit(this.emitter.EVENT_FOCUS, e);
    }
    handleBlur(e) {
        const { onBlur } = this.props;
        if (onBlur) onBlur(e);
        this.emitter.emit(this.emitter.EVENT_BLUR, e);
    }
    handleChange(e) {
        e.persist();
        const { value } = e.target;
        this.setText(value, e);
    }
    handlePaste(e) {
        if (!this.config.allowPasteImage || !this.config.onImageUpload) return;
        const event = e.nativeEvent;
        const items = (event.clipboardData || window.clipboardData).items;
        if (items) {
            e.preventDefault();
            this.uploadWithDataTransfer(items);
        }
    }
    handleDrop(e) {
        if (!this.config.onImageUpload) return;
        const event = e.nativeEvent;
        if (!event.dataTransfer) return;
        const { items } = event.dataTransfer;
        if (items) {
            e.preventDefault();
            this.uploadWithDataTransfer(items);
        }
    }
    handleEditorKeyDown(e) {
        const { keyCode, key, currentTarget } = e;
        if ((13 === keyCode || 'Enter' === key) && false === this.composing) {
            const text = currentTarget.value;
            const curPos = currentTarget.selectionStart;
            const lineInfo = (0, tool_js_namespaceObject.getLineAndCol)(text, curPos);
            const emptyCurrentLine = ()=>{
                const newValue = currentTarget.value.substr(0, curPos - lineInfo.curLine.length) + currentTarget.value.substr(curPos);
                this.setText(newValue, void 0, {
                    start: curPos - lineInfo.curLine.length,
                    end: curPos - lineInfo.curLine.length
                });
                e.preventDefault();
            };
            const addSymbol = (symbol)=>{
                this.insertText(`\n${symbol}`, false, {
                    start: symbol.length + 1,
                    end: symbol.length + 1
                });
                e.preventDefault();
            };
            const isSymbol = lineInfo.curLine.match(/^(\s*?)\* /);
            if (isSymbol) {
                if (/^(\s*?)\* $/.test(lineInfo.curLine)) return void emptyCurrentLine();
                addSymbol(isSymbol[0]);
                return;
            }
            const isOrderList = lineInfo.curLine.match(/^(\s*?)(\d+)\. /);
            if (isOrderList) {
                if (/^(\s*?)(\d+)\. $/.test(lineInfo.curLine)) return void emptyCurrentLine();
                const toInsert = `${isOrderList[1]}${parseInt(isOrderList[2], 10) + 1}. `;
                addSymbol(toInsert);
                return;
            }
        }
        this.emitter.emit(this.emitter.EVENT_EDITOR_KEY_DOWN, e);
    }
    handleLocaleUpdate() {
        this.forceUpdate();
    }
    getMdElement() {
        return this.nodeMdText.current;
    }
    getHtmlElement() {
        return this.nodeMdPreviewWrapper.current;
    }
    clearSelection() {
        if (this.nodeMdText.current) this.nodeMdText.current.setSelectionRange(0, 0, 'none');
    }
    getSelection() {
        const source = this.nodeMdText.current;
        if (!source) return {
            ...var_js_namespaceObject.initialSelection
        };
        const start = source.selectionStart;
        const end = source.selectionEnd;
        const text = (source.value || '').slice(start, end);
        return {
            start,
            end,
            text
        };
    }
    setSelection(to) {
        if (this.nodeMdText.current) {
            this.nodeMdText.current.setSelectionRange(to.start, to.end, 'forward');
            this.nodeMdText.current.focus();
        }
    }
    insertMarkdown(type, option = {}) {
        const curSelection = this.getSelection();
        let decorateOption = option ? {
            ...option
        } : {};
        if ('image' === type) decorateOption = {
            ...decorateOption,
            target: option.target || curSelection.text || '',
            imageUrl: option.imageUrl || this.config.imageUrl
        };
        if ('link' === type) decorateOption = {
            ...decorateOption,
            linkUrl: this.config.linkUrl
        };
        if ('tab' === type && curSelection.start !== curSelection.end) {
            const curLineStart = this.getMdValue().slice(0, curSelection.start).lastIndexOf('\n') + 1;
            this.setSelection({
                start: curLineStart,
                end: curSelection.end
            });
        }
        const decorate = decorate_js_default()(curSelection.text, type, decorateOption);
        let { text } = decorate;
        const { selection } = decorate;
        if (decorate.newBlock) {
            const startLineInfo = (0, tool_js_namespaceObject.getLineAndCol)(this.getMdValue(), curSelection.start);
            const { col, curLine } = startLineInfo;
            if (col > 0 && curLine.length > 0) {
                text = `\n${text}`;
                if (selection) {
                    selection.start++;
                    selection.end++;
                }
            }
            let { afterText } = startLineInfo;
            if (curSelection.start !== curSelection.end) afterText = (0, tool_js_namespaceObject.getLineAndCol)(this.getMdValue(), curSelection.end).afterText;
            if ('' !== afterText.trim() && '\n\n' !== afterText.substr(0, 2)) {
                if ('\n' !== afterText.substr(0, 1)) text += '\n';
                text += '\n';
            }
        }
        this.insertText(text, true, selection);
    }
    insertPlaceholder(placeholder, wait) {
        this.insertText(placeholder, true);
        wait.then((str)=>{
            const text = this.getMdValue().replace(placeholder, str);
            this.setText(text);
        });
    }
    insertText(value = '', replaceSelected = false, newSelection) {
        const { text } = this.state;
        const selection = this.getSelection();
        const beforeContent = text.slice(0, selection.start);
        const afterContent = text.slice(replaceSelected ? selection.end : selection.start, text.length);
        this.setText(beforeContent + value + afterContent, void 0, newSelection ? {
            start: newSelection.start + beforeContent.length,
            end: newSelection.end + beforeContent.length
        } : {
            start: selection.start,
            end: selection.start
        });
    }
    setText(value = '', event, newSelection) {
        const { onChangeTrigger = 'both' } = this.config;
        const text = value.replace(/↵/g, '\n');
        if (this.state.text === value) return;
        this.setState({
            text
        });
        if (this.props.onChange && ('both' === onChangeTrigger || 'beforeRender' === onChangeTrigger)) this.props.onChange({
            text,
            html: this.getHtmlValue()
        }, event);
        this.emitter.emit(this.emitter.EVENT_CHANGE, value, event, void 0 === event);
        if (newSelection) setTimeout(()=>this.setSelection(newSelection));
        if (!this.hasContentChanged) this.hasContentChanged = true;
        const rendering = this.renderHTML(text);
        if ('both' === onChangeTrigger || 'afterRender' === onChangeTrigger) rendering.then(()=>{
            if (this.props.onChange) this.props.onChange({
                text: this.state.text,
                html: this.getHtmlValue()
            }, event);
        });
    }
    getMdValue() {
        return this.state.text;
    }
    getHtmlValue() {
        if ('string' == typeof this.state.html) return this.state.html;
        if (this.nodeMdPreview.current) return this.nodeMdPreview.current.getHtml();
        return '';
    }
    keyboardListeners = [];
    onKeyboard(data) {
        if (Array.isArray(data)) return void data.forEach((it)=>this.onKeyboard(it));
        if (!this.keyboardListeners.includes(data)) this.keyboardListeners.push(data);
    }
    offKeyboard(data) {
        if (Array.isArray(data)) return void data.forEach((it)=>this.offKeyboard(it));
        const index = this.keyboardListeners.indexOf(data);
        if (index >= 0) this.keyboardListeners.splice(index, 1);
    }
    handleKeyDown(e) {
        for (const it of this.keyboardListeners)if ((0, tool_js_namespaceObject.isKeyMatch)(e, it)) {
            e.preventDefault();
            it.callback(e);
            return;
        }
        this.emitter.emit(this.emitter.EVENT_KEY_DOWN, e);
    }
    getEventType(event) {
        switch(event){
            case 'change':
                return this.emitter.EVENT_CHANGE;
            case 'fullscreen':
                return this.emitter.EVENT_FULL_SCREEN;
            case 'viewchange':
                return this.emitter.EVENT_VIEW_CHANGE;
            case 'keydown':
                return this.emitter.EVENT_KEY_DOWN;
            case 'editor_keydown':
                return this.emitter.EVENT_EDITOR_KEY_DOWN;
            case 'blur':
                return this.emitter.EVENT_BLUR;
            case 'focus':
                return this.emitter.EVENT_FOCUS;
            case 'scroll':
                return this.emitter.EVENT_SCROLL;
        }
    }
    on(event, cb) {
        const eventType = this.getEventType(event);
        if (eventType) this.emitter.on(eventType, cb);
    }
    off(event, cb) {
        const eventType = this.getEventType(event);
        if (eventType) this.emitter.off(eventType, cb);
    }
    setView(to) {
        const newView = {
            ...this.state.view,
            ...to
        };
        this.setState({
            view: newView
        }, ()=>{
            this.emitter.emit(this.emitter.EVENT_VIEW_CHANGE, newView);
        });
    }
    getView() {
        return {
            ...this.state.view
        };
    }
    fullScreen(enable) {
        if (this.state.fullScreen !== enable) this.setState({
            fullScreen: enable
        }, ()=>{
            this.emitter.emit(this.emitter.EVENT_FULL_SCREEN, enable);
        });
    }
    registerPluginApi(name, cb) {
        this.pluginApis.set(name, cb);
    }
    unregisterPluginApi(name) {
        this.pluginApis.delete(name);
    }
    callPluginApi(name, ...others) {
        const handler = this.pluginApis.get(name);
        if (!handler) throw new Error(`API ${name} not found`);
        return handler(...others);
    }
    isFullScreen() {
        return this.state.fullScreen;
    }
    uploadWithDataTransfer(items) {
        const { onImageUpload } = this.config;
        if (!onImageUpload) return;
        const queue = [];
        Array.prototype.forEach.call(items, (it)=>{
            if ('file' === it.kind && it.type.includes('image')) {
                const file = it.getAsFile();
                if (file) {
                    const placeholder = uploadPlaceholder_js_default()(file, onImageUpload);
                    queue.push(Promise.resolve(placeholder.placeholder));
                    placeholder.uploaded.then((str)=>{
                        const text = this.getMdValue().replace(placeholder.placeholder, str);
                        const offset = str.length - placeholder.placeholder.length;
                        const selection = this.getSelection();
                        this.setText(text, void 0, {
                            start: selection.start + offset,
                            end: selection.start + offset
                        });
                    });
                }
            } else if ('string' === it.kind && 0 === it.type.indexOf('text/')) queue.push(new Promise((resolve)=>it.getAsString(resolve)));
        });
        Promise.all(queue).then((res)=>{
            const text = res.join('');
            const selection = this.getSelection();
            this.insertText(text, true, {
                start: selection.start === selection.end ? text.length : 0,
                end: text.length
            });
        });
    }
    render() {
        const { view, fullScreen, text, html } = this.state;
        const { id, className = '', style, name = 'textarea', autoFocus, placeholder, readOnly } = this.props;
        const { canView } = this.config;
        const showHideMenu = canView?.hideMenu && canView?.menu;
        const getPluginAt = (at)=>this.state.plugins[at] || [];
        const isShowMenu = !!view.menu;
        const editorId = id ? `${id}_md` : void 0;
        const previewerId = id ? `${id}_html` : void 0;
        return /*#__PURE__*/ external_react_default().createElement("div", {
            id: id,
            className: `rc-md-editor ${fullScreen ? 'full' : ''} ${className}`,
            style: style,
            onKeyDown: this.handleKeyDown,
            onDrop: this.handleDrop
        }, /*#__PURE__*/ external_react_default().createElement(NavigationBar_index_js_default(), {
            visible: isShowMenu,
            left: getPluginAt('left'),
            right: getPluginAt('right')
        }), /*#__PURE__*/ external_react_default().createElement("div", {
            className: "editor-container"
        }, showHideMenu && /*#__PURE__*/ external_react_default().createElement(ToolBar_index_js_default(), null, /*#__PURE__*/ external_react_default().createElement("span", {
            className: "button button-type-menu",
            title: isShowMenu ? 'hidden menu' : 'show menu',
            onClick: this.handleToggleMenu
        }, /*#__PURE__*/ external_react_default().createElement(index_js_default(), {
            type: `expand-${isShowMenu ? 'less' : 'more'}`
        }))), /*#__PURE__*/ external_react_default().createElement("section", {
            className: `section sec-md ${view.md ? 'visible' : 'in-visible'}`
        }, /*#__PURE__*/ external_react_default().createElement("textarea", {
            id: editorId,
            ref: this.nodeMdText,
            name: name,
            autoFocus: autoFocus,
            placeholder: placeholder,
            readOnly: readOnly,
            value: text,
            className: `section-container input ${this.config.markdownClass || ''}`,
            wrap: "hard",
            onChange: this.handleChange,
            onScroll: this.handleInputScroll,
            onMouseOver: ()=>this.shouldSyncScroll = 'md',
            onKeyDown: this.handleEditorKeyDown,
            onCompositionStart: ()=>this.composing = true,
            onCompositionEnd: ()=>this.composing = false,
            onPaste: this.handlePaste,
            onFocus: this.handleFocus,
            onBlur: this.handleBlur
        })), /*#__PURE__*/ external_react_default().createElement("section", {
            className: `section sec-html ${view.html ? 'visible' : 'in-visible'}`
        }, /*#__PURE__*/ external_react_default().createElement("div", {
            id: previewerId,
            className: "section-container html-wrap",
            ref: this.nodeMdPreviewWrapper,
            onMouseOver: ()=>this.shouldSyncScroll = 'html',
            onScroll: this.handlePreviewScroll
        }, /*#__PURE__*/ external_react_default().createElement(external_preview_js_namespaceObject.HtmlRender, {
            html: html,
            className: this.config.htmlClass,
            ref: this.nodeMdPreview
        })))));
    }
}
const editor = Editor;
exports["default"] = __webpack_exports__["default"];
for(var __rspack_i in __webpack_exports__)if (-1 === [
    "default"
].indexOf(__rspack_i)) exports[__rspack_i] = __webpack_exports__[__rspack_i];
Object.defineProperty(exports, '__esModule', {
    value: true
});

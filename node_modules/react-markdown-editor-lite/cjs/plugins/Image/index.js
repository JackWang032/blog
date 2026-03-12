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
    default: ()=>Image
});
const external_react_namespaceObject = require("react");
var external_react_default = /*#__PURE__*/ __webpack_require__.n(external_react_namespaceObject);
const index_js_namespaceObject = require("../../components/Icon/index.js");
var index_js_default = /*#__PURE__*/ __webpack_require__.n(index_js_namespaceObject);
const external_i18n_index_js_namespaceObject = require("../../i18n/index.js");
var external_i18n_index_js_default = /*#__PURE__*/ __webpack_require__.n(external_i18n_index_js_namespaceObject);
const tool_js_namespaceObject = require("../../utils/tool.js");
const uploadPlaceholder_js_namespaceObject = require("../../utils/uploadPlaceholder.js");
var uploadPlaceholder_js_default = /*#__PURE__*/ __webpack_require__.n(uploadPlaceholder_js_namespaceObject);
const external_Plugin_js_namespaceObject = require("../Plugin.js");
const external_inputFile_js_namespaceObject = require("./inputFile.js");
var external_inputFile_js_default = /*#__PURE__*/ __webpack_require__.n(external_inputFile_js_namespaceObject);
class Image extends external_Plugin_js_namespaceObject.PluginComponent {
    static pluginName = 'image';
    inputFile;
    constructor(props){
        super(props);
        this.inputFile = /*#__PURE__*/ external_react_default().createRef();
        this.onImageChanged = this.onImageChanged.bind(this);
        this.handleCustomImageUpload = this.handleCustomImageUpload.bind(this);
        this.handleImageUpload = this.handleImageUpload.bind(this);
        this.state = {
            show: false
        };
    }
    handleImageUpload() {
        const { onImageUpload } = this.editorConfig;
        if ('function' == typeof onImageUpload) {
            if (this.inputFile.current) this.inputFile.current.click();
        } else this.editor.insertMarkdown('image');
    }
    onImageChanged(file) {
        const { onImageUpload } = this.editorConfig;
        if (onImageUpload) {
            const placeholder = uploadPlaceholder_js_default()(file, onImageUpload);
            this.editor.insertPlaceholder(placeholder.placeholder, placeholder.uploaded);
        }
    }
    handleCustomImageUpload(e) {
        const { onCustomImageUpload } = this.editorConfig;
        if (onCustomImageUpload) {
            const res = onCustomImageUpload.call(this, e);
            if ((0, tool_js_namespaceObject.isPromise)(res)) res.then((result)=>{
                if (result && result.url) this.editor.insertMarkdown('image', {
                    target: result.text,
                    imageUrl: result.url
                });
            });
        }
    }
    render() {
        const isCustom = !!this.editorConfig.onCustomImageUpload;
        return isCustom ? /*#__PURE__*/ external_react_default().createElement("span", {
            className: "button button-type-image",
            title: external_i18n_index_js_default().get('btnImage'),
            onClick: this.handleCustomImageUpload
        }, /*#__PURE__*/ external_react_default().createElement(index_js_default(), {
            type: "image"
        })) : /*#__PURE__*/ external_react_default().createElement("span", {
            className: "button button-type-image",
            title: external_i18n_index_js_default().get('btnImage'),
            onClick: this.handleImageUpload,
            style: {
                position: 'relative'
            }
        }, /*#__PURE__*/ external_react_default().createElement(index_js_default(), {
            type: "image"
        }), /*#__PURE__*/ external_react_default().createElement(external_inputFile_js_default(), {
            accept: this.editorConfig.imageAccept || '',
            ref: this.inputFile,
            onChange: (e)=>{
                e.persist();
                if (e.target.files && e.target.files.length > 0) this.onImageChanged(e.target.files[0]);
            }
        }));
    }
}
exports["default"] = __webpack_exports__["default"];
for(var __rspack_i in __webpack_exports__)if (-1 === [
    "default"
].indexOf(__rspack_i)) exports[__rspack_i] = __webpack_exports__[__rspack_i];
Object.defineProperty(exports, '__esModule', {
    value: true
});

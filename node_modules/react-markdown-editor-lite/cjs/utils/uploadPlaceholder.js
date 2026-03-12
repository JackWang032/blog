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
    default: ()=>uploadPlaceholder
});
const external_nanoid_namespaceObject = require("nanoid");
const external_decorate_js_namespaceObject = require("./decorate.js");
var external_decorate_js_default = /*#__PURE__*/ __webpack_require__.n(external_decorate_js_namespaceObject);
const external_tool_js_namespaceObject = require("./tool.js");
function getUploadPlaceholder(file, onImageUpload) {
    const placeholder = external_decorate_js_default()('', 'image', {
        target: `Uploading_${(0, external_nanoid_namespaceObject.nanoid)()}`,
        imageUrl: ''
    }).text;
    const uploaded = new Promise((resolve)=>{
        let isCallback = true;
        const handleUploaded = (url)=>{
            if (isCallback) console.warn('Deprecated: onImageUpload should return a Promise, callback will be removed in future');
            resolve(external_decorate_js_default()('', 'image', {
                target: file.name,
                imageUrl: url
            }).text);
        };
        const upload = onImageUpload(file, handleUploaded);
        if ((0, external_tool_js_namespaceObject.isPromise)(upload)) {
            isCallback = false;
            upload.then(handleUploaded);
        }
    });
    return {
        placeholder,
        uploaded
    };
}
const uploadPlaceholder = getUploadPlaceholder;
exports["default"] = __webpack_exports__["default"];
for(var __rspack_i in __webpack_exports__)if (-1 === [
    "default"
].indexOf(__rspack_i)) exports[__rspack_i] = __webpack_exports__[__rspack_i];
Object.defineProperty(exports, '__esModule', {
    value: true
});

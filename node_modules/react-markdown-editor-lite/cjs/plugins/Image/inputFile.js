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
    default: ()=>inputFile
});
const external_react_namespaceObject = require("react");
var external_react_default = /*#__PURE__*/ __webpack_require__.n(external_react_namespaceObject);
class InputFile extends external_react_default().Component {
    timerId;
    locked;
    input;
    constructor(props){
        super(props);
        this.timerId = void 0;
        this.locked = false;
        this.input = /*#__PURE__*/ external_react_default().createRef();
    }
    click() {
        if (this.locked || !this.input.current) return;
        this.locked = true;
        this.input.current.value = '';
        this.input.current.click();
        if (this.timerId) window.clearTimeout(this.timerId);
        this.timerId = window.setTimeout(()=>{
            this.locked = false;
            window.clearTimeout(this.timerId);
            this.timerId = void 0;
        }, 200);
    }
    componentWillUnmount() {
        if (this.timerId) window.clearTimeout(this.timerId);
    }
    render() {
        return /*#__PURE__*/ external_react_default().createElement("input", {
            type: "file",
            ref: this.input,
            accept: this.props.accept,
            style: {
                position: 'absolute',
                zIndex: -1,
                left: 0,
                top: 0,
                width: 0,
                height: 0,
                opacity: 0
            },
            onChange: this.props.onChange
        });
    }
}
const inputFile = InputFile;
exports["default"] = __webpack_exports__["default"];
for(var __rspack_i in __webpack_exports__)if (-1 === [
    "default"
].indexOf(__rspack_i)) exports[__rspack_i] = __webpack_exports__[__rspack_i];
Object.defineProperty(exports, '__esModule', {
    value: true
});

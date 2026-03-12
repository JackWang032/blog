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
    default: ()=>table
});
const external_react_namespaceObject = require("react");
var external_react_default = /*#__PURE__*/ __webpack_require__.n(external_react_namespaceObject);
class TableList extends external_react_default().Component {
    config = {
        padding: 3,
        width: 20,
        height: 20
    };
    constructor(props){
        super(props);
        const { maxRow = 5, maxCol = 6 } = props;
        this.state = {
            maxRow,
            maxCol,
            list: this.formatTableModel(maxRow, maxCol)
        };
    }
    formatTableModel(maxRow = 0, maxCol = 0) {
        const result = new Array(maxRow).fill(void 0);
        return result.map((_)=>new Array(maxCol).fill(0));
    }
    calcWrapStyle() {
        const { maxRow, maxCol } = this.state;
        const { width, height, padding } = this.config;
        const wrapWidth = (width + padding) * maxCol - padding;
        const wrapHeight = (height + padding) * maxRow - padding;
        return {
            width: `${wrapWidth}px`,
            height: `${wrapHeight}px`
        };
    }
    calcItemStyle(row = 0, col = 0) {
        const { width, height, padding } = this.config;
        const top = (height + padding) * row;
        const left = (width + padding) * col;
        return {
            top: `${top}px`,
            left: `${left}px`
        };
    }
    getList(i, j) {
        const { list } = this.state;
        return list.map((v, row)=>v.map((_, col)=>row <= i && col <= j ? 1 : 0));
    }
    handleHover(i, j) {
        this.setState({
            list: this.getList(i, j)
        });
    }
    handleSetTable(i, j) {
        const { onSetTable } = this.props;
        if ('function' == typeof onSetTable) onSetTable({
            row: i + 1,
            col: j + 1
        });
    }
    componentDidUpdate(prevProps) {
        if (false === this.props.visibility && prevProps.visibility !== this.props.visibility) this.setState({
            list: this.getList(-1, -1)
        });
    }
    render() {
        return /*#__PURE__*/ external_react_default().createElement("ul", {
            className: "table-list wrap",
            style: this.calcWrapStyle()
        }, this.state.list.map((row, i)=>row.map((col, j)=>/*#__PURE__*/ external_react_default().createElement("li", {
                    className: `list-item ${1 === col ? 'active' : ''}`,
                    key: `${i}-${j}`,
                    style: this.calcItemStyle(i, j),
                    onMouseOver: this.handleHover.bind(this, i, j),
                    onClick: this.handleSetTable.bind(this, i, j)
                }))));
    }
}
const table = TableList;
exports["default"] = __webpack_exports__["default"];
for(var __rspack_i in __webpack_exports__)if (-1 === [
    "default"
].indexOf(__rspack_i)) exports[__rspack_i] = __webpack_exports__[__rspack_i];
Object.defineProperty(exports, '__esModule', {
    value: true
});

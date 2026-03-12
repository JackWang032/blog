import react from "react";
class TableList extends react.Component {
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
        return /*#__PURE__*/ react.createElement("ul", {
            className: "table-list wrap",
            style: this.calcWrapStyle()
        }, this.state.list.map((row, i)=>row.map((col, j)=>/*#__PURE__*/ react.createElement("li", {
                    className: `list-item ${1 === col ? 'active' : ''}`,
                    key: `${i}-${j}`,
                    style: this.calcItemStyle(i, j),
                    onMouseOver: this.handleHover.bind(this, i, j),
                    onClick: this.handleSetTable.bind(this, i, j)
                }))));
    }
}
const table = TableList;
export { table as default };

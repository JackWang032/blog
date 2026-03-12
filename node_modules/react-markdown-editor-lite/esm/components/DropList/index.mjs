import react from "react";
class DropList extends react.Component {
    constructor(props){
        super(props);
        this.handleClose = this.handleClose.bind(this);
    }
    handleClose(e) {
        e.stopPropagation();
        const { onClose } = this.props;
        if ('function' == typeof onClose) onClose();
    }
    render() {
        return /*#__PURE__*/ react.createElement("div", {
            className: `drop-wrap ${this.props.show ? 'show' : 'hidden'}`,
            onClick: this.handleClose
        }, this.props.children);
    }
}
const components_DropList = DropList;
export { components_DropList as default };

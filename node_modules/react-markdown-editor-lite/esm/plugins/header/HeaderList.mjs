import react from "react";
class HeaderList extends react.Component {
    handleHeader(header) {
        const { onSelectHeader } = this.props;
        if ('function' == typeof onSelectHeader) onSelectHeader(header);
    }
    render() {
        return /*#__PURE__*/ react.createElement("ul", {
            className: "header-list"
        }, /*#__PURE__*/ react.createElement("li", {
            className: "list-item"
        }, /*#__PURE__*/ react.createElement("h1", {
            onClick: this.handleHeader.bind(this, 'h1')
        }, "H1")), /*#__PURE__*/ react.createElement("li", {
            className: "list-item"
        }, /*#__PURE__*/ react.createElement("h2", {
            onClick: this.handleHeader.bind(this, 'h2')
        }, "H2")), /*#__PURE__*/ react.createElement("li", {
            className: "list-item"
        }, /*#__PURE__*/ react.createElement("h3", {
            onClick: this.handleHeader.bind(this, 'h3')
        }, "H3")), /*#__PURE__*/ react.createElement("li", {
            className: "list-item"
        }, /*#__PURE__*/ react.createElement("h4", {
            onClick: this.handleHeader.bind(this, 'h4')
        }, "H4")), /*#__PURE__*/ react.createElement("li", {
            className: "list-item"
        }, /*#__PURE__*/ react.createElement("h5", {
            onClick: this.handleHeader.bind(this, 'h5')
        }, "H5")), /*#__PURE__*/ react.createElement("li", {
            className: "list-item"
        }, /*#__PURE__*/ react.createElement("h6", {
            onClick: this.handleHeader.bind(this, 'h6')
        }, "H6")));
    }
}
const header_HeaderList = HeaderList;
export { header_HeaderList as default };

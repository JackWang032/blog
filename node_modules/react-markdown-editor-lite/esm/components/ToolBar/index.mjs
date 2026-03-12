import react from "react";
function ToolBar(props) {
    return /*#__PURE__*/ react.createElement("div", {
        className: "tool-bar",
        style: props.style
    }, props.children);
}
export { ToolBar as default };

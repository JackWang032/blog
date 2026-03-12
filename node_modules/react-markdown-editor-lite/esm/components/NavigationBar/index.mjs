import react from "react";
function NavigationBar(props) {
    return /*#__PURE__*/ react.createElement("div", {
        className: `rc-md-navigation ${props.visible ? 'visible' : 'in-visible'}`
    }, /*#__PURE__*/ react.createElement("div", {
        className: "navigation-nav left"
    }, /*#__PURE__*/ react.createElement("div", {
        className: "button-wrap"
    }, props.left)), /*#__PURE__*/ react.createElement("div", {
        className: "navigation-nav right"
    }, /*#__PURE__*/ react.createElement("div", {
        className: "button-wrap"
    }, props.right)));
}
export { NavigationBar as default };

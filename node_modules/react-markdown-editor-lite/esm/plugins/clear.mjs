import react from "react";
import Icon from "../components/Icon/index.mjs";
import i18n from "../i18n/index.mjs";
import { PluginComponent } from "./Plugin.mjs";
class Clear extends PluginComponent {
    static pluginName = 'clear';
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        if ('' === this.editor.getMdValue()) return;
        if (window.confirm && 'function' == typeof window.confirm) {
            const result = window.confirm(i18n.get('clearTip'));
            if (result) this.editor.setText('');
        }
    }
    render() {
        return /*#__PURE__*/ react.createElement("span", {
            className: "button button-type-clear",
            title: i18n.get('btnClear'),
            onClick: this.handleClick
        }, /*#__PURE__*/ react.createElement(Icon, {
            type: "delete"
        }));
    }
}
export { Clear as default };

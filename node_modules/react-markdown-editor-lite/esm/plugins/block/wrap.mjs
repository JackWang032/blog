import react from "react";
import Icon from "../../components/Icon/index.mjs";
import i18n from "../../i18n/index.mjs";
import { PluginComponent } from "../Plugin.mjs";
class BlockWrap extends PluginComponent {
    static pluginName = 'block-wrap';
    render() {
        return /*#__PURE__*/ react.createElement("span", {
            className: "button button-type-wrap",
            title: i18n.get('btnLineBreak'),
            onClick: ()=>this.editor.insertMarkdown('hr')
        }, /*#__PURE__*/ react.createElement(Icon, {
            type: "wrap"
        }));
    }
}
export { BlockWrap as default };

import react from "react";
import Icon from "../../components/Icon/index.mjs";
import i18n from "../../i18n/index.mjs";
import { PluginComponent } from "../Plugin.mjs";
class BlockCodeInline extends PluginComponent {
    static pluginName = 'block-code-inline';
    render() {
        return /*#__PURE__*/ react.createElement("span", {
            className: "button button-type-code-inline",
            title: i18n.get('btnInlineCode'),
            onClick: ()=>this.editor.insertMarkdown('inlinecode')
        }, /*#__PURE__*/ react.createElement(Icon, {
            type: "code"
        }));
    }
}
export { BlockCodeInline as default };

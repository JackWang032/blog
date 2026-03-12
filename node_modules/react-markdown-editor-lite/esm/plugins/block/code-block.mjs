import react from "react";
import Icon from "../../components/Icon/index.mjs";
import i18n from "../../i18n/index.mjs";
import { PluginComponent } from "../Plugin.mjs";
class BlockCodeBlock extends PluginComponent {
    static pluginName = 'block-code-block';
    render() {
        return /*#__PURE__*/ react.createElement("span", {
            className: "button button-type-code-block",
            title: i18n.get('btnCode'),
            onClick: ()=>this.editor.insertMarkdown('code')
        }, /*#__PURE__*/ react.createElement(Icon, {
            type: "code-block"
        }));
    }
}
export { BlockCodeBlock as default };

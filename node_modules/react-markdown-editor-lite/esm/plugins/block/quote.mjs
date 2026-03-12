import react from "react";
import Icon from "../../components/Icon/index.mjs";
import i18n from "../../i18n/index.mjs";
import { PluginComponent } from "../Plugin.mjs";
class BlockQuote extends PluginComponent {
    static pluginName = 'block-quote';
    render() {
        return /*#__PURE__*/ react.createElement("span", {
            className: "button button-type-quote",
            title: i18n.get('btnQuote'),
            onClick: ()=>this.editor.insertMarkdown('quote')
        }, /*#__PURE__*/ react.createElement(Icon, {
            type: "quote"
        }));
    }
}
export { BlockQuote as default };

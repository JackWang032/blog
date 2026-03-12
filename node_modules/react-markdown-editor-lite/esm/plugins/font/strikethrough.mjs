import react from "react";
import Icon from "../../components/Icon/index.mjs";
import i18n from "../../i18n/index.mjs";
import { PluginComponent } from "../Plugin.mjs";
class FontStrikethrough extends PluginComponent {
    static pluginName = 'font-strikethrough';
    handleKeyboard;
    constructor(props){
        super(props);
        this.handleKeyboard = {
            key: 'd',
            keyCode: 68,
            aliasCommand: true,
            withKey: [
                'ctrlKey'
            ],
            callback: ()=>this.editor.insertMarkdown('strikethrough')
        };
    }
    componentDidMount() {
        if (this.editorConfig.shortcuts) this.editor.onKeyboard(this.handleKeyboard);
    }
    componentWillUnmount() {
        this.editor.offKeyboard(this.handleKeyboard);
    }
    render() {
        return /*#__PURE__*/ react.createElement("span", {
            className: "button button-type-strikethrough",
            title: i18n.get('btnStrikethrough'),
            onClick: ()=>this.editor.insertMarkdown('strikethrough')
        }, /*#__PURE__*/ react.createElement(Icon, {
            type: "strikethrough"
        }));
    }
}
export { FontStrikethrough as default };

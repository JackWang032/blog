import react from "react";
import Icon from "../../components/Icon/index.mjs";
import i18n from "../../i18n/index.mjs";
import { PluginComponent } from "../Plugin.mjs";
class FontUnderline extends PluginComponent {
    static pluginName = 'font-underline';
    handleKeyboard;
    constructor(props){
        super(props);
        this.handleKeyboard = {
            key: 'u',
            keyCode: 85,
            withKey: [
                'ctrlKey'
            ],
            callback: ()=>this.editor.insertMarkdown('underline')
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
            className: "button button-type-underline",
            title: i18n.get('btnUnderline'),
            onClick: ()=>this.editor.insertMarkdown('underline')
        }, /*#__PURE__*/ react.createElement(Icon, {
            type: "underline"
        }));
    }
}
export { FontUnderline as default };

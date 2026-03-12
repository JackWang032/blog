import react from "react";
import Icon from "../../components/Icon/index.mjs";
import i18n from "../../i18n/index.mjs";
import { PluginComponent } from "../Plugin.mjs";
class FontItalic extends PluginComponent {
    static pluginName = 'font-italic';
    handleKeyboard;
    constructor(props){
        super(props);
        this.handleKeyboard = {
            key: 'i',
            keyCode: 73,
            aliasCommand: true,
            withKey: [
                'ctrlKey'
            ],
            callback: ()=>this.editor.insertMarkdown('italic')
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
            className: "button button-type-italic",
            title: i18n.get('btnItalic'),
            onClick: ()=>this.editor.insertMarkdown('italic')
        }, /*#__PURE__*/ react.createElement(Icon, {
            type: "italic"
        }));
    }
}
export { FontItalic as default };

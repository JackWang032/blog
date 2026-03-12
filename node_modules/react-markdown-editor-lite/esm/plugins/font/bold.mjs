import react from "react";
import Icon from "../../components/Icon/index.mjs";
import i18n from "../../i18n/index.mjs";
import { PluginComponent } from "../Plugin.mjs";
class FontBold extends PluginComponent {
    static pluginName = 'font-bold';
    handleKeyboard;
    constructor(props){
        super(props);
        this.handleKeyboard = {
            key: 'b',
            keyCode: 66,
            aliasCommand: true,
            withKey: [
                'ctrlKey'
            ],
            callback: ()=>this.editor.insertMarkdown('bold')
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
            className: "button button-type-bold",
            title: i18n.get('btnBold'),
            onClick: ()=>this.editor.insertMarkdown('bold')
        }, /*#__PURE__*/ react.createElement(Icon, {
            type: "bold"
        }));
    }
}
export { FontBold as default };

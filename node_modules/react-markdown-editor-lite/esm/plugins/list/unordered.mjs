import react from "react";
import Icon from "../../components/Icon/index.mjs";
import i18n from "../../i18n/index.mjs";
import { PluginComponent } from "../Plugin.mjs";
class ListUnordered extends PluginComponent {
    static pluginName = 'list-unordered';
    handleKeyboard;
    constructor(props){
        super(props);
        this.handleKeyboard = {
            key: '8',
            keyCode: 56,
            withKey: [
                'ctrlKey',
                'shiftKey'
            ],
            aliasCommand: true,
            callback: ()=>this.editor.insertMarkdown('unordered')
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
            className: "button button-type-unordered",
            title: i18n.get('btnUnordered'),
            onClick: ()=>this.editor.insertMarkdown('unordered')
        }, /*#__PURE__*/ react.createElement(Icon, {
            type: "list-unordered"
        }));
    }
}
export { ListUnordered as default };

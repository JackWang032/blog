import react from "react";
import Icon from "../../components/Icon/index.mjs";
import i18n from "../../i18n/index.mjs";
import { PluginComponent } from "../Plugin.mjs";
class ListOrdered extends PluginComponent {
    static pluginName = 'list-ordered';
    handleKeyboard;
    constructor(props){
        super(props);
        this.handleKeyboard = {
            key: '7',
            keyCode: 55,
            withKey: [
                'ctrlKey',
                'shiftKey'
            ],
            aliasCommand: true,
            callback: ()=>this.editor.insertMarkdown('order')
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
            className: "button button-type-ordered",
            title: i18n.get('btnOrdered'),
            onClick: ()=>this.editor.insertMarkdown('order')
        }, /*#__PURE__*/ react.createElement(Icon, {
            type: "list-ordered"
        }));
    }
}
export { ListOrdered as default };

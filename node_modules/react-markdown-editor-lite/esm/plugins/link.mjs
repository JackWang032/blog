import react from "react";
import Icon from "../components/Icon/index.mjs";
import i18n from "../i18n/index.mjs";
import { PluginComponent } from "./Plugin.mjs";
class Link extends PluginComponent {
    static pluginName = 'link';
    handleKeyboard;
    constructor(props){
        super(props);
        this.handleKeyboard = {
            key: 'k',
            keyCode: 75,
            aliasCommand: true,
            withKey: [
                'ctrlKey'
            ],
            callback: ()=>this.editor.insertMarkdown('link')
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
            className: "button button-type-link",
            title: i18n.get('btnLink'),
            onClick: ()=>this.editor.insertMarkdown('link')
        }, /*#__PURE__*/ react.createElement(Icon, {
            type: "link"
        }));
    }
}
export { Link as default };

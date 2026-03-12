import react from "react";
import DropList from "../../components/DropList/index.mjs";
import Icon from "../../components/Icon/index.mjs";
import i18n from "../../i18n/index.mjs";
import { PluginComponent } from "../Plugin.mjs";
import HeaderList from "./HeaderList.mjs";
class Header extends PluginComponent {
    static pluginName = 'header';
    constructor(props){
        super(props);
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.state = {
            show: false
        };
    }
    show() {
        this.setState({
            show: true
        });
    }
    hide() {
        this.setState({
            show: false
        });
    }
    render() {
        return /*#__PURE__*/ react.createElement("span", {
            className: "button button-type-header",
            title: i18n.get('btnHeader'),
            onMouseEnter: this.show,
            onMouseLeave: this.hide
        }, /*#__PURE__*/ react.createElement(Icon, {
            type: "font-size"
        }), /*#__PURE__*/ react.createElement(DropList, {
            show: this.state.show,
            onClose: this.hide
        }, /*#__PURE__*/ react.createElement(HeaderList, {
            onSelectHeader: (header)=>this.editor.insertMarkdown(header)
        })));
    }
}
export { Header as default };

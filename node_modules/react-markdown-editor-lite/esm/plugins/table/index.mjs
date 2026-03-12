import react from "react";
import DropList from "../../components/DropList/index.mjs";
import Icon from "../../components/Icon/index.mjs";
import i18n from "../../i18n/index.mjs";
import { PluginComponent } from "../Plugin.mjs";
import table from "./table.mjs";
class Table extends PluginComponent {
    static pluginName = 'table';
    static defaultConfig = {
        maxRow: 6,
        maxCol: 6
    };
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
        const config = this.editorConfig.table || this.props.config;
        return /*#__PURE__*/ react.createElement("span", {
            className: "button button-type-table",
            title: i18n.get('btnTable'),
            onMouseEnter: this.show,
            onMouseLeave: this.hide
        }, /*#__PURE__*/ react.createElement(Icon, {
            type: "grid"
        }), /*#__PURE__*/ react.createElement(DropList, {
            show: this.state.show,
            onClose: this.hide
        }, /*#__PURE__*/ react.createElement(table, {
            visibility: this.state.show,
            maxRow: config.maxRow,
            maxCol: config.maxCol,
            onSetTable: (option)=>this.editor.insertMarkdown('table', option)
        })));
    }
}
export { Table as default };

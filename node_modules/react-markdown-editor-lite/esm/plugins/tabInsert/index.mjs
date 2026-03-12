import react from "react";
import DropList from "../../components/DropList/index.mjs";
import Icon from "../../components/Icon/index.mjs";
import i18n from "../../i18n/index.mjs";
import { PluginComponent } from "../Plugin.mjs";
import TabMapList from "./TabMapList.mjs";
class TabInsert extends PluginComponent {
    static pluginName = 'tab-insert';
    static defaultConfig = {
        tabMapValue: 1
    };
    handleKeyboard;
    constructor(props){
        super(props);
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.handleChangeMapValue = this.handleChangeMapValue.bind(this);
        this.state = {
            tabMapValue: this.getConfig('tabMapValue'),
            show: false
        };
        this.handleKeyboard = {
            key: 'Tab',
            keyCode: 9,
            aliasCommand: true,
            withKey: [],
            callback: ()=>this.editor.insertMarkdown('tab', {
                    tabMapValue: this.state.tabMapValue
                })
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
    handleChangeMapValue(mapValue) {
        this.setState({
            tabMapValue: mapValue
        });
    }
    componentDidMount() {
        if (this.editorConfig.shortcuts) this.editor.onKeyboard(this.handleKeyboard);
    }
    componentWillUnmount() {
        this.editor.offKeyboard(this.handleKeyboard);
    }
    render() {
        return /*#__PURE__*/ react.createElement("span", {
            className: "button button-type-header",
            title: i18n.get('selectTabMap'),
            onClick: this.show,
            onMouseLeave: this.hide
        }, /*#__PURE__*/ react.createElement(Icon, {
            type: "tab"
        }), /*#__PURE__*/ react.createElement(DropList, {
            show: this.state.show,
            onClose: this.hide
        }, /*#__PURE__*/ react.createElement(TabMapList, {
            value: this.state.tabMapValue,
            onSelectMapValue: this.handleChangeMapValue
        })));
    }
}
export { TabInsert as default };

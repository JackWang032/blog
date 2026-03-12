import react from "react";
import Icon from "../components/Icon/index.mjs";
import i18n from "../i18n/index.mjs";
import { PluginComponent } from "./Plugin.mjs";
class FullScreen extends PluginComponent {
    static pluginName = 'full-screen';
    static align = 'right';
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            enable: this.editor.isFullScreen()
        };
    }
    handleClick() {
        this.editor.fullScreen(!this.state.enable);
    }
    handleChange(enable) {
        this.setState({
            enable
        });
    }
    componentDidMount() {
        this.editor.on('fullscreen', this.handleChange);
    }
    componentWillUnmount() {
        this.editor.off('fullscreen', this.handleChange);
    }
    render() {
        if (this.editorConfig.canView && this.editorConfig.canView.fullScreen) {
            const { enable } = this.state;
            return /*#__PURE__*/ react.createElement("span", {
                className: "button button-type-fullscreen",
                title: i18n.get(enable ? 'btnExitFullScreen' : 'btnFullScreen'),
                onClick: this.handleClick
            }, /*#__PURE__*/ react.createElement(Icon, {
                type: enable ? 'fullscreen-exit' : 'fullscreen'
            }));
        }
        return null;
    }
}
export { FullScreen as default };

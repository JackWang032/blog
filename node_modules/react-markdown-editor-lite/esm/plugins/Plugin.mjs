import react from "react";
class PluginComponent extends react.Component {
    static pluginName = '';
    static align = 'left';
    static defaultConfig = {};
    get editor() {
        return this.props.editor;
    }
    get editorConfig() {
        return this.props.editorConfig;
    }
    get config() {
        return this.props.config;
    }
    getConfig(key, defaultValue) {
        return void 0 !== this.props.config[key] && null !== this.props.config[key] ? this.props.config[key] : defaultValue;
    }
}
export { PluginComponent };

import react from "react";
import Icon from "../components/Icon/index.mjs";
import i18n from "../i18n/index.mjs";
import { PluginComponent } from "./Plugin.mjs";
class ModeToggle extends PluginComponent {
    static pluginName = 'mode-toggle';
    static align = 'right';
    get isDisplay() {
        const { canView } = this.editorConfig;
        if (canView) return [
            canView.html,
            canView.md,
            canView.both
        ].filter((it)=>it).length >= 2;
        return false;
    }
    get next() {
        const { canView } = this.editorConfig;
        const { view } = this.state;
        const actions = [
            0,
            1,
            2
        ];
        if (canView) {
            if (!canView.both) actions.splice(actions.indexOf(0), 1);
            if (!canView.md) actions.splice(actions.indexOf(1), 1);
            if (!canView.html) actions.splice(actions.indexOf(2), 1);
        }
        let current = 1;
        if (view.html) current = 2;
        if (view.html && view.md) current = 0;
        if (0 === actions.length) return current;
        if (1 === actions.length) return actions[0];
        const index = actions.indexOf(current);
        return index < actions.length - 1 ? actions[index + 1] : actions[0];
    }
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            view: this.editor.getView()
        };
    }
    handleClick() {
        switch(this.next){
            case 0:
                this.editor.setView({
                    html: true,
                    md: true
                });
                break;
            case 2:
                this.editor.setView({
                    html: true,
                    md: false
                });
                break;
            case 1:
                this.editor.setView({
                    html: false,
                    md: true
                });
                break;
        }
    }
    handleChange(view) {
        this.setState({
            view
        });
    }
    componentDidMount() {
        this.editor.on('viewchange', this.handleChange);
    }
    componentWillUnmount() {
        this.editor.off('viewchange', this.handleChange);
    }
    getDisplayInfo() {
        const { next } = this;
        switch(next){
            case 0:
                return {
                    icon: 'view-split',
                    title: 'All'
                };
            case 2:
                return {
                    icon: 'visibility',
                    title: 'Preview'
                };
            default:
                return {
                    icon: 'keyboard',
                    title: 'Editor'
                };
        }
    }
    render() {
        if (this.isDisplay) {
            const display = this.getDisplayInfo();
            return /*#__PURE__*/ react.createElement("span", {
                className: "button button-type-mode",
                title: i18n.get(`btnMode${display.title}`),
                onClick: this.handleClick
            }, /*#__PURE__*/ react.createElement(Icon, {
                type: display.icon
            }));
        }
        return null;
    }
}
const modeToggle = ModeToggle;
export { modeToggle as default };

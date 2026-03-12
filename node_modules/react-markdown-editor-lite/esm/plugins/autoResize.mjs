import react from "react";
import { PluginComponent } from "./Plugin.mjs";
class AutoResize extends PluginComponent {
    static pluginName = 'auto-resize';
    static align = 'left';
    static defaultConfig = {
        min: 200,
        max: 1 / 0,
        useTimer: false
    };
    timer = null;
    useTimer;
    constructor(props){
        super(props);
        this.useTimer = this.getConfig('useTimer') || "u" < typeof requestAnimationFrame;
        this.handleChange = this.handleChange.bind(this);
        this.doResize = this.doResize.bind(this);
    }
    doResize() {
        const resizeElement = (e)=>{
            e.style.height = 'auto';
            const height = Math.min(Math.max(this.getConfig('min'), e.scrollHeight), this.getConfig('max'));
            e.style.height = `${height}px`;
            return height;
        };
        this.timer = null;
        const view = this.editor.getView();
        const el = this.editor.getMdElement();
        const previewer = this.editor.getHtmlElement();
        if (el && view.md) {
            const height = resizeElement(el);
            if (previewer) previewer.style.height = `${height}px`;
            return;
        }
        if (previewer && view.html) resizeElement(previewer);
    }
    handleChange() {
        if (null !== this.timer) return;
        if (this.useTimer) {
            this.timer = window.setTimeout(this.doResize);
            return;
        }
        this.timer = requestAnimationFrame(this.doResize);
    }
    componentDidMount() {
        this.editor.on('change', this.handleChange);
        this.editor.on('viewchange', this.handleChange);
        this.handleChange();
    }
    componentWillUnmount() {
        this.editor.off('change', this.handleChange);
        this.editor.off('viewchange', this.handleChange);
        if (null !== this.timer && this.useTimer) {
            window.clearTimeout(this.timer);
            this.timer = null;
        }
    }
    render() {
        return /*#__PURE__*/ react.createElement("span", null);
    }
}
export { AutoResize as default };

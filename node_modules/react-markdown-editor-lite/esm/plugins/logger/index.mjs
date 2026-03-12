import react from "react";
import Icon from "../../components/Icon/index.mjs";
import i18n from "../../i18n/index.mjs";
import { PluginComponent } from "../Plugin.mjs";
import logger from "./logger.mjs";
class Logger extends PluginComponent {
    static pluginName = 'logger';
    logger;
    timerId;
    handleKeyboards = [];
    lastPop = null;
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleRedo = this.handleRedo.bind(this);
        this.handleUndo = this.handleUndo.bind(this);
        this.handleKeyboards = [
            {
                key: 'y',
                keyCode: 89,
                withKey: [
                    'ctrlKey'
                ],
                callback: this.handleRedo
            },
            {
                key: 'z',
                keyCode: 90,
                withKey: [
                    'metaKey',
                    'shiftKey'
                ],
                callback: this.handleRedo
            },
            {
                key: 'z',
                keyCode: 90,
                aliasCommand: true,
                withKey: [
                    'ctrlKey'
                ],
                callback: this.handleUndo
            }
        ];
        this.logger = new logger({
            maxSize: this.editorConfig.loggerMaxSize
        });
        this.editor.registerPluginApi('undo', this.handleUndo);
        this.editor.registerPluginApi('redo', this.handleRedo);
    }
    handleUndo() {
        const last = this.logger.undo(this.editor.getMdValue());
        if (void 0 !== last) {
            this.pause();
            this.lastPop = last;
            this.editor.setText(last);
            this.forceUpdate();
        }
    }
    handleRedo() {
        const last = this.logger.redo();
        if (void 0 !== last) {
            this.lastPop = last;
            this.editor.setText(last);
            this.forceUpdate();
        }
    }
    handleChange(value, e, isNotInput) {
        if (this.logger.getLast() === value || null !== this.lastPop && this.lastPop === value) return;
        this.logger.cleanRedo();
        if (isNotInput) {
            this.logger.push(value);
            this.lastPop = null;
            this.forceUpdate();
            return;
        }
        if (this.timerId) {
            window.clearTimeout(this.timerId);
            this.timerId = 0;
        }
        this.timerId = window.setTimeout(()=>{
            if (this.logger.getLast() !== value) {
                this.logger.push(value);
                this.lastPop = null;
                this.forceUpdate();
            }
            window.clearTimeout(this.timerId);
            this.timerId = 0;
        }, this.editorConfig.loggerInterval);
    }
    componentDidMount() {
        this.editor.on('change', this.handleChange);
        this.handleKeyboards.forEach((it)=>this.editor.onKeyboard(it));
        this.logger.initValue = this.editor.getMdValue();
        this.forceUpdate();
    }
    componentWillUnmount() {
        if (this.timerId) window.clearTimeout(this.timerId);
        this.editor.off('change', this.handleChange);
        this.editor.unregisterPluginApi('undo');
        this.editor.unregisterPluginApi('redo');
        this.handleKeyboards.forEach((it)=>this.editor.offKeyboard(it));
    }
    pause() {
        if (this.timerId) {
            window.clearTimeout(this.timerId);
            this.timerId = void 0;
        }
    }
    render() {
        const hasUndo = this.logger.getUndoCount() > 1 || this.logger.initValue !== this.editor.getMdValue();
        const hasRedo = this.logger.getRedoCount() > 0;
        return /*#__PURE__*/ react.createElement(react.Fragment, null, /*#__PURE__*/ react.createElement("span", {
            className: `button button-type-undo ${hasUndo ? '' : 'disabled'}`,
            title: i18n.get('btnUndo'),
            onClick: this.handleUndo
        }, /*#__PURE__*/ react.createElement(Icon, {
            type: "undo"
        })), /*#__PURE__*/ react.createElement("span", {
            className: `button button-type-redo ${hasRedo ? '' : 'disabled'}`,
            title: i18n.get('btnRedo'),
            onClick: this.handleRedo
        }, /*#__PURE__*/ react.createElement(Icon, {
            type: "redo"
        })));
    }
}
export { Logger as default };

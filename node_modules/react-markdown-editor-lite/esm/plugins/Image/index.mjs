import react from "react";
import Icon from "../../components/Icon/index.mjs";
import i18n from "../../i18n/index.mjs";
import { isPromise } from "../../utils/tool.mjs";
import uploadPlaceholder from "../../utils/uploadPlaceholder.mjs";
import { PluginComponent } from "../Plugin.mjs";
import inputFile from "./inputFile.mjs";
class Image extends PluginComponent {
    static pluginName = 'image';
    inputFile;
    constructor(props){
        super(props);
        this.inputFile = /*#__PURE__*/ react.createRef();
        this.onImageChanged = this.onImageChanged.bind(this);
        this.handleCustomImageUpload = this.handleCustomImageUpload.bind(this);
        this.handleImageUpload = this.handleImageUpload.bind(this);
        this.state = {
            show: false
        };
    }
    handleImageUpload() {
        const { onImageUpload } = this.editorConfig;
        if ('function' == typeof onImageUpload) {
            if (this.inputFile.current) this.inputFile.current.click();
        } else this.editor.insertMarkdown('image');
    }
    onImageChanged(file) {
        const { onImageUpload } = this.editorConfig;
        if (onImageUpload) {
            const placeholder = uploadPlaceholder(file, onImageUpload);
            this.editor.insertPlaceholder(placeholder.placeholder, placeholder.uploaded);
        }
    }
    handleCustomImageUpload(e) {
        const { onCustomImageUpload } = this.editorConfig;
        if (onCustomImageUpload) {
            const res = onCustomImageUpload.call(this, e);
            if (isPromise(res)) res.then((result)=>{
                if (result && result.url) this.editor.insertMarkdown('image', {
                    target: result.text,
                    imageUrl: result.url
                });
            });
        }
    }
    render() {
        const isCustom = !!this.editorConfig.onCustomImageUpload;
        return isCustom ? /*#__PURE__*/ react.createElement("span", {
            className: "button button-type-image",
            title: i18n.get('btnImage'),
            onClick: this.handleCustomImageUpload
        }, /*#__PURE__*/ react.createElement(Icon, {
            type: "image"
        })) : /*#__PURE__*/ react.createElement("span", {
            className: "button button-type-image",
            title: i18n.get('btnImage'),
            onClick: this.handleImageUpload,
            style: {
                position: 'relative'
            }
        }, /*#__PURE__*/ react.createElement(Icon, {
            type: "image"
        }), /*#__PURE__*/ react.createElement(inputFile, {
            accept: this.editorConfig.imageAccept || '',
            ref: this.inputFile,
            onChange: (e)=>{
                e.persist();
                if (e.target.files && e.target.files.length > 0) this.onImageChanged(e.target.files[0]);
            }
        }));
    }
}
export { Image as default };

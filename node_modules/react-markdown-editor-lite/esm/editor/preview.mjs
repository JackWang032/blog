import react from "react";
class Preview extends react.Component {
    el;
    constructor(props){
        super(props);
        this.el = /*#__PURE__*/ react.createRef();
    }
    getElement() {
        return this.el.current;
    }
    getHeight() {
        return this.el.current ? this.el.current.offsetHeight : 0;
    }
}
class HtmlRender extends Preview {
    getHtml() {
        if ('string' == typeof this.props.html) return this.props.html;
        if (this.el.current) return this.el.current.innerHTML;
        return '';
    }
    render() {
        return 'string' == typeof this.props.html ? /*#__PURE__*/ react.createElement('div', {
            ref: this.el,
            dangerouslySetInnerHTML: {
                __html: this.props.html
            },
            className: this.props.className || 'custom-html-style'
        }) : /*#__PURE__*/ react.createElement('div', {
            ref: this.el,
            className: this.props.className || 'custom-html-style'
        }, this.props.html);
    }
}
const preview = HtmlRender;
export { HtmlRender, Preview, preview as default };

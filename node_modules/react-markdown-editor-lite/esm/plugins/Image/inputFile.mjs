import react from "react";
class InputFile extends react.Component {
    timerId;
    locked;
    input;
    constructor(props){
        super(props);
        this.timerId = void 0;
        this.locked = false;
        this.input = /*#__PURE__*/ react.createRef();
    }
    click() {
        if (this.locked || !this.input.current) return;
        this.locked = true;
        this.input.current.value = '';
        this.input.current.click();
        if (this.timerId) window.clearTimeout(this.timerId);
        this.timerId = window.setTimeout(()=>{
            this.locked = false;
            window.clearTimeout(this.timerId);
            this.timerId = void 0;
        }, 200);
    }
    componentWillUnmount() {
        if (this.timerId) window.clearTimeout(this.timerId);
    }
    render() {
        return /*#__PURE__*/ react.createElement("input", {
            type: "file",
            ref: this.input,
            accept: this.props.accept,
            style: {
                position: 'absolute',
                zIndex: -1,
                left: 0,
                top: 0,
                width: 0,
                height: 0,
                opacity: 0
            },
            onChange: this.props.onChange
        });
    }
}
const inputFile = InputFile;
export { inputFile as default };

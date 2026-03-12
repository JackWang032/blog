import react from "react";
import { PluginComponent } from "../Plugin.mjs";
class Divider extends PluginComponent {
    static pluginName = 'divider';
    render() {
        return /*#__PURE__*/ react.createElement("span", {
            className: "rc-md-divider"
        });
    }
}
export { Divider as default };

import classnames from "classnames";
import react from "react";
import i18n from "../../i18n/index.mjs";
class TabMapList extends react.Component {
    handleSelectMapValue(mapValue) {
        const { onSelectMapValue } = this.props;
        if ('function' == typeof onSelectMapValue) onSelectMapValue(mapValue);
    }
    render() {
        const { value } = this.props;
        return /*#__PURE__*/ react.createElement("ul", {
            className: "tab-map-list"
        }, [
            1,
            2,
            4,
            8
        ].map((it)=>/*#__PURE__*/ react.createElement("li", {
                key: it,
                className: classnames('list-item', {
                    active: value === it
                })
            }, /*#__PURE__*/ react.createElement("div", {
                onClick: this.handleSelectMapValue.bind(this, it)
            }, 1 === it ? i18n.get('tab') : `${it} ${i18n.get('spaces')}`))));
    }
}
const tabInsert_TabMapList = TabMapList;
export { tabInsert_TabMapList as default };

function deepClone(obj) {
    if (!obj || 'object' != typeof obj) return obj;
    const objArray = Array.isArray(obj) ? [] : {};
    if (obj && 'object' == typeof obj) {
        for(const key in obj)if (Object.prototype.hasOwnProperty.call(obj, key)) if (obj[key] && 'object' == typeof obj[key]) objArray[key] = deepClone(obj[key]);
        else objArray[key] = obj[key];
    }
    return objArray;
}
function isEmpty(obj) {
    return null == obj || '' === obj;
}
function isPromise(obj) {
    return obj && (obj instanceof Promise || ('object' == typeof obj || 'function' == typeof obj) && 'function' == typeof obj.then);
}
function repeat(str, num) {
    let result = '';
    let n = num;
    while(n--)result += str;
    return result;
}
function isKeyMatch(event, cond) {
    const { withKey, keyCode, key, aliasCommand } = cond;
    const e = {
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
        altKey: event.altKey,
        shiftKey: event.shiftKey,
        keyCode: event.keyCode,
        key: event.key
    };
    if (aliasCommand) e.ctrlKey = e.ctrlKey || e.metaKey;
    if (withKey && withKey.length > 0) {
        for (const it of withKey)if (void 0 !== e[it] && !e[it]) return false;
    } else if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
    if (e.key) return e.key === key;
    return e.keyCode === keyCode;
}
function getLineAndCol(text, pos) {
    const lines = text.split('\n');
    const beforeLines = text.substr(0, pos).split('\n');
    const line = beforeLines.length;
    const col = beforeLines[beforeLines.length - 1].length;
    const curLine = lines[beforeLines.length - 1];
    const prevLine = beforeLines.length > 1 ? beforeLines[beforeLines.length - 2] : null;
    const nextLine = lines.length > beforeLines.length ? lines[beforeLines.length] : null;
    return {
        line,
        col,
        beforeText: text.substr(0, pos),
        afterText: text.substr(pos),
        curLine,
        prevLine,
        nextLine
    };
}
export { deepClone, getLineAndCol, isEmpty, isKeyMatch, isPromise, repeat };

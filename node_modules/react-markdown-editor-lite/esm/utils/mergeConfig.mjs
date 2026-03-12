function mergeObject(obj1, obj2) {
    const result = {};
    Object.keys(obj1).forEach((k)=>{
        if (void 0 === obj2[k]) {
            result[k] = obj1[k];
            return;
        }
        if ('object' == typeof obj2[k]) {
            if (Array.isArray(obj2[k])) result[k] = [
                ...obj2[k]
            ];
            else result[k] = mergeObject(obj1[k], obj2[k]);
            return;
        }
        result[k] = obj2[k];
    });
    return result;
}
function mergeConfig(defaultConfig, ...configs) {
    let res = {
        ...defaultConfig
    };
    configs.forEach((conf)=>{
        if ('object' != typeof conf) return;
        res = mergeObject(res, conf);
    });
    return res;
}
export { mergeConfig as default };

const defaultConfig = {
    theme: 'default',
    view: {
        menu: true,
        md: true,
        html: true
    },
    canView: {
        menu: true,
        md: true,
        html: true,
        both: true,
        fullScreen: true,
        hideMenu: true
    },
    htmlClass: '',
    markdownClass: '',
    syncScrollMode: [
        'rightFollowLeft',
        'leftFollowRight'
    ],
    imageUrl: '',
    imageAccept: '',
    linkUrl: '',
    loggerMaxSize: 100,
    loggerInterval: 600,
    table: {
        maxRow: 4,
        maxCol: 6
    },
    allowPasteImage: true,
    onImageUpload: void 0,
    onCustomImageUpload: void 0,
    shortcuts: true,
    onChangeTrigger: 'both'
};
const editor_defaultConfig = defaultConfig;
export { editor_defaultConfig as default };

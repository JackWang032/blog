"use strict";
var __webpack_require__ = {};
(()=>{
    __webpack_require__.d = (exports1, definition)=>{
        for(var key in definition)if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports1, key)) Object.defineProperty(exports1, key, {
            enumerable: true,
            get: definition[key]
        });
    };
})();
(()=>{
    __webpack_require__.o = (obj, prop)=>Object.prototype.hasOwnProperty.call(obj, prop);
})();
(()=>{
    __webpack_require__.r = (exports1)=>{
        if ("u" > typeof Symbol && Symbol.toStringTag) Object.defineProperty(exports1, Symbol.toStringTag, {
            value: 'Module'
        });
        Object.defineProperty(exports1, '__esModule', {
            value: true
        });
    };
})();
var __webpack_exports__ = {};
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
    default: ()=>decorate
});
const external_tool_js_namespaceObject = require("./tool.js");
const SIMPLE_DECORATOR = {
    bold: [
        '**',
        '**'
    ],
    italic: [
        '*',
        '*'
    ],
    underline: [
        '++',
        '++'
    ],
    strikethrough: [
        '~~',
        '~~'
    ],
    quote: [
        '\n> ',
        '\n'
    ],
    inlinecode: [
        '`',
        '`'
    ],
    code: [
        '\n```\n',
        '\n```\n'
    ]
};
for(let i = 1; i <= 6; i++)SIMPLE_DECORATOR[`h${i}`] = [
    `\n${(0, external_tool_js_namespaceObject.repeat)('#', i)} `,
    '\n'
];
function decorateTableText(option) {
    const { row = 2, col = 2 } = option;
    const rowHeader = [
        '|'
    ];
    const rowData = [
        '|'
    ];
    const rowDivision = [
        '|'
    ];
    let colStr = '';
    for(let i = 1; i <= col; i++){
        rowHeader.push(' Head |');
        rowDivision.push(' --- |');
        rowData.push(' Data |');
    }
    for(let j = 1; j <= row; j++)colStr += '\n' + rowData.join('');
    return `${rowHeader.join('')}\n${rowDivision.join('')}${colStr}`;
}
function decorateList(type, target) {
    let text = target;
    if ('\n' !== text.substr(0, 1)) text = '\n' + text;
    if ('unordered' === type) return text.length > 1 ? text.replace(/\n/g, '\n* ').trim() : '* ';
    {
        let count = 1;
        if (text.length > 1) return text.replace(/\n/g, ()=>`\n${count++}. `).trim();
        return '1. ';
    }
}
function createTextDecorated(text, newBlock) {
    return {
        text,
        newBlock,
        selection: {
            start: text.length,
            end: text.length
        }
    };
}
function getDecorated(target, type, option) {
    if (void 0 !== SIMPLE_DECORATOR[type]) return {
        text: `${SIMPLE_DECORATOR[type][0]}${target}${SIMPLE_DECORATOR[type][1]}`,
        selection: {
            start: SIMPLE_DECORATOR[type][0].length,
            end: SIMPLE_DECORATOR[type][0].length + target.length
        }
    };
    switch(type){
        case 'tab':
            const inputValue = 1 === option.tabMapValue ? '\t' : ' '.repeat(option.tabMapValue);
            const newSelectedText = inputValue + target.replace(/\n/g, `\n${inputValue}`);
            const lineBreakCount = target.includes('\n') ? target.match(/\n/g).length : 0;
            return {
                text: newSelectedText,
                selection: {
                    start: option.tabMapValue,
                    end: option.tabMapValue * (lineBreakCount + 1) + target.length
                }
            };
        case 'unordered':
            return createTextDecorated(decorateList('unordered', target), true);
        case 'order':
            return createTextDecorated(decorateList('order', target), true);
        case 'hr':
            return createTextDecorated('---', true);
        case 'table':
            return {
                text: decorateTableText(option),
                newBlock: true
            };
        case 'image':
            return {
                text: `![${target || option.target}](${option.imageUrl || ''})`,
                selection: {
                    start: 2,
                    end: target.length + 2
                }
            };
        case 'link':
            return {
                text: `[${target}](${option.linkUrl || ''})`,
                selection: {
                    start: 1,
                    end: target.length + 1
                }
            };
    }
    return {
        text: target,
        selection: {
            start: 0,
            end: target.length
        }
    };
}
const decorate = getDecorated;
exports["default"] = __webpack_exports__["default"];
for(var __rspack_i in __webpack_exports__)if (-1 === [
    "default"
].indexOf(__rspack_i)) exports[__rspack_i] = __webpack_exports__[__rspack_i];
Object.defineProperty(exports, '__esModule', {
    value: true
});

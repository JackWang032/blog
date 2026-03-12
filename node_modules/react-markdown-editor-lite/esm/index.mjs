import DropList from "./components/DropList/index.mjs";
import editor from "./editor/index.mjs";
import autoResize from "./plugins/autoResize.mjs";
import code_block from "./plugins/block/code-block.mjs";
import code_inline from "./plugins/block/code-inline.mjs";
import quote from "./plugins/block/quote.mjs";
import wrap from "./plugins/block/wrap.mjs";
import clear from "./plugins/clear.mjs";
import bold from "./plugins/font/bold.mjs";
import italic from "./plugins/font/italic.mjs";
import strikethrough from "./plugins/font/strikethrough.mjs";
import underline from "./plugins/font/underline.mjs";
import fullScreen from "./plugins/fullScreen.mjs";
import header from "./plugins/header/index.mjs";
import Image from "./plugins/Image/index.mjs";
import plugins_link from "./plugins/link.mjs";
import ordered from "./plugins/list/ordered.mjs";
import unordered from "./plugins/list/unordered.mjs";
import logger from "./plugins/logger/index.mjs";
import modeToggle from "./plugins/modeToggle.mjs";
import { PluginComponent } from "./plugins/Plugin.mjs";
import tabInsert from "./plugins/tabInsert/index.mjs";
import table from "./plugins/table/index.mjs";
import decorate from "./utils/decorate.mjs";
editor.use(header);
editor.use(bold);
editor.use(italic);
editor.use(underline);
editor.use(strikethrough);
editor.use(unordered);
editor.use(ordered);
editor.use(quote);
editor.use(wrap);
editor.use(code_inline);
editor.use(code_block);
editor.use(table);
editor.use(Image);
editor.use(plugins_link);
editor.use(clear);
editor.use(logger);
editor.use(modeToggle);
editor.use(fullScreen);
const Plugins = {
    Header: header,
    FontBold: bold,
    FontItalic: italic,
    FontUnderline: underline,
    FontStrikethrough: strikethrough,
    ListUnordered: unordered,
    ListOrdered: ordered,
    BlockQuote: quote,
    BlockWrap: wrap,
    BlockCodeInline: code_inline,
    BlockCodeBlock: code_block,
    Table: table,
    Image: Image,
    Link: plugins_link,
    Clear: clear,
    Logger: logger,
    ModeToggle: modeToggle,
    FullScreen: fullScreen,
    AutoResize: autoResize,
    TabInsert: tabInsert
};
const src = editor;
export { DropList, PluginComponent, Plugins, src as default, decorate as getDecorated };

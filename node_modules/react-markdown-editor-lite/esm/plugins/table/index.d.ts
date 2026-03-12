import { PluginComponent } from '../Plugin';
interface State {
    show: boolean;
}
interface Config {
    maxRow?: number;
    maxCol?: number;
}
export default class Table extends PluginComponent<State, Config> {
    static pluginName: string;
    static defaultConfig: {
        maxRow: number;
        maxCol: number;
    };
    constructor(props: any);
    private show;
    private hide;
    render(): import("react/jsx-runtime").JSX.Element;
}
export {};

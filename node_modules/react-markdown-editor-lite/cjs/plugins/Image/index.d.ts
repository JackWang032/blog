import { PluginComponent } from '../Plugin';
interface State {
    show: boolean;
}
export default class Image extends PluginComponent<State> {
    static pluginName: string;
    private inputFile;
    constructor(props: any);
    private handleImageUpload;
    private onImageChanged;
    private handleCustomImageUpload;
    render(): import("react/jsx-runtime").JSX.Element;
}
export {};

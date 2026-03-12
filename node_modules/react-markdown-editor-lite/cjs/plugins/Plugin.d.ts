import React from 'react';
import type Editor from '../editor';
import type { EditorConfig, PluginProps } from '../share/var';
export declare abstract class PluginComponent<S = any, C = any, P extends PluginProps = PluginProps<C>> extends React.Component<P, S> {
    static pluginName: string;
    static align: string;
    static defaultConfig: {};
    protected get editor(): Editor;
    protected get editorConfig(): EditorConfig;
    protected get config(): C;
    protected getConfig(key: string, defaultValue?: any): any;
}

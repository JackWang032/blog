import React, { type PropsWithChildren } from 'react';
interface DropListProps {
    show: boolean;
    onClose?: () => void;
}
declare class DropList extends React.Component<PropsWithChildren<DropListProps>, any> {
    constructor(props: any);
    handleClose(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void;
    render(): import("react/jsx-runtime").JSX.Element;
}
export default DropList;

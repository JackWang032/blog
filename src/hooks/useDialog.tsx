import { useState, useCallback } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ReactDOM from "react-dom";

interface DialogOptions {
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
}

interface DialogHookResult {
    modalSlot: React.ReactElement;
    show: (options: DialogOptions) => Promise<boolean>;
}

export function useDialog(): DialogHookResult {
    const [dialogState, setDialogState] = useState<{
        isOpen: boolean;
        options: DialogOptions | null;
        resolve: ((value: boolean) => void) | null;
    }>({
        isOpen: false,
        options: null,
        resolve: null,
    });

    const show = useCallback((options: DialogOptions) => {
        return new Promise<boolean>((resolve) => {
            setDialogState({
                isOpen: true,
                options,
                resolve,
            });
        });
    }, []);

    const handleClose = useCallback(() => {
        if (dialogState.resolve) {
            dialogState.resolve(false);
        }
        setDialogState((prev) => ({ ...prev, isOpen: false }));
    }, [dialogState]);

    const handleConfirm = useCallback(() => {
        if (dialogState.resolve) {
            dialogState.resolve(true);
        }
        setDialogState((prev) => ({ ...prev, isOpen: false }));
    }, [dialogState]);

    const Dialog = useCallback(() => {
        if (!dialogState.options) return null;

        const { title, description, confirmText = "确认", cancelText = "取消" } = dialogState.options;

        return (
            <AlertDialog open={dialogState.isOpen} onOpenChange={(open) => !open && handleClose()}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{title}</AlertDialogTitle>
                        <AlertDialogDescription>{description}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleClose}>{cancelText}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm}>{confirmText}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    }, [dialogState, handleClose, handleConfirm]);

    const modalSlot = ReactDOM.createPortal(<Dialog />, document.body);

    return { show, modalSlot };
}

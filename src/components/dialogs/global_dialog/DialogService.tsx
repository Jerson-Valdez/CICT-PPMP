import { createRoot } from 'react-dom/client';
import GlobalDialog, { type DialogUIProps } from './GlobalDialog';

type DialogOptions = Omit<DialogUIProps, 'isOpen' | 'onConfirm' | 'onCancel'>;

let activeForceClose: (() => void) | null = null;

export const showDialog = (options: DialogOptions): Promise<boolean> => {
    return new Promise((resolve) => {
        const dialogContainer = document.createElement('div');
        document.body.appendChild(dialogContainer);
        
        const root = createRoot(dialogContainer);

        const cleanup = () => {
            root.render(
                <GlobalDialog
                    {...options}
                    isOpen={false} 
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            );

            setTimeout(() => {
                root.unmount();
                dialogContainer.remove();
            }, 250); 
        };

        const handleConfirm = () => {
            cleanup();
            resolve(true);
        };

        const handleCancel = () => {
            cleanup();
            resolve(false); 
        };

        activeForceClose = () => {
            handleCancel();
        };

        root.render(
            <GlobalDialog
                {...options}
                isOpen={true}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        );
    });
};

export const notify = (title: string, message: string, type: DialogOptions['type'] = "info", confirmButtonText: string = "OK") => 
    showDialog({ title, message, type, mode: "notification", confirmButtonText });

export const confirm = (title: string, message: string, type: DialogOptions['type'] = "info", confirmButtonText: string = "OK") => 
    showDialog({ title, message, type, mode: "confirmation", confirmButtonText });

export const closeConfirmDialog = () => {
    if (activeForceClose) {
        activeForceClose();
    }
};
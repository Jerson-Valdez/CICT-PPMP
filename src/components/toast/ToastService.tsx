import { createRoot } from 'react-dom/client';
import Toast, { type ToastProps } from './Toast';

const getToastContainer = () => {
    let container = document.getElementById('global-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'global-toast-container';
        container.className = 'fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none';
        document.body.appendChild(container);
    }
    return container;
};

type ToastOptions = Omit<ToastProps, 'onClose'>;

export const showToast = ({ message, type = "info", duration = 5000 }: ToastOptions) => {
    const container = getToastContainer();

    const toastWrapper = document.createElement('div');
    container.appendChild(toastWrapper);
    
    const root = createRoot(toastWrapper);

    const cleanup = () => {
        root.unmount();
        toastWrapper.remove();
        
        if (container.childNodes.length === 0) {
            container.remove();
        }
    };

    root.render(
        <Toast
            message={message}
            type={type}
            duration={duration}
            onClose={cleanup}
        />
    );
};

export const toast = {
    success: (message: string, duration?: number) => showToast({ message, type: "success", duration }),
    error: (message: string, duration?: number) => showToast({ message, type: "error", duration }),
    info: (message: string, duration?: number) => showToast({ message, type: "info", duration }),
    warning: (message: string, duration?: number) => showToast({ message, type: "warning", duration }),
};
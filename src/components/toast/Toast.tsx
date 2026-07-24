import "./toast.css";
import { IconCircleCheck, IconExclamationCircle, IconXboxX, IconAlertTriangle } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

export interface ToastProps {
    message: string;
    type: "success" | "error" | "info" | "warning";
    duration?: number;
    onClose: () => void;
}

export default function Toast({ message, type, duration = 5000, onClose }: ToastProps) {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    return (
        <div className={`toast ${type} ${isClosing ? 'closing' : ''}`}>
            <div className={`icon ${type === "success" ? "green" : type === "error" ? "red" : type === "warning" ? "yellow" : "blue"}`}>
                {type === "success" && <IconCircleCheck size={20} />}   
                {type === "error" && <IconXboxX size={20} />}
                {type === "warning" && <IconAlertTriangle size={20} />}
                {type === "info" && <IconExclamationCircle size={20} />}
            </div>
        
            <p>{message}</p>
        </div>
    );
}
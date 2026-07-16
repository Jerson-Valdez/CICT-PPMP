import { useEffect, useRef } from "react";
import "./circle-loading-dialog.css";
import { FourSquare } from "react-loading-indicators";

export interface CircleLoadingDialogProps {
    isOpen: boolean;
    onClose?: () => void;
}

export default function CircleLoadingDialog({ isOpen }: CircleLoadingDialogProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen && !dialog.open) {
            dialog.showModal();
        } else if (!isOpen && dialog.open) {
            dialog.close();
        }
    }, [isOpen]);

    return (
        <dialog ref={dialogRef} className="circle-loading-dialog">
            <FourSquare color="var(--primary)" size="large" text="Loading..."/>
        </dialog>
    );
}
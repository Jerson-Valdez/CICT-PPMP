import "./print-pr.css";
import { IconPrinter, IconX } from '@tabler/icons-react';
import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print"; 

interface PrintPRProps {
    prId?: number;
    itemName: string;
    itemDescription: string;
    quantity: number;
    unitPrice: number;
    requestedDate: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function PrintPR({ prId, itemName, itemDescription, quantity, unitPrice, requestedDate, isOpen, onClose }: PrintPRProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const printRef = useRef<HTMLDivElement>(null);
    const printDate = new Date().toLocaleDateString();
    const totalPrice = quantity * unitPrice;

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen) {
            if (!dialog.hasAttribute('open')) {
                dialog.showModal();
            }
        } else {
            dialog.close();
        }
    }, [isOpen]);

    const handleCancel = (e: React.SyntheticEvent) => {
        e.preventDefault(); 
        onClose();          
    };

    const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        onClose();
    };

    const handlePrint = useReactToPrint({
        contentRef: printRef, 
        documentTitle: `Purchase_Request_${prId || 'New'}`,
        pageStyle: `
            @page {
                size: auto;
                margin: 25mm 20mm;
            }
        `
    });

    return (
        <dialog className="print-pr" ref={dialogRef} onCancel={handleCancel}>
            <div className="header">
                <div className="icon blue">
                    <IconPrinter size={24} />
                </div>
                <h3>Print Purchase Request</h3>
            </div>
            
            <div className="print-purchase-request-info" ref={printRef}>
                <h4>Bulacan State University</h4>   
                <p>CICT Department Procurement</p>
                <div className="pr-title">
                    <h3>PURCHASE REQUEST</h3>
                </div>
                <hr />
                <div className="pr-id-date">
                    <p>PR ID: <span>PR-{prId}</span></p>
                    <p>Date: <span>{printDate}</span></p>
                </div>
                <div className="pr-unit-date">
                    <p>Unit: <span>CICT Department</span></p>
                    <p>Requested Date: <span>{new Date(requestedDate).toLocaleString('en-PH')}</span></p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Item Description</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><div className="item-description">
                                    <h4>{itemName}</h4>
                                    <p>{itemDescription}</p>
                                </div>
                            </td>
                            <td>{quantity}</td>
                            <td>PHP {unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td>PHP {totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                        <tr>
                            <td colSpan={3} className="total-label">Grand Total:</td>
                            <td>PHP {totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                    </tbody>
                </table>
                <div className="signature-row">
                    <div className="signature">
                        <hr />
                        <p>Requested By:</p>
                    </div>
                    <div className="signature">
                        <hr />
                        <p>Approved By:</p>
                    </div>
                </div>
            </div>
            
            <div className="action-btns">
                <button className="btn-secondary" onClick={handleClose}>
                    <IconX size={18} />
                    Cancel
                </button>
                <button className="btn-solid blue" onClick={handlePrint}>
                    <IconPrinter size={18} />
                    Print Document
                </button>
            </div>
        </dialog>
    );
}
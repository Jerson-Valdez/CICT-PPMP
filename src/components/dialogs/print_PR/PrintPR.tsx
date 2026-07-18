import "./print-pr.css";
import { IconPrinter, IconX } from '@tabler/icons-react';
import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print"; 
import { useOutletContext } from "react-router";

interface PrintPRProps {
    prId?: number;
    itemName: string;
    itemDescription: string;
    unitMeasurement: string;
    quantity: number;
    unitPrice: number;
    requestedDate: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function PrintPR({ prId, itemName, itemDescription, unitMeasurement, quantity, unitPrice, requestedDate, isOpen, onClose }: PrintPRProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const printRef = useRef<HTMLDivElement>(null);
    const printDate = new Date().toLocaleDateString();
    const stockPropertyNoCounter = 1;
    const totalPrice = quantity * unitPrice;
    
    const { selectedFiscalYear, deanName, prAsignatories } = useOutletContext<{ selectedFiscalYear: string, deanName: string, prAsignatories: any }>();

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
                <div className="pr-title">
                    <h3>PURCHASE REQUEST</h3>
                </div>

                <div className="entity-fundcluster">
                    <p>Entity: <strong>Bulacan State University</strong></p>
                    <p>Fund Cluster: __________________________</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <td colSpan={2}>
                                <div>
                                    <p>Office Section:</p>
                                    <p>-</p>
                                </div>
                            </td>
                            <td colSpan={2}>
                                <div>
                                    <p>PR No.: <strong>{prId}</strong></p>
                                    <p>Responsibility Center Code: </p>
                                </div>
                            </td>
                            <td colSpan={2}>
                                <div>
                                    <p>Date: {printDate}</p>
                                    <p>Requested Date: {new Date(requestedDate).toLocaleString('en-PH')}</p>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th><strong>Stock/Property No.</strong></th>
                            <th><strong>Unit</strong></th>
                            <th><strong>Item Description</strong></th>
                            <th><strong>Quantity</strong></th>
                            <th><strong>Unit Cost</strong></th>
                            <th><strong>Total Cost</strong></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{stockPropertyNoCounter}</td>
                            <td>{unitMeasurement}</td>
                            <td>
                                <div>
                                    <p className="font-semibold">{itemName}</p>
                                    <p className="font-light">{itemDescription}</p>
                                </div>
                            </td>
                            <td>{quantity}</td>
                            <td>{unitPrice.toFixed(2)}</td>
                            <td>{totalPrice.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td><strong>{totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                        </tr>
                        <tr>
                            <td colSpan={6} className="purpose">
                                <p>Purpose: </p>
                            </td>
                        </tr>
                        <tr>
                            <td className="sign" colSpan={2}></td>
                            <td className="sign-label" colSpan={2}><strong>Requested by:</strong></td>
                            <td className="sign-label" colSpan={2}><strong>Approved:</strong></td>
                        </tr>
                        <tr>
                            <td className="sign" colSpan={2}><strong>Signature:</strong></td>
                            <td className="sign signature" colSpan={2}></td>
                            <td className="sign signature" colSpan={2}></td>
                        </tr>
                        <tr>
                            <td className="sign" colSpan={2}><strong>Printed Name:</strong></td>
                            <td className="sign-label uppercase" colSpan={2}><strong>{deanName}</strong></td>
                            <td className="sign-label uppercase" colSpan={2}><strong>{prAsignatories.map((signatory: any) => signatory.fullName).join(", ")}</strong></td>
                        </tr>
                        <tr><td className="sign" colSpan={2}><strong>Designation:</strong></td>
                            <td className="sign-label" colSpan={2}><p className="text-xs italic font-light">Dean, CICT</p></td>
                            <td className="sign-label" colSpan={2}><p className="text-xs italic font-light">{prAsignatories.map((signatory: any) => signatory.position).join(", ")}</p></td>
                        </tr>
                    </tbody>
                </table>
                <p>To be accomplished by the Procurement Office:</p>
                <p>Included in the: {selectedFiscalYear} Revised PPMP</p> 
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
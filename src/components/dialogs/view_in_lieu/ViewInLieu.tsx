import "./view-in-lieu.css";
import { IconFileStack, IconX, IconChecklist, IconPrinter } from '@tabler/icons-react';
import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";

interface Item {
    itemId: number;
    quantity: number;
    itemName: string;
    unitMeasurement: string;
    priceCatalog: number;
    availableQuantityAfter?: number;
    plannedQuantity?: number;
}

interface BudgetImpact {
    originalItemsTotal: number;
    proposedItemsTotal: number;
    difference: number;
}

interface ViewInLieuProps {
    inLieuId?: number;
    requestDate?: string;
    requestedBy?: string;
    status?: string;
    originalItems?: Item[];
    proposedItems?: Item[];
    budgetImpact?: BudgetImpact;
    isOpen: boolean;
    onClose: () => void;
}

export default function ViewInLieu({inLieuId, requestDate, requestedBy, status, originalItems, proposedItems, budgetImpact, isOpen, onClose }: ViewInLieuProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const printRef = useRef<HTMLDivElement>(null);

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
        documentTitle: `In_Lieu_Request_${inLieuId || 'New'}`,
        pageStyle: `
            @page {
                size: auto;
                margin: 25mm 20mm;
            }
        `
    });

    return (
        <dialog className="view-in-lieu" ref={dialogRef} onCancel={handleCancel}>
            <div className="header">
                <div className="icon blue">
                    <IconFileStack size={24} />
                </div>
                <div className="title">
                    <h3>View In Lieu Request</h3>
                    <p>Detailed Information of the Request</p>
                </div>
            </div>
            <div className="content" ref={printRef}>
                <div className="top-content">
                    <p><strong>Request Date: </strong> {new Date(requestDate ?? '').toLocaleString('en-PH')}</p>
                    <p><strong>Requested By: </strong> {requestedBy}</p>
                    <div><strong>Current Status: </strong> <div className={`status ${status?.toLowerCase()}`}>{status}</div></div>
                </div>
                <div className="table-content original">
                    <h3>Original Items (Surrendered)</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Original Items</th>
                                <th>Reduced Qty</th>
                                <th>Measurement Unit</th>
                                <th>Available Quantity After Deduction</th>
                                <th>Planned Quantity</th>
                                <th>Unit Price</th>
                                <th>Total Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {originalItems?.map((item) => (
                                <tr key={item.itemId ?? '-'}>
                                    <td>{item.itemName ?? '-'}</td>
                                    <td>-{item.quantity ?? '-'}</td>
                                    <td>{item.unitMeasurement  ?? '-'}</td>
                                    <td>{item.availableQuantityAfter ?? '-'}</td>
                                    <td>{item.plannedQuantity ?? '-'}</td>
                                    <td>PHP {item.priceCatalog.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td>PHP {(item.quantity * item.priceCatalog).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })  ?? '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="total">
                        <p><strong>Total Value:</strong> PHP {budgetImpact?.originalItemsTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                </div>
                <div className="table-content substitute">
                    <h3>Proposed Substitution (Requested)</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Proposed Items</th>
                                <th>Increase Qty</th>
                                <th>Measurement Unit</th>
                                <th>Unit Price</th>
                                <th>Total Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {proposedItems?.map((item) => (
                                <tr key={item.itemId}>
                                    <td>{item.itemName}</td>
                                    <td>+{item.quantity}</td>
                                    <td>{item.unitMeasurement}</td>
                                    <td>PHP {item.priceCatalog.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td>PHP {(item.quantity * item.priceCatalog).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="total">
                        <p><strong>Total Value:</strong> PHP {budgetImpact?.proposedItemsTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                </div>
                <div className="financial-summary">
                    <h3>Financial Summary</h3>
                    <p><strong>Total Value of Original Items:</strong> PHP {budgetImpact?.originalItemsTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p><strong>Total Value of Proposed Items:</strong> PHP {budgetImpact?.proposedItemsTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p><strong>Net Budget Impact (Final):</strong> PHP {budgetImpact?.difference.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
            </div>
            <div className="action-btns">
                <div className="cancel-btn-container">
                    <button className="btn-secondary" onClick={handleClose}>
                        <IconX size={18} /> Close
                    </button>
                </div>
                <button className="btn-solid blue" onClick={handlePrint}>
                    <IconPrinter size={18} /> Print
                </button>
                {status === "Pending" && (
                    <>
                        <button className="btn-solid green">
                            <IconChecklist size={18} /> Approve
                        </button>
                        <button className="btn-solid red">
                            <IconX size={18} /> Reject
                        </button>
                    </>
                )}
            </div>
        </dialog>
    );
}
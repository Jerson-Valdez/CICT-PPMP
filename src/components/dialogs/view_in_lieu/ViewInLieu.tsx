import "./view-in-lieu.css";
import { IconFileStack, IconX, IconChecklist, IconPrinter } from '@tabler/icons-react';
import { useEffect, useRef } from "react";
import { useOutletContext } from "react-router";
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

interface ViewInLieuProps {
    inLieuId?: number;
    requestDate?: string;
    status?: string;
    originalItems?: Item[];
    proposedItems?: Item[];
    isOpen: boolean;
    onClose: () => void;
}

export default function ViewInLieu({inLieuId, requestDate, status, originalItems, proposedItems, isOpen, onClose }: ViewInLieuProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const printRef = useRef<HTMLDivElement>(null);
    const { selectedFiscalYear, deanName, revisedAsignatories } = useOutletContext<{ selectedFiscalYear: string, deanName: string, revisedAsignatories: any }>();
    const parsedRequestDate = requestDate ? new Date(String(requestDate)) : null;
    const requestMonthIndex = parsedRequestDate ? parsedRequestDate.getMonth() : null;

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
                <div className="title">
                    <h3>REVISED PROJECT PROCUREMENT MANAGEMENT PLAN {selectedFiscalYear}</h3>
                </div>
                <p>END-USER/UNIT: <u>CICT</u></p>
                <p>SOURCE OF FUND: ________________</p>
                <table>
                    <thead>
                        <tr>
                            <th rowSpan={2}>NO.</th>
                            <th rowSpan={2}>GENERAL DESCRIPTION</th>
                            <th rowSpan={2}>UNIT OF MEASUREMENT</th>
                            <th colSpan={13}>SCHEDULE/MILESTONES OF ACTIVITIES</th>
                            <th rowSpan={2}>PRICE CATALOGUE</th>
                            <th rowSpan={2}>AMOUNT</th>
                        </tr>
                        <tr>
                            <th>JAN</th>
                            <th>FEB</th>
                            <th>MAR</th>
                            <th>APR</th>
                            <th>MAY</th>
                            <th>JUN</th>
                            <th>JUL</th>
                            <th>AUG</th>
                            <th>SEP</th>
                            <th>OCT</th>
                            <th>NOV</th>
                            <th>DEC</th>
                            <th>TOTAL</th>
                        </tr>
                        <tr>
                            <th colSpan={2} className="bg-gray-200">OTHER SUPPLIES AND MATERIALS</th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {originalItems && originalItems.map((item, index) => (
                            <tr key={item.itemId}>
                                <td>{index + 1}</td>
                                <td className="text-left">{item.itemName}</td>
                                <td>{item.unitMeasurement}</td>
                                
                                {Array.from({ length: 12 }).map((_, monthIndex) => (
                                    <td key={monthIndex}>
                                        {requestMonthIndex === monthIndex ? item.quantity : ""}
                                    </td>
                                ))}

                                <td>{item.quantity}</td>

                                <td className="text-right">{item.priceCatalog.toFixed(2)}</td>
                                <td className="text-right">{(item.priceCatalog * item.quantity).toFixed(2)}</td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={2} className="text-right bg-gray-200"><strong>TOTAL AMOUNT</strong></td>
                            <td colSpan={16} className="text-right bg-gray-200"><strong>{originalItems ? originalItems.reduce((total, item) => total + (item.priceCatalog * item.quantity), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}</strong></td>
                        </tr>
                    </tbody>
                </table>
                <p>"in lieu of" </p>
                <table className="in-lieu-table">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Quantity</th>
                            <th>Item</th>
                            <th>Unit of Measurement</th>
                            <th>Price as per Catalogue</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {proposedItems && proposedItems.map((item, index) => (
                            <tr key={item.itemId}>
                                <td>{index + 1}</td>
                                <td>{item.quantity}</td>
                                <td>{item.itemName}</td>
                                <td>{item.unitMeasurement}</td>
                                <td className="text-right">{item.priceCatalog.toFixed(2)}</td>
                                <td className="text-right">{(item.priceCatalog * item.quantity).toFixed(2)}</td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={5} className="text-right"><strong>TOTAL AMOUNT:</strong></td>
                            <td><strong>{proposedItems ? proposedItems.reduce((total, item) => total + (item.priceCatalog * item.quantity), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}</strong></td>
                        </tr>
                    </tbody>
                </table>
                <div className="signatory">
                    <div className="submitted-by">
                        <p>Submitted By:</p>
                        <p className="signatory-name"><strong>{deanName}</strong></p>
                        <p>Dean, CICT</p>
                    </div>
                    <div className="noted-by">
                        <p>Noted By:</p>
                        <div>
                            {revisedAsignatories && revisedAsignatories.map((signatory: any, index: number) => (
                                <div key={index}>
                                    <p className="signatory-name"><strong>{signatory.fullName}</strong></p>
                                    <p>{signatory.position}</p>
                                </div>
                            ))}
                        </div>
                        </div>
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
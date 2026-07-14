import { useState } from "react";
import PrintPR from "../../dialogs/print_PR/PrintPR";
import "./pr-history-card.css";
import { IconClock, IconCircleDashedCheck, IconPrinter, IconChecklist, IconCancel } from '@tabler/icons-react';
import {notify, confirm} from "../../dialogs/global_dialog/DialogService";
import { toast } from "../../toast/ToastService";
import { showCircleLoadingDialog } from "../../dialogs/circle_loading_dialog/CircleLoadingDialogService";

interface PRHistoryCardProps {
    prId: number;
    quantity: number;
    itemName: string;
    unitMeasurement: string;
    specifications: string;
    priceCatalog: number;
    status: string;
    dateRequested: string;
    dateFulfilled?: string | null;
}

export default function PRHistoryCard({prId, quantity, itemName, unitMeasurement, priceCatalog, specifications, status, dateRequested, dateFulfilled}: PRHistoryCardProps) {
    const [isPrintPROpen, setPrintPROpen] = useState(false);

    function handleArrivedClick() {
        confirm("Arrive", "Are you sure you want to mark this PR as arrived?", "info", "Yes Mark as Arrived")
            .then((confirmed) => {
                if (confirmed) {
                    const loading = showCircleLoadingDialog();

                    setTimeout(() => {
                        toast.success("PR marked as arrived successfully!");
                        loading();
                    }, 1000);

                }
            });
    }
    function handleCancelClick() {
        confirm("Cancel", "Are you sure you want to cancel this PR?", "warning", "Yes Cancel PR")
            .then((confirmed) => {
                if (confirmed) {
                    toast.error("PR cancelled successfully!");
                } 
            });
    }
    return (    
        <div className="pr-history-card">
            <div className={`icon ${status === "Pending" ? "yellow" : status === "Fulfilled" ? "green" : status === "Cancelled" ? "red" : ""}`}>
                {status === "Pending" && <IconClock size={24} />}
                {status === "Fulfilled" && <IconCircleDashedCheck size={24} />}
                {status === "Cancelled" && <IconCancel size={24}/>}
            </div>
            <div className="info">
                <div className="pr-number-status-container">
                    <p className="pr-number">PR-{prId}</p>
                    <p className={`status ${status.toLowerCase()}`}>{status}</p>
                </div>
                <p className="specifications">{itemName} • {specifications}</p>
                <p className="pr-quantity">Quantity: {quantity} {unitMeasurement}</p>
            </div>
            <div className="date-button-container">
                <p className="pr-date">{new Date(dateRequested).toLocaleString('en-PH')}</p>
                {status === "Pending" && (
                    <>
                        <div className="button-container">
                            <button className="btn-solid blue" onClick={() => setPrintPROpen(true)}>
                                <IconPrinter size={16} />
                                Print Document
                            </button>
                            <button className="btn-solid green" onClick={handleArrivedClick}>
                                <IconChecklist size={16} />
                                Fulfill PR
                            </button>
                            <button className="btn-solid red" onClick={handleCancelClick}>
                                <IconCancel size={16} />
                                Cancel
                            </button>
                        </div>
                        <PrintPR
                            prId={prId}
                            itemName={itemName}
                            itemDescription={specifications}
                            quantity={quantity}
                            unitPrice={priceCatalog} 
                            requestedDate={dateRequested}
                            isOpen={isPrintPROpen}
                            onClose={() => {setPrintPROpen(false)}}
                        />
                    </>
                )}
                {status === "Fulfilled" && dateFulfilled && (
                    <p className="date-fulfilled">Received: {dateFulfilled}</p>
                )}
            </div>
        </div>
    )
}
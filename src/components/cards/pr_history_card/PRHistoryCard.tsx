import { useState } from "react";
import PrintPR from "../../dialogs/print_PR/PrintPR";
import "./pr-history-card.css";
import { IconClock, IconCircleDashedCheck, IconPrinter, IconChecklist, IconCancel } from '@tabler/icons-react';
import { confirm} from "../../dialogs/global_dialog/DialogService";
import { toast } from "../../toast/ToastService";
import { showCircleLoadingDialog } from "../../dialogs/circle_loading_dialog/CircleLoadingDialogService";
import { getAccessToken } from "../../../../supadb";

interface PRHistoryCardProps {
    prId: number;
    quantity: number;
    itemId: number;
    itemName: string;
    unitMeasurement: string;
    specifications: string;
    priceCatalog: number;
    status: string;
    requestedBy?: string;
    dateRequested: string;
    dateFulfilled?: string | null;
    handlePrHistoryStatusChange: (itemId: number, prId: number, newStatus: string, quantity: number) => void;
}

export default function PRHistoryCard({prId, quantity, itemId, itemName, unitMeasurement, priceCatalog, specifications, status, requestedBy, dateRequested, dateFulfilled, handlePrHistoryStatusChange}: PRHistoryCardProps) {
    const [isPrintPROpen, setPrintPROpen] = useState(false);

    function handleArrivedClick() {
        confirm("Arrive", "Confirmation if you want to mark this PR as arrived/fulfilled?", "info", "Yes Mark as Fulfilled")
            .then(async (confirmed) => {
                if (confirmed) {

                    const formData = new FormData();
                    formData.append('prId', String(prId));
                    formData.append('status', "Fulfilled");

                    const loading = showCircleLoadingDialog();

                    try {
                        const response = await fetch("https://test-ppmp.onrender.com/api/procurement_status/", {
                            method: "PUT",
                            body: formData,
                            headers: {
                                "Authorization": `Bearer ${await getAccessToken() || ""}`
                            }
                        });
                        if (!response.ok) {
                            throw new Error("Failed to mark PR as fulfilled.");
                        }else {
                            handlePrHistoryStatusChange(itemId, prId, "Fulfilled", quantity);
                            toast.success("PR marked as fulfilled successfully!");
                        }
                    }
                    catch (error) {
                        toast.error("Error occurred while marking PR as fulfilled.");
                    }
                    finally {
                        loading();
                    }
                }
            });
    }

    function handleCancelClick() {
        confirm("Cancel", "Are you sure you want to cancel this PR \n Note: You cannot undo this action?", "warning", "Yes Cancel PR")
            .then(async (confirmed) => {
                if (confirmed) {

                    const formData = new FormData();
                    formData.append('prId', String(prId));
                    formData.append('status', "Cancelled");

                    const loading = showCircleLoadingDialog();

                    try {
                        const response = await fetch("https://test-ppmp.onrender.com/api/procurement_status/", {
                            method: "PUT",
                            body: formData,
                            headers: {
                                "Authorization": `Bearer ${await getAccessToken() || ""}`
                            }
                        });
                        if (!response.ok) {
                            throw new Error("Failed to mark PR as cancelled.");
                        }else {
                            handlePrHistoryStatusChange(itemId, prId, "Cancelled", quantity);
                            toast.success("PR marked as Cancelled successfully!");
                        }
                    }
                    catch (error) {
                        toast.error("Error occurred while marking PR as cancelled.");
                    }
                    finally {
                        loading();
                    }
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
                            requestedBy={requestedBy}
                            unitMeasurement={unitMeasurement}
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
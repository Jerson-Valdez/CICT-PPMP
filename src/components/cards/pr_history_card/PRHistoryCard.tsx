import "./pr-history-card.css";
import { IconClock, IconCircleDashedCheck, IconPrinter, IconChecklist, IconCancel } from '@tabler/icons-react';

export default function PRHistoryCard({prNumber, quantity, specifications, status, dateRequested, dateFulfilled}: 
        {prNumber: string, quantity: number, specifications: string, status: string, dateRequested: string, dateFulfilled?: string | null}) {
    return (    
        <div className="pr-history-card">
            <div className={`icon ${status === "Pending" ? "yellow" : status === "Fulfilled" ? "green" : status === "Cancelled" ? "red" : ""}`}>
                {status === "Pending" && <IconClock size={24} />}
                {status === "Fulfilled" && <IconCircleDashedCheck size={24} />}
                {status === "Cancelled" && <IconCancel size={24}/>}
            </div>
            <div className="info">
                <div className="pr-number-status-container">
                    <p className="pr-number">{prNumber}</p>
                    <p className={`status ${status.toLowerCase()}`}>{status}</p>
                </div>
                <p className="pr-quantity">Quantity: {quantity} units</p>
                <p className="pr-specs">{specifications}</p>
            </div>
            <div className="date-button-container">
                <p className="pr-date">{dateRequested}</p>
                {status === "Pending" && (
                    <div className="button-container">
                        <button className="btn-solid blue">
                            <IconPrinter size={16} />
                            Print Document
                        </button>
                        <button className="btn-solid green">
                            <IconChecklist size={16} />
                            Arrived
                        </button>
                        <button className="btn-solid red">
                            <IconCancel size={16} />
                            Cancel
                        </button>
                    </div>
                )}
                {status === "Fulfilled" && dateFulfilled && (
                    <p className="date-fulfilled">Received: {dateFulfilled}</p>
                )}
            </div>
        </div>
    )
}
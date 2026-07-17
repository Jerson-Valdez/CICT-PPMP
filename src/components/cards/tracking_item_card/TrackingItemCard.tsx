import { useState } from "react";
import PRHistoryCard from "../pr_history_card/PRHistoryCard";
import "./tracking-item-card.css";
import { IconChevronRight, IconPackage, IconChartHistogram, IconClock, IconCircleDashedCheck, IconCircleFilled, IconFileStack } from '@tabler/icons-react';

interface TrackingItemCardProps {
    itemName: string;
    unitMeasurement: string;
    priceCatalog: number;
    plannedQuantity: number;
    availableQuantity: number;
    pendingQuantity: number;
    fulfilledQuantity: number;
    prHistory: any[];
    prHistoryCount: number;
}

export default function TrackingItemCard({itemName, unitMeasurement, priceCatalog, plannedQuantity, availableQuantity, pendingQuantity, fulfilledQuantity, prHistory, prHistoryCount}: TrackingItemCardProps) {

        const availablePercentage: number = (availableQuantity / plannedQuantity) * 100;
        const pendingPercentage: number = (pendingQuantity / plannedQuantity) * 100;
        const fulfilledPercentage: number = (fulfilledQuantity / plannedQuantity) * 100;

        const [togglePRHistory, setTogglePRHistory] = useState(false);

        const handleTogglePRHistory = () => {
            setTogglePRHistory(!togglePRHistory);
        }

    return (
        <div className="tracking-item-card">
            <div className="status-tracker-container">
                <div className="item-name-price-container" onClick={handleTogglePRHistory}>
                    <IconChevronRight size={24} className={`chevron-icon ${togglePRHistory ? 'rotated' : ''}`}/>
                    <div className="item-name">
                        <h3>{itemName}</h3>
                        <p>{plannedQuantity} {unitMeasurement} • PHP {priceCatalog.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                    <p>PHP {priceCatalog.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className="status-count-container">
                    <div className="status-count-card"><div className="icon-count black"><IconPackage size={24}/> <p>{plannedQuantity}</p></div><p>PLANNED QTY</p></div>
                    <div className="status-count-card"><div className="icon-count blue"><IconChartHistogram size={24}/> <p>{availableQuantity}</p></div><p>AVAILABLE</p></div>
                    <div className="status-count-card"><div className="icon-count yellow"><IconClock size={24}/> <p>{pendingQuantity}</p></div><p>PENDING</p></div>
                    <div className="status-count-card"><div className="icon-count green"><IconCircleDashedCheck size={24}/> <p>{fulfilledQuantity}</p></div><p>FULFILLED</p></div>
                </div>
                <div className="status-tracker-container">
                    {availablePercentage > 0 && (
                        <hr 
                            className="status-tracker available" 
                            style={{ width: `${availablePercentage}%` }} 
                        />
                    )}
                    {pendingPercentage > 0 && (
                        <hr 
                            className="status-tracker pending" 
                            style={{ width: `${pendingPercentage}%` }} 
                        />
                    )}
                    {fulfilledPercentage > 0 && (
                        <hr 
                            className="status-tracker fulfilled" 
                            style={{ width: `${fulfilledPercentage}%` }} 
                        />
                    )}
                </div>
                <div className="legend-container">
                    <p> <IconCircleFilled size={14} /> AVAILABLE</p>
                    <p> <IconCircleFilled size={14} /> PENDING</p>
                    <p> <IconCircleFilled size={14} /> FULFILLED</p>
                </div>
            </div>
            <div className={`pr-history-container ${togglePRHistory ? 'expanded' : ''}`}>
                <div className="header-pr-history">
                    <div className="icon blue"><IconFileStack size={24} /></div>
                    <h3>Purchase Request History <span>({prHistoryCount} records)</span></h3>
                </div>
                <div className="pr-history-list-container">
                    {prHistory.map((pr, index) => (
                        <PRHistoryCard
                            key={index}
                            prId={pr.prId}
                            quantity={pr.quantity}
                            itemName={itemName}
                            unitMeasurement={unitMeasurement}
                            priceCatalog={priceCatalog}
                            specifications={pr.specifications}
                            status={pr.status}
                            requestedBy={pr.requestedBy ? pr.requestedBy : 'N/A'}
                            dateRequested={pr.dateRequested}
                            dateFulfilled={pr.dateFulfilled? pr.dateFulfilled : null}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
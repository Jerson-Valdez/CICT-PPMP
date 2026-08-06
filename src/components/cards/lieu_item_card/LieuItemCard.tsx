import "./lieu-item-card.css";
import { IconCircle, IconCircleCheckFilled } from '@tabler/icons-react';
import { useState } from "react";

interface LieuItemCardProps {
    itemId: number;
    itemName: string;
    unitMeasurement: string;
    priceCatalog: number;
    plannedQuantity?: number;
    availableQuantity: number;
    isSelected: boolean;
    reduceQuantity: number;
    onToggle: () => void;
    onQuantityChange: (id: number, qty: number) => void;
    isOpenFunds?: boolean;
}

export default function LieuItemCard({itemId, itemName, unitMeasurement, priceCatalog, plannedQuantity, availableQuantity, 
    isSelected, reduceQuantity, onToggle, onQuantityChange, isOpenFunds = false
}: LieuItemCardProps) {

    const [error, setError] = useState<string>("");
    
    const costReduction = reduceQuantity * priceCatalog;

    function handleReduceQuantityChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = parseInt(event.target.value) || 0;

        if (value > availableQuantity) {
            setError("Exceeds available quantity");
            onQuantityChange(itemId, 0); 
        } else if (value < 0) {
            setError("Invalid quantity");
            onQuantityChange(itemId, 0);
        } else {
            setError("");
            onQuantityChange(itemId, value); 
        }
    }

    return (
        <div className={`lieu-item-card ${isSelected ? "selected" : ''}`}>
            <div className="upper-content-container">
                <div className="icon-container" onClick={onToggle}>
                    {isSelected ? (
                        <IconCircleCheckFilled size={45} className={`icon ${isSelected ? "selected" : ''}`} />
                    ) : (
                        <IconCircle size={45} className="icon" />
                    )}
                </div>
                
                <div className="item-description">
                    <h3>{itemName}</h3>
                    {isOpenFunds ? (
                        <p>{availableQuantity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} avail. @ PHP {priceCatalog.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per: {unitMeasurement}</p>
                    ) : (
                        <p>{availableQuantity}/{plannedQuantity} avail. @ PHP {priceCatalog.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per: {unitMeasurement}</p>
                    )}
                </div>
                <div className="available-quantity-container">
                    {isOpenFunds ? (
                        <p>{availableQuantity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AVAIL.</p>
                    ) : (
                        <p>{availableQuantity} AVAIL.</p>
                    )}
                </div>
            </div>
            
            <div className={`lower-content-container ${isSelected ? "" : "hidden"}`}>
                <div className="input-group">
                    <label htmlFor={`reduce-quantity-${itemId}`}>Reduce by:</label>
                    <input 
                        type="number" 
                        id={`reduce-quantity-${itemId}`} 
                        min="1" 
                        max={availableQuantity} 
                        value={reduceQuantity === 0 ? '' : reduceQuantity}
                        onChange={handleReduceQuantityChange}
                        disabled={!isSelected}
                        className="disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />

                    {error && <p className="error-message">{error}</p>}
                </div>
                <p>
                    -PHP {costReduction.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
            </div>
        </div>
    );
}
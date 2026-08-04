import "./new-item-card.css";
import { IconTrash } from '@tabler/icons-react';

interface NewItemCardProps {
    itemId: number;
    itemName: string;
    unitMeasurement: string;
    quantity: number;
    priceCatalog: number;
    itemCategories: string[];
    ppmpCategories: string[];
    itemCategory?: string;
    ppmpCategory?: string;
    ppmpReallocationData?: any[];
    onDelete: (id: number) => void;
    onUpdate: (id: number, field: 'name' | 'measurementUnit' | 'quantity' | 'unitPrice' | 'itemCategory' | 'ppmpCategory', value: string | number) => void;
}

export default function NewItemCard({ 
    itemId, 
    itemName, 
    unitMeasurement, 
    quantity, 
    priceCatalog, 
    itemCategories,
    ppmpCategories,
    itemCategory, 
    ppmpCategory,
    ppmpReallocationData, 
    onDelete, 
    onUpdate 
}: NewItemCardProps) {
    
    const totalPrice = quantity * priceCatalog;
    const isNewItemExisting = ppmpReallocationData?.some(item => item.itemId === itemId) || false;

    return (
        <div className="new-item-card">
            <div className="top-field-container">
                <div className="field-group">
                    <label htmlFor={`itemName-${itemId}`}>Item Name</label>
                    {isNewItemExisting ? 
                        <input 
                            type="text"
                            value={itemName} 
                            disabled
                            readOnly
                            className="isNewItemExisting"
                        />
                    :
                        <input 
                            type="text" 
                            id={`itemName-${itemId}`} 
                            placeholder="Enter item name" 
                            value={itemName} 
                            onChange={(e) => onUpdate(itemId, 'name', e.target.value)} 
                            required
                            className="isNewItemExisting"
                        />
                    }
                </div>
                <div className="field-group">
                    <label htmlFor={`itemCategory-${itemId}`}>Item Category</label>
                    <select 
                        id={`itemCategory-${itemId}`} 
                        onChange={(e) => onUpdate(itemId, 'itemCategory', e.target.value)} 
                        disabled={isNewItemExisting} 
                        required
                        >

                        {isNewItemExisting ?
                            <option value={itemCategory}>{itemCategory}</option>
                        :
                            <>
                                <option value="">Select Category</option>
                                    {itemCategories?.map((category, index) => (
                                        <option key={index} value={category}>{category}</option>
                                    ))}
                            </>
                        }
                    </select>
                </div>
                <div className="field-group">
                    <label htmlFor={`ppmpCategory-${itemId}`}>PPMP Category</label>
                    <select 
                        id={`ppmpCategory-${itemId}`} 
                        value={isNewItemExisting? ppmpCategory || "" : ""} 
                        onChange={(e) => onUpdate(itemId, 'ppmpCategory', e.target.value)} 
                        disabled={isNewItemExisting} 
                        required
                        >
                        {isNewItemExisting ?
                            <option value={ppmpCategory}>{ppmpCategory}</option>
                        :
                            <>
                                <option value="">Select Category</option>
                                    {ppmpCategories?.map((category, index) => (
                                        <option key={index} value={category}>{category}</option>
                                    ))}
                            </>
                        }
                    </select>
                </div>
            </div>
            <div className="bottom-field-container">
                <div className="field-group">
                    <label htmlFor={`unitMeasurement-${itemId}`}>Unit Measurement</label>
                    {isNewItemExisting ? 
                        <input 
                            type="text" 
                            value={unitMeasurement} 
                            disabled
                            readOnly
                            className="isNewItemExisting"
                        />
                    :
                        <input 
                            type="text" 
                            id={`unitMeasurement-${itemId}`} 
                            placeholder="eg. piece, kg, box..." 
                            value={unitMeasurement}
                            onChange={(e) => onUpdate(itemId, 'measurementUnit', e.target.value)}
                            required
                            className="isNewItemExisting"
                        />
                    }
                </div>
                <div className="field-group">
                    <label htmlFor={`quantity-${itemId}`}>Quantity</label>
                    <input 
                        type="number" 
                        id={`quantity-${itemId}`} 
                        min="1" 
                        value={quantity === 0 ? '' : quantity} 
                        onChange={(e) => onUpdate(itemId, 'quantity', parseFloat(e.target.value) || 0)} 
                        required
                    />
                </div>
                <div className="field-group">
                    <label htmlFor={`unitPrice-${itemId}`}>Unit Price (PHP)</label>
                    {isNewItemExisting ?
                        <input 
                            type="number"
                            value={priceCatalog}
                            disabled
                            readOnly
                            className="isNewItemExisting"
                        />
                    :   
                        <input 
                            type="number" 
                            id={`unitPrice-${itemId}`} 
                            min="1" 
                            step="0.01"
                            value={priceCatalog === 0 ? '' : priceCatalog} 
                            onChange={(e) => onUpdate(itemId, 'unitPrice', parseFloat(e.target.value) || 0)} 
                            required
                            className="isNewItemExisting"
                        />
                    }
                </div>
            </div>
            <div className="total-price">
                <div className="icon red cursor-pointer" onClick={() => onDelete(itemId)}>
                    <IconTrash size={18}/>
                </div>
                <p>Total Price: <span>PHP {totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
            </div>
        </div>
    )
}
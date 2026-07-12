import { useState } from 'react';
import CreatePR from '../../dialogs/create_PR/CreatePR';
import '../table-design.css';
import { IconSearch, IconFileTypeXls, IconFilter, IconFileStack } from '@tabler/icons-react';

interface MasterlistTableProps {
    itemCount: number;
    unitCount: number;
    exportFunction?: () => void;
    data: any[];
}

export default function MasterlistTable({ itemCount, unitCount, exportFunction, data }: MasterlistTableProps) {

    const [openDialogIndex, setOpenDialogIndex] = useState<number | null>(null);

    return (
        <div className="table-container masterlist">
            <div className="table-title-container">
                <div className="table-title">
                    <h2 className="table-title">Master PPMP Table</h2>
                    <p><span>{itemCount}</span> Items • <span>{unitCount}</span> Units available for request</p>
                </div>
                <div className="search-container">
                    <IconSearch size={24} />
                    <input type="text" placeholder="Search Items..." className="search-input" />
                </div>
                <button className="export-button" onClick={exportFunction}>
                    <IconFileTypeXls size={24} /> Export Latest PPMP
                </button>
                <div className="filter-container">
                    <IconFilter size={24} />
                    <select className="filter-select">
                        <option value="">Filter by:</option>
                        <option value="ascendingByItemName">Ascending Item Name</option>
                        <option value="descendingByItemName">Descending Item Name</option>
                        <option value="availableItems">Available Items</option>
                        <option value="pendingItems">Pending Items</option>
                        <option value="fulfilledItems">Fulfilled Items</option>
                    </select>
                </div>
            </div>
            <div className="table-wrapper">
                <table className="styled-table masterlist">
                    <thead>
                        <tr>
                            <th><h3>Item Name</h3><p>General Description</p></th>
                            <th><h3>Unit</h3><p>Measurement</p></th>
                            <th><h3>Planned</h3><p>Total Quantity</p></th>
                            <th><h3>Available</h3><p>Free for Lieu Pool</p></th>
                            <th><h3>Pending</h3><p>Under PR</p></th>
                            <th><h3>Fulfilled</h3><p>Arrived Items</p></th>
                            <th><h3>Price Catalog</h3><p>Per Unit (PHP)</p></th>
                            <th><h3>Total Price</h3><p>Overall Price (PHP)</p></th>
                            <th colSpan={2}><h3>Action</h3><p>Available Actions</p></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.ItemName}</td>
                                <td>{item.UnitName}</td>
                                <td>{item.PlannedQuantity | 0}</td>
                                <td>{item.AvailableQuantity | 0}</td>
                                <td>{item.PendingQuantity | 0}</td>
                                <td>{item.ReceivedQuantity | 0}</td>
                                <td>{item.PricePerUnit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td>{(item.PlannedQuantity * item.PricePerUnit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td>
                                    {item.AvailableQuantity > 0 ? (
                                        <>
                                            <button 
                                                className="btn-solid blue" 
                                                onClick={() => setOpenDialogIndex(index)}
                                            >
                                                <IconFileStack size={18} /> Create PR ({item.AvailableQuantity} avail.)
                                            </button>
                                            
                                            <CreatePR 
                                                key={index} 
                                                itemID={item.ItemID}
                                                itemName={item.ItemName} 
                                                availableQuantity={item.AvailableQuantity} 
                                                pendingQuantity={item.PendingQuantity} 
                                                fulfilledQuantity={item.ReceivedQuantity} 
                                                priceCatalog={item.PricePerUnit}
                                                isOpen={openDialogIndex === index} 
                                                onClose={() => setOpenDialogIndex(null)}
                                            />
                                        </>
                                    ) : (
                                        <button className="btn-solid blue" disabled>
                                            <IconFileStack size={18} /> Create PR ({item.AvailableQuantity} avail.)
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
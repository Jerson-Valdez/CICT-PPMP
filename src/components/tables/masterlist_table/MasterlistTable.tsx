import '../table-design.css';
import { IconSearch ,IconFileTypeXls,IconFilter,IconFileStack  } from '@tabler/icons-react';

export default function MasterlistTable({itemCount, unitCount, exportFunction, data}: {itemCount: number, unitCount: number, exportFunction?: () => void, data: any[]}) {
    return (
        <div className="table-container">
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
                        <option value="ascending">Ascending Item Name</option>
                        <option value="descending">Descending Item Name</option>
                        <option value="available">Available Items</option>
                        <option value="pending">Pending Items</option>
                        <option value="fulfilled">Fulfilled Items</option>
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
                            <td>{item.itemDescription}</td>
                            <td>{item.unitMeasurement}</td>
                            <td>{item.plannedQuantity}</td>
                            <td>{item.availableQuantity}</td>
                            <td>{item.pendingQuantity}</td>
                            <td>{item.fulfilledQuantity}</td>
                            <td>{item.priceCatalogue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td>{item.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td>
                                {item.availableQuantity > 0 ? (
                                    <button className="btn-solid blue">
                                        <IconFileStack size={18} /> Create PR ({item.availableQuantity} avail.)</button>
                                ) : (
                                    <button className="btn-solid blue" disabled>
                                        <IconFileStack size={18} /> Create PR ({item.availableQuantity} avail.)</button>
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
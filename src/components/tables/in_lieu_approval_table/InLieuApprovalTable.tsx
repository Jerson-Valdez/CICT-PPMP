import "../table-design.css";
import { useState } from "react";
import { IconSearch ,IconFilter,IconFileStack,IconChecklist,IconX } from '@tabler/icons-react';
import ViewInLieu from "../../dialogs/view_in_lieu/ViewInLieu";

export default function InLieuApprovalTable({data}: {data: any[]}) {

    const [openDialogIndex, setOpenDialogIndex] = useState<number | null>(null);

    return (
        <div className="table-container approvals">
            <div className="table-title-container">
                <div className="table-title">
                    <h2 className="table-title">Manage In Lieu Reallocation</h2>
                    <p>Accept necessary changes to apply in PPMP master list</p>
                </div>
                <div className="search-container">
                    <IconSearch size={24} />
                    <input type="text" placeholder="Search Items..." className="search-input" />
                </div>
                <div className="filter-container">
                    <IconFilter size={24} />
                    <select className="filter-select">
                        <option value="">Filter by:</option>
                        <option value="ascending">Ascending Item Name</option>
                        <option value="descending">Descending Item Name</option>
                        <option value="pending">Pending Items</option>
                        <option value="fulfilled">Approved Items</option>
                        <option value="rejected">Rejected Items</option>
                    </select>
                </div>
            </div>
            <div className="table-wrapper">
                <table className="styled-table approvals">
                    <thead>
                        <tr>
                            <th><h3>Request Date</h3><p>Date of Submission</p></th>
                        <th><h3>Staff Name</h3><p>Who submitted the request</p></th>
                        <th><h3>Original Items</h3><p>To be In-Lieu of</p></th>
                        <th><h3>Proposed Substitution</h3><p>Proposed new items</p></th>
                        <th><h3>Budget Impact</h3><p>Financial impact</p></th>
                        <th><h3>Status</h3><p>Current state of request</p></th>
                        <th colSpan={2}><h3>Action</h3><p>Available Actions</p></th>
                    </tr>
                </thead>
                <tbody> 
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.requestDate}</td>
                            <td>{item.requestedBy}</td>
                            <td>
                                <div className="original-items">
                                    {item.inLieuReducedItems.map((i: any) => (
                                        <div key={i.itemId} className="original-item">
                                            <span>-{i.quantity} {i.unitMeasurement} • </span>
                                            <span>{i.itemName}</span>
                                        </div>
                                    ))}
                                </div>
                            </td>
                            <td>
                                <div className="proposed-items">
                                    {item.inLieuAdditionItems.map((i: any) => (
                                        <div key={i.itemId} className="proposed-item">
                                            <span>+{i.quantity} {i.unitMeasurement} • </span>
                                            <span>{i.itemName}</span>
                                        </div>
                                    ))}
                                </div>
                            </td>
                            <td>
                                <div className="budget-impact">
                                    <span>- {item.budgetImpact.originalItemsTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    <span>+ {item.budgetImpact.proposedItemsTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    <span>{item.budgetImpact.difference.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                            </td>
                            <td>
                                <div className="status-container">
                                    <span className={`status ${item.status.toLowerCase()}`}>{item.status}</span>
                                </div>
                            </td>
                            <td>
                                <div className="button-container">
                                    <button className="btn-solid blue" onClick={() => setOpenDialogIndex(index)}>
                                        <IconFileStack size={18} /> View
                                    </button>
                                    {item.status.toLowerCase() === "pending" && (
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
                                <ViewInLieu
                                    key={item.id}
                                    inLieuId={item.inLieuId}
                                    requestDate={item.requestDate}
                                    requestedBy={item.requestedBy}
                                    originalItems={item.inLieuReducedItems}
                                    proposedItems={item.inLieuAdditionItems}
                                    budgetImpact={item.budgetImpact}
                                    status={item.status}
                                    isOpen={openDialogIndex === index} 
                                    onClose={() => setOpenDialogIndex(null)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>
    )
}
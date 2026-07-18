import "../table-design.css";
import { useState } from "react";
import { IconSearch, IconFilter, IconFileStack, IconChecklist, IconX } from '@tabler/icons-react';
import ViewInLieu from "../../dialogs/view_in_lieu/ViewInLieu";
import { useOutletContext } from 'react-router';

export default function InLieuApprovalTable({ data }: { data: any[] }) {
    const [openDialogIndex, setOpenDialogIndex] = useState<number | null>(null);

    const { userRole } = useOutletContext<{ userRole: string }>();

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filterOption, setFilterOption] = useState<string>("");

    let processedData = data.filter((item) => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = searchTerm === "" || item.requestedBy.toLowerCase().includes(searchLower) || item.requestDate.toLowerCase().includes(searchLower) || item.inLieuReducedItems.some((i: any) => i.itemName.toLowerCase().includes(searchLower)) || item.inLieuAdditionItems.some((i: any) => i.itemName.toLowerCase().includes(searchLower));

        let matchesStatus = true;
        if (filterOption === "pending") matchesStatus = item.status.toLowerCase() === "pending";
        if (filterOption === "approved") matchesStatus = item.status.toLowerCase() === "approved";
        if (filterOption === "rejected") matchesStatus = item.status.toLowerCase() === "rejected";

        return matchesSearch && matchesStatus;
    });

    if (filterOption === "ascending") {
        processedData.sort((a, b) => a.requestDate.localeCompare(b.requestDate));
    } else if (filterOption === "descending") {
        processedData.sort((a, b) => b.requestDate.localeCompare(a.requestDate));
    }

    return (
        <div className="table-container approvals">
            <div className="table-title-container">
                <div className="table-title">
                    <h2 className="table-title">Manage In Lieu Reallocation</h2>
                    <p>Accept necessary changes to apply in PPMP master list</p>
                </div>
                <div className="search-container">
                    <IconSearch size={24} />
                    <input type="text" placeholder="Search..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="filter-container">
                    <IconFilter size={24} />
                    <select className="filter-select" value={filterOption} onChange={(e) => setFilterOption(e.target.value)}>
                        <option value="">Filter by:</option>
                        <option value="ascending">Ascending by Request Date</option>
                        <option value="descending">Descending by Request Date</option>
                        <option value="pending">Pending Items</option>
                        <option value="approved">Approved Items</option>
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
                        {processedData.map((item, index) => {
                            const combinedOriginalItems = [
                                ...(item.openFundsUtilized > 0 ? [{
                                    itemId: 0,
                                    itemName: "Unallocated Open Funds",
                                    unitMeasurement: "PHP",
                                    priceCatalog: 1,
                                    quantity: item.openFundsUtilized,
                                }] : []),
                                ...(item.inLieuReducedItems || [])
                            ];

                            return (
                                <tr key={index}>
                                    <td>{new Date(item.requestDate).toLocaleString('en-PH')}</td>
                                    <td>{item.requestedBy}</td>
                                    <td>
                                        <div className="original-items">
                                            {item.openFundsUtilized > 0 && (
                                                <div className="original-item">
                                                    <span>-{item.openFundsUtilized.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} PHP • </span>
                                                    <span>Open Funds</span>
                                                </div>
                                            )}
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
                                            {item.status.toLowerCase() === "pending" && userRole === "Admin" &&(
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
                                            key={item.inLieuId || index}
                                            inLieuId={item.inLieuId}
                                            requestDate={item.requestDate}
                                            originalItems={combinedOriginalItems}
                                            proposedItems={item.inLieuAdditionItems}
                                            status={item.status}
                                            isOpen={openDialogIndex === index}
                                            onClose={() => setOpenDialogIndex(null)}
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
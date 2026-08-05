import "../table-design.css";
import { useState } from "react";
import { IconSearch, IconFilter, IconFileStack, IconChecklist, IconX } from '@tabler/icons-react';
import ViewInLieu from "../../dialogs/view_in_lieu/ViewInLieu";
import { notify, confirm } from "../../dialogs/global_dialog/DialogService";
import { useOutletContext } from 'react-router';
import { showCircleLoadingDialog } from "../../dialogs/circle_loading_dialog/CircleLoadingDialogService";
import { getAccessToken } from "../../../../supadb";
import { toast } from "../../toast/ToastService";
import DynamicFilterDialog, { type FilterGroup } from "../../dialogs/dynamic_filter_dialog/DynamicFilterDialog";

interface InLieuApprovalTableProps {
    data: any[];
    handleInLieuStatusChange: (inLieuId: number, newStatus: string) => void;
    itemCategoriesOriginal?: string[];
    itemCategoriesProposed?: string[];
    ppmpCategoriesOriginal?: string[];
    ppmpCategoriesProposed?: string[];
}

export default function InLieuApprovalTable({ data, handleInLieuStatusChange, itemCategoriesOriginal, itemCategoriesProposed, ppmpCategoriesOriginal, ppmpCategoriesProposed }: InLieuApprovalTableProps) {
    const [openDialogIndex, setOpenDialogIndex] = useState<number | null>(null);

    const { userRole } = useOutletContext<{ userRole: string }>();

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isFilterDialogOpen, setIsFilterDialogOpen] = useState<boolean>(false);
        const [sortFilter, setSortFilter] = useState<string>("");
        const [statusFilter, setStatusFilter] = useState<string>("");
        const [itemCatFilterOriginal, setItemCatFilterOriginal] = useState<string>("");
        const [itemCatFilterProposed, setItemCatFilterProposed] = useState<string>("");
        const [ppmpCatFilterOriginal, setPpmpCatFilterOriginal] = useState<string>("");
        const [ppmpCatFilterProposed, setPpmpCatFilterProposed] = useState<string>("");

    
        const clearAllFilters = () => {
            setSortFilter("");
            setStatusFilter("");
            setItemCatFilterOriginal("");
            setItemCatFilterProposed("");
            setPpmpCatFilterOriginal("");
            setPpmpCatFilterProposed("");
        };
    
        const filterConfig: FilterGroup[] = [
            {
                id: 'sort',
                title: 'Sort Order',
                selectedValue: sortFilter,
                onChange: setSortFilter,
                options: [
                    { label: 'Ascending (Date)', value: 'asc' },
                    { label: 'Descending (Date)', value: 'desc' }
                ]
            },
            {
                id: 'status',
                title: 'Request Status',
                selectedValue: statusFilter,
                onChange: setStatusFilter,
                options: [
                    { label: 'Pending', value: 'pending' },
                    { label: 'Approved', value: 'approved' },
                    { label: 'Rejected', value: 'rejected' }
                ]
            },
            {
                id: 'itemCategoryOriginal',
                title: 'Item Category of Original Items',
                selectedValue: itemCatFilterOriginal,
                onChange: setItemCatFilterOriginal,
                options: (itemCategoriesOriginal || []).map(cat => ({ label: cat, value: cat }))
            },
            {
                id: 'itemCategoryProposed',
                title: 'Item Category of Proposed Items',
                selectedValue: itemCatFilterProposed,
                onChange: setItemCatFilterProposed,
                options: (itemCategoriesProposed || []).map(cat => ({ label: cat, value: cat }))
            },
            {
                id: 'ppmpCategoryOriginal',
                title: 'PPMP Category of Original Items',
                selectedValue: ppmpCatFilterOriginal,
                onChange: setPpmpCatFilterOriginal,
                options: (ppmpCategoriesOriginal || []).map(cat => ({ label: cat, value: cat }))
            },
            {
                id: 'ppmpCategoryProposed',
                title: 'PPMP Category of Proposed Items',
                selectedValue: ppmpCatFilterProposed,
                onChange: setPpmpCatFilterProposed,
                options: (ppmpCategoriesProposed || []).map(cat => ({ label: cat, value: cat }))
            }
        ];
    
        let processedData = data.filter((request) => {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch = searchTerm === "" || request.itemName.toLowerCase().includes(searchLower);
    
            let matchesStatus = true;
            if (statusFilter === "pending") matchesStatus = request.status.toLowerCase() === "pending";
            if (statusFilter === "approved") matchesStatus = request.status.toLowerCase() === "approved";
            if (statusFilter === "rejected") matchesStatus = request.status.toLowerCase() === "rejected";

            const matchesItemCatOriginal = itemCatFilterOriginal === "" || request.inLieuReducedItems.some((reducedItem: any) => reducedItem.itemCategory === itemCatFilterOriginal);
            const matchesItemCatProposed = itemCatFilterProposed === "" || request.inLieuAdditionItems.some((additionItem: any) => additionItem.itemCategory === itemCatFilterProposed);
            const matchesPpmpCatOriginal = ppmpCatFilterOriginal === "" || request.inLieuReducedItems.some((reducedItem: any) => reducedItem.ppmpCategory === ppmpCatFilterOriginal);
            const matchesPpmpCatProposed = ppmpCatFilterProposed === "" || request.inLieuAdditionItems.some((additionItem: any) => additionItem.ppmpCategory === ppmpCatFilterProposed);

            return matchesSearch && matchesStatus && matchesItemCatOriginal && matchesItemCatProposed && matchesPpmpCatOriginal && matchesPpmpCatProposed;
        });
    
        if (sortFilter === "asc") {
            processedData.sort((a, b) => a.requestDate.localeCompare(b.requestDate));
        } else if (sortFilter === "desc") {
            processedData.sort((a, b) => b.requestDate.localeCompare(a.requestDate));
        }
    
        const activeFilterCount = [sortFilter, statusFilter, itemCatFilterOriginal, itemCatFilterProposed, ppmpCatFilterOriginal, ppmpCatFilterProposed].filter(Boolean).length;

    function handleOnApproveInLieu(inLieuId: number) {
        confirm("In Lieu Approval", "Are you sure you want to approve this Reallocation \n Note: Once you approve this, it will cause changes to the PPMP master list.", "success", "Yes Approve Reallocation")
            .then(async (confirmed) => {
                if (confirmed) {

                    const formData = new FormData();
                    formData.append('inLieuId', String(inLieuId));
                    formData.append('status', "Approved");

                    const loading = showCircleLoadingDialog();

                    try {
                        const response = await fetch("https://test-ppmp.onrender.com/api/in_lieu_approval_status/", {
                            method: "PUT",
                            body: formData,
                            headers: {
                                "Authorization": `Bearer ${await getAccessToken() || ""}`
                            }
                        });
                        if (!response.ok) {
                            const responseData = await response.json();
                            notify("Action Failed", responseData.error, "error", "I Understand");
                            toast.error(responseData.error || "Failed to mark Reallocation as Approved.");
                            throw new Error("Failed to mark Reallocation as Approved.");
                        }else {
                            handleInLieuStatusChange(inLieuId, "Approved");
                            toast.success("Reallocation marked as Approved successfully!");
                        }
                    }
                    catch (error) {
                        toast.error("Error occurred while marking Reallocation as approved.");
                    }
                    finally {
                        loading();
                    }
                }
            });
    }

    function handleOnRejectInLieu(inLieuId: number) {
        confirm("In Lieu Approval", "Are you sure you want to reject this Reallocation \n Note: Once you reject this, it will cause changes to the PPMP master list.", "warning", "Yes Reject Reallocation")
            .then(async (confirmed) => {
                if (confirmed) {

                    const formData = new FormData();
                    formData.append('inLieuId', String(inLieuId));
                    formData.append('status', "Rejected");

                    const loading = showCircleLoadingDialog();

                    try {
                        const response = await fetch("https://test-ppmp.onrender.com/api/in_lieu_approval_status/", {
                            method: "PUT",
                            body: formData,
                            headers: {
                                "Authorization": `Bearer ${await getAccessToken() || ""}`
                            }
                        });
                        if (!response.ok) {
                            throw new Error("Failed to mark Reallocation as cancelled.");
                        }else {
                            handleInLieuStatusChange(inLieuId, "Rejected");
                            toast.success("Reallocation marked as Rejected successfully!");
                        }
                    }
                    catch (error) {
                        toast.error("Error occurred while marking Reallocation as rejected.");
                    }
                    finally {
                        loading();
                    }
                }
            });
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
                    <button className="filter-select" onClick={() => setIsFilterDialogOpen(true)}>
                        Filters
                        {activeFilterCount > 0 && (
                        <span className="filter-badge">
                            {activeFilterCount}
                        </span>
                    )}
                    </button>
                    {isFilterDialogOpen && (
                        <DynamicFilterDialog 
                            isOpen={isFilterDialogOpen}
                            onClose={() => setIsFilterDialogOpen(false)}
                            onClearAll={clearAllFilters}
                            filterGroups={filterConfig}
                        />
                    )}
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
                                            {item.inLieuAdditionItems.map((i: any, index: number) => (
                                                <div key={index} className="proposed-item">
                                                    <span>+{i.quantity} {i.unitMeasurement} • </span>
                                                    <span>{i.itemName}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="budget-impact">
                                            <span>{item.budgetImpact.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
                                                    <button className="btn-solid green" onClick={() => handleOnApproveInLieu(item.inLieuId)}>
                                                        <IconChecklist size={18} /> Approve
                                                    </button>
                                                    <button className="btn-solid red" onClick={() => handleOnRejectInLieu(item.inLieuId)}>
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
import { useState } from 'react';
import CreatePR from '../../dialogs/create_PR/CreatePR';
import '../table-design.css';
import { IconSearch, IconFileTypeXls, IconFilter, IconFileStack } from '@tabler/icons-react';
import DynamicFilterDialog, { type FilterGroup } from '../../dialogs/dynamic_filter_dialog/DynamicFilterDialog';

interface MasterlistTableProps {
    itemCount: number;
    unitCount: number;
    exportFunction?: () => void;
    purchaseRequestQuantityChange: (prQuantity: number, itemId: number) => void;
    data: any[];
    itemCategories?: string[];
    ppmpCategories?: string[];
}

export default function MasterlistTable({ itemCount, unitCount, exportFunction, purchaseRequestQuantityChange, data, itemCategories, ppmpCategories }: MasterlistTableProps) {

    const [openDialogIndex, setOpenDialogIndex] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const [isFilterDialogOpen, setIsFilterDialogOpen] = useState<boolean>(false);
    const [sortFilter, setSortFilter] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [itemCatFilter, setItemCatFilter] = useState<string>("");
    const [ppmpCatFilter, setPpmpCatFilter] = useState<string>("");

    const clearAllFilters = () => {
        setSortFilter("");
        setStatusFilter("");
        setItemCatFilter("");
        setPpmpCatFilter("");
    };

    const filterConfig: FilterGroup[] = [
        {
            id: 'sort',
            title: 'Sort Order',
            selectedValue: sortFilter,
            onChange: setSortFilter,
            options: [
                { label: 'Ascending (A-Z)', value: 'asc' },
                { label: 'Descending (Z-A)', value: 'desc' }
            ]
        },
        {
            id: 'status',
            title: 'Item Status',
            selectedValue: statusFilter,
            onChange: setStatusFilter,
            options: [
                { label: 'Pending PR', value: 'pending' },
                { label: 'Fulfilled', value: 'fulfilled' },
                { label: 'Available in Lieu', value: 'available' }
            ]
        },
        {
            id: 'itemCategory',
            title: 'Item Category',
            selectedValue: itemCatFilter,
            onChange: setItemCatFilter,
            options: (itemCategories || []).map(cat => ({ label: cat, value: cat }))
        },
        {
            id: 'ppmpCategory',
            title: 'PPMP Category',
            selectedValue: ppmpCatFilter,
            onChange: setPpmpCatFilter,
            options: (ppmpCategories || []).map(cat => ({ label: cat, value: cat }))
        }
    ];

    let processedData = data.filter((item) => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = searchTerm === "" || item.itemName.toLowerCase().includes(searchLower);

        let matchesStatus = true;
        if (statusFilter === "pending") matchesStatus = item.pendingQuantity > 0;
        if (statusFilter === "fulfilled") matchesStatus = item.fulfilledQuantity > 0;
        if (statusFilter === "available") matchesStatus = item.availableQuantity > 0;

        const matchesItemCat = itemCatFilter === "" || item.itemCategory === itemCatFilter;
        const matchesPpmpCat = ppmpCatFilter === "" || item.ppmpCategory === ppmpCatFilter;

        return matchesSearch && matchesStatus && matchesItemCat && matchesPpmpCat;
    });

    if (sortFilter === "asc") {
        processedData.sort((a, b) => a.itemName.localeCompare(b.itemName));
    } else if (sortFilter === "desc") {
        processedData.sort((a, b) => b.itemName.localeCompare(a.itemName));
    }

    const activeFilterCount = [sortFilter, statusFilter, itemCatFilter, ppmpCatFilter].filter(Boolean).length;

    return (
        <div className="table-container masterlist">
            <div className="table-title-container">
                <div className="table-title">
                    <h2 className="table-title">Master PPMP Table</h2>
                    <p><span>{itemCount}</span> Items • <span>{unitCount}</span> Units available for request</p>
                </div>
                <div className="search-container">
                    <IconSearch size={24} />
                    <input type="text" placeholder="Search Items..." className="search-input" value={searchTerm}onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="export-button" onClick={exportFunction}>
                    <IconFileTypeXls size={24} /> Export Latest PPMP
                </button>
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
                        {processedData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.itemName}</td>
                                <td>{item.unitMeasurement}</td>
                                <td>{item.plannedQuantity | 0}</td>
                                <td>{item.availableQuantity | 0}</td>
                                <td>{item.pendingQuantity | 0}</td>
                                <td>{item.fulfilledQuantity | 0}</td>
                                <td>{item.priceCatalog.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td>{(item.plannedQuantity * item.priceCatalog).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td>
                                    {item.availableQuantity > 0 ? (
                                        <>
                                            <button 
                                                className="btn-solid blue" 
                                                onClick={() => setOpenDialogIndex(index)}
                                            >
                                                <IconFileStack size={18} /> Create PR ({item.availableQuantity} avail.)
                                            </button>
                                            
                                            <CreatePR 
                                                key={index} 
                                                itemId={item.itemId}
                                                itemName={item.itemName}
                                                unitMeasurement={item.unitMeasurement} 
                                                availableQuantity={item.availableQuantity} 
                                                pendingQuantity={item.pendingQuantity} 
                                                fulfilledQuantity={item.fulfilledQuantity} 
                                                priceCatalog={item.priceCatalog}
                                                isOpen={openDialogIndex === index} 
                                                purchaseRequestQuantityChange={purchaseRequestQuantityChange}
                                                onClose={() => setOpenDialogIndex(null)}
                                            />
                                        </>
                                    ) : (
                                        <button className="btn-solid blue" disabled>
                                            <IconFileStack size={18} /> Create PR ({item.availableQuantity} avail.)
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
import { useEffect, useState } from "react";
import ItemsCountCard from "../../components/cards/items_count_card/ItemsCountCard";
import TrackingItemCard from "../../components/cards/tracking_item_card/TrackingItemCard";
import "./procurement-monitor.css";
import { IconSearch, IconFilter } from '@tabler/icons-react';
import LoadingWrapper from "../../components/wrappers/loading wrapper/LoadingWrapper";
import MonitoringSkeleton from "../../components/skeleton/skeleton_pages/MonitoringSkeleton";
import { toast } from '../../components/toast/ToastService';
import { useOutletContext } from 'react-router';
import { getAccessToken } from "../../../supadb";
import DynamicFilterDialog, { type FilterGroup } from '../../components/dialogs/dynamic_filter_dialog/DynamicFilterDialog';

interface ItemsCountCardData {
    icon: string;
    title: string;
    count: number;
    color: string;
}
interface prHistory {
    prId: number;
    quantity: number;
    specifications: string;
    status: string;
    requestedBy?: string;
    dateRequested: string;
    dateFulfilled?: string | null;
} 
interface ppmpMonitoringData {
    itemId: number;
    itemName: string;
    unitMeasurement: string;
    priceCatalog: number;
    plannedQuantity: number;
    availableQuantity: number;
    pendingQuantity: number;
    fulfilledQuantity: number;
    itemCategory: string;
    ppmpCategory: string;

    prHistory: prHistory[];
    prHistoryCount: number;
}

export default function ProcurementMonitor() {
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const { selectedFiscalYear } = useOutletContext<{ selectedFiscalYear: string }>();
    const [fiscalYearHolder, setFiscalYearHolder] = useState<string | null>(null);

    const [totalPlannedItemCount, setTotalPlannedItemCount] = useState<number>(0);
    const [totalAvailableItemCount, setTotalAvailableItemCount] = useState<number>(0);
    const [totalPendingItemCount, setTotalPendingItemCount] = useState<number>(0);
    const [totalFulfilledItemCount, setTotalFulfilledItemCount] = useState<number>(0);

    const [ppmpMonitoringData, setPpmpMonitoringData] = useState<ppmpMonitoringData[]>([]);
    const [itemCategories, setItemCategories] = useState<string[]>([]);
    const [ppmpCategories, setPpmpCategories] = useState<string[]>([]);

    useEffect(() => {
        const loadPpmpMonitoringData = async () => {
            handlePpmpMonitoringFiscalYearChange(selectedFiscalYear);
            try {
                const formData = new FormData();
                formData.append('year', String(selectedFiscalYear));

                const [monitoringResponse] = await Promise.all([

                    fetch('https://test-ppmp.onrender.com/api/procurement_monitoring/', {
                        method: "POST",
                        body: formData,
                        headers: {
                            "Authorization": `Bearer ${await getAccessToken() || ""}`
                        }
                    })
                ]);

                if (!monitoringResponse.ok) {
                    toast.error("Failed to fetch PPMP monitoring data. Please try again later.");
                } else {
                    const monitoringResult = await monitoringResponse.json();

                    console.log("PPMP monitoring data retrieved: ", monitoringResult);

                    setTotalPlannedItemCount(monitoringResult.totalPlannedItemCount || 0);
                    setTotalAvailableItemCount(monitoringResult.totalAvailableItemCount || 0);
                    setTotalPendingItemCount(monitoringResult.totalPendingItemCount || 0);
                    setTotalFulfilledItemCount(monitoringResult.totalFulfilledItemCount || 0);
                    
                    setPpmpMonitoringData(monitoringResult.ppmpMonitoringData || []);
                    setItemCategories(monitoringResult.itemCategories || []);
                    setPpmpCategories(monitoringResult.ppmpCategories || []);

                    setFiscalYearHolder(selectedFiscalYear);
                }
            } catch (error) {
                console.error("Error fetching PPMP monitoring data:", error);
                toast.error("Network error. Please try again later.");
            }
            finally {
                setIsInitialLoading(false);
            }
        };
        loadPpmpMonitoringData();
                
    }, [selectedFiscalYear]);

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

    let processedData = ppmpMonitoringData.filter((item) => {
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

    const ItemsCountCardData: ItemsCountCardData[] = [
        {icon: 'package', title: 'Total Items in Planned', count: totalPlannedItemCount, color: 'gray'},
        {icon: 'chart', title: 'Total Available Items', count: totalAvailableItemCount, color: 'blue'},
        {icon: 'clock', title: 'Total Pending Items', count: totalPendingItemCount, color: 'yellow'},
        {icon: 'check', title: 'Total Fulfilled Items', count: totalFulfilledItemCount, color: 'green'},
    ];

    function handlePrHistoryStatusChange(itemId: number, prId: number, newStatus: string, quantity: number) {
        setPpmpMonitoringData(prevTableData => 
            prevTableData.map(item => {
                if (item.itemId === itemId) {
                    if (newStatus === "Fulfilled") {
                        return {
                            ...item,
                            fulfilledQuantity: item.fulfilledQuantity + quantity,
                            pendingQuantity: item.pendingQuantity - quantity,
                            prHistory: item.prHistory.map(pr => {
                                if (pr.prId === prId) {
                                    return { ...pr, status: newStatus, dateFulfilled: new Date().toISOString() };
                                }
                                return pr;
                            }
                        )
                    }
                    } else if (newStatus === "Cancelled") {
                        return {
                            ...item,
                            availableQuantity: item.availableQuantity + quantity,
                            pendingQuantity: item.pendingQuantity - quantity,
                            prHistory: item.prHistory.map(pr => {
                                if (pr.prId === prId) {
                                    return { ...pr, status: newStatus };
                                }
                                return pr;
                            }
                        )
                    };
                    }
                }
                return item;
            })
        );

        if (newStatus === "Fulfilled") {
            setTotalFulfilledItemCount(prevCount => prevCount + quantity);
            setTotalPendingItemCount(prevCount => prevCount - quantity);
        }else if (newStatus === "Cancelled") {
            setTotalAvailableItemCount(prevCount => prevCount + quantity);
            setTotalPendingItemCount(prevCount => prevCount - quantity);
        }
    }

    function handlePpmpMonitoringFiscalYearChange(newFiscalYear: string) {
        if (newFiscalYear !== fiscalYearHolder) {
            setIsInitialLoading(true);
            setFiscalYearHolder(newFiscalYear);
        }
    }

  return (
    <main className="page-container monitoring">
        <LoadingWrapper isLoading={isInitialLoading} skeleton={<MonitoringSkeleton />}>
            <div className="items-count-card-container">
                {ItemsCountCardData.map((data, index) => (
                    <ItemsCountCard 
                        key={index} 
                        icon={data.icon} 
                        title={data.title} 
                        count={data.count} 
                        color={data.color} />
                ))}
            </div>
            <div className="header-content">
                <h2>Monitor and Track Items</h2>
                <div className="search-container">
                    <IconSearch size={24} />
                    <input type="text" placeholder="Search Items..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
            <div className="tracking-items-card-container">
                    {processedData.map((item, index) => (
                        <TrackingItemCard 
                            key={index}
                            itemId={item.itemId}
                            itemName={item.itemName}
                            unitMeasurement={item.unitMeasurement}
                            priceCatalog={item.priceCatalog}
                            plannedQuantity={item.plannedQuantity}
                            availableQuantity={item.availableQuantity}
                            pendingQuantity={item.pendingQuantity}
                            fulfilledQuantity={item.fulfilledQuantity}
                            prHistory={item.prHistory}
                            prHistoryCount={item.prHistoryCount}
                            handlePrHistoryStatusChange = {handlePrHistoryStatusChange}
                        />
                    ))}
            </div>
        </LoadingWrapper>
    </main>
  );
}
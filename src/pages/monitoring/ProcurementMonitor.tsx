import { useEffect, useState } from "react";
import ItemsCountCard from "../../components/cards/items_count_card/ItemsCountCard";
import TrackingItemCard from "../../components/cards/tracking_item_card/TrackingItemCard";
import "./procurement-monitor.css";
import { IconSearch, IconFilter } from '@tabler/icons-react';
import LoadingWrapper from "../../components/wrappers/loading wrapper/LoadingWrapper";
import MonitoringSkeleton from "../../components/skeleton/skeleton_pages/MonitoringSkeleton";
import { toast } from '../../components/toast/ToastService';
import { useOutletContext } from 'react-router';

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
    prHistory: prHistory[];
    prHistoryCount: number;
}

export default function ProcurementMonitor() {
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const { selectedFiscalYear } = useOutletContext<{ selectedFiscalYear: string }>();
    const [fiscalYearHolder, setFiscalYearHolder] = useState<string | null>(null);

    const [totalPlannedItemCount, setTotalPlannedItemCount] = useState(258);
    const [totalAvailableItemCount, setTotalAvailableItemCount] = useState(189);
    const [totalPendingItemCount, setTotalPendingItemCount] = useState(12);
    const [totalFulfilledItemCount, setTotalFulfilledItemCount] = useState(58);

    const [ppmpMonitoringData, setPpmpMonitoringData] = useState<ppmpMonitoringData[]>([]);

    useEffect(() => {
        const loadPpmpMonitoringData = async () => {
            handlePpmpMonitoringFiscalYearChange(selectedFiscalYear);
            try {
                const formData = new FormData();
                formData.append('year', String(selectedFiscalYear));

                const [monitoringResponse] = await Promise.all([

                    fetch('https://test-ppmp.onrender.com/api/procurement_monitoring/', {
                        method: "POST",
                        body: formData
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
    const [filterOption, setFilterOption] = useState<string>("");

    const processedData = ppmpMonitoringData.filter((item) => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = searchTerm === "" || item.itemName.toLowerCase().includes(searchLower);

        let matchesStatus = true;
        if (filterOption === "pendingItems") matchesStatus = item.pendingQuantity > 0;
        if (filterOption === "fulfilledItems") matchesStatus = item.fulfilledQuantity > 0;
        if (filterOption === "availableItems") matchesStatus = item.availableQuantity > 0;

        return matchesSearch && matchesStatus;
    });

    if (filterOption === "ascendingByItemName") {
        processedData.sort((a, b) => a.itemName.localeCompare(b.itemName));
    } else if (filterOption === "descendingByItemName") {
        processedData.sort((a, b) => b.itemName.localeCompare(a.itemName));
    }

    const ItemsCountCardData: ItemsCountCardData[] = [
        {icon: 'package', title: 'Total Items in Planned', count: totalPlannedItemCount, color: 'gray'},
        {icon: 'chart', title: 'Total Available Items', count: totalAvailableItemCount, color: 'blue'},
        {icon: 'clock', title: 'Total Pending Items', count: totalPendingItemCount, color: 'yellow'},
        {icon: 'check', title: 'Total Fulfilled Items', count: totalFulfilledItemCount, color: 'green'},
    ];

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
                    <select className="filter-select" value={filterOption} onChange={(e) => setFilterOption(e.target.value)}>
                        <option value="">Filter by:</option>
                        <option value="ascendingByItemName">Ascending Item Name</option>
                        <option value="descendingByItemName">Descending Item Name</option>
                        <option value="availableItems">Available Items</option>
                        <option value="pendingItems">Pending Items</option>
                        <option value="fulfilledItems">Fulfilled Items</option>
                    </select>
                </div>
            </div>
            <div className="tracking-items-card-container">
                    {processedData.map((item, index) => (
                        <TrackingItemCard 
                            key={index}
                            itemName={item.itemName}
                            unitMeasurement={item.unitMeasurement}
                            priceCatalog={item.priceCatalog}
                            plannedQuantity={item.plannedQuantity}
                            availableQuantity={item.availableQuantity}
                            pendingQuantity={item.pendingQuantity}
                            fulfilledQuantity={item.fulfilledQuantity}
                            prHistory={item.prHistory}
                            prHistoryCount={item.prHistoryCount}
                        />
                    ))}
            </div>
        </LoadingWrapper>
    </main>
  );
}
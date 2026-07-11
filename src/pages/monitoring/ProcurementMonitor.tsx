import { useEffect, useState } from "react";
import ItemsCountCard from "../../components/cards/items_count_card/ItemsCountCard";
import TrackingItemCard from "../../components/cards/tracking_item_card/TrackingItemCard";
import "./procurement-monitor.css";
import { IconSearch, IconFilter } from '@tabler/icons-react';
import LoadingWrapper from "../../components/wrappers/loading wrapper/LoadingWrapper";
import MonitoringSkeleton from "../../components/skeleton/skeleton_pages/MonitoringSkeleton";

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
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const [totalPlannedItemCount, setTotalPlannedItemCount] = useState(258);
    const [totalAvailableItemCount, setTotalAvailableItemCount] = useState(189);
    const [totalPendingItemCount, setTotalPendingItemCount] = useState(12);
    const [totalFulfilledItemCount, setTotalFulfilledItemCount] = useState(58);
        
    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 500));
            } finally {
                setIsInitialLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    const ItemsCountCardData: ItemsCountCardData[] = [
        {icon: 'package', title: 'Total Items in Planned', count: totalPlannedItemCount, color: 'gray'},
        {icon: 'chart', title: 'Total Available Items', count: totalAvailableItemCount, color: 'blue'},
        {icon: 'clock', title: 'Total Pending Items', count: totalPendingItemCount, color: 'yellow'},
        {icon: 'check', title: 'Total Fulfilled Items', count: totalFulfilledItemCount, color: 'green'},
    ];

    const mockTrackingItems: ppmpMonitoringData[] = [
        {
            itemId: 1,
            itemName: "Solid State Drive (1TB NVMe Gen4)",
            unitMeasurement: "unit",
            priceCatalog: 4500.00,
            plannedQuantity: 10,
            availableQuantity: 9,
            pendingQuantity: 1,
            fulfilledQuantity: 0,
            prHistory: [
                {
                    prId: 1,
                    quantity: 5,
                    specifications: "5 pieces of Solid State Drive (1TB NVMe Gen4)",
                    status: "Pending",
                    dateRequested: "2023-10-01",
                },
                {
                    prId: 2,
                    quantity: 4,
                    specifications: "4 pieces of Solid State Drive (1TB NVMe Gen4)",
                    status: "Fulfilled",
                    dateRequested: "2023-10-05",
                    dateFulfilled: "2023-10-10",
                },
                {
                    prId: 3,
                    quantity: 2,
                    specifications: "2 pieces of Solid State Drive (1TB NVMe Gen4)",
                    status: "Cancelled",
                    dateRequested: "2023-10-01",
                }
            ],
            prHistoryCount: 1,
        },
        {   
            itemId: 2,
            itemName: "LED Monitor (24-inch IPS, 144Hz)",
            unitMeasurement: "unit",
            priceCatalog: 8500.00,
            plannedQuantity: 5,
            availableQuantity: 5,
            pendingQuantity: 0,
            fulfilledQuantity: 0,
            prHistory: [
                {
                    prId: 3,
                    quantity: 5,
                    specifications: "5 units of LED Monitor (24-inch IPS, 144Hz)",
                    status: "Available",
                    dateRequested: "2023-10-03",
                },
            ],
            prHistoryCount: 0,
        },
        {
            itemId: 3,
            itemName: "Mechanical Keyboard (Hot-swappable)",
            unitMeasurement: "piece",
            priceCatalog: 2200.00,
            plannedQuantity: 15,
            availableQuantity: 5,
            pendingQuantity: 10,
            fulfilledQuantity: 0,
            prHistory: [],
            prHistoryCount: 0,
        },
    ];

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
                    <input type="text" placeholder="Search Items..." className="search-input" />
                </div>
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
            <div className="tracking-items-card-container">
                    {mockTrackingItems.map((item, index) => (
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
                        />
                    ))}
            </div>
        </LoadingWrapper>
    </main>
  );
}
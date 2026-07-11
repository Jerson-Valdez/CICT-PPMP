import './ppmp-masterlist.css';
import { useEffect, useState } from 'react';
import ItemsCountCard from '../../components/cards/items_count_card/ItemsCountCard';
import MasterlistTable from '../../components/tables/masterlist_table/MasterlistTable';
import LoadingWrapper from '../../components/wrappers/loading wrapper/LoadingWrapper';
import PpmpMasterlistSkeleton from '../../components/skeleton/skeleton_pages/PpmpMasterlistSkeleton';

interface PPMPItem {
    itemId: number;
    itemName: string;
    unitMeasurement: string;
    plannedQuantity: number;
    availableQuantity: number;
    pendingQuantity: number;
    fulfilledQuantity: number;
    priceCatalog: number;
}

export default function PpmpMasterlist() {

    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const [totalPlannedItemCount, setTotalPlannedItemCount] = useState(258);
    const [totalAvailableItemCount, setTotalAvailableItemCount] = useState(189);
    const [totalPendingItemCount, setTotalPendingItemCount] = useState(12);
    const [totalFulfilledItemCount, setTotalFulfilledItemCount] = useState(58);
    const [totalPlannedFunds, setTotalPlannedFunds] = useState(4300000);

    const [ppmpTableData, setPpmpTableData] = useState<PPMPItem[]>([
    {
        itemId: 1,
        itemName: "Solid State Drive (1TB NVMe Gen4)",
        unitMeasurement: "piece",
        plannedQuantity: 10,
        availableQuantity: 9,
        pendingQuantity: 1,
        fulfilledQuantity: 0,
        priceCatalog: 4500.00,
    },
    {
        itemId: 2,
        itemName: "LED Monitor (24-inch IPS, 144Hz)",
        unitMeasurement: "unit",
        plannedQuantity: 5,
        availableQuantity: 5,
        pendingQuantity: 0,
        fulfilledQuantity: 0,
        priceCatalog: 8500.00,
    },
    {
        itemId: 3,
        itemName: "Mechanical Keyboard (Hot-swappable)",
        unitMeasurement: "piece",
        plannedQuantity: 15,
        availableQuantity: 5,
        pendingQuantity: 10,
        fulfilledQuantity: 0,
        priceCatalog: 2200.00,
    },
    {
        itemId: 4,
        itemName: "CAT6 UTP Network Cable (305m Roll)",
        unitMeasurement: "roll",
        plannedQuantity: 2,
        availableQuantity: 0,
        pendingQuantity: 0,
        fulfilledQuantity: 2,
        priceCatalog: 5800.00,
    },
    {
        itemId: 5,
        itemName: "Wireless Access Point (WiFi 6 Dual Band)",
        unitMeasurement: "unit",
        plannedQuantity: 3,
        availableQuantity: 0,
        pendingQuantity: 0,
        fulfilledQuantity: 3,
        priceCatalog: 4200.00,
    },
]);
    
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

    const ItemsCountCardData: {icon: string, title: string, count: number, color: string}[] = [
        {icon: 'package', title: 'Total Items in Planned', count: totalPlannedItemCount, color: 'gray'},
        {icon: 'chart', title: 'Total Available Items', count: totalAvailableItemCount, color: 'blue'},
        {icon: 'clock', title: 'Total Pending Items', count: totalPendingItemCount, color: 'yellow'},
        {icon: 'check', title: 'Total Fulfilled Items', count: totalFulfilledItemCount, color: 'green'},
        {icon: 'businessplan', title: 'Total Planned Price', count: totalPlannedFunds, color: 'royal-red'},
    ];

    function exportLatestPPMP() {
        // Placeholder function for exporting the latest PPMP data
        alert("Exporting latest PPMP data...");
    }

    return (
        <main className="page-container masterlist">
            <LoadingWrapper isLoading={isInitialLoading} skeleton={<PpmpMasterlistSkeleton />}>
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
                <MasterlistTable 
                    itemCount={256} 
                    unitCount={189} 
                    data={ppmpTableData}
                    exportFunction={exportLatestPPMP}
                    />
            </LoadingWrapper>
        </main>
    )
}
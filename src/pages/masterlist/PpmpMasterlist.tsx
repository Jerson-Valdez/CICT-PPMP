import './ppmp-masterlist.css';
import { useEffect, useState } from 'react';
import ItemsCountCard from '../../components/cards/items_count_card/ItemsCountCard';
import MasterlistTable from '../../components/tables/masterlist_table/MasterlistTable';
import LoadingWrapper from '../../components/wrappers/loading wrapper/LoadingWrapper';
import PpmpMasterlistSkeleton from '../../components/skeleton/skeleton_pages/PpmpMasterlistSkeleton';
import { toast } from '../../components/toast/ToastService';
import { useOutletContext } from 'react-router';

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
    const { selectedFiscalYear } = useOutletContext<{ selectedFiscalYear: number }>();
    const [fiscalYearHolder, setFiscalYearHolder] = useState<number | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const [totalPlannedItemCount, setTotalPlannedItemCount] = useState(0);
    const [totalAvailableItemCount, setTotalAvailableItemCount] = useState(0);
    const [totalPendingItemCount, setTotalPendingItemCount] = useState(0);
    const [totalFulfilledItemCount, setTotalFulfilledItemCount] = useState(0);
    const [totalPlannedFunds, setTotalPlannedFunds] = useState(0);

    const [ppmpTableData, setPpmpTableData] = useState<PPMPItem[]>([]);
    
    useEffect(() => {
        const loadPpmpTableData = async () => {
            handleMasterlistFiscalYearChange(selectedFiscalYear);
            try {
                const formData = new FormData();
                formData.append('year', String(selectedFiscalYear));

                const [masterlistResponse, countsResponse] = await Promise.all([

                    fetch('https://test-ppmp.onrender.com/api/masterlist/', {
                        method: "POST",
                        body: formData
                    }),
                    fetch('https://test-ppmp.onrender.com/api/masterlist_cards/', {
                        method: "POST",
                        body: formData
                    })
                ]);

                if (!countsResponse.ok) {
                    toast.error("Failed to fetch PPMP counts. Please try again later.");
                } else {
                    const countsResult = await countsResponse.json();
                    setTotalPlannedItemCount(countsResult.totalPlannedItemCount);
                    setTotalAvailableItemCount(countsResult.totalAvailableItemCount);
                    setTotalPendingItemCount(countsResult.totalPendingItemCount);
                    setTotalFulfilledItemCount(countsResult.totalFulfilledItemCount);
                    setTotalPlannedFunds(countsResult.totalPlannedFunds);
                }

                if (!masterlistResponse.ok) {
                    toast.error("Failed to fetch PPMP masterlist data. Please try again later.");
                }
                else {
                    const masterlistResult = await masterlistResponse.json();
                    setPpmpTableData(masterlistResult);
                }
            } catch (error) {
                console.error("Error fetching PPMP masterlist data:", error);
                toast.error("Network error. Please try again later.");
            }
            finally {
                setIsInitialLoading(false);
                setFiscalYearHolder(selectedFiscalYear);
            }
        };
        loadPpmpTableData();
                
    }, [selectedFiscalYear]);

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

    function handleMasterlistFiscalYearChange(newFiscalYear: number) {
        if (newFiscalYear !== fiscalYearHolder) {
            setIsInitialLoading(true);
            setFiscalYearHolder(newFiscalYear);
        }
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
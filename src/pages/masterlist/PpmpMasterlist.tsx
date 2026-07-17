import './ppmp-masterlist.css';
import { useEffect, useState } from 'react';
import ItemsCountCard from '../../components/cards/items_count_card/ItemsCountCard';
import MasterlistTable from '../../components/tables/masterlist_table/MasterlistTable';
import LoadingWrapper from '../../components/wrappers/loading wrapper/LoadingWrapper';
import PpmpMasterlistSkeleton from '../../components/skeleton/skeleton_pages/PpmpMasterlistSkeleton';
import { toast } from '../../components/toast/ToastService';
import { useOutletContext } from 'react-router';
import { getAccessToken } from '../../../supadb';

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
    const { selectedFiscalYear } = useOutletContext<{ selectedFiscalYear: string }>();
    const [fiscalYearHolder, setFiscalYearHolder] = useState<string | null>(null);

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
                        body: formData,
                        headers: {
                            "Authorization": `Bearer ${await getAccessToken() || ""}`
                        }
                    }),
                    fetch('https://test-ppmp.onrender.com/api/masterlist_cards/', {
                        method: "POST",
                        body: formData,
                        headers: {
                            "Authorization": `Bearer ${await getAccessToken() || ""}`
                        }
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

    const exportLatestPPMP = async () => {
        try {
            toast.info("Exporting the latest PPMP. Please wait...");
            const response = await fetch(`https://test-ppmp.onrender.com/api/export/?year=${selectedFiscalYear}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${await getAccessToken() || ""}` }
            });
            if (!response.ok) {
                toast.error("Failed to export the latest PPMP. Please try again later.");
            }
            else {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `Revised_PPMP_${selectedFiscalYear}_as_of_${new Date().toISOString().split('T')[0]}.xlsx`);
                document.body.appendChild(link);
                link.click();
                link.parentNode?.removeChild(link);
                toast.success("Latest PPMP exported successfully!");
            }
        } catch (error) {
            console.error("Error exporting the latest PPMP:", error);
            toast.error("Network error. Please try again later.");
        }
    };

    function handlePRQuantityChange(prQuantity: number, itemId: number) {
        setPpmpTableData(prevTableData => 
            prevTableData.map(item => {
                if (item.itemId === itemId) {
                    return {
                        ...item,
                        availableQuantity: item.availableQuantity - prQuantity,
                        pendingQuantity: item.pendingQuantity + prQuantity
                    };
                }
                return item;
            })
        );

        setTotalAvailableItemCount(prevCount => prevCount - prQuantity);
        setTotalPendingItemCount(prevCount => prevCount + prQuantity);
    }

    function handleMasterlistFiscalYearChange(newFiscalYear: string) {
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
                    purchaseRequestQuantityChange={handlePRQuantityChange}
                    />
            </LoadingWrapper>
        </main>
    )
}
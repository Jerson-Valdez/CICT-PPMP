import { useEffect, useState } from "react";
import InLieuApprovalTable from "../../components/tables/in_lieu_approval_table/InLieuApprovalTable";
import "./in-lieu-approvals.css";
import LoadingWrapper from "../../components/wrappers/loading wrapper/LoadingWrapper";
import TableSkeleton from "../../components/skeleton/TableSkeleton";
import { toast } from "../../components/toast/ToastService";
import { useOutletContext } from "react-router";
import { getAccessToken } from "../../../supadb";

interface Item{
    itemId: number;
    quantity: number;
    itemName: string;
    unitMeasurement: string;
    priceCatalog: number;
    availableQuantityAfter?: number;
    plannedQuantity?: number;
    itemCategory?: string;
    ppmpCategory?: string;
}
interface InLieuApprovalData {
    inLieuId: number;
    requestDate: string;
    requestedBy: string;
    openFundsUtilized?: number;
    inLieuReducedItems: Item[];
    inLieuAdditionItems: Item[];
    budgetImpact: number;
    status: string;
}

export default function InLieuApprovals() {
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const { selectedFiscalYear } = useOutletContext<{ selectedFiscalYear: string }>();
    const [fiscalYearHolder, setFiscalYearHolder] = useState<string | null>(null);

    const [inLieuApprovalData, setInLieuApprovalData] = useState<InLieuApprovalData[]>([]);
    const [itemCategories, setItemCategories] = useState<string[]>([]);
    const [ppmpCategories, setPpmpCategories] = useState<string[]>([]);

    useEffect(() => {
            const loadPpmpApprovalData = async () => {
                handlePpmpMonitoringFiscalYearChange(selectedFiscalYear);
                try {
                    const formData = new FormData();
                    formData.append('year', String(selectedFiscalYear));

                    const [approvalResponse] = await Promise.all([
                        fetch('https://test-ppmp.onrender.com/api/in_lieu_approvals/', {
                            method: "POST",
                            body: formData,
                            headers: {
                                "Authorization": `Bearer ${await getAccessToken() || ""}`
                            }
                        })
                    ]);
    
                    if (!approvalResponse.ok) {
                        toast.error("Failed to fetch In-Lieu approval data. Please try again later.");
                    } else {
                        const approvalResult = await approvalResponse.json();
    
                        setInLieuApprovalData(approvalResult.inLieuApprovalData || []);

                        const uniqueReducedItemCategories: string[] = Array.from(new Set(approvalResult.inLieuApprovalData.flatMap((item: InLieuApprovalData) => item.inLieuReducedItems.map((reducedItem) => reducedItem.itemCategory))));

                        const uniqueAdditionItemCategories: string[] = Array.from(new Set(approvalResult.inLieuApprovalData.flatMap((item: InLieuApprovalData) => item.inLieuAdditionItems.map((additionItem) => additionItem.itemCategory))));
                        const combinedItemCategories: string[] = Array.from(new Set([...uniqueReducedItemCategories, ...uniqueAdditionItemCategories]));
                        setItemCategories(combinedItemCategories);
                        
                        const uniqueReducedPpmpCategories: string[] = Array.from(new Set(approvalResult.inLieuApprovalData.flatMap((item: InLieuApprovalData) => item.inLieuReducedItems.map((reducedItem) => reducedItem.ppmpCategory))));
                        const uniqueAdditionPpmpCategories: string[] = Array.from(new Set(approvalResult.inLieuApprovalData.flatMap((item: InLieuApprovalData) => item.inLieuAdditionItems.map((additionItem) => additionItem.ppmpCategory))));
                        const combinedPpmpCategories: string[] = Array.from(new Set([...uniqueReducedPpmpCategories, ...uniqueAdditionPpmpCategories]));
                        setPpmpCategories(combinedPpmpCategories);

                        setFiscalYearHolder(selectedFiscalYear);
                    }
                } catch (error) {
                    console.error("Error fetching In-Lieu approval data:", error);
                    toast.error("Network error. Please try again later.");
                }
                finally {
                    setIsInitialLoading(false);
                }
            };
            loadPpmpApprovalData();
                    
        }, [selectedFiscalYear]);

    function handlePpmpMonitoringFiscalYearChange(newFiscalYear: string) {
        if (newFiscalYear !== fiscalYearHolder) {
            setIsInitialLoading(true);
            setFiscalYearHolder(newFiscalYear);
        }
    }

    function handleInLieuStatusChange(inLieuId: number, newStatus: string) {
        setInLieuApprovalData((prevData) =>
            prevData.map((item) =>
                item.inLieuId === inLieuId ? { ...item, status: newStatus } : item
            )
        );
    }
    return (
        <main className="page-container approvals">
            <LoadingWrapper isLoading={isInitialLoading} skeleton={<TableSkeleton />}>
                <InLieuApprovalTable data={inLieuApprovalData} handleInLieuStatusChange={handleInLieuStatusChange} itemCategories={itemCategories} ppmpCategories={ppmpCategories} />
            </LoadingWrapper>
        </main>
    )
}
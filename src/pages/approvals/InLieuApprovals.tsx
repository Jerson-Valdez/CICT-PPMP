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
    
                        console.log("In-Lieu approval data retrieved: ", approvalResult.inLieuApprovalData);
    
                        setInLieuApprovalData(approvalResult.inLieuApprovalData || []);
                        
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
                <InLieuApprovalTable data={inLieuApprovalData} handleInLieuStatusChange={handleInLieuStatusChange} />
            </LoadingWrapper>
        </main>
    )
}
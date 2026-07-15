import { useEffect, useState } from "react";
import InLieuApprovalTable from "../../components/tables/in_lieu_approval_table/InLieuApprovalTable";
import "./in-lieu-approvals.css";
import LoadingWrapper from "../../components/wrappers/loading wrapper/LoadingWrapper";
import TableSkeleton from "../../components/skeleton/TableSkeleton";

interface Item{
    itemId: number;
    quantity: number;
    itemName: string;
    unitMeasurement: string;
    priceCatalog: number;
    availableQuantityAfter?: number;
    plannedQuantity?: number;
}
interface BudgetImpact {
    originalItemsTotal: number;
    proposedItemsTotal: number;
    difference: number;
}
interface InLieuApprovalData {
    inLieuId: number;
    requestDate: string;
    requestedBy: string;
    openFundsUtilized?: number;
    inLieuReducedItems: Item[];
    inLieuAdditionItems: Item[];
    budgetImpact: BudgetImpact;
    status: string;
}

export default function InLieuApprovals() {
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const inLieuApprovalData: InLieuApprovalData[] = [
        {
            inLieuId: 1,
            requestDate: "2024-06-01",
            requestedBy: "John Doe",
            openFundsUtilized: 1030,
            inLieuReducedItems: [
                {
                    itemId: 1,
                    quantity: 10,
                    itemName: "ddr 4 ram",
                    unitMeasurement: "pieces",
                    priceCatalog: 100.00,
                    availableQuantityAfter: -25,
                    plannedQuantity: 5
                },
                {
                    itemId: 2,
                    quantity: 10,
                    itemName: "sd card",
                    unitMeasurement: "pieces",
                    priceCatalog: 200.00,
                    availableQuantityAfter: 5,
                    plannedQuantity: 5
                },
                {
                    itemId: 3,
                    quantity: 10,
                    itemName: "Solid State Drive (1TB NVMe Gen4)",
                    unitMeasurement: "pieces",
                    priceCatalog: 300.00,
                    availableQuantityAfter: 5,
                    plannedQuantity: 5
                },
                {
                    itemId: 4,
                    quantity: 10,
                    itemName: "sd card",
                    unitMeasurement: "pieces",
                    priceCatalog: 200.00,
                    availableQuantityAfter: 5,
                    plannedQuantity: 5
                },
            ],
            inLieuAdditionItems: [
                {
                    itemId: 2,
                    quantity: 5,
                    itemName: "Item 2",
                    unitMeasurement: "pieces",
                    priceCatalog: 150.00,
                }
            ],
            budgetImpact: {
                originalItemsTotal: 1000.00,
                proposedItemsTotal: 750.00,
                difference: 250.00
            },
            status: "Pending"
        },
        {
            inLieuId: 2,
            requestDate: "2023-06-01",
            requestedBy: "John jerson",
            inLieuReducedItems: [
                {
                    itemId: 1,
                    quantity: 10,
                    itemName: "Item 1",
                    unitMeasurement: "pieces",
                    priceCatalog: 100.00,
                    availableQuantityAfter: 5,
                    plannedQuantity: 5
                }
            ],
            inLieuAdditionItems: [
                {
                    itemId: 2,
                    quantity: 5,
                    itemName: "Item 2",
                    unitMeasurement: "pieces",
                    priceCatalog: 150.00,
                }
            ],
            budgetImpact: {
                originalItemsTotal: 1000.00,
                proposedItemsTotal: 750.00,
                difference: 250.00
            },
            status: "Rejected"
        }
    ];

    useEffect(() => {
        const loadInLieuApprovalData = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 500));
            } finally {
                setIsInitialLoading(false);
            }
        };

        loadInLieuApprovalData();
    }, []);

    return (
        <main className="page-container approvals">
            <LoadingWrapper isLoading={isInitialLoading} skeleton={<TableSkeleton />}>
                <InLieuApprovalTable data={inLieuApprovalData} />
            </LoadingWrapper>
        </main>
    )
}
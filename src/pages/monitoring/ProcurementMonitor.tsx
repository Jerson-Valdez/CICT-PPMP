import ItemsCountCard from "../../components/cards/items_count_card/ItemsCountCard";
import TrackingItemCard from "../../components/cards/tracking_item_card/TrackingItemCard";
import "./procurement-monitor.css";
import { IconSearch, IconFilter } from '@tabler/icons-react';

export default function ProcurementMonitor() {

    const ItemsCountCardData: {icon: string, title: string, count: number, color: string}[] = [
        {icon: 'package', title: 'Total Items in Planned', count: 256, color: 'gray'},
        {icon: 'chart', title: 'Total Available Items', count: 189, color: 'blue'},
        {icon: 'clock', title: 'Total Pending Items', count: 12, color: 'yellow'},
        {icon: 'check', title: 'Total Fulfilled Items', count: 58, color: 'green'},
    ];

    interface prHistoryItem {
        id: string;
        prNumber: string;
        quantity: number;
        specifications: string;
        status: string;
        dateRequested: string;
        dateFulfilled?: string | null;
    } 

    interface TrackingItem {
        itemName: string;
        unitCount: number;
        priceCatalog: number;
        plannedQuantity: number;
        availableQuantity: number;
        pendingQuantity: number;
        fulfilledQuantity: number;
        prHistory: prHistoryItem[];
        prHistoryCount: number;
    }

    const mockTrackingItems: TrackingItem[] = [
        {
            itemName: "Solid State Drive (1TB NVMe Gen4)",
            unitCount: 10,
            priceCatalog: 4500.00,
            plannedQuantity: 10,
            availableQuantity: 9,
            pendingQuantity: 1,
            fulfilledQuantity: 0,
            prHistory: [
                {
                    id: "pr-001",
                    prNumber: "PR-2023-001",
                    quantity: 5,
                    specifications: "5 pieces of Solid State Drive (1TB NVMe Gen4)",
                    status: "Pending",
                    dateRequested: "2023-10-01",
                },
                {
                    id: "pr-002",
                    prNumber: "PR-2023-002",
                    quantity: 4,
                    specifications: "4 pieces of Solid State Drive (1TB NVMe Gen4)",
                    status: "Fulfilled",
                    dateRequested: "2023-10-05",
                    dateFulfilled: "2023-10-10",
                },
                {
                    id: "pr-003",
                    prNumber: "PR-2023-003",
                    quantity: 2,
                    specifications: "2 pieces of Solid State Drive (1TB NVMe Gen4)",
                    status: "Cancelled",
                    dateRequested: "2023-10-01",
                }
            ],
            prHistoryCount: 1,
        },
        {   
            itemName: "LED Monitor (24-inch IPS, 144Hz)",
            unitCount: 5,
            priceCatalog: 8500.00,
            plannedQuantity: 5,
            availableQuantity: 5,
            pendingQuantity: 0,
            fulfilledQuantity: 0,
            prHistory: [
                {
                    id: "pr-003",
                    prNumber: "PR-2023-003",
                    quantity: 5,
                    specifications: "5 units of LED Monitor (24-inch IPS, 144Hz)",
                    status: "Available",
                    dateRequested: "2023-10-03",
                },
            ],
            prHistoryCount: 0,
        },
        {
            itemName: "Mechanical Keyboard (Hot-swappable)",
            unitCount: 15,
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
                    <option value="ascending">Ascending Item Name</option>
                    <option value="descending">Descending Item Name</option>
                    <option value="available">Available Items</option>
                    <option value="pending">Pending Items</option>
                    <option value="fulfilled">Fulfilled Items</option>
                </select>
            </div>
        </div>
        <div className="tracking-items-card-container">
                {mockTrackingItems.map((item, index) => (
                    <TrackingItemCard 
                        key={index} 
                        itemName={item.itemName}
                        unitCount={item.unitCount}
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
    </main>
  );
}
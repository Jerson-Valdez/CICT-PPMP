import "./in-lieu-reallocation.css";
import { IconPrinter, IconTransfer, IconX, IconCheck, IconSearch, IconShoppingCart, IconTransform } from '@tabler/icons-react';
import alabIcon from "../../assets/icons/alab.svg";
import NewItemCard from "../../components/cards/new_item_card/NewItemCard";
import LieuItemCard from "../../components/cards/lieu_item_card/LieuItemCard";
import { useEffect, useState } from "react";
import WarningNote from "../../components/notes/warning_note/WarningNote";
import ViewInLieu from "../../components/dialogs/view_in_lieu/ViewInLieu";
import LoadingWrapper from "../../components/wrappers/loading wrapper/LoadingWrapper";
import InLieuReallocationSkeleton from "../../components/skeleton/skeleton_pages/InLieuReallocationSkeleton";

interface NewItem {
    itemId: number;
    name: string;
    measurementUnit: string;
    quantity: number;
    unitPrice: number;
}
interface SelectedLieuItem {
    itemId: number;
    itemName: string;
    unitMeasurement: string;
    reduceQuantity: number;
    priceCatalog: number;
}
interface ppmpReallocationData {
    itemId: number;
    itemName: string;
    unitMeasurement: string;
    plannedQuantity: number;
    availableQuantity: number;
    pendingQuantity: number;
    fulfilledQuantity: number;
    priceCatalog: number;
}

export default function InLieuReallocation() {
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const [isPrintPROpen, setPrintPROpen] = useState(false);

    const [openFunds, setOpenFunds] = useState<number>(0);

    const [ppmpReallocationData, setPpmpReallocationData] = useState<ppmpReallocationData[]>([]);

    useEffect(() => {
        const loadPpmpReallocationData = async () => {
            try {
                setPpmpReallocationData([
                    { itemId: 1, itemName: "Solid State Drive (1TB NVMe Gen4)", unitMeasurement: "piece", plannedQuantity: 10, availableQuantity: 9, pendingQuantity: 1, fulfilledQuantity: 0, priceCatalog: 4500.00 },
                    { itemId: 2, itemName: "LED Monitor (24-inch IPS, 144Hz)", unitMeasurement: "unit", plannedQuantity: 5, availableQuantity: 5, pendingQuantity: 0, fulfilledQuantity: 0, priceCatalog: 8500.00 },
                    { itemId: 3, itemName: "Mechanical Keyboard (Hot-swappable)", unitMeasurement: "piece", plannedQuantity: 15, availableQuantity: 5, pendingQuantity: 10, fulfilledQuantity: 0, priceCatalog: 2200.00 },
                    { itemId: 4, itemName: "Mechanical Keyboard (Hot-swappable)", unitMeasurement: "piece", plannedQuantity: 15, availableQuantity: 0, pendingQuantity: 15, fulfilledQuantity: 0, priceCatalog: 2200.00 }])
                setOpenFunds(10000);
                await new Promise(resolve => setTimeout(resolve, 500));
            } finally {
                setIsInitialLoading(false);
            }
        };

        loadPpmpReallocationData();
    }, []);

    const [inLieuSearchTerm, setInLieuSearchTerm] = useState<string>("");
    const [newItemsSearchTerm, setNewItemsSearchTerm] = useState<string>("");

    let inLieuData = ppmpReallocationData.filter((item) => {
        const searchLower = inLieuSearchTerm.toLowerCase();
        const matchesSearch = inLieuSearchTerm === "" || item.itemName.toLowerCase().includes(searchLower);

        return matchesSearch;
    });

    const filteredCatalogItems = newItemsSearchTerm.trim() === "" 
        ? []
        : ppmpReallocationData.filter(item => 
            item.itemName.toLowerCase().includes(newItemsSearchTerm.toLowerCase())
        );

    const handleSelectNewItem = (catalogItem: any) => {
        setNewItemsArray(prev => [...prev, {
            itemId: Date.now(),
            name: catalogItem.itemName,
            measurementUnit: catalogItem.unitMeasurement,
            quantity: 1,
            unitPrice: catalogItem.priceCatalog
        }]);
        setNewItemsSearchTerm("");
    };

    const [newItemsArray, setNewItemsArray] = useState<NewItem[]>([
        { itemId: Date.now(), name: "", measurementUnit: "", quantity: 1, unitPrice: 0 }
    ]);

    const requiredBudget = newItemsArray.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

    const [selectedLieuItems, setSelectedLieuItems] = useState<SelectedLieuItem[]>([]);

    const selectedItemsValue = selectedLieuItems.reduce((sum, item) => sum + (item.reduceQuantity * item.priceCatalog), 0);

    const remainingBudget = selectedItemsValue - requiredBudget;

    const isNewItemsValid = newItemsArray.every(item => 
        item.name.trim() !== "" && 
        item.measurementUnit.trim() !== "" && 
        item.quantity > 0 && 
        item.unitPrice > 0
    );

    const isOldItemsValid = selectedLieuItems.every(item => 
        item.itemName.trim() !== "" && 
        item.unitMeasurement.trim() !== "" && 
        item.reduceQuantity > 0 && 
        item.priceCatalog > 0
    );

    const handleAddItem = () => setNewItemsArray([...newItemsArray, { itemId: Date.now(), name: "", measurementUnit: "", quantity: 1, unitPrice: 0 }]);
    const handleDeleteItem = (itemId: number) => setNewItemsArray(newItemsArray.filter(item => item.itemId !== itemId));
    const handleUpdateItem = (itemId: number, field: keyof NewItem, value: string | number) => {
        setNewItemsArray(prev => prev.map(item => item.itemId === itemId ? { ...item, [field]: value } : item));
    };

    const handleToggleLieuItem = (item: any) => {
        const isSelected = selectedLieuItems.some(selected => selected.itemId === item.itemId);
        if (isSelected) {
            setSelectedLieuItems(prev => prev.filter(selected => selected.itemId !== item.itemId));
        } else {
            setSelectedLieuItems(prev => [...prev, {
                itemId: item.itemId,
                itemName: item.itemName,
                unitMeasurement: item.unitMeasurement,
                reduceQuantity: 0,
                priceCatalog: item.priceCatalog
            }]);
        }
    };

    const handleUpdateLieuQuantity = (itemId: number, quantity: number) => {
        setSelectedLieuItems(prev => prev.map(item => 
            item.itemId === itemId ? { ...item, reduceQuantity: quantity } : item
        ));
    };

    const handleSaveToDatabase = () => {
        const actualItemsToReduce = selectedLieuItems.filter(item => item.itemId !== 0);
        const openFundsUsed = selectedLieuItems.find(item => item.itemId === 0)?.reduceQuantity || 0;

        const payload = {
            status: "Pending Approval",
            requiredBudget: requiredBudget,
            lieuFundedValue: selectedItemsValue,
            openFundsUtilized: openFundsUsed, // iSave to sa new column sa IN_LIEU table openFundsUtilized
            itemsToProcure: newItemsArray,
            itemsToReduce: actualItemsToReduce // eto naman ungg original items na galing sa PPMP na ire-reduce natin
        };
        
        console.log("Full JSON Payload ready for database:", payload);
    };

    return (
        <main className="page-container reallocation">
            <div className="budget-balancing-container">
                <div className="title-container">
                    <h2>Bulk Budget Balancing</h2>
                    <p>Add emergency needs and select items from the Available In-Lieu Pool to fit the budget.</p>
                </div>
                <div className={`price-balancing-container ${remainingBudget >= 0 ? 'balanced' : 'unbalanced'}`}>
                    <div className="required-budget-container">
                        <h3>Required Budget</h3>
                        <p>PHP {requiredBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                    <IconTransfer size={24} className="transfer-icon" color="gray" />
                    <div className="available-budget-container">
                        <h3>Selected for Lieu</h3>
                        <p>PHP {selectedItemsValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                    <div className="remaining-budget-container">
                        <h3>Remaining</h3>
                        <p>PHP {remainingBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                    {remainingBudget >= 0 ? <IconCheck size={24} className="check-icon" color="green" /> : <IconX size={24} className="x-icon" color="red" />}
                </div>

                <div className="note-container">
                    <WarningNote message="Please ensure that all fields must be filled out before proceeding." />
                </div>

                <div className="new-lieu-items-container">
                    <div className="new-items-container">
                        <div className="search-container relative">
                            <IconSearch size={24} />
                            <input 
                                type="text" 
                                placeholder="Search Catalog to add new item..." 
                                className="search-input w-full" 
                                value={newItemsSearchTerm}
                                onChange={(e) => setNewItemsSearchTerm(e.target.value)} />
                            
                            {filteredCatalogItems.length > 0 && (
                                <div className="option-container">
                                    <ul>
                                        {filteredCatalogItems.map((item) => (
                                            <li 
                                                key={item.itemId}
                                                onClick={() => handleSelectNewItem(item)}>

                                                <span className="item-name">{item.itemName}</span>
                                                <span className="item-details">
                                                    PHP {item.priceCatalog.toLocaleString()} / {item.unitMeasurement}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <div className="title-button-container">
                            <h3><IconShoppingCart size={24} color="green"/> New Needs Cart</h3>
                            <button className="btn-secondary cursor-pointer" onClick={handleAddItem}>+ Add Item</button>
                        </div>
                        <div className="new-items-card-container">
                            {newItemsArray.map((item) => (
                                <NewItemCard key={item.itemId} itemId={item.itemId} itemName={item.name} unitMeasurement={item.measurementUnit} quantity={item.quantity} priceCatalog={item.unitPrice} onDelete={handleDeleteItem} onUpdate={handleUpdateItem} ppmpReallocationData={ppmpReallocationData} />
                            ))}
                        </div>
                    </div>
                    
                    <div className="lieu-items-container">
                        <div className="search-container">
                            <IconSearch size={24} />
                            <input type="text" placeholder="Search Item to be “In Lieu of” new Items..." className="search-input" value={inLieuSearchTerm} onChange={(e) => setInLieuSearchTerm(e.target.value)} />
                        </div>
                        <div className="title-button-container">
                            <h3><IconTransform size={24} color="red"/> Available Lieu Pool</h3>
                            {newItemsArray.length > 0 && requiredBudget > 0 && isNewItemsValid ?
                                (<button className="btn-alab"><img src={alabIcon} alt="ALAB Icon" className="w-5 h-5" />Suggest Optimization</button>) : (
                                <button className="btn-alab" disabled><img src={alabIcon} alt="ALAB Icon" className="w-5 h-5" />Suggest Optimization</button>
                                )}
                        </div>
                        <LoadingWrapper isLoading={isInitialLoading} skeleton={<InLieuReallocationSkeleton />}>
                            <div className="lieu-items-card-container">
                                {openFunds > 0 && (() => {
                                    const selectedOpenFunds = selectedLieuItems.find(selected => selected.itemId === 0);
                                    const isSelected = !!selectedOpenFunds;
                                    const currentReduceQty = selectedOpenFunds ? selectedOpenFunds.reduceQuantity : 0;

                                    return (
                                        <LieuItemCard
                                            key={0}
                                            itemId={0}
                                            itemName="Unallocated Open Funds"
                                            unitMeasurement="PHP"
                                            priceCatalog={1}     
                                            plannedQuantity={openFunds}
                                            availableQuantity={openFunds}
                                            isSelected={isSelected}
                                            reduceQuantity={currentReduceQty}
                                            onToggle={() => handleToggleLieuItem({
                                                itemId: 0,
                                                itemName: "Unallocated Open Funds",
                                                unitMeasurement: "PHP",
                                                priceCatalog: 1
                                            })}
                                            onQuantityChange={handleUpdateLieuQuantity}
                                        />
                                    );
                                })()}
                                {inLieuData?.map((item) => {
                                    const selectedItemInfo = selectedLieuItems.find(selected => selected.itemId === item.itemId);
                                    const isSelected = !!selectedItemInfo;
                                    const currentReduceQty = selectedItemInfo ? selectedItemInfo.reduceQuantity : 0;

                                    return item.availableQuantity > 0 && (
                                        <LieuItemCard 
                                            key={item.itemId}
                                            itemId={item.itemId}
                                            itemName={item.itemName}
                                            unitMeasurement={item.unitMeasurement}
                                            priceCatalog={item.priceCatalog}
                                            plannedQuantity={item.plannedQuantity}
                                            availableQuantity={item.availableQuantity}
                                            isSelected={isSelected}
                                            reduceQuantity={currentReduceQty}
                                            onToggle={() => handleToggleLieuItem(item)}
                                            onQuantityChange={handleUpdateLieuQuantity}
                                        />
                                    );
                                })}
                            </div>
                        </LoadingWrapper>
                    </div>
                </div>
                {remainingBudget >= 0 && newItemsArray.length > 0 && requiredBudget > 0 && isNewItemsValid && isOldItemsValid ?(
                    <div className="button-container">
                        <button 
                            className="btn-secondary" 
                            onClick={() => setPrintPROpen(true)}
                        >
                            <IconPrinter size={24} />Print Preview
                        </button>
                        
                        <button 
                            className="btn-primary-rd-shadow" 
                            onClick={handleSaveToDatabase}
                        >
                            <IconTransfer size={24} />Apply for Approval
                        </button>
                    </div>
                ):(
                    <div className="button-container">
                        <button className="btn-secondary" disabled>
                            <IconPrinter size={24} />Print Preview
                        </button>
                        <button className="btn-primary-rd-shadow" disabled>
                            <IconTransfer size={24} />Apply for Approval
                        </button>
                    </div>
                )}
                <ViewInLieu 
                    requestDate={new Date().toLocaleString('en-PH')}
                    originalItems={selectedLieuItems.map(item => ({
                        itemId: item.itemId,
                        quantity: item.reduceQuantity,
                        itemName: item.itemName,
                        unitMeasurement: item.unitMeasurement,
                        priceCatalog: item.priceCatalog,
                        availableQuantityAfter: (ppmpReallocationData?.find(ppmpItem => ppmpItem.itemId === item.itemId)?.availableQuantity ?? (selectedLieuItems.find(i => i.itemId === item.itemId)?.itemId === 0 ? openFunds : 0)) - item.reduceQuantity,
                        plannedQuantity: ppmpReallocationData?.find(ppmpItem => ppmpItem.itemId === item.itemId)?.plannedQuantity ?? 0
                    }))}
                    proposedItems={newItemsArray.map(item => ({
                        itemId: item.itemId,
                        quantity: item.quantity,
                        itemName: item.name,
                        unitMeasurement: item.measurementUnit,
                        priceCatalog: item.unitPrice
                    }))}
                    status="Pending"
                    isOpen={isPrintPROpen}
                    onClose={() => setPrintPROpen(false)}
                />
            </div>
        </main>
    )
}
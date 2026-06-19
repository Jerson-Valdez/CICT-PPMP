import "./in-lieu-reallocation.css";
import { IconPrinter, IconTransfer, IconX, IconCheck, IconSearch, IconShoppingCart, IconTransform } from '@tabler/icons-react';
import alabIcon from "../../assets/icons/alab.svg";

export default function InLieuReallocation() {
    const requiredBudget = 1000000;
    const selectedItemsValue = 1000000;
    const remainingBudget = selectedItemsValue - requiredBudget;
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
                        <p>PHP {requiredBudget.toLocaleString()}</p>
                    </div>
                    <IconTransfer size={24} className="transfer-icon" color="gray" />
                    <div className="available-budget-container">
                        <h3>Selected for Lieu</h3>
                        <p>PHP {selectedItemsValue.toLocaleString()}</p>
                    </div>
                    <div className="remaining-budget-container">
                        <h3>Remaining</h3>
                        <p>PHP {remainingBudget.toLocaleString()}</p>
                    </div>
                    {remainingBudget >= 0 ? (
                        <IconCheck size={24} className="check-icon" color="green" />
                    ) : (
                        <IconX size={24} className="x-icon" color="red" />
                    )}
                </div>
                <div className="new-lieu-items-container">
                    <div className="new-items-container">
                        <div className="search-container">
                            <IconSearch size={24} />
                            <input type="text" placeholder="Search Item if already exist and you want to add Qty..." className="search-input" />
                        </div>
                        <div className="title-button-container">
                            <h3><IconShoppingCart size={24} color="green"/> New Needs Cart</h3>
                            <button className="btn-secondary">+ Add Item</button>
                        </div>
                        <div className="new-items-card-container">

                        </div>
                    </div>
                    <div className="lieu-items-container">
                        <div className="search-container">
                            <IconSearch size={24} />
                            <input type="text" placeholder="Search Item to be “In Lieu of” new Items..." className="search-input" />
                        </div>
                        <div className="title-button-container">
                            <h3><IconTransform size={24} color="red"/> Available Lieu Pool</h3>
                            <button className="btn-alab">
                                <img src={alabIcon} alt="ALAB Icon" className="w-5 h-5" />
                                Suggest Optimization
                            </button>
                        </div>
                        <div className="lieu-items-card-container">
                                
                        </div>
                    </div>
                </div>
                <div className="button-container">
                    {remainingBudget >= 0 ? (
                        <button className="btn-secondary"><IconPrinter size={24} />Print Preview</button>
                    ) : (
                        <button className="btn-secondary" disabled><IconPrinter size={24} />Print Preview</button>
                    )}
                    {remainingBudget >= 0 ? (
                        <button className="btn-primary-rd-shadow"><IconTransfer size={24} />Apply for Approval</button>
                    ) : (
                        <button className="btn-primary-rd-shadow" disabled><IconTransfer size={24} />Apply for Approval</button>
                    )}
                </div>
            </div>
        </main>
    )
}
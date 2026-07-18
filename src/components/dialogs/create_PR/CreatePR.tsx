import "./create-pr.css";
import { IconFileStack, IconChartHistogram, IconClock, IconCircleDashedCheck, IconX, IconPrinter } from '@tabler/icons-react';
import { useEffect, useRef, useState } from "react";
import PrintPR from "../print_PR/PrintPR";
import { getAccessToken, getUserID } from "../../../../supadb"
import { confirm } from "../../dialogs/global_dialog/DialogService";
import { toast } from "../../toast/ToastService";
import { useOutletContext } from "react-router";
import { showCircleLoadingDialog } from "../circle_loading_dialog/CircleLoadingDialogService";

interface CreatePRProps {
    itemId: number;
    itemName: string;
    unitMeasurement: string;
    availableQuantity: number;
    pendingQuantity: number;
    fulfilledQuantity: number;
    priceCatalog: number;
    isOpen: boolean;
    purchaseRequestQuantityChange: (prQuantity: number, itemId: number) => void;
    onClose: () => void;
}

export default function CreatePR({itemId, itemName, unitMeasurement, availableQuantity, pendingQuantity, fulfilledQuantity, priceCatalog, isOpen, purchaseRequestQuantityChange, onClose }: CreatePRProps) {
    const [requestQuantity, setRequestQuantity] = useState<number | null>(1);
    const [techSpecs, setTechSpecs] = useState("");
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
    const totalPrice = priceCatalog * (requestQuantity || 0);
    const { userFullName } = useOutletContext<{ userFullName: string }>();

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen) {
            if (!dialog.hasAttribute('open')) {
                dialog.showModal();
            }
        } else {
            dialog.close();
        }
    }, [isOpen]);

    const handleCancel = (e: React.SyntheticEvent) => {
        e.preventDefault(); 
        onClose();          
    };

    const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        onClose();
    };

    function handleRequestQuantityChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.valueAsNumber;
        const errorMessageElement = document.getElementById(`requestQtyError${itemId}`);
        setRequestQuantity(null);

        if (!Number.isFinite(value) || value < 1 || value > availableQuantity) {
            errorMessageElement!.textContent = `Request quantity must be between 1 and ${availableQuantity}.`;
        } else {
            errorMessageElement!.textContent = "";
            setRequestQuantity(value);
        }
    }

    function handleTechSpecsChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        const value = e.target.value;
        const errorMessageElement = document.getElementById(`specsError${itemId}`);

        if (value.trim() === "") {
            errorMessageElement!.textContent = "Technical specifications cannot be empty.";
            setTechSpecs("");
        } else {
            errorMessageElement!.textContent = "";
            setTechSpecs(value);
        }
    }

    async function handlePurchaseRequest() {
        confirm("Create Purchase Request", "Note: This will create a new purchase request " + itemName + " with a request quantity of " + requestQuantity + ".", "info", "Continue, Create PR")
            .then((confirmed) => {
                if (confirmed) {
                    proceedCreatePR();
                }
            }
        );
    }

    async function proceedCreatePR() {
        if (requestQuantity === null || requestQuantity < 1 || requestQuantity > availableQuantity) {
            toast.error("Invalid request quantity. Please ensure it is between 1 and the available quantity.");
            return;
        }

        const formData = new FormData();
        formData.append("item_id", String(itemId));
        formData.append("specifications", String(techSpecs));
        formData.append("request_quantity", String(requestQuantity));
        formData.append("user_id", String(await getUserID(await getAccessToken() || "")));

        const closeLoading = showCircleLoadingDialog();
        try {
            const response = await fetch("https://test-ppmp.onrender.com/api/purchase_request/", {   
                method: "POST",
                body: formData,
                headers: {
                    "Authorization": `Bearer ${await getAccessToken() || ""}`
                }
            });
            const responseData = await response.json();
            if (!response.ok) {
                toast.error(responseData.message || "Failed to create purchase request. Please try again later.");
                return;
            }else{
                onClose();
                purchaseRequestQuantityChange(requestQuantity, itemId);
                toast.success("Purchase request created successfully.");
                console.log(responseData);
                setRequestQuantity(1);
                setTechSpecs("");
            }
        }catch (error) {
            console.error("Error creating purchase request:", error);
            toast.error("Network error. Please try again later.");
        }finally {
            closeLoading();
        }
    }

    return(
        <>
            <dialog ref={dialogRef} onCancel={handleCancel} className="create-pr">
                <div className="header">
                    <div className="icon blue">
                        <IconFileStack size={24} />
                    </div>
                    <div className="title">
                        <h3>Create Purchase Request</h3>
                        <p>Create a new purchase request for approval.</p>
                    </div>
                </div>
                <p className="item-name">{itemName} • ({unitMeasurement})</p>

                <div className="status-count-container">
                    <div className="status-count-card"><div className="icon-count blue"><IconChartHistogram size={24}/> <p>{availableQuantity}</p></    div><p>AVAILABLE</p></div>
                    <div className="status-count-card"><div className="icon-count yellow"><IconClock size={24}/> <p>{pendingQuantity}</p></    div><p>PENDING</p></div>
                    <div className="status-count-card"><div className="icon-count green"><IconCircleDashedCheck size={24}/> <p>{fulfilledQuantity}</p></    div><p>FULFILLED</p></div>
                </div>

                <div className="input-group">
                    <div className="field-group">
                        <label htmlFor={`requestQty${itemId}`}>Request Quantity</label>
                        <input type="number" id={`requestQty${itemId}`} min="1" max={availableQuantity} value={requestQuantity ?? ''} onChange={handleRequestQuantityChange} />
                        <p className="error-message" id={`requestQtyError${itemId}`}></p>
                    </div>
                    <div className="field-group">
                        <label htmlFor={`priceCatalog${itemId}`}>Price Catalog (PHP)</label>
                        <input type="number" id={`priceCatalog${itemId}`} value={priceCatalog} readOnly />
                    </div>
                </div>
                <div className="field-group">
                    <label htmlFor={`specifications${itemId}`}>Technical Specifications</label>
                    <textarea id={`specifications${itemId}`} rows={4} placeholder="Enter technical specifications..." value={techSpecs} onChange={handleTechSpecsChange}></textarea>
                    <p className="error-message" id={`specsError${itemId}`}></p>
                </div>
                <div className="total-price">
                    <p>Total Amount:</p>
                    <h4>PHP {totalPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '0.00'}</h4>
                </div>
                <div className="action-btns">
                    <div className="cancel-btn-container">
                        <button className="btn-secondary" onClick={handleClose}>
                            <IconX size={18} />
                            Cancel
                        </button>
                    </div>
                    {requestQuantity && techSpecs ? (
                        <>
                            <button className="btn-secondary" onClick={() => setIsPrintPreviewOpen(true)}>
                                <IconPrinter size={18} />
                                Print Preview
                            </button>
                            <button className="btn-solid blue" onClick={() => handlePurchaseRequest()}>
                                <IconFileStack size={18} />
                                Create PR
                            </button>
                        </>
                    ) : <>
                            <button className="btn-secondary" disabled>
                                <IconPrinter size={18} />
                                Print Preview
                            </button>
                            <button className="btn-solid blue" disabled>
                                <IconFileStack size={18} />
                                Create PR
                            </button>
                        </>}
                </div>
            </dialog>
            <PrintPR
                itemName={itemName}
                unitMeasurement={unitMeasurement}
                itemDescription={techSpecs}
                quantity={requestQuantity ?? 0}
                unitPrice={priceCatalog}
                requestedDate={new Date().toLocaleDateString()}
                isOpen={isPrintPreviewOpen}
                onClose={() => setIsPrintPreviewOpen(false)}
            />
        </>
    )
}
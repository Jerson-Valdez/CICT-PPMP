import "./upload-ppmp.css";
import { useRef, useEffect, useState } from "react";
import { IconFileTypeXls, IconCircleFilled, IconCircleCheckFilled, IconArrowNarrowRightDashed, IconCloudUpload, IconX, IconArrowNarrowLeftDashed } from '@tabler/icons-react';
import InfoNote from "../../notes/info_note/InfoNote";
import { toast } from "../../toast/ToastService";
import { showCircleLoadingDialog } from "../circle_loading_dialog/CircleLoadingDialogService";
import { confirm} from "../../dialogs/global_dialog/DialogService";

interface UploadPPMPProps {
    fiscalYears: number[];
    isOpen: boolean;
    onClose: () => void;
}

export default function UploadPPMP({ fiscalYears, isOpen, onClose }: UploadPPMPProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileUploaded, setFileUploaded] = useState<File | null>(null);
    const [totalABC, setTotalABC] = useState<number | null>(null);
    const [previewData, setPreviewData] = useState<Array<Record<string, string | number>>>([]);

    const rowStartOptions = Array.from({ length: 100 }, (_, i) => i + 1);
    const letterOptions = Array.from({ length: 26 }, (_, i) => 
        String.fromCharCode(65 + i)
    );
    const [selectedRowStart, setSelectedRowStart] = useState<number | null>(null);
    const [selectedItemName, setSelectedItemName] = useState<number | null>(null);
    const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
    const [selectedTotalQuantity, setSelectedTotalQuantity] = useState<number | null>(null);
    const [selectedPricePerUnit, setSelectedPricePerUnit] = useState<number | null>(null);

    const [uploadFileStep, setUploadFileStep] = useState("current");
    const [mapColumnsStep, setMapColumnsStep] = useState("upcoming");
    const [previewImportStep, setPreviewImportStep] = useState("upcoming");

    const year = new Date().getFullYear();

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen) {
            if (!dialog.hasAttribute('open')) {
                if (year === fiscalYears.find(fy => fy === year)) {
                    toast.warning("Current fiscal year is already present in the system. Uploading a new PPMP will overwrite the existing data for this year.");
                    confirm("Overwrite Existing Data", "Note: Current fiscal year is already present in the system. Uploading a new PPMP will overwrite the existing data for this year.", "warning", "Yes, Overwrite")
                    .then((confirmed) => {
                        if (confirmed) {
                            dialog.showModal();
                        } else {
                            onClose();
                        }
                    });
                } else {
                    dialog.showModal();
                }
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

    function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
            console.log("Uploaded file:", file);
            setFileUploaded(file);
        }
    }
    function handleFileDrop(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];
        if (file) {
            console.log("Dropped file:", file);
            setFileUploaded(file);
        }
    }

    function handleBack() {
        if (previewImportStep === "current") {
            setPreviewImportStep("upcoming");
            setMapColumnsStep("current");
        }
        else if (mapColumnsStep === "current") {
            setMapColumnsStep("upcoming");
            setUploadFileStep("current");
        }
    }

    function handleTotalABCChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = parseFloat(e.target.value);
        const errorMessageElement = document.getElementById("totalABCErrors");
        setTotalABC(null);

        if (isNaN(value) || value <= 0) {
            errorMessageElement!.textContent = "Total ABC must be a positive number.";
        } else {
            errorMessageElement!.textContent = "";
            setTotalABC(value);
        }
    }

    async function PPMPPreview() {
        if (!fileUploaded || selectedRowStart === null || selectedItemName === null || selectedUnit === null || selectedTotalQuantity === null || selectedPricePerUnit === null) {
            return;
        }

        const formData = new FormData();
        formData.append("file", fileUploaded);
        formData.append("totalABC", String(totalABC));
        formData.append("startRow", String(selectedRowStart));
        formData.append("itemName", String(selectedItemName));
        formData.append("unit", String(selectedUnit));
        formData.append("quantity", String(selectedTotalQuantity));
        formData.append("unitPrice", String(selectedPricePerUnit));
        formData.append("year", String(year));

        const closeLoading = showCircleLoadingDialog();
        try {
            const response = await fetch("https://test-ppmp.onrender.com/api/ppmp/", {
                method: "POST",
                body: formData
            });
            if (!response.ok) {
                throw new Error("Failed to fetch preview data.");
                toast.error("Failed to fetch preview data. Please try again later.");
            }else{
                const responseData = await response.json();
                const rows = Array.isArray(responseData) ? responseData : responseData.data ?? [];
                setPreviewData(rows);
                console.log(responseData);
                console.log("Preview data set:", rows);
            }
        } catch (error) {
            setMapColumnsStep("current");
            setPreviewImportStep("upcoming");
            toast.error("Error fetching preview data. Please try again later.");
            console.error("Error fetching preview data:", error);
        } finally {
            closeLoading();
        }
    }

    async function handleImport() {
        if (!fileUploaded || selectedRowStart === null || selectedItemName === null || selectedUnit === null || selectedTotalQuantity === null || selectedPricePerUnit === null) {
            return;
        }
        const formData = new FormData();
        formData.append("file", fileUploaded);
        formData.append("totalABC", String(totalABC));
        formData.append("startRow", String(selectedRowStart));
        formData.append("itemName", String(selectedItemName));
        formData.append("unit", String(selectedUnit));
        formData.append("quantity", String(selectedTotalQuantity));
        formData.append("unitPrice", String(selectedPricePerUnit));
        formData.append("year", String(year));
        const closeLoading = showCircleLoadingDialog();
        try {
            toast.info("Importing data. This may take a few moments...");
            const response = await fetch("https://test-ppmp.onrender.com/api/import/", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                toast.error("Failed to import data. Please try again later.");
                throw new Error("Failed to import data.");
            }else{
                const responseData = await response.json();
                toast.success("Data imported successfully.");
                setUploadFileStep("current");
                setMapColumnsStep("upcoming");
                setPreviewImportStep("upcoming");
                setFileUploaded(null);
                setTotalABC(null);
                setSelectedRowStart(null);
                setSelectedItemName(null);
                setSelectedUnit(null);
                setSelectedTotalQuantity(null);
                setSelectedPricePerUnit(null);
                console.log(responseData);
            }
        } catch (error) {
            console.error("Error importing data:", error);
            toast.error("Error importing data. Please try again later.");
        } finally {
            closeLoading();
        }
    }

    return (
        <dialog ref={dialogRef} onCancel={handleCancel} className="upload-ppmp">
            <div className="header">
                <div className="title">
                    <div className="icon green">
                        <IconFileTypeXls size={24} />
                    </div>
                    <h3>Spreadsheet Ingestion</h3>
                </div>
                <div className="fiscal-yr-date">
                    <p>FY {year} Masterlist</p>
                </div>
            </div>
            <div className="upload-steps">
                <div className="icon green">
                    {uploadFileStep === "done" ? (
                        <IconCircleCheckFilled size={18} />
                    ) : (
                        <IconCircleFilled size={18} />
                    )}
                    <p>Upload File</p>
                </div>
                <IconArrowNarrowRightDashed size={18} color="gray"/>
                <div className={mapColumnsStep === "upcoming" ? "icon gray" : "icon green"}>
                    {mapColumnsStep === "done" ? (
                        <IconCircleCheckFilled size={18} />
                    ) : (
                        <IconCircleFilled size={18} />
                    )}
                    <p>Map Columns</p>
                </div>
                <IconArrowNarrowRightDashed size={18} color="gray"/>
                <div className={previewImportStep === "upcoming" ? "icon gray" : "icon green"}>
                    {previewImportStep === "done" ? (
                        <IconCircleCheckFilled size={18} />
                    ) : (
                        <IconCircleFilled size={18} />
                    )}
                    <p>Preview & Import</p>
                </div>
            </div>
            {uploadFileStep === "current" && (
                <div className="file-upload-container" onClick={() => fileInputRef.current?.click()} onDrop={handleFileDrop} onDragOver={(e) => e.preventDefault()}>
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                    />
                    {fileUploaded ? (
                        <>
                            <div className="icon green">
                                <IconCloudUpload size={24} />
                            </div>
                            <p>You uploaded:</p>
                            <h3>{fileUploaded.name}</h3>
                        </>
                    ) : (
                    <>
                        <div className="icon green">
                            <IconCloudUpload size={24} />
                        </div>
                        <h4>Drop your spreadsheet here</h4>
                        <p>Supported formats: .xlsx, .xls</p>
                        <div className="status active">
                            <p>All imported rows will be tagged to FY {year}</p>
                        </div>
                    </>
                    )}
                </div>
            )}
            {mapColumnsStep === "current" && (
                <div className="map-columns-container">
                    <InfoNote message="Please map the row and columns from your spreadsheet to the corresponding fields in the system."/>
                    <br />
                    <p>File: <strong>{fileUploaded?.name}</strong></p>
                    <div className="selection-container">
                        <div className="totalABC">
                            <div className="title">
                                <h5>Total ABC</h5>
                                <p>Total Approved Budget for Contract value</p>
                            </div>
                            <div className="field-group">
                                <input type="number" value={totalABC ?? ""} onChange={handleTotalABCChange} min={1} step={0.01} placeholder="Enter the Total ABC"/>
                                <p className="error-message" id="totalABCErrors"></p>
                            </div>
                        </div>
                        <div className="group row">
                            <div className="title">
                                <h5>Row Start</h5>
                                <p>Where was the first row of data located in the spreadsheet?</p>
                            </div>
                            <select value={selectedRowStart ?? ""} onChange={(e) => setSelectedRowStart(e.target.value ? Number(e.target.value) : null)}>
                                <option value="">Select a row</option>
                                {rowStartOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="header">
                            <h4>System Fields</h4>
                            <h4>Spreadsheet Columns</h4>
                        </div>
                        <div className="group">
                            <div className="title">
                                <h5>Item Name</h5>
                                <p>General Description</p>
                            </div>
                            <select value={selectedItemName ?? ""} onChange={(e) => setSelectedItemName(e.target.value === "" ? null : Number(e.target.value))}>
                                <option value="">Select a column</option>
                                {letterOptions.map((option, index) => (
                                    <option key={option} value={index}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="group">
                            <div className="title">
                                <h5>Unit</h5>
                                <p>Unit of Measurement</p>
                            </div>
                            <select value={selectedUnit ?? ""} onChange={(e) => setSelectedUnit(e.target.value === "" ? null : Number(e.target.value))}>
                                <option value="">Select a column</option>
                                {letterOptions.map((option, index) => (
                                    <option key={option} value={index}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="group">
                            <div className="title">
                                <h5>Total Quantity</h5>
                                <p>Total Planned Quantity</p>
                            </div>
                            <select value={selectedTotalQuantity ?? ""} onChange={(e) => setSelectedTotalQuantity(e.target.value === "" ? null : Number(e.target.value))}>
                                <option value="">Select a column</option>
                                {letterOptions.map((option, index) => (
                                    <option key={option} value={index}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="group">
                            <div className="title">
                                <h5>Price/Unit</h5>
                                <p>Price Catalogue per Unit</p>
                            </div>
                            <select value={selectedPricePerUnit ?? ""} onChange={(e) => setSelectedPricePerUnit(e.target.value === "" ? null : Number(e.target.value))}>
                                <option value="">Select a column</option>
                                {letterOptions.map((option, index) => (
                                    <option key={option} value={index}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}
            {previewImportStep === "current" && (
                <div className="preview-import-container">
                    <InfoNote message="Please review the first 5 rows of data before importing it into the system."/>
                    <br />
                    <p>File: <strong>{fileUploaded?.name}</strong></p>
                    <div className="preview-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Item Name</th>
                                    <th>Unit</th>
                                    <th>Total Quantity</th>
                                    <th>Price/Unit (PHP)</th>
                                    <th>Total Amount (PHP)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {previewData && previewData.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.Description ?? row.Description ?? ""}</td>
                                        <td>{row.Unit ?? row.Unit}</td>
                                        <td>{row.Quantity ?? row.Quantity ?? ""}</td>
                                        <td>{row.CatalogPrice ?? row.CatalogPrice ?? ""}</td>
                                        <td>{row.TotalAmount ?? row.TotalAmount ?? ""}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            <div className="action-btns">
                <div className="cancel-btn-container">
                    <button className="btn-secondary" onClick={handleClose}>
                        <IconX size={20} />
                        Cancel
                    </button>
                </div>
                {uploadFileStep !== "current" && (
                    <button className="btn-solid gray" onClick={handleBack}>
                        <IconArrowNarrowLeftDashed size={18} color="white" />
                        Back
                    </button>
                )}
                {uploadFileStep === "current" && fileUploaded && (
                    <button className="btn-solid green" onClick={() => {
                        setUploadFileStep("done");
                        setMapColumnsStep("current");
                    }}>
                        Map Columns
                        <IconArrowNarrowRightDashed size={18} color="white"/>
                    </button>
                )}
                {mapColumnsStep === "current" && selectedItemName !== null && selectedUnit !== null && selectedTotalQuantity !== null && selectedPricePerUnit !== null && selectedRowStart !== null && totalABC !== null && totalABC > 0 && (
                    <button className="btn-solid green" onClick={async () => {
                        setMapColumnsStep("done");
                        setPreviewImportStep("current");
                        await PPMPPreview();
                    }}>
                        Preview Data
                        <IconArrowNarrowRightDashed size={18} color="white"/>
                    </button>
                )}
                {previewImportStep === "current" && previewData && (
                    <button className="btn-solid green" onClick={async () => {
                        setPreviewImportStep("done");
                        onClose();
                        await handleImport();
                    }}>
                        Import
                        <IconArrowNarrowRightDashed size={18} color="white"/>
                    </button>
                )}
            </div>
        </dialog>
    );
}
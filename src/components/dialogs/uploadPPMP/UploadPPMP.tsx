import "./upload-ppmp.css";
import { useRef, useEffect, useState } from "react";
import { IconFileTypeXls, IconCircleFilled, IconCircleCheckFilled, IconArrowNarrowRightDashed, IconCloudUpload, IconX, IconArrowNarrowLeftDashed } from '@tabler/icons-react';
import InfoNote from "../../notes/info_note/InfoNote";

interface UploadPPMPProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function UploadPPMP({ isOpen, onClose }: UploadPPMPProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileUploaded, setFileUploaded] = useState<File | null>(null);

    const rowStartOptions = Array.from({ length: 100 }, (_, i) => i + 1);
    const [selectedRowStart, setSelectedRowStart] = useState<number | null>(null);
    const [selectedColumnMappings, setSelectedColumnMappings] = useState<{ [key: string]: string | null }>({
        itemName: null,
        unit: null,
        totalQuantity: null,
        pricePerUnit: null,
    });

    const [uploadFileStep, setUploadFileStep] = useState("current");
    const [mapColumnsStep, setMapColumnsStep] = useState("upcoming");
    const [previewImportStep, setPreviewImportStep] = useState("upcoming");

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

    const year = new Date().getFullYear();

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

    return (
        <dialog ref={dialogRef} onCancel={handleCancel} className="upload-ppmp dialog">
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
                        <div className="group row">
                            <div className="title">
                                <h5>Row Start</h5>
                                <p>Where was the first row of data located in the spreadsheet?</p>
                            </div>
                            <select value={selectedRowStart ?? ""} onChange={(e) => setSelectedRowStart(Number(e.target.value))}>
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
                            <select>
                                <option value="option1">Option 1</option>
                                <option value="option2">Option 2</option>
                            </select>
                        </div>
                        <div className="group">
                            <div className="title">
                                <h5>Unit</h5>
                                <p>Unit of Measurement</p>
                            </div>
                            <select>
                                <option value="option1">Option 1</option>
                                <option value="option2">Option 2</option>
                            </select>
                        </div>
                        <div className="group">
                            <div className="title">
                                <h5>Total Quantity</h5>
                                <p>Total Planned Quantity</p>
                            </div>
                            <select>
                                <option value="option1">Option 1</option>
                                <option value="option2">Option 2</option>
                            </select>
                        </div>
                        <div className="group">
                            <div className="title">
                                <h5>Price/Unit</h5>
                                <p>Price Catalogue per Unit</p>
                            </div>
                            <select>
                                <option value="option1">Option 1</option>
                                <option value="option2">Option 2</option>
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
                                    <th>Price/Unit</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Sample Item 1</td>
                                    <td>pcs</td>
                                    <td>100</td>
                                    <td>50.00</td>
                                </tr>
                                <tr>
                                    <td>Sample Item 2</td>
                                    <td>box</td>
                                    <td>200</td>
                                    <td>30.00</td>
                                </tr>
                                <tr>
                                    <td>Sample Item 3</td>
                                    <td>kg</td>
                                    <td>150</td>
                                    <td>20.00</td>
                                </tr>
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
                {/*mapColumnsStep === "current" && selectedColumnMappings.itemName && selectedColumnMappings.unit && selectedColumnMappings.totalQuantity && selectedColumnMappings.pricePerUnit && selectedColumnMappings.rowStart && (
                    <button className="btn-solid green" onClick={() => {
                        setMapColumnsStep("done");
                        setPreviewImportStep("current");
                    }}>
                        Preview Data
                        <IconArrowNarrowRightDashed size={18} color="white"/>
                    </button>
                )*/}
                {mapColumnsStep === "current" && (
                    <button className="btn-solid green" onClick={() => {
                        setMapColumnsStep("done");
                        setPreviewImportStep("current");
                    }}>
                        Preview Data
                        <IconArrowNarrowRightDashed size={18} color="white"/>
                    </button>
                )}
                {previewImportStep === "current" && (
                    <button className="btn-solid green" onClick={() => {
                        setPreviewImportStep("done");
                        onClose();
                    }}>
                        Import
                        <IconArrowNarrowRightDashed size={18} color="white"/>
                    </button>
                )}
            </div>
        </dialog>
    );
}
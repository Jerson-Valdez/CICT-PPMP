import { useEffect, useRef, useState } from "react";
import "./export-prompt-dialog.css";
import { IconTableExport, IconX } from "@tabler/icons-react";

interface ExportPromptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  exportFunction: (options: string[]) => void;
}

export default function ExportPromptDialog({
  isOpen,
  onClose,
  exportFunction,
}: ExportPromptDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.hasAttribute("open")) {
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

  const [allSelected, setAllSelected] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const exportAll = [{ label: "Export All Data", value: "all" }];

  const exportOptions = [
    { label: "Revised PPMP", value: "revised_ppmp" },
    { label: "Supplemental PPMP", value: "supplemental_ppmp" },
    { label: "In Lieus", value: "in_lieus" },
    { label: "Purchase Requests", value: "purchase_requests" },
    { label: "Dashboard Report", value: "dashboard_report" },
  ];

  function handleSelectAllChange() {
    if (allSelected) {
      setSelectedOptions([]);
    } else {
      setSelectedOptions(exportOptions.map((option) => option.value));
    }
    setAllSelected(!allSelected);
  }

  function handleOptionChange(optionValue: string) {
    if (selectedOptions.includes(optionValue)) {
      setSelectedOptions(
        selectedOptions.filter((value) => value !== optionValue),
      );
    } else {
      setSelectedOptions([...selectedOptions, optionValue]);
    }
  }

  function handleExport() {
    exportFunction(selectedOptions);
    onClose();
  }

  let counter = selectedOptions.length;

  return (
    <dialog
      className="export-prompt-dialog"
      ref={dialogRef}
      onCancel={handleCancel}
    >
      <div className="header">
        <div className="title-wrapper">
          <div className="icon royal-red">
            <IconTableExport size={20} />
          </div>
          <h3>Export Data</h3>
        </div>
        <button className="close-btn" onClick={onClose} aria-label="Close">
          <IconX size={20} />
        </button>
      </div>

      <div className="filter-content">
        <h4>Select Options to include in export</h4>
        {exportAll.map((option) => (
          <div className="checkbox-wrapper all" key={option.value}>
            <input
              type="checkbox"
              key={option.value}
              onChange={handleSelectAllChange}
            />
            <label className="checkbox-label">{option.label}</label>
          </div>
        ))}
        <p className="checkbox-counter">
          {counter} out of {exportOptions.length} selected
        </p>
        {exportOptions.map((option) => (
          <div className="checkbox-wrapper" key={option.value}>
            <input
              type="checkbox"
              key={option.value}
              onChange={() => handleOptionChange(option.value)}
              checked={selectedOptions.includes(option.value)}
            />
            <label className="checkbox-label">{option.label}</label>
          </div>
        ))}
      </div>

      <div className="action-btns">
        {counter > 0 ? (
          <button
            className="btn-primary-rd-shadow"
            onClick={handleExport}
          >
            <IconTableExport size={18} />
            Export Data
          </button>
        ) : (
          <button className="btn-primary-rd-shadow" disabled>
            <IconTableExport size={18} />
            Export Data
          </button>
        )}
      </div>
    </dialog>
  );
}

import { useEffect, useRef } from "react";
import { IconX, IconFilter, IconRefresh } from '@tabler/icons-react';
import './dynamic-filter.css'; 

export interface FilterOption {
    label: string;
    value: string;
}

export interface FilterGroup {
    id: string;
    title: string;
    options: FilterOption[];
    selectedValue: string;
    onChange: (value: string) => void;
}

interface DynamicFilterDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onClearAll: () => void;
    filterGroups: FilterGroup[];
}

export default function DynamicFilterDialog({ isOpen, onClose, onClearAll, filterGroups }: DynamicFilterDialogProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

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

    const handleChipClick = (group: FilterGroup, optionValue: string) => {
        const newValue = group.selectedValue === optionValue ? "" : optionValue;
        group.onChange(newValue);
    };

    return (
        <dialog className="dynamic-filter-dialog" ref={dialogRef} onCancel={handleCancel}>
            <div className="header">
                <div className="title-wrapper">
                    <div className="icon royal-red">
                        <IconFilter size={24}/>
                    </div>
                    <h3>Filter & Sort</h3>
                </div>
                <button className="close-btn" onClick={onClose} aria-label="Close">
                    <IconX size={20} />
                </button>
            </div>
            
            <div className="content">
                {filterGroups.map((group) => (
                    <div className="filter-row" key={group.id}>
                        <h4>{group.title}</h4>
                        <div className="chip-container">
                            {group.options.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    className={`filter-chip ${group.selectedValue === option.value ? 'active' : ''}`}
                                    onClick={() => handleChipClick(group, option.value)}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="action-btns">
                <button className="btn-secondary" onClick={onClearAll}>
                    <IconRefresh size={18} /> Clear Filters
                </button>
                <button className="btn-primary-rd-shadow" onClick={handleClose}>
                    Apply Filters
                </button>
            </div>
        </dialog>
    );
}
import {
  IconCheck,
  IconSearch,
  IconTransfer,
  IconDeviceTabletPlus,
  IconX,
  IconPrinter,
} from "@tabler/icons-react";
import NewItemCard from "../../components/cards/new_item_card/NewItemCard";
import WarningNote from "../../components/notes/warning_note/WarningNote";
import "./supplemental-ppmp.css";
import { useEffect, useState } from "react";
import {
  notify,
  confirm,
} from "../../components/dialogs/global_dialog/DialogService";
import { useOutletContext } from "react-router";
import { toast } from "../../components/toast/ToastService";
import { getAccessToken } from "../../../supadb";
import LoadingWrapper from "../../components/wrappers/loading wrapper/LoadingWrapper";
import TableSkeleton from "../../components/skeleton/TableSkeleton";
import SupplementalTable from "../../components/tables/supplemental_table/SupplementalTable";
import { showCircleLoadingDialog } from "../../components/dialogs/circle_loading_dialog/CircleLoadingDialogService";

interface NewItem {
  itemId: number;
  itemName: string;
  measurementUnit: string;
  quantity: number;
  priceCatalog: number;
  itemCategory: string;
  ppmpCategory: string;
  added: boolean;
}

interface NewItemHistory {
  itemId: number;
  itemName: string;
  measurementUnit: string;
  quantity: number;
  priceCatalog: number;
  itemCategory: string;
  ppmpCategory: string;
}

interface ppmpSupplementalData {
  itemId: number;
  itemName: string;
  unitMeasurement: string;
  plannedQuantity: number;
  availableQuantity: number;
  pendingQuantity: number;
  fulfilledQuantity: number;
  priceCatalog: number;
}

interface SupplementalPpmpHistory {
  supplementalId: number;
  createdAt: string;
  createdBy: string;
  supplementalABC: number;
  newItems: NewItemHistory[];
}

export default function SupplementalPpmp() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const { selectedFiscalYear } = useOutletContext<{
    selectedFiscalYear: string;
  }>();
  const [fiscalYearHolder, setFiscalYearHolder] = useState<string | null>(null);

  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);

  const [ppmpSupplementalData, setPpmpSupplementalData] = useState<
    ppmpSupplementalData[]
  >([]);

  const [ppmpSupplementalHistory, setPpmpSupplementalHistory] = useState<
    SupplementalPpmpHistory[]
  >([
    {
      supplementalId: 0,
      createdAt: "2026-01-01",
      createdBy: "Jerson patrick Valdez",
      supplementalABC: 200.0,
      newItems: [
        {
          itemId: 1,
          itemName: "Item 1",
          measurementUnit: "pcs",
          quantity: 10,
          priceCatalog: 20.0,
          itemCategory: "Category A",
          ppmpCategory: "PPMP Category 1",
        },
        {
          itemId: 2,
          itemName: "Item 2",
          measurementUnit: "pcs",
          quantity: 5,
          priceCatalog: 30.0,
          itemCategory: "Category B",
          ppmpCategory: "PPMP Category 2",
        },
      ],
    },
    {
      supplementalId: 1,
      createdAt: "2026-02-15",
      createdBy: "Jane Doe",
      supplementalABC: 150.0,
      newItems: [
        {
          itemId: 3,
          itemName: "Item 3",
          measurementUnit: "pcs",
          quantity: 8,
          priceCatalog: 25.0,
          itemCategory: "Category C",
          ppmpCategory: "PPMP Category 3",
        },
      ],
    },
    {
      supplementalId: 2,
      createdAt: "2026-03-10",
      createdBy: "John Smith",
      supplementalABC: 3000.0,
      newItems: [
        {
          itemId: 4,
          itemName: "Item 4",
          measurementUnit: "pcs",
          quantity: 12,
          priceCatalog: 15.0,
          itemCategory: "Category D",
          ppmpCategory: "PPMP Category 4",
        },
        {
          itemId: 5,
          itemName: "Item 5",
          measurementUnit: "pcs",
          quantity: 6,
          priceCatalog: 40.0,
          itemCategory: "COMMON OFFICE SUPPLIES",
          ppmpCategory: "PPMP Category 5",
        },
      ],
    },
  ]);

  const [itemCategories, setItemCategories] = useState<string[]>([]);
  const [ppmpCategories, setPpmpCategories] = useState<string[]>([]);

  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    const LoadSupplementalData = async () => {
      handlePpmpSupplementalFiscalYearChange(selectedFiscalYear);
      try {
        const formData = new FormData();
        formData.append("year", String(selectedFiscalYear));

        const [supplementalResponse] = await Promise.all([
          fetch("https://test-ppmp.onrender.com/api/in_lieu_data/", {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `Bearer ${(await getAccessToken()) || ""}`,
            },
          }),
        ]);

        if (!supplementalResponse.ok) {
          toast.error(
            "Failed to fetch PPMP supplemental data. Please try again later.",
          );
        } else {
          const supplementalResult = await supplementalResponse.json();
          setItemCategories(supplementalResult.itemCategories || []);
          setPpmpCategories(supplementalResult.ppmpCategories || []);
          setPpmpSupplementalData(
            supplementalResult.ppmpReallocationData || [],
          );
          //   setPpmpSupplementalHistory(
          //     supplementalResult.ppmpSupplementalHistory || [],
          //   );
          setFiscalYearHolder(selectedFiscalYear);
        }
      } catch (error) {
        console.error("Error fetching PPMP supplemental data:", error);
        toast.error("Network error. Please try again later.");
      } finally {
        setIsInitialLoading(false);
      }
    };
    LoadSupplementalData();
  }, [selectedFiscalYear]);

  const [additionalBudget, setAdditionalBudget] = useState<number>(0);

  const [newItemsSearchTerm, setNewItemsSearchTerm] = useState<string>("");

  const [newItemsArray, setNewItemsArray] = useState<NewItem[]>([]);

  const filteredCatalogItems =
    newItemsSearchTerm.trim() === ""
      ? []
      : ppmpSupplementalData?.filter((item) =>
          item.itemName
            .toLowerCase()
            .includes(newItemsSearchTerm.toLowerCase()),
        );

  const handleSelectNewItem = (catalogItem: any) => {
    if (newItemsArray.length == 1 && newItemsArray[0].itemName.trim().length == 0) {
      newItemsArray[0].itemId = catalogItem.itemId;
      newItemsArray[0].itemName = catalogItem.itemName;
      newItemsArray[0].measurementUnit = catalogItem.unitMeasurement;
      newItemsArray[0].quantity = 1;
      newItemsArray[0].priceCatalog = catalogItem.priceCatalog;
      newItemsArray[0].itemCategory = catalogItem.itemCategory
        ? catalogItem.itemCategory
        : "";
      newItemsArray[0].ppmpCategory = catalogItem.ppmpCategory
        ? catalogItem.ppmpCategory
        : "";
      newItemsArray[0].added = false;
    } else if (
      newItemsArray.some((item) => item.itemId === catalogItem.itemId)
    ) {
      notify(
        "Duplicate Item",
        "This item is already in the New Needs Cart. Please select a different item.",
        "error",
        "I understand",
      );
    } else {
      setNewItemsArray((prev) => [
        ...prev,
        {
          itemId: catalogItem.itemId,
          itemName: catalogItem.itemName,
          measurementUnit: catalogItem.unitMeasurement,
          quantity: 1,
          priceCatalog: catalogItem.priceCatalog,
          itemCategory: catalogItem.itemCategory,
          ppmpCategory: catalogItem.ppmpCategory,
          added: false,
        },
      ]);
    }

    setNewItemsSearchTerm("");
  };

  const newItemsValue = newItemsArray.reduce(
    (sum, item) => sum + item.quantity * item.priceCatalog,
    0,
  );
  const remainingBudget = additionalBudget - newItemsValue;

  const isNewItemsValid = newItemsArray.every(
    (item) =>
      item.itemName.trim() !== "" &&
      item.measurementUnit.trim() !== "" &&
      item.quantity > 0 &&
      item.priceCatalog > 0 &&
      item.itemCategory.trim() !== "" &&
      item.ppmpCategory.trim() !== "",
  );

  const handleAddItem = () =>
    setNewItemsArray([
      ...newItemsArray,
      {
        itemId: Date.now(),
        itemName: "",
        measurementUnit: "",
        quantity: 1,
        priceCatalog: 0,
        itemCategory: "",
        ppmpCategory: "",
        added: true,
      },
    ]);
  const handleDeleteItem = (itemId: number) =>
    setNewItemsArray(newItemsArray.filter((item) => item.itemId !== itemId));
  const handleUpdateItem = (
    itemId: number,
    field: keyof NewItem,
    value: string | number,
  ) => {
    setNewItemsArray((prev) =>
      prev.map((item) =>
        item.itemId === itemId ? { ...item, [field]: value } : item,
      ),
    );
  };

  function onAdditionalBudgetChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const newBudget = parseFloat(event.target.value);
    if (!isNaN(newBudget)) {
      setAdditionalBudget(newBudget);
    } else {
      setAdditionalBudget(0);
    }
  }

  function onDescriptionChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    let description = event.target.value;
    setDescription("");
    if (event.target.value.trim() === "") {
      document.getElementById("descriptionError")!.textContent =
        "Description is required.";
    } else {
      document.getElementById("descriptionError")!.textContent = "";
      setDescription(description);
    }
  }

  function handlePpmpSupplementalFiscalYearChange(newFiscalYear: string) {
    if (newFiscalYear !== fiscalYearHolder) {
      setIsInitialLoading(true);
      setFiscalYearHolder(newFiscalYear);
    }
  }

  const handleSaveToDatabase = () => {
    const newItems = newItemsArray;
    const year = selectedFiscalYear;
    const budget = additionalBudget;

    confirm(
      "Supplemental PPMP Submission",
      "Are you sure you want to proceed this supplemental PPMP? \n Note: Once proceeded, it will take effect to the original PPMP Masterlist.",
      "info",
      "Yes Proceed",
    ).then(async (confirmed) => {
      if (confirmed) {
        const formData = new FormData();
        formData.append("newItems", JSON.stringify(newItems));
        formData.append("year", year);
        formData.append("additionalBudget", budget.toString());

        const loading = showCircleLoadingDialog();

        try {
          const response = await fetch(
            "https://test-ppmp.onrender.com/api/supplemental_ppmp/",
            {
              method: "POST",
              body: formData,
              headers: {
                Authorization: `Bearer ${(await getAccessToken()) || ""}`,
              },
            },
          );
          if (!response.ok) {
            toast.error(
              "Failed to create supplemental PPMP. Please try again later.",
            );
            throw new Error("Failed to create supplemental PPMP.");
          } else {
            toast.success("Supplemental PPMP created successfully!");
            setAdditionalBudget(0);
            setDescription("");
            setNewItemsSearchTerm("");
            setNewItemsArray([]);
          }
        } catch (error) {
          toast.error("Error occurred while creating supplemental PPMP.");
        } finally {
          loading();
        }
      }
    });
  };
  return (
    <main className="page-container supplemental">
      <div className="supplemental-content-container">
        <div className="title-container">
          <h2>Budget injections</h2>
          <p>
            Additional budget and or items for the current selected fiscal year.
          </p>
        </div>
        <div
          className={`price-balancing-container ${remainingBudget >= 0 ? "balanced" : "unbalanced"}`}
        >
          <div className="required-budget-container">
            <h3>Additional Budget</h3>
            <p>
              PHP{" "}
              {additionalBudget.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <IconTransfer size={24} className="transfer-icon" color="gray" />
          <div className="available-budget-container">
            <h3>New Items Value</h3>
            <p>
              PHP{" "}
              {newItemsValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="remaining-budget-container">
            <h3>Remaining</h3>
            <p>
              PHP{" "}
              {remainingBudget.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          {remainingBudget >= 0 ? (
            <IconCheck size={24} className="check-icon" color="green" />
          ) : (
            <IconX size={24} className="x-icon" color="red" />
          )}
        </div>
        <WarningNote message="Please ensure that all fields must be filled out before proceeding." />
        <div className="budget-injection-form-container">
          <div className="field-group">
            <label htmlFor="budget-injection">Budget Injection (PHP)</label>
            <input
              type="number"
              id="budget-injection"
              placeholder="Enter the amount of additional budget"
              onChange={onAdditionalBudgetChange}
            />
          </div>
          <div className="field-group">
            <label htmlFor="description">Description/Justification</label>
            <textarea
              id="description"
              placeholder="Enter a description of the budget injection"
              value={description}
              onChange={onDescriptionChange}
            ></textarea>
            <p className="error-message" id="descriptionError"></p>
          </div>
        </div>
        <div className="new-items-container supplemental">
          <div className="search-button-container">
            <div className="search-container relative">
              <IconSearch size={24} />
              <input
                type="text"
                placeholder="Search Catalog to add quantity of existing item..."
                className="search-input w-full"
                value={newItemsSearchTerm}
                onChange={(e) => setNewItemsSearchTerm(e.target.value)}
              />

              {filteredCatalogItems.length > 0 && (
                <div className="option-container">
                  <ul>
                    {filteredCatalogItems.map((item) => (
                      <li
                        key={item.itemId}
                        onClick={() => handleSelectNewItem(item)}
                      >
                        <span className="item-name">{item.itemName}</span>
                        <span className="item-details">
                          PHP {item.priceCatalog.toLocaleString()} /{" "}
                          {item.unitMeasurement}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <button
              className="btn-secondary cursor-pointer"
              onClick={handleAddItem}
            >
              + Add Item
            </button>
          </div>

          <div className="new-items-card-container">
            {newItemsArray.map((item) => (
              <NewItemCard
                key={item.itemId}
                itemId={item.itemId}
                itemName={item.itemName}
                unitMeasurement={item.measurementUnit}
                quantity={item.quantity}
                priceCatalog={item.priceCatalog}
                itemCategories={itemCategories}
                ppmpCategories={ppmpCategories}
                itemCategory={item.itemCategory ? item.itemCategory : ""}
                ppmpCategory={item.ppmpCategory ? item.ppmpCategory : ""}
                onDelete={handleDeleteItem}
                onUpdate={handleUpdateItem}
                ppmpReallocationData={ppmpSupplementalData}
              />
            ))}
          </div>
        </div>
        <div className="proceed-button-container">
          {additionalBudget > 0 &&
          remainingBudget >= 0 &&
          isNewItemsValid &&
          description ? (
            <>
              <button
                className="btn-secondary"
                onClick={() => setIsPrintPreviewOpen(true)}
              >
                <IconPrinter size={20} />
                Print Preview
              </button>
              <button
                className="btn-primary-rd-shadow"
                onClick={handleSaveToDatabase}
              >
                <IconDeviceTabletPlus size={20} />
                Proceed with supplemental PPPMP
              </button>
            </>
          ) : (
            <>
              <button className="btn-secondary" disabled>
                <IconPrinter size={20} />
                Print Preview
              </button>
              <button className="btn-primary-rd-shadow" disabled>
                <IconDeviceTabletPlus size={20} />
                Proceed with supplemental PPPMP
              </button>
            </>
          )}
        </div>
      </div>
      <LoadingWrapper isLoading={isInitialLoading} skeleton={<TableSkeleton />}>
        {ppmpSupplementalHistory.length > 0 && (
          <SupplementalTable
            data={ppmpSupplementalHistory}
            itemCategories={itemCategories}
            ppmpCategories={ppmpCategories}
          />
        )}
      </LoadingWrapper>
    </main>
  );
}

import "../table-design.css";
import { useState } from "react";
import { IconSearch, IconFilter, IconFileStack } from "@tabler/icons-react";
import ViewInLieu from "../../dialogs/view_in_lieu/ViewInLieu";
import DynamicFilterDialog, {
  type FilterGroup,
} from "../../dialogs/dynamic_filter_dialog/DynamicFilterDialog";

interface SupplementalTableProps {
  data: any[];
  itemCategories?: string[];
  ppmpCategories?: string[];
}

export default function SupplementalTable({
  data,
  itemCategories,
  ppmpCategories,
}: SupplementalTableProps) {
  const [openDialogIndex, setOpenDialogIndex] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState<boolean>(false);
  const [sortFilter, setSortFilter] = useState<string>("");
  const [itemCatFilter, setItemCatFilter] = useState<string>("");
  const [ppmpCatFilter, setPpmpCatFilter] = useState<string>("");

  const clearAllFilters = () => {
    setSortFilter("");
    setItemCatFilter("");
    setPpmpCatFilter("");
  };

  const filterConfig: FilterGroup[] = [
    {
      id: "sort",
      title: "Sort Order",
      selectedValue: sortFilter,
      onChange: setSortFilter,
      options: [
        { label: "Ascending (Date)", value: "asc" },
        { label: "Descending (Date)", value: "desc" },
      ],
    },
    {
      id: "itemCategory",
      title: "Item Category",
      selectedValue: itemCatFilter,
      onChange: setItemCatFilter,
      options: (itemCategories || []).map((cat) => ({
        label: cat,
        value: cat,
      })),
    },
    {
      id: "ppmpCategory",
      title: "PPMP Category of Items",
      selectedValue: ppmpCatFilter,
      onChange: setPpmpCatFilter,
      options: (ppmpCategories || []).map((cat) => ({
        label: cat,
        value: cat,
      })),
    },
  ];

  let processedData = data.filter((create) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      searchTerm === "" ||
      create.createdBy.toLowerCase().includes(searchLower);

    const matchesItemCat =
      itemCatFilter === "" ||
      create.newItems.some(
        (reducedItem: any) => reducedItem.itemCategory === itemCatFilter,
      );
    const matchesPpmpCat =
      ppmpCatFilter === "" ||
      create.newItems.some(
        (additionItem: any) => additionItem.ppmpCategory === ppmpCatFilter,
      );

    return matchesSearch && matchesItemCat && matchesPpmpCat;
  });

  if (sortFilter === "asc") {
    processedData.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  } else if (sortFilter === "desc") {
    processedData.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  const activeFilterCount = [sortFilter, itemCatFilter, ppmpCatFilter].filter(
    Boolean,
  ).length;

  return (
    <div className="table-container supplemental">
      <div className="table-title-container">
        <div className="table-title">
          <h2 className="table-title">Supplemental PPMP History</h2>
          <p>View all supplemental PPMP Histories</p>
        </div>
        <div className="search-container">
          <IconSearch size={24} />
          <input
            type="text"
            placeholder="Search By Creator Name..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-container">
          <IconFilter size={24} />
          <button
            className="filter-select"
            onClick={() => setIsFilterDialogOpen(true)}
          >
            Filters
            {activeFilterCount > 0 && (
              <span className="filter-badge">{activeFilterCount}</span>
            )}
          </button>
          {isFilterDialogOpen && (
            <DynamicFilterDialog
              isOpen={isFilterDialogOpen}
              onClose={() => setIsFilterDialogOpen(false)}
              onClearAll={clearAllFilters}
              filterGroups={filterConfig}
            />
          )}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="styled-table supplemental">
          <thead>
            <tr>
              <th>
                <h3>Created Date</h3>
                <p>Date of Creation</p>
              </th>
              <th>
                <h3>Staff Name</h3>
                <p>Who made the supplemental</p>
              </th>
              <th>
                <h3>Supplemental Items</h3>
                <p>Additional items added</p>
              </th>
              <th>
                <h3>Additional Budget</h3>
                <p>Supplemental budget</p>
              </th>
              <th colSpan={2}>
                <h3>Action</h3>
                <p>Available Actions</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {processedData.map((item, index) => (
              <tr key={index}>
                <td>{new Date(item.createdAt).toLocaleString("en-PH")}</td>
                <td>{item.createdBy}</td>
              <td>
                <div className="proposed-items">
                  {item.newItems.map((i: any, index: number) => (
                    <div key={index} className="proposed-item">
                      <span>
                        {i.quantity} {i.measurementUnit} •{" "}
                      </span>
                      <span>{i.name}</span>
                    </div>
                  ))}
                </div>
              </td>
              <td>
                <div className="budget-injected">
                  <span>
                    {item.supplementalABC.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </td>
              <td>
                <div className="button-container">
                  <button
                    className="btn-solid blue"
                    onClick={() => setOpenDialogIndex(index)}
                  >
                    <IconFileStack size={18} /> View
                  </button>
                </div>

                {/* <ViewInLieu
                  key={item.inLieuId || index}
                  inLieuId={item.inLieuId}
                  requestDate={item.requestDate}
                  originalItems={item.newItems}
                  proposedItems={item.inLieuAdditionItems}
                  status={item.status}
                  isOpen={openDialogIndex === index}
                  onClose={() => setOpenDialogIndex(null)}
                /> */}
              </td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

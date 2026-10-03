import { IconPlus, IconStackBack, IconTrash } from "@tabler/icons-react";

interface SignatoriesCMSSectionProps {
    handleAddAsignatory: (category: "pr" | "approved" | "revised") => void;
    localPrAsignatories: any[];
    localApprovedAsignatories: any[];
    localRevisedAsignatories: any[];
    handleAsignatoryChange: (
        category: "pr" | "approved" | "revised",
        index: number,
        field: "fullName" | "position",
        newValue: string,
    ) => void;
    handleDeleteAsignatory: (category: "pr" | "approved" | "revised",
    index: number,) => void;
    onAsignatoriesUpdate: (asignatoriesType: "pr" | "approved" | "revised",) => void;
    isPrDirty: boolean;
    isApprovedDirty: boolean;
    isRevisedDirty: boolean;
}

export default function SignatoriesCMSSection({handleAddAsignatory, localPrAsignatories, localApprovedAsignatories, localRevisedAsignatories, handleAsignatoryChange, handleDeleteAsignatory, onAsignatoriesUpdate, isPrDirty, isApprovedDirty, isRevisedDirty}: SignatoriesCMSSectionProps) {
  return (
    <section className="content-management-container">
      <div className="content-management-title">
        <div className="icon royal-red">
          <IconStackBack size={20} />
        </div>
        <div className="title">
          <h2>Content Management</h2>
          <p>Manage Signatories for the contents</p>
        </div>
      </div>
      <div className="pr-asignatory">
        <div className="title-addbtn">
          <h3>Purchase Request Signatories</h3>
          <button
            className="btn-secondary"
            onClick={handleAddAsignatory.bind(null, "pr")}
          >
            <IconPlus size={18} />
            Add PR Signatory
          </button>
        </div>
        {localPrAsignatories.map((signatory: any, index: number) => (
          <div key={signatory.signatoryId} className="input-row">
            <div className="field-group">
              <label htmlFor={`fullName-${signatory.signatoryId}-pr`}>
                Full Name
              </label>
              <input
                type="text"
                id={`fullName-${signatory.signatoryId}-pr`}
                value={signatory.fullName}
                onChange={(e) =>
                  handleAsignatoryChange(
                    "pr",
                    index,
                    "fullName",
                    e.target.value,
                  )
                }
              />
              <p
                className="error-message"
                id={`fullnameError-${signatory.signatoryId}-pr`}
              ></p>
            </div>
            <div className="field-group">
              <label htmlFor={`position-${signatory.signatoryId}-pr`}>
                Position Title
              </label>
              <input
                type="text"
                id={`position-${signatory.signatoryId}-pr`}
                value={signatory.position}
                onChange={(e) =>
                  handleAsignatoryChange(
                    "pr",
                    index,
                    "position",
                    e.target.value,
                  )
                }
              />
              <p
                className="error-message"
                id={`positionError-${signatory.signatoryId}-pr`}
              ></p>
            </div>
            <button
              className="btn-secondary red"
              onClick={() => handleDeleteAsignatory("pr", index)}
            >
              <IconTrash size={18} />
            </button>
          </div>
        ))}
        {isPrDirty && (
          <button
            className="btn-primary-rd-shadow"
            onClick={() => onAsignatoriesUpdate("pr")}
          >
            Update Purchase Request Signatories
          </button>
        )}
      </div>
      <div className="pr-asignatory">
        <div className="title-addbtn">
          <h3>Approved PPMP Signatories</h3>
          <button
            className="btn-secondary"
            onClick={handleAddAsignatory.bind(null, "approved")}
          >
            <IconPlus size={18} />
            Add Approved Signatory
          </button>
        </div>
        {localApprovedAsignatories.map((signatory: any, index: number) => (
          <div key={signatory.signatoryId} className="input-row">
            <div className="field-group">
              <label htmlFor={`fullName-${signatory.signatoryId}-approved`}>
                Full Name
              </label>
              <input
                type="text"
                id={`fullName-${signatory.signatoryId}-approved`}
                value={signatory.fullName}
                onChange={(e) =>
                  handleAsignatoryChange(
                    "approved",
                    index,
                    "fullName",
                    e.target.value,
                  )
                }
              />
              <p
                className="error-message"
                id={`fullnameError-${signatory.signatoryId}-approved`}
              ></p>
            </div>
            <div className="field-group">
              <label htmlFor={`position-${signatory.signatoryId}-approved`}>
                Position Title
              </label>
              <input
                type="text"
                id={`position-${signatory.signatoryId}-approved`}
                value={signatory.position}
                onChange={(e) =>
                  handleAsignatoryChange(
                    "approved",
                    index,
                    "position",
                    e.target.value,
                  )
                }
              />
              <p
                className="error-message"
                id={`positionError-${signatory.signatoryId}-approved`}
              ></p>
            </div>
            <button
              className="btn-secondary red"
              onClick={() => handleDeleteAsignatory("approved", index)}
            >
              <IconTrash size={18} />
            </button>
          </div>
        ))}
        {isApprovedDirty && (
          <button
            className="btn-primary-rd-shadow"
            onClick={() => onAsignatoriesUpdate("approved")}
          >
            Update Approved PPMP Signatories
          </button>
        )}
      </div>
      <div className="pr-asignatory">
        <div className="title-addbtn">
          <h3>Revised PPMP Signatories</h3>
          <button
            className="btn-secondary"
            onClick={handleAddAsignatory.bind(null, "revised")}
          >
            <IconPlus size={18} />
            Add Revised Signatory
          </button>
        </div>
        {localRevisedAsignatories.map((signatory: any, index: number) => (
          <div key={signatory.signatoryId} className="input-row">
            <div className="field-group">
              <label htmlFor={`fullName-${signatory.signatoryId}-revised`}>
                Full Name
              </label>
              <input
                type="text"
                id={`fullName-${signatory.signatoryId}-revised`}
                value={signatory.fullName}
                onChange={(e) =>
                  handleAsignatoryChange(
                    "revised",
                    index,
                    "fullName",
                    e.target.value,
                  )
                }
              />
              <p
                className="error-message"
                id={`fullnameError-${signatory.signatoryId}-revised`}
              ></p>
            </div>
            <div className="field-group">
              <label htmlFor={`position-${signatory.signatoryId}-revised`}>
                Position Title
              </label>
              <input
                type="text"
                id={`position-${signatory.signatoryId}-revised`}
                value={signatory.position}
                onChange={(e) =>
                  handleAsignatoryChange(
                    "revised",
                    index,
                    "position",
                    e.target.value,
                  )
                }
              />
              <p
                className="error-message"
                id={`positionError-${signatory.signatoryId}-revised`}
              ></p>
            </div>
            <button
              className="btn-secondary red"
              onClick={() => handleDeleteAsignatory("revised", index)}
            >
              <IconTrash size={18} />
            </button>
          </div>
        ))}
        {isRevisedDirty && (
          <button
            className="btn-primary-rd-shadow"
            onClick={() => onAsignatoriesUpdate("revised")}
          >
            Update Revised PPMP Signatories
          </button>
        )}
      </div>
    </section>
  );
}

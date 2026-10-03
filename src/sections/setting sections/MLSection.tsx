import { IconSettingsAi } from "@tabler/icons-react";
import InfoNote from "../../components/notes/info_note/InfoNote";
import WarningNote from "../../components/notes/warning_note/WarningNote";
import { useState } from "react";

interface MLSectionProps {
  retrainAIModel: (threshold: number) => void;
  timeLeft: number;
  aiFeaturesDataTraining: {
    icon: React.ReactNode;
    title: string;
    description: string;
    percentage?: number;
  }[];
  knapsackFeaturesData: {
    icon: React.ReactNode;
    title: string;
    description: string;
  }[];
}

export default function MLSection({
  retrainAIModel,
  timeLeft,
  aiFeaturesDataTraining,
  knapsackFeaturesData,
}: MLSectionProps) {
  const [threshold, setThreshold] = useState<number>(0);

  function handleThresholdChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    const numericValue = Number(value);
    let thresholdError = document.getElementById(
      "thresholdError",
    ) as HTMLParagraphElement;

    if (isNaN(numericValue) || numericValue < 1 || numericValue > 100) {
      thresholdError.textContent =
        "Please enter a valid number between 1 and 100.";
      setThreshold(0);
    } else {
      thresholdError.textContent = "";
      setThreshold(numericValue);
    }
  }

  return (
    <section className="retrain-importances-container">
      <div className="content-management-title">
        <div className="icon royal-red">
          <IconSettingsAi size={20} />
        </div>
        <div className="title">
          <h2>Artificial Intelligence</h2>
          <p>
            Manage the training curve of the AI model by retraining it with new
            data
          </p>
        </div>
      </div>
      <InfoNote message="The AI model is advisable to train every other procurement year." />
      <InfoNote message="The acceptable threshold was the AI tool to predict which item should be flagged as safe to replace. If the items utilization was greater than the declared threshold the item is considered highly utilize and the AI will probably mark this as protected item to avoid suggesting it to be in-lieu of other items. Otherwise, if the items utilization rate was below to the acceptable threshold, the item will be flagged as not-utilized items and AI will probably suggest this item to be in-lieu of other items." />
      <WarningNote message="The Acceptable threshold must be whole number. eg: 50, 30, 20..." />
      <div className="ml-retrain-container">
        {timeLeft > 0 ? (
          <div className="threshold-button-container">
            <div className="field-group">
              <label htmlFor="threshold">
                Enter Acceptable Threshold Utilization of Items
              </label>
              <input
                id="threshold"
                type="number"
                placeholder="Enter retraining acceptable threshold...eg: (50%)"
                disabled
              />
            </div>
            <button className="btn-alab" disabled>
              Retrain AI Model ({Math.ceil(timeLeft / 1000)}s)
            </button>
          </div>
        ) : (
          <div className="threshold-button-container">
            <div className="field-group">
              <label htmlFor="threshold">
                Enter Acceptable Threshold Utilization of Items
              </label>
              <input
                id="threshold"
                type="number"
                placeholder="Enter retraining acceptable threshold...eg: (50%)"
                value={threshold === 0 ? "" : threshold}
                onChange={(e) => handleThresholdChange(e)}
                min={1}
                max={100}
              />
              <p className="error-message" id="thresholdError"></p>
            </div>
            {threshold !== 0 ? (
              <button
                className="btn-alab"
                onClick={(e) => {
                  e.preventDefault();
                  retrainAIModel(threshold);
                  setThreshold(0);
                }}
              >
                Retrain AI Model
              </button>
            ) : (
              <button className="btn-alab" disabled>
                Retrain AI Model
              </button>
            )}
          </div>
        )}
      </div>
      <div className="ai-features-container btn-alab">
        <div className="ai-features-header">
          <div className="title-container">
            <h2>Bulk Budget Balancing (AI Decision Weights)</h2>
            <p>Your AI-powered budget optimization tool</p>
          </div>
        </div>
        <div className="content-container">
          <div className="title-content-container">
            <h4>Training Data Importances</h4>
            {aiFeaturesDataTraining.map((data, index) => (
              <div className="ai-features-content" key={index}>
                <div className="icon white">{data.icon}</div>
                <div className="description">
                  <h3>{data.title}</h3>
                  <p>{data.description}</p>
                </div>
                <span>
                  {data.percentage !== undefined
                    ? data.percentage.toFixed(2)
                    : "N/A"}
                  %
                </span>
              </div>
            ))}
          </div>
          <div className="title-content-container">
            <h4>Knapsack Problem Features</h4>
            {knapsackFeaturesData.map((data, index) => (
              <div className="ai-features-content" key={index}>
                <div className="icon white">{data.icon}</div>
                <div className="description">
                  <h3>{data.title}</h3>
                  <p>{data.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState, type JSX } from "react";
import "./settings.css";
import {
  IconTransform,
  IconClockDollar,
  IconCalendarCheck,
  IconCalendarCancel,
  IconCategory2,
} from "@tabler/icons-react";
import {
  confirm,
  notify,
} from "../../components/dialogs/global_dialog/DialogService";
import { showCircleLoadingDialog } from "../../components/dialogs/circle_loading_dialog/CircleLoadingDialogService";
import { toast } from "../../components/toast/ToastService";
import { useOutletContext } from "react-router";
import { getAccessToken, getRefreshToken, logoutUser } from "../../../supadb";
import { useNavigate } from "react-router";
import ProfileSection from "../../sections/setting sections/ProfileSection";
import SecuritySection from "../../sections/setting sections/SecuritySection";
import SignatoriesCMSSection from "../../sections/setting sections/SignatoriesCMSSection";
import MLSection from "../../sections/setting sections/MLSection";

interface aiFeaturesData {
  icon: JSX.Element;
  title: string;
  description: string;
  percentage?: number;
}

export default function Settings() {
  const navigate = useNavigate();
  const {
    userFullName,
    userEmailAddress,
    userRole,
    prAsignatories,
    revisedAsignatories,
    approvedAsignatories,
    setUserFullName,
    setPrAsignatories,
    setApprovedAsignatories,
    setRevisedAsignatories,
  } = useOutletContext<{
    userFullName: string;
    userEmailAddress: string;
    userRole: string;
    prAsignatories: any[];
    revisedAsignatories: any[];
    approvedAsignatories: any[];
    setUserFullName: (name: string) => void;
    setPrAsignatories: (asignatories: any[]) => void;
    setApprovedAsignatories: (asignatories: any[]) => void;
    setRevisedAsignatories: (asignatories: any[]) => void;
  }>();

  const [aiAvailableQuantityWeight, setAiAvailableQuantityWeight] =
    useState(0);
  const [aiItemCategoryWeight, setAiItemCategoryWeight] =
    useState(0);
  const [
    aiPlannedQuantityWeight,
    setAiPlannedQuantityWeight,
  ] = useState(0);
  const [aiPricePerUnitWeight, setAiPricePerUnitWeight] = useState(0);
  const [aiUtilizedQuantityWeight, setAiUtilizedQuantityWeight] = useState(0);

  const [localPrAsignatories, setLocalPrAsignatories] = useState(
    prAsignatories || [],
  );
  const [localApprovedAsignatories, setLocalApprovedAsignatories] = useState(
    approvedAsignatories || [],
  );
  const [localRevisedAsignatories, setLocalRevisedAsignatories] = useState(
    revisedAsignatories || [],
  );

  const email = userEmailAddress;
  const initialFullName = userFullName;
  const [fullName, setFullName] = useState(initialFullName);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] =
    useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmNewPasswordVisible, setIsConfirmNewPasswordVisible] =
    useState(false);
  const [isPasswordMatched, setIsPasswordMatched] = useState(false);

  const [eightCharacter, setEightCharacter] = useState<boolean>(false);
  const [upperLowerCase, setUpperLowerCase] = useState<boolean>(false);
  const [number, setNumber] = useState<boolean>(false);
  const [specialCharacter, setSpecialCharacter] = useState<boolean>(false);

  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const buttonCoolDown = localStorage.getItem("retrainButtonCoolDown");

    if (buttonCoolDown) {
      const remaining = Math.ceil(Number(buttonCoolDown) - Date.now());
      if (remaining > 0) {
        setTimeLeft(remaining);
      } else {
        localStorage.removeItem("retrainButtonCoolDown");
        setTimeLeft(0);
      }
    }
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1000) {
          clearInterval(interval);
          localStorage.removeItem("retrainButtonCoolDown");
          return 0;
        }
        return prevTime - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [importancesResponse] = await Promise.all([
          fetch(
            "https://test-ppmp.onrender.com/api/get_importances/",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${(await getAccessToken()) || ""}`,
              },
            },
          ),
        ]);
        if (!importancesResponse.ok) {
          toast.error(
            "Failed to fetch AI importances data. Please try again later.",
          );
        } else {
          const importancesResult = await importancesResponse.json();
          console.log("Importances Result:", importancesResult);
          setAiAvailableQuantityWeight(importancesResult.availableQuantityWeight || 0);
          setAiItemCategoryWeight(importancesResult.itemCategoryWeight || 0);
          setAiPlannedQuantityWeight(importancesResult.plannedQuantityWeight || 0);
          setAiPricePerUnitWeight(importancesResult.pricePerUnitWeight || 0);
          setAiUtilizedQuantityWeight(importancesResult.utilizedQuantityWeight || 0);
        }
      } catch (error) {
        console.error("Error fetching dashboard cards data:", error);
        toast.error("Network error. Please try again later.");
      } finally {
        // setIsInitialLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  function handleAsignatoryChange(
    category: "pr" | "approved" | "revised",
    index: number,
    field: "fullName" | "position",
    newValue: string,
  ) {
    if (category === "pr") {
      const updated = [...localPrAsignatories];
      updated[index] = { ...updated[index], [field]: newValue };
      setLocalPrAsignatories(updated);
    } else if (category === "approved") {
      const updated = [...localApprovedAsignatories];
      updated[index] = { ...updated[index], [field]: newValue };
      setLocalApprovedAsignatories(updated);
    } else if (category === "revised") {
      const updated = [...localRevisedAsignatories];
      updated[index] = { ...updated[index], [field]: newValue };
      setLocalRevisedAsignatories(updated);
    }
  }

  function handleFullNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFullName("");
    const errorMessage = document.getElementById("fullnameError");

    if (e.target.value.trim() === "") {
      errorMessage!.textContent = "Full Name is required.";
    } else {
      setFullName(e.target.value);
      errorMessage!.textContent = "";
    }
  }

  function handleNewPasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const temp: string = e.target.value;
    setNewPassword("");
    const errorMessage = document.getElementById("confirmNewPasswordError");

    if (confirmNewPassword && temp !== confirmNewPassword) {
      errorMessage!.textContent = "Passwords do not match.";
      setIsPasswordMatched(false);
    } else {
      errorMessage!.textContent = "";
      setIsPasswordMatched(true);
    }

    setEightCharacter(temp.length >= 8);
    setUpperLowerCase(/(?=.*[a-z])(?=.*[A-Z])/.test(temp));
    setNumber(/\d/.test(temp));
    setSpecialCharacter(/[^a-zA-Z0-9]/.test(temp));

    if (
      temp.length >= 8 &&
      /(?=.*[a-z])(?=.*[A-Z])/.test(temp) &&
      /\d/.test(temp) &&
      /[^a-zA-Z0-9]/.test(temp)
    ) {
      setNewPassword(temp);
    } else {
      setNewPassword("");
    }
  }

  function handleConfirmNewPasswordChange(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const temp: string = e.target.value;
    setConfirmNewPassword("");
    const errorMessage = document.getElementById("confirmNewPasswordError");

    if (!temp.trim()) {
      errorMessage!.textContent = "Confirm password is required.";
    } else if (temp !== newPassword) {
      errorMessage!.textContent = "Passwords do not match.";
      setIsPasswordMatched(false);
    } else {
      errorMessage!.textContent = "";
      setConfirmNewPassword(temp);
      setIsPasswordMatched(true);
    }
  }

  function toggleCurrentPasswordVisibility() {
    setIsCurrentPasswordVisible(!isCurrentPasswordVisible);
  }

  function toggleNewPasswordVisibility() {
    setIsNewPasswordVisible(!isNewPasswordVisible);
  }

  function toggleConfirmNewPasswordVisibility() {
    setIsConfirmNewPasswordVisible(!isConfirmNewPasswordVisible);
  }

  const isPrDirty =
    JSON.stringify(localPrAsignatories) !== JSON.stringify(prAsignatories);
  const isApprovedDirty =
    JSON.stringify(localApprovedAsignatories) !==
    JSON.stringify(approvedAsignatories);
  const isRevisedDirty =
    JSON.stringify(localRevisedAsignatories) !==
    JSON.stringify(revisedAsignatories);

  function handleUpdateProfile() {
    confirm(
      "Full Name Change",
      "Are you sure you want to update your full name?",
      "success",
      "Yes Update Name",
    ).then(async (confirmed) => {
      if (confirmed) {
        const formData = new FormData();
        formData.append("fullName", String(fullName));

        const loading = showCircleLoadingDialog();

        try {
          const response = await fetch(
            "https://test-ppmp.onrender.com/api/user/update_fullname/",
            {
              method: "PUT",
              body: formData,
              headers: {
                Authorization: `Bearer ${(await getAccessToken()) || ""}`,
              },
            },
          );
          if (!response.ok) {
            toast.error("Failed to update full name. Please try again later.");
            throw new Error("Failed to update full name.");
          } else {
            toast.success("Full name updated successfully!");
            setUserFullName(fullName);
          }
        } catch (error) {
          toast.error("Error occurred while updating full name.");
        } finally {
          loading();
        }
      }
    });
  }

  function handleUpdatePassword() {
    confirm(
      "Password Update",
      "Are you sure you want to update your password? \n Note: Your session will be terminated after the update. You will need to log in again.",
      "info",
      "Yes Update Password",
    ).then(async (confirmed) => {
      if (confirmed) {
        const formData = new FormData();
        formData.append("currentPassword", String(currentPassword));
        formData.append("newPassword", String(newPassword));
        formData.append("accessToken", String(await getAccessToken()));
        formData.append("refreshToken", String(await getRefreshToken()));
        const loading = showCircleLoadingDialog();

        try {
          const response = await fetch(
            "https://test-ppmp.onrender.com/api/auth/update_password/",
            {
              method: "PUT",
              body: formData,
              headers: {
                Authorization: `Bearer ${(await getAccessToken()) || ""}`,
              },
            },
          );
          if (!response.ok) {
            toast.error(
              "Failed to update password. Please check your current password and try again.",
            );
            throw new Error("Failed to update password.");
          } else {
            toast.success("Password updated successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");

            try {
              await logoutUser();
              navigate("/login");
              toast.success("Logged out successfully.");
              localStorage.removeItem("isLoggedIn");
            } catch (error) {
              console.error("Logout error:", error);
              toast.error(
                "Network error. Cannot perform logout. Please logout manually.",
              );
            }
          }
        } catch (error) {
          toast.error("Error occurred while updating password.");
        } finally {
          loading();
        }
      }
    });
  }

  function handleDeleteAsignatory(
    category: "pr" | "approved" | "revised",
    index: number,
  ) {
    if (category === "pr") {
      if (localPrAsignatories.length <= 1) {
        notify(
          "Action Prohibited",
          "At least one PR signatory is required.",
          "error",
          "I Understand",
        );
        return;
      }
      const updated = [...localPrAsignatories];
      updated.splice(index, 1);
      setLocalPrAsignatories(updated);
    } else if (category === "approved") {
      if (localApprovedAsignatories.length <= 1) {
        notify(
          "Action Prohibited",
          "At least one Approved signatory is required.",
          "error",
          "I Understand",
        );
        return;
      }
      const updated = [...localApprovedAsignatories];
      updated.splice(index, 1);
      setLocalApprovedAsignatories(updated);
    } else if (category === "revised") {
      if (localRevisedAsignatories.length <= 1) {
        notify(
          "Action Prohibited",
          "At least one Revised signatory is required.",
          "error",
          "I Understand",
        );
        return;
      }
      const updated = [...localRevisedAsignatories];
      updated.splice(index, 1);
      setLocalRevisedAsignatories(updated);
    }
  }

  function handleAddAsignatory(category: "pr" | "approved" | "revised") {
    const newSignatory = {
      signatoryId: Date.now(),
      fullName: "",
      position: "",
    };
    if (category === "pr") {
      setLocalPrAsignatories([...localPrAsignatories, newSignatory]);
    } else if (category === "approved") {
      setLocalApprovedAsignatories([
        ...localApprovedAsignatories,
        newSignatory,
      ]);
    } else if (category === "revised") {
      setLocalRevisedAsignatories([...localRevisedAsignatories, newSignatory]);
    }
  }

  function onAsignatoriesUpdate(
    asignatoriesType: "pr" | "approved" | "revised",
  ) {
    confirm(
      "Signatories Update",
      "Note: Updating signatories will affect the printing process of the documents.",
      "info",
      "Yes Update Signatories",
    ).then(async (confirmed) => {
      if (confirmed) {
        const formatAsignatoriesForBackend = (asignatoriesArray: any[]) => {
          const formattedArray = asignatoriesArray.map((person) => ({
            signatoryId: person.signatoryId,
            fullName: person.fullName,
            positionTitle: person.position,
          }));
          return {
            signatories: formattedArray,
          };
        };

        const formData = new FormData();

        if (asignatoriesType === "pr") {
          const payload = formatAsignatoriesForBackend(localPrAsignatories);
          formData.append("signatories", JSON.stringify(payload));
          formData.append("documentType", "PURCHASE REQUEST");
        } else if (asignatoriesType === "approved") {
          const payload = formatAsignatoriesForBackend(
            localApprovedAsignatories,
          );
          formData.append("signatories", JSON.stringify(payload));
          formData.append("documentType", "APPROVED PPMP");
        } else if (asignatoriesType === "revised") {
          const payload = formatAsignatoriesForBackend(
            localRevisedAsignatories,
          );
          formData.append("signatories", JSON.stringify(payload));
          formData.append("documentType", "REVISED PPMP");
        }

        const loading = showCircleLoadingDialog();

        try {
          const response = await fetch(
            "https://test-ppmp.onrender.com/api/update_signatories/",
            {
              method: "POST",
              body: formData,
              headers: {
                Authorization: `Bearer ${(await getAccessToken()) || ""}`,
              },
            },
          );
          if (!response.ok) {
            console.log(response);
            toast.error("Failed to update signatories. Please try again.");
            throw new Error("Failed to update signatories.");
          } else {
            toast.success("Signatories updated successfully!");
            if (asignatoriesType === "pr") {
              setPrAsignatories(localPrAsignatories);
            } else if (asignatoriesType === "approved") {
              setApprovedAsignatories(localApprovedAsignatories);
            } else if (asignatoriesType === "revised") {
              setRevisedAsignatories(localRevisedAsignatories);
            } else {
              toast.error("Invalid signatories type.");
            }
          }
        } catch (error) {
          toast.error("Error occurred while updating signatories.");
        } finally {
          loading();
        }
      }
    });
  }

  function retrainAIModel(threshold: number) {
    confirm(
      "Retrain AI Model",
      "Are you sure you want to retrain the AI model? This process may take some time.",
      "info",
      "Yes Retrain",
    ).then(async (confirmed) => {
      if (confirmed) {
        const closeLoading = showCircleLoadingDialog();
        const formData = new FormData();
        formData.append("threshold", String(threshold));

        try {
          const response = await fetch(
            "https://test-ppmp.onrender.com/api/retrain_ml/",
            {
              method: "POST",
              body: formData,
              headers: {
                Authorization: `Bearer ${(await getAccessToken()) || ""}`,
              },
            },
          );

          const responseData = await response.json();

          if (responseData.status === "success") {
            toast.success("AI Model retraining successfully!");
            const endTime = Date.now() + 60 * 60 * 1000;
            localStorage.setItem("retrainButtonCoolDown", endTime.toString());
            setTimeLeft(60 * 60 * 1000);
          } else {
            toast.error(responseData.message || "Failed to retrain AI model.");
          }
        } catch (error) {
          toast.error("Network error. Please try again later.");
        } finally {
          closeLoading();
        }
      }
    });
  }

  const aiFeaturesDataTraining: aiFeaturesData[] = [
        {icon: <IconCalendarCancel  size={18}/>, title: "Available Quantity Weight", description: "Based on the historical available quantity of items left not utilized", percentage: aiAvailableQuantityWeight},
        {icon: <IconCalendarCheck size={18}/>, title: "Planned Quantity Weight", description: "Based on the historical planned quantity of items", percentage: aiPlannedQuantityWeight},
        {icon: <IconCategory2 size={18}/>, title: "Item Category Weight", description: "Based on the historical utilization of items category", percentage: aiItemCategoryWeight},
        {icon: <IconClockDollar size={18}/>, title: "Price Per Unit Weight", description: "Based on the historical utilization of price per unit of items", percentage: aiPricePerUnitWeight},
        {icon: <IconTransform size={18}/>, title: "Utilized Quantity Weight", description: "Based on the historical utilized quantity of items", percentage: aiUtilizedQuantityWeight},
    ];

    const knapsackFeaturesData: aiFeaturesData[] = [
        {icon: <IconClockDollar size={18}/>, title: "Lowest Price possible of Combined Items", description: "Algorithm to find the lowest price possible of combined items based on the target budget."},
    ];

  return (
    <main className="page-container settings">
      <ProfileSection
        fullName={fullName}
        email={email}
        initialFullName={initialFullName}
        handleFullNameChange={handleFullNameChange}
        handleUpdateProfile={handleUpdateProfile}
      />
      <SecuritySection 
        currentPassword={currentPassword}
        newPassword={newPassword}
        confirmNewPassword={confirmNewPassword}
        isCurrentPasswordVisible={isCurrentPasswordVisible}
        isNewPasswordVisible={isNewPasswordVisible}
        isConfirmNewPasswordVisible={isConfirmNewPasswordVisible}
        isPasswordMatched={isPasswordMatched}
        eightCharacter={eightCharacter}
        upperLowerCase={upperLowerCase}
        number={number}
        specialCharacter={specialCharacter}
        setCurrentPassword={setCurrentPassword}
        handleNewPasswordChange={handleNewPasswordChange}
        handleConfirmNewPasswordChange={handleConfirmNewPasswordChange}
        toggleCurrentPasswordVisibility={toggleCurrentPasswordVisibility}
        toggleNewPasswordVisibility={toggleNewPasswordVisibility}
        toggleConfirmNewPasswordVisibility={toggleConfirmNewPasswordVisibility}
        handleUpdatePassword={handleUpdatePassword}
      />
      <SignatoriesCMSSection 
        localPrAsignatories={localPrAsignatories}
        localApprovedAsignatories={localApprovedAsignatories}
        localRevisedAsignatories={localRevisedAsignatories}
        handleAsignatoryChange={handleAsignatoryChange}
        handleDeleteAsignatory={handleDeleteAsignatory}
        handleAddAsignatory={handleAddAsignatory}
        onAsignatoriesUpdate={onAsignatoriesUpdate}
        isPrDirty={isPrDirty}
        isApprovedDirty={isApprovedDirty}
        isRevisedDirty={isRevisedDirty}
      />
      {userRole === "Admin" && (
        <MLSection
          aiFeaturesDataTraining={aiFeaturesDataTraining}
          knapsackFeaturesData={knapsackFeaturesData}
          retrainAIModel={retrainAIModel}
          timeLeft={timeLeft}
        />
      )}
    </main>
  );
}

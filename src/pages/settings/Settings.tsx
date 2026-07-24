import { useState } from "react";
import "./settings.css";
import { IconUser, IconEye, IconEyeOff, IconShield, IconCheck, IconX, IconStackBack } from '@tabler/icons-react';
import { confirm } from "../../components/dialogs/global_dialog/DialogService";
import { showCircleLoadingDialog } from "../../components/dialogs/circle_loading_dialog/CircleLoadingDialogService";
import { toast } from "../../components/toast/ToastService";
import { useOutletContext } from "react-router";
import { getAccessToken, logoutUser } from "../../../supadb";
import { useNavigate } from "react-router";
import InfoNote from "../../components/notes/info_note/InfoNote";
import WarningNote from "../../components/notes/warning_note/WarningNote";

export default function Settings() {
    const navigate = useNavigate();
    const { userFullName, userEmailAddress, prAsignatories, revisedAsignatories, approvedAsignatories, setUserFullName, setPrAsignatories, setApprovedAsignatories, setRevisedAsignatories } = useOutletContext<{
        userFullName: string;
        userEmailAddress: string;
        prAsignatories: any[];
        revisedAsignatories: any[];
        approvedAsignatories: any[];
        setUserFullName: (name: string) => void;
        setPrAsignatories: (asignatories: any[]) => void;
        setApprovedAsignatories: (asignatories: any[]) => void;
        setRevisedAsignatories: (asignatories: any[]) => void;
    }>();

    const [localPrAsignatories, setLocalPrAsignatories] = useState(prAsignatories || []);
    const [localApprovedAsignatories, setLocalApprovedAsignatories] = useState(approvedAsignatories || []);
    const [localRevisedAsignatories, setLocalRevisedAsignatories] = useState(revisedAsignatories || []);

    const email = userEmailAddress;
    const initialFullName = userFullName;
    const [fullName, setFullName] = useState(initialFullName);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);
    const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
    const [isConfirmNewPasswordVisible, setIsConfirmNewPasswordVisible] = useState(false);
    const [isPasswordMatched, setIsPasswordMatched] = useState(false);

    const [eightCharacter, setEightCharacter] = useState<boolean>(false);
    const [upperLowerCase, setUpperLowerCase] = useState<boolean>(false);
    const [number, setNumber] = useState<boolean>(false);
    const [specialCharacter, setSpecialCharacter] = useState<boolean>(false);

    function handleAsignatoryChange(
        category: 'pr' | 'approved' | 'revised', 
        index: number, 
        field: 'fullName' | 'position', 
        newValue: string
    ) {
        if (category === 'pr') {
            const updated = [...localPrAsignatories];
            updated[index] = { ...updated[index], [field]: newValue };
            setLocalPrAsignatories(updated);
        } 
        else if (category === 'approved') {
            const updated = [...localApprovedAsignatories];
            updated[index] = { ...updated[index], [field]: newValue };
            setLocalApprovedAsignatories(updated);
        } 
        else if (category === 'revised') {
            const updated = [...localRevisedAsignatories];
            updated[index] = { ...updated[index], [field]: newValue };
            setLocalRevisedAsignatories(updated);
        }
    }

    function handleFullNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFullName("");
        const errorMessage = document.getElementById('fullnameError');

        if(e.target.value.trim() === '') {
            errorMessage!.textContent = 'Full Name is required.';
        }
        else {
            setFullName(e.target.value);
            errorMessage!.textContent = '';
        }
    }

    function handleNewPasswordChange(e : React.ChangeEvent<HTMLInputElement>){
        const temp: string = e.target.value;
        setNewPassword("");
        const errorMessage = document.getElementById('confirmNewPasswordError');

        if(confirmNewPassword && temp !== confirmNewPassword){
            errorMessage!.textContent = "Passwords do not match.";
            setIsPasswordMatched(false);
        }else{
            errorMessage!.textContent = "";
            setIsPasswordMatched(true);
        }

        setEightCharacter(temp.length >= 8);
        setUpperLowerCase(/(?=.*[a-z])(?=.*[A-Z])/.test(temp));
        setNumber(/\d/.test(temp));
        setSpecialCharacter(/[^a-zA-Z0-9]/.test(temp));

        if(temp.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])/.test(temp) && /\d/.test(temp) && /[^a-zA-Z0-9]/.test(temp)){
            setNewPassword(temp);
        }else{
            setNewPassword('');
        }
    }

    function handleConfirmNewPasswordChange(e : React.ChangeEvent<HTMLInputElement>){
        const temp: string = e.target.value;
        setConfirmNewPassword('');
        const errorMessage = document.getElementById('confirmNewPasswordError');

        if(!temp.trim()){
            errorMessage!.textContent = "Confirm password is required.";
        }else if(temp !== newPassword){
            errorMessage!.textContent = "Passwords do not match.";
            setIsPasswordMatched(false);
        }else{
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

    const isPrDirty = JSON.stringify(localPrAsignatories) !== JSON.stringify(prAsignatories);
    const isApprovedDirty = JSON.stringify(localApprovedAsignatories) !== JSON.stringify(approvedAsignatories);
    const isRevisedDirty = JSON.stringify(localRevisedAsignatories) !== JSON.stringify(revisedAsignatories);

    function handleUpdateProfile() {
        confirm("Full Name Change", "Are you sure you want to update your full name?", "success", "Yes Update Name")
            .then(async (confirmed) => {
                if (confirmed) {

                    const formData = new FormData();
                    formData.append('fullName', String(fullName));

                    const loading = showCircleLoadingDialog();

                    try {
                        const response = await fetch("https://test-ppmp.onrender.com/api/user/update_fullname/", {
                            method: "PUT",
                            body: formData,
                            headers: {
                                "Authorization": `Bearer ${await getAccessToken() || ""}`
                            }
                        });
                        if (!response.ok) {
                            toast.error("Failed to update full name. Please try again later."); 
                            throw new Error("Failed to update full name.");
                        }else {
                            toast.success("Full name updated successfully!");
                            setUserFullName(fullName);
                        }
                    }
                    catch (error) {
                        toast.error("Error occurred while updating full name.");
                    }
                    finally {
                        loading();
                    }
                }
            });
    }

    function handleUpdatePassword() {
        confirm("Password Update", "Are you sure you want to update your password? \n Note: Your session will be terminated after the update. You will need to log in again.", "info", "Yes Update Password")
            .then(async (confirmed) => {
                if (confirmed) {

                    const formData = new FormData();
                    formData.append('currentPassword', String(currentPassword));
                    formData.append('newPassword', String(newPassword));

                    const loading = showCircleLoadingDialog();

                    try {
                        const response = await fetch("https://test-ppmp.onrender.com/api/auth/update_password/", {
                            method: "PUT",
                            body: formData,
                            headers: {
                                "Authorization": `Bearer ${await getAccessToken() || ""}`
                            }
                        });
                        if (!response.ok) {
                            toast.error("Failed to update password. Please check your current password and try again.");
                            throw new Error("Failed to update password.");
                        }else {
                            toast.success("Password updated successfully!");
                            setCurrentPassword('');
                            setNewPassword('');
                            setConfirmNewPassword('');

                            try {
                                await logoutUser();
                                navigate('/login');
                                toast.success("Logged out successfully.");
                            } catch (error) {
                                console.error("Logout error:", error);
                                toast.error("Network error. Cannot perform logout. Please logout manually.");
                            }
                        }
                    }
                    catch (error) {
                        toast.error("Error occurred while updating password.");
                    }
                    finally {
                        loading();
                    }
                }
            });
    }

    function onAsignatoriesUpdate(asignatoriesType: 'pr' | 'approved' | 'revised') {
        confirm("Asignatories Update", "Note: Updating asignatories will affect the printing process of the documents.", "info", "Yes Update Asignatories")
            .then(async (confirmed) => {
                if (confirmed) {

                    const formatAsignatoriesForBackend = (asignatoriesArray: any[]) => {
                        const formattedArray = asignatoriesArray.map(person => ({
                            signatoryId: person.signatoryId,
                            fullName: person.fullName,
                            positionTitle: person.position
                        }));
                        return {
                            signatories: formattedArray
                        };
                    };

                    const formData = new FormData();

                    if (asignatoriesType === 'pr') {
                        const payload = formatAsignatoriesForBackend(localPrAsignatories);
                        formData.append('signatories', JSON.stringify(payload));
                        console.log("PR Payload: ", payload);
                    } else if (asignatoriesType === 'approved') {
                        const payload = formatAsignatoriesForBackend(localApprovedAsignatories);
                        formData.append('signatories', JSON.stringify(payload));
                        console.log("Approved Payload: ", payload);
                    } else if (asignatoriesType === 'revised') {
                        const payload = formatAsignatoriesForBackend(localRevisedAsignatories);
                        formData.append('signatories', JSON.stringify(payload));
                        console.log("Revised Payload: ", payload);
                    }

                    const loading = showCircleLoadingDialog();

                    try {
                        const response = await fetch("https://test-ppmp.onrender.com/api/update_signatories/", {
                            method: "PUT",
                            body: formData,
                            headers: {
                                "Authorization": `Bearer ${await getAccessToken() || ""}`
                            }
                        });
                        if (!response.ok) {
                            console.log(response);
                            toast.error("Failed to update asignatories. Please try again.");
                            throw new Error("Failed to update asignatories.");
                        }else {
                            toast.success("Asignatories updated successfully!");
                            if (asignatoriesType === 'pr') {
                                setPrAsignatories(localPrAsignatories);
                            } else if (asignatoriesType === 'approved') {
                                setApprovedAsignatories(localApprovedAsignatories);
                            } else if (asignatoriesType === 'revised') {
                                setRevisedAsignatories(localRevisedAsignatories);
                            }else {
                                toast.error("Invalid asignatories type.");
                            }
                        }
                    }
                    catch (error) {
                        toast.error("Error occurred while updating asignatories.");
                    }
                    finally {
                        loading();
                    }
                }
            });
    }

    return (
        <main className="page-container settings">
            <div className="profile-container">
                <div className="profile-title">
                    <div className="icon royal-red">
                        <IconUser size={20} />
                    </div>
                    <div className="title">
                        <h2>Profile</h2>
                        <p>Your Account Information</p>
                    </div>
                </div>
                <div className="input-row">
                    <div className="field-group">
                        <label htmlFor="fullName">Full Name</label>
                        <input type="text" id="fullName" value={fullName} onChange={handleFullNameChange} />
                        <p className="error-message" id="fullnameError"></p>
                    </div>
                    <div className="field-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" disabled value={email} className="text-gray-500"/>
                    </div>
                </div>
                {(fullName !== '' && fullName !== initialFullName) && (
                    <button className="btn-primary-rd-shadow" onClick={handleUpdateProfile}>
                        Update Profile
                    </button>
                )}
            </div>
            <div className="security-container">
                <div className="security-title">
                    <div className="icon royal-red">
                        <IconShield size={20} />
                    </div>
                    <div className="title">
                        <h2>Security</h2>
                        <p>Your Account Security Settings</p>
                    </div>
                </div>
                <InfoNote message="For security reasons, you will be logged out after updating your password. Please log in again with your new password." />
                <WarningNote message="Your password must not be the same as your current password." />
                <div className="field-group">
                    <label htmlFor="password">Current Password</label>
                    <div className="input-field">
                        <input type={isCurrentPasswordVisible ? "text" : "password"} id="password" placeholder="Enter your current password" onChange={(e) => setCurrentPassword(e.target.value)}/>
                        <button type="button" className="input-icon" onClick={toggleCurrentPasswordVisibility}>
                            {isCurrentPasswordVisible ? <IconEye /> : <IconEyeOff />}
                        </button>
                    </div>
                    <p className="error-message" id="passwordError"></p>
                </div>
                <div className="input-row">
                    <div className="field-group">
                        <label htmlFor="newPassword">New Password</label>
                        <div className="input-field">
                            <input type={isNewPasswordVisible ? "text" : "password"} id="newPassword" placeholder="Enter your new password" onChange={handleNewPasswordChange}/>
                            <button type="button" className="input-icon" onClick={toggleNewPasswordVisibility}>
                                {isNewPasswordVisible ? <IconEye /> : <IconEyeOff />}
                            </button>
                        </div>
                    </div>
                    <div className="field-group">
                        <label htmlFor="confirmNewPassword">Confirm New Password</label>
                        <div className="input-field">
                            <input type={isConfirmNewPasswordVisible ? "text" : "password"} id="confirmNewPassword" placeholder="Confirm your new password" onChange={handleConfirmNewPasswordChange}/>
                            <button type="button" className="input-icon" onClick={toggleConfirmNewPasswordVisibility}>
                                {isConfirmNewPasswordVisible ? <IconEye /> : <IconEyeOff />}
                            </button>
                        </div>
                        <p className="error-message" id="confirmNewPasswordError"></p>
                    </div>
                </div>
                <ul>
                    <li className={eightCharacter ? 'valid' : 'error'}>
                        {eightCharacter ? <IconCheck size={18} /> : <IconX size={18} />} Atleast 8 characters
                    </li>
                    <li className={upperLowerCase ? 'valid' : 'error'}>
                        {upperLowerCase ? <IconCheck size={18} /> : <IconX size={18} />} Include uppercase and lowercase letters
                    </li>
                    <li className={number ? 'valid' : 'error'}>
                        {number ? <IconCheck size={18} /> : <IconX size={18} />} Contain at least one number
                    </li>
                    <li className={specialCharacter ? 'valid' : 'error'}>
                        {specialCharacter ? <IconCheck size={18} /> : <IconX size={18} />} Include at least one special character
                    </li>
                </ul>
                {currentPassword && newPassword && confirmNewPassword && isPasswordMatched ? (
                    <button className="btn-primary-rd-shadow" onClick={handleUpdatePassword}>
                        Update Password
                    </button>
                ) : (
                    <button className="btn-primary-rd-shadow" disabled>
                        Update Password
                    </button>
                )}
            </div>
            <div className="content-management-container">
                <div className="content-management-title">
                    <div className="icon royal-red">
                        <IconStackBack size={20} />
                    </div>
                    <div className="title">
                        <h2>Content Management</h2>
                        <p>Manage asignatories for the contents</p>
                    </div>
                </div>
                <div className="pr-asignatory">
                    <h3>Purchase Request Asignatories</h3>
                    {localPrAsignatories.map((signatory: any, index: number) => (
                        <div key={signatory.signatoryId} className="input-row">
                            <div className="field-group">
                                <label htmlFor={`fullName-${signatory.signatoryId}-pr`}>Full Name</label>
                                <input type="text" id={`fullName-${signatory.signatoryId}-pr`} value={signatory.fullName} onChange={(e) => handleAsignatoryChange("pr", index, 'fullName', e.target.value)}/>
                                <p className="error-message" id={`fullnameError-${signatory.signatoryId}-pr`}></p>
                            </div>
                            <div className="field-group">
                                <label htmlFor={`position-${signatory.signatoryId}-pr`}>Position Title</label>
                                <input type="text" id={`position-${signatory.signatoryId}-pr`} value={signatory.position} onChange={(e) => handleAsignatoryChange("pr", index, 'position', e.target.value)}/>
                                <p className="error-message" id={`positionError-${signatory.signatoryId}-pr`}></p>
                            </div>
                        </div>
                    ))}
                    {isPrDirty && (
                        <button className="btn-primary-rd-shadow" onClick={() => onAsignatoriesUpdate('pr')}>
                            Update Purchase Request Asignatories
                        </button>
                    )}
                </div>
                <div className="pr-asignatory">
                    <h3>Approved PPMP Asignatories</h3>
                    {localApprovedAsignatories.map((signatory: any, index: number) => (
                        <div key={signatory.signatoryId} className="input-row">
                            <div className="field-group">
                                <label htmlFor={`fullName-${signatory.signatoryId}-approved`}>Full Name</label>
                                <input type="text" id={`fullName-${signatory.signatoryId}-approved`} value={signatory.fullName} onChange={(e) => handleAsignatoryChange("approved", index, 'fullName', e.target.value)} />
                                <p className="error-message" id={`fullnameError-${signatory.signatoryId}-approved`}></p>
                            </div>
                            <div className="field-group">
                                <label htmlFor={`position-${signatory.signatoryId}-approved`}>Position Title</label>
                                <input type="text" id={`position-${signatory.signatoryId}-approved`} value={signatory.position} onChange={(e) => handleAsignatoryChange("approved", index, 'position', e.target.value)} />
                                <p className="error-message" id={`positionError-${signatory.signatoryId}-approved`}></p>
                            </div>
                        </div>
                    ))}
                    {isApprovedDirty && (
                        <button className="btn-primary-rd-shadow" onClick={() => onAsignatoriesUpdate('approved')}>
                            Update Approved PPMP Asignatories
                        </button>
                    )}
                </div>
                <div className="pr-asignatory">
                    <h3>Revised PPMP Asignatories</h3>
                    {localRevisedAsignatories.map((signatory: any, index: number) => (
                        <div key={signatory.signatoryId} className="input-row">
                            <div className="field-group">
                                <label htmlFor={`fullName-${signatory.signatoryId}-revised`}>Full Name</label>
                                <input type="text" id={`fullName-${signatory.signatoryId}-revised`} value={signatory.fullName} onChange={(e) => handleAsignatoryChange("revised", index, 'fullName', e.target.value)} />
                                <p className="error-message" id={`fullnameError-${signatory.signatoryId}-revised`}></p>
                            </div>
                            <div className="field-group">
                                <label htmlFor={`position-${signatory.signatoryId}-revised`}>Position Title</label>
                                <input type="text" id={`position-${signatory.signatoryId}-revised`} value={signatory.position} onChange={(e) => handleAsignatoryChange("revised", index, 'position', e.target.value)} />
                                <p className="error-message" id={`positionError-${signatory.signatoryId}-revised`}></p>
                            </div>
                        </div>
                    ))}
                    {isRevisedDirty && (
                        <button className="btn-primary-rd-shadow" onClick={() => onAsignatoriesUpdate('revised')}>
                            Update Revised PPMP Asignatories
                        </button>
                    )}
                </div>
            </div>
        </main>
    );
}
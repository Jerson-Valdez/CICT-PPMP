import { useState } from "react";
import "./settings.css";
import { IconUser, IconEye, IconEyeOff, IconShield, IconCheck, IconX, IconStackBack } from '@tabler/icons-react';
import { useOutletContext } from "react-router";

export default function Settings() {
    const { userFullName, userEmailAddress, prAsignatories, revisedAsignatories, approvedAsignatories } = useOutletContext<{ userFullName: string; userEmailAddress: string; prAsignatories: any[]; revisedAsignatories: any[]; approvedAsignatories: any[] }>();

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
                    <button className="btn-primary-rd-shadow">Update Profile</button>
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
                    <button className="btn-primary-rd-shadow">Update Password</button>
                ) : (
                    <button className="btn-primary-rd-shadow" disabled>Update Password</button>
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
                        <div key={index} className="input-row">
                            <div className="field-group">
                                <label htmlFor={`fullName-${index}-pr`}>Full Name</label>
                                <input type="text" id={`fullName-${index}-pr`} value={signatory.fullName} onChange={(e) => handleAsignatoryChange("pr", index, 'fullName', e.target.value)}/>
                                <p className="error-message" id={`fullnameError-${index}-pr`}></p>
                            </div>
                            <div className="field-group">
                                <label htmlFor={`position-${index}-pr`}>Position Title</label>
                                <input type="text" id={`position-${index}-pr`} value={signatory.position} onChange={(e) => handleAsignatoryChange("pr", index, 'position', e.target.value)}/>
                                <p className="error-message" id={`positionError-${index}-pr`}></p>
                            </div>
                        </div>
                    ))}
                    {isPrDirty && (
                        <button className="btn-primary-rd-shadow">Update Purchase Request Asignatories</button>
                    )}
                </div>
                <div className="pr-asignatory">
                    <h3>Approved PPMP Asignatories</h3>
                    {localApprovedAsignatories.map((signatory: any, index: number) => (
                        <div key={index} className="input-row">
                            <div className="field-group">
                                <label htmlFor={`fullName-${index}-approved`}>Full Name</label>
                                <input type="text" id={`fullName-${index}-approved`} value={signatory.fullName} onChange={(e) => handleAsignatoryChange("approved", index, 'fullName', e.target.value)} />
                                <p className="error-message" id={`fullnameError-${index}-approved`}></p>
                            </div>
                            <div className="field-group">
                                <label htmlFor={`position-${index}-approved`}>Position Title</label>
                                <input type="text" id={`position-${index}-approved`} value={signatory.position} onChange={(e) => handleAsignatoryChange("approved", index, 'position', e.target.value)} />
                                <p className="error-message" id={`positionError-${index}-approved`}></p>
                            </div>
                        </div>
                    ))}
                    {isApprovedDirty && (
                        <button className="btn-primary-rd-shadow">Update Approved PPMP Asignatories</button>
                    )}
                </div>
                <div className="pr-asignatory">
                    <h3>Revised PPMP Asignatories</h3>
                    {localRevisedAsignatories.map((signatory: any, index: number) => (
                        <div key={index} className="input-row">
                            <div className="field-group">
                                <label htmlFor={`fullName-${index}-revised`}>Full Name</label>
                                <input type="text" id={`fullName-${index}-revised`} value={signatory.fullName} onChange={(e) => handleAsignatoryChange("revised", index, 'fullName', e.target.value)} />
                                <p className="error-message" id={`fullnameError-${index}-revised`}></p>
                            </div>
                            <div className="field-group">
                                <label htmlFor={`position-${index}-revised`}>Position Title</label>
                                <input type="text" id={`position-${index}-revised`} value={signatory.position} onChange={(e) => handleAsignatoryChange("revised", index, 'position', e.target.value)} />
                                <p className="error-message" id={`positionError-${index}-revised`}></p>
                            </div>
                        </div>
                    ))}
                    {isRevisedDirty && (
                        <button className="btn-primary-rd-shadow">Update Revised PPMP Asignatories</button>
                    )}
                </div>
            </div>
        </main>
    );
}
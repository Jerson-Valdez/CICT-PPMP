import {
  IconCheck,
  IconEye,
  IconEyeOff,
  IconShield,
  IconX,
} from "@tabler/icons-react";
import InfoNote from "../../components/notes/info_note/InfoNote";
import WarningNote from "../../components/notes/warning_note/WarningNote";

interface SecuritySectionProps {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  isCurrentPasswordVisible: boolean;
  isNewPasswordVisible: boolean;
  isConfirmNewPasswordVisible: boolean;
  eightCharacter: boolean;
  upperLowerCase: boolean;
  number: boolean;
  specialCharacter: boolean;
  isPasswordMatched: boolean;
  setCurrentPassword: (value: string) => void;
  handleNewPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleConfirmNewPasswordChange: (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  toggleCurrentPasswordVisibility: () => void;
  toggleNewPasswordVisibility: () => void;
  toggleConfirmNewPasswordVisibility: () => void;
  handleUpdatePassword: () => void;
}

export default function SecuritySection({
  currentPassword,
  newPassword,
  confirmNewPassword,
  isCurrentPasswordVisible,
  isNewPasswordVisible,
  isConfirmNewPasswordVisible,
  eightCharacter,
  upperLowerCase,
  number,
  specialCharacter,
  isPasswordMatched,
  setCurrentPassword,
  handleNewPasswordChange,
  handleConfirmNewPasswordChange,
  toggleCurrentPasswordVisibility,
  toggleNewPasswordVisibility,
  toggleConfirmNewPasswordVisibility,
  handleUpdatePassword,
}: SecuritySectionProps) {
  return (
    <section className="security-container">
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
          <input
            type={isCurrentPasswordVisible ? "text" : "password"}
            id="password"
            placeholder="Enter your current password"
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <button
            type="button"
            className="input-icon"
            onClick={toggleCurrentPasswordVisibility}
          >
            {isCurrentPasswordVisible ? <IconEye /> : <IconEyeOff />}
          </button>
        </div>
        <p className="error-message" id="passwordError"></p>
      </div>
      <div className="input-row">
        <div className="field-group">
          <label htmlFor="newPassword">New Password</label>
          <div className="input-field">
            <input
              type={isNewPasswordVisible ? "text" : "password"}
              id="newPassword"
              placeholder="Enter your new password"
              onChange={handleNewPasswordChange}
            />
            <button
              type="button"
              className="input-icon"
              onClick={toggleNewPasswordVisibility}
            >
              {isNewPasswordVisible ? <IconEye /> : <IconEyeOff />}
            </button>
          </div>
        </div>
        <div className="field-group">
          <label htmlFor="confirmNewPassword">Confirm New Password</label>
          <div className="input-field">
            <input
              type={isConfirmNewPasswordVisible ? "text" : "password"}
              id="confirmNewPassword"
              placeholder="Confirm your new password"
              onChange={handleConfirmNewPasswordChange}
            />
            <button
              type="button"
              className="input-icon"
              onClick={toggleConfirmNewPasswordVisibility}
            >
              {isConfirmNewPasswordVisible ? <IconEye /> : <IconEyeOff />}
            </button>
          </div>
          <p className="error-message" id="confirmNewPasswordError"></p>
        </div>
      </div>
      <ul>
        <li className={eightCharacter ? "valid" : "error"}>
          {eightCharacter ? <IconCheck size={18} /> : <IconX size={18} />}{" "}
          Atleast 8 characters
        </li>
        <li className={upperLowerCase ? "valid" : "error"}>
          {upperLowerCase ? <IconCheck size={18} /> : <IconX size={18} />}{" "}
          Include uppercase and lowercase letters
        </li>
        <li className={number ? "valid" : "error"}>
          {number ? <IconCheck size={18} /> : <IconX size={18} />} Contain at
          least one number
        </li>
        <li className={specialCharacter ? "valid" : "error"}>
          {specialCharacter ? <IconCheck size={18} /> : <IconX size={18} />}{" "}
          Include at least one special character
        </li>
      </ul>
      {currentPassword &&
      newPassword &&
      confirmNewPassword &&
      isPasswordMatched ? (
        <button
          className="btn-primary-rd-shadow"
          onClick={handleUpdatePassword}
        >
          Update Password
        </button>
      ) : (
        <button className="btn-primary-rd-shadow" disabled>
          Update Password
        </button>
      )}
    </section>
  );
}

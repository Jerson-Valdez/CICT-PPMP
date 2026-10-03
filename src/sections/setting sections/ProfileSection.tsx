import { IconUser } from "@tabler/icons-react";

interface ProfileSectionProps {
  fullName: string;
  email: string;
  initialFullName: string;
  handleFullNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpdateProfile: () => void;
}

export default function ProfileSection({
  fullName,
  email,
  initialFullName,
  handleFullNameChange,
  handleUpdateProfile
}: ProfileSectionProps) {
  return (
    <section className="profile-container">
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
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={handleFullNameChange}
          />
          <p className="error-message" id="fullnameError"></p>
        </div>
        <div className="field-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            disabled
            value={email}
            className="text-gray-500"
          />
        </div>
      </div>
      {fullName !== "" && fullName !== initialFullName && (
        <button className="btn-primary-rd-shadow" onClick={handleUpdateProfile}>
          Update Profile
        </button>
      )}
    </section>
  );
}

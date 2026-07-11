import { useState } from "react";
import UserManagementTable from "../../components/tables/user_management_table/UserManagementTable";
import "./user-management.css";
import { IconUser, IconEye, IconEyeOff } from '@tabler/icons-react';

interface User {
    userId: number;
    fullName: string;
    email: string;
    role: string;
    dateCreated: string;
    status: string;
}

export default function UserManagement() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [departmentRole, setDepartmentRole] = useState('Staff');
    const [temporaryPassword, setTemporaryPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const [users, setUsers] = useState<User[]>([
        {
            userId: 1,
            fullName: "Jerson Doe",
            email: "Doe@gmail.com",
            role: "Staff",
            dateCreated: "2023-01-01",
            status: "Active"
        },
        {
            userId: 2,
            fullName: "Jane Smith",
            email: "Smith@gmail.com",
            role: "Dean",
            dateCreated: "2023-02-15",
            status: "Inactive"
        },
        {
            userId: 3,
            fullName: "Michael Johnson",
            email: "Johnson@gmail.com",
            role: "Staff",
            dateCreated: "2023-03-10",
            status: "Active"
        },
        {
            userId: 4,
            fullName: "Emily Davis",
            email: "Davis@gmail.com",
            role: "Staff",
            dateCreated: "2023-04-05",
            status: "Active"
        },
    ]);

    function togglePasswordVisibility() {
        setIsPasswordVisible(!isPasswordVisible);
    }

    function handleFullNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFullName("");
        const errorMessage = document.getElementById('fullnameError');
        
        if(e.target.value.trim() === '') {
            errorMessage!.textContent = 'Full Name is required.';
        } else {
            setFullName(e.target.value);
            errorMessage!.textContent = '';
        }
    }

    function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
        setEmail("");
        const errorMessage = document.getElementById('emailError');

        if(e.target.value.trim() === '') {
            errorMessage!.textContent = 'Email Address is required.';
        } else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value)) {
            errorMessage!.textContent = 'Please enter a valid email address.';
        } else {
            setEmail(e.target.value);
            errorMessage!.textContent = '';
        }
    }

    function handleTemporaryPasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        setTemporaryPassword("");
        const errorMessage = document.getElementById('temporaryPasswordError');

        if(e.target.value.trim() === '') {
            errorMessage!.textContent = 'Temporary Password is required.';
        } else if(e.target.value.length < 8) {
            errorMessage!.textContent = 'Temporary Password must be at least 8 characters long.';
        } else {
            setTemporaryPassword(e.target.value);
            errorMessage!.textContent = '';
        }
    }

  return (
    <main className="page-container usermanagement">
      <div className="create-user-container">
        <div className="create-user-title">
            <div className="icon royal-red">
                <IconUser size={24} />
            </div>
            <div className="title">
                <h2>Create New Account</h2>
                <p>Add a new staff or transfer dean account to the system.</p>
            </div>
        </div>
        <div className="input-row">
            <div className="field-group">
                <label htmlFor="fullName">Full Name</label>
                <input type="text" id="fullName" onChange={handleFullNameChange} />
                <p className="error-message" id="fullnameError"></p>
            </div>
            <div className="field-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" onChange={handleEmailChange} />
                <p className="error-message" id="emailError"></p>
            </div>
        </div>
        <div className="input-row">
            <div className="field-group">
                <label htmlFor="departmentRole">Department Role</label>
                <select id="departmentRole" onChange={(e) => setDepartmentRole(e.target.value)}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                <p className="error-message" id="departmentRoleError"></p>
            </div>
            <div className="field-group">
                <label htmlFor="temporaryPassword">Temporary Password</label>
                <div className="input-field">
                    <input 
                        type={isPasswordVisible ? "text" : "password"} 
                        id="temporaryPassword" 
                        onChange={handleTemporaryPasswordChange} 
                    />
                    <button type="button" className="input-icon" onClick={togglePasswordVisibility}>
                        {isPasswordVisible ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                    </button>
                </div>
                <p className="error-message" id="temporaryPasswordError"></p>
            </div>
        </div>
        {fullName && email && departmentRole && temporaryPassword ? (
            <div className="create-user-button">
                <button className="btn-primary-rd-shadow">Create Account</button>
            </div>
        ) : <div className="create-user-button">
                <button className="btn-primary-rd-shadow" disabled>Create Account</button>
            </div>}
      </div>
        <UserManagementTable data={users} />
    </main>
  );
}
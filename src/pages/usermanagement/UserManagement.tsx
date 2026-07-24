import { useEffect, useState } from "react";
import UserManagementTable from "../../components/tables/user_management_table/UserManagementTable";
import "./user-management.css";
import { IconUser, IconEye, IconEyeOff } from '@tabler/icons-react';
import LoadingWrapper from "../../components/wrappers/loading wrapper/LoadingWrapper";
import TableSkeleton from "../../components/skeleton/TableSkeleton";
import { toast } from "../../components/toast/ToastService";
import { getAccessToken } from "../../../supadb";
import { confirm } from "../../components/dialogs/global_dialog/DialogService";
import { showCircleLoadingDialog } from "../../components/dialogs/circle_loading_dialog/CircleLoadingDialogService";
import { useNavigate } from "react-router";
import { useOutletContext } from "react-router";

interface User {
    userId: number;
    fullname: string;
    email: string;
    role: string;
    dateCreated?: string;
    status: string;
}

export default function UserManagement() {
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const { userRole, setUserRole } = useOutletContext<{ userRole: string, setUserRole: (role: string) => void }>(); 
    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [departmentRole, setDepartmentRole] = useState('User');
    const [temporaryPassword, setTemporaryPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        if(userRole !== "Admin") {
            toast.error("You do not have permission to access this page.");
            navigate("/dashboard");
            return;
        }
        const loadUserManagementData = async () => {
            try {
                const [userManagemenResponse] = await Promise.all([

                    fetch('https://test-ppmp.onrender.com/api/auth/users/', {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${await getAccessToken() || ""}`
                        }
                    })
                ]);

                if (!userManagemenResponse.ok) {
                    toast.error("Failed to fetch User Management data. Please try again later.");
                } else {
                    const userManagemenResult = await userManagemenResponse.json();
                    console.log(userManagemenResult)    
                    setUsers(userManagemenResult.user);
                }

            } catch (error) {
                console.error("Error fetching User Management data:", error);
                toast.error("Network error. Please try again later.");
            }
            finally {
                setIsInitialLoading(false);
            }
        };
        loadUserManagementData();
    }, []);

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

    function handleUserStatusChange(userId: number, newStatus: string) {
        setUsers(prevTableData => 
            prevTableData.map(user => {
                if (user.userId === userId) {
                    if (newStatus === "Active") {
                        return {
                            ...user,
                            status: newStatus
                        }
                    } else if (newStatus === "Inactive") {
                        return {
                            ...user,
                            status: newStatus
                        }
                    }
                }
                return user;
            })
        );
    }

    function handleUserCreation(userId: number, fullName: string, email: string, role: string){
        setUsers(prev => [...prev, {
            userId: userId,
            fullname: fullName,
            email: email,
            role: role,
            status: "Active",
            dateCreated: new Date().toLocaleString("en-PH")
        }]);
    };

    function onPromote(userId: number) {
        confirm("User Promotion", "Are you sure you want to promote this user? \n Note: Once the user is promoted, you will be domoted to user level access", "warning", "Continue Promotion")
            .then(async (confirmed) => {
                if (confirmed) {

                    const formData = new FormData();
                    formData.append('userId', String(userId));

                    const loading = showCircleLoadingDialog();

                    try {
                        const response = await fetch("https://test-ppmp.onrender.com/api/user/promote_user/", {
                            method: "PUT",
                            body: formData,
                            headers: {
                                "Authorization": `Bearer ${await getAccessToken() || ""}`
                            }
                        });
                        if (!response.ok) {
                            toast.error("Failed to Promote user. Please try again later."); 
                            throw new Error("Failed to Promote User.");
                        }else {
                            toast.success("Promotion successful!");
                            toast.info("Redirecting to dashboard, you dont have access to user management.")
                            setUserRole("User")
                            navigate('/dashboard')
                        }
                    }
                    catch (error) {
                        toast.error("Error occurred while promoting user.");
                    }
                    finally {
                        loading();
                    }
                }
            });
    }

    function onDeactivate(userId: number) {
        confirm("User Deactivation", "Are you sure you want to Deactivate this user? \n Note: Once the user is deactivated, he/she will be prevented to login in this system", "warning", "Continue Deactivation")
            .then(async (confirmed) => {
                if (confirmed) {

                    const formData = new FormData();
                    formData.append('userId', String(userId));
                    formData.append('status', String("Inactive"))

                    const loading = showCircleLoadingDialog();

                    try {
                        const response = await fetch("https://test-ppmp.onrender.com/api/user/update_user_status/", {
                            method: "PUT",
                            body: formData,
                            headers: {
                                "Authorization": `Bearer ${await getAccessToken() || ""}`
                            }
                        });
                        if (!response.ok) {
                            toast.error("Failed to Update user status. Please try again later."); 
                            throw new Error("Failed to Update User status.");
                        }else {
                            toast.success("User status updated successfully!");
                            handleUserStatusChange(userId, "Inactive")
                        }
                    }
                    catch (error) {
                        toast.error("Error occurred while updating User Status.");
                    }
                    finally {
                        loading();
                    }
                }
            });
    }

    function onActivate(userId: number) {
        confirm("User Activation", "Are you sure you want to Activate this user? \n Note: Once the user is activated, he/she will be allowed to login and perform in the system", "info", "Continue Activation")
            .then(async (confirmed) => {
                if (confirmed) {

                    const formData = new FormData();
                    formData.append('userId', String(userId));
                    formData.append('status', String("Active"))

                    const loading = showCircleLoadingDialog();

                    try {
                        const response = await fetch("https://test-ppmp.onrender.com/api/user/update_user_status/", {
                            method: "PUT",
                            body: formData,
                            headers: {
                                "Authorization": `Bearer ${await getAccessToken() || ""}`
                            }
                        });
                        if (!response.ok) {
                            toast.error("Failed to Update user status. Please try again later."); 
                            throw new Error("Failed to Update User status.");
                        }else {
                            toast.success("User status updated successfully!");
                            handleUserStatusChange(userId, "Active")
                        }
                    }
                    catch (error) {
                        toast.error("Error occurred while updating User Status.");
                    }
                    finally {
                        loading();
                    }
                }
            });
    }

    function onCreateUser(fullName: string, email: string, role: string, temporaryPassword: string) {
        confirm("Create User", "Note: Once user is created, he/she will be allowed to perform in the system.", "info", "Continue Creation")
            .then(async (confirmed) => {
                if (confirmed) {

                    const formData = new FormData();
                    formData.append('fullName', String(fullName));
                    formData.append('email', String(email))
                    formData.append('password', String(temporaryPassword))
                    formData.append('role', String(role))

                    const loading = showCircleLoadingDialog();

                    try {
                        const response = await fetch("https://test-ppmp.onrender.com/api/user/create_user/", {
                            method: "POST",
                            body: formData,
                            headers: {
                                "Authorization": `Bearer ${await getAccessToken() || ""}`
                            }
                        });
                        if (!response.ok) {
                            toast.error("Failed to Create user. Please try again later. or Check if the email is already registered."); 
                            throw new Error("Failed to Create User.");
                        }else {
                            toast.success("User created successfully!");
                            const result = await response.json();
                            handleUserCreation(result.userId, fullName, email, role)
                            setFullName('');
                            setEmail('');
                            setDepartmentRole('User');
                            setTemporaryPassword('');
                        }
                    }
                    catch (error) {
                        toast.error("Error occurred while Creating User.");
                    }
                    finally {
                        loading();
                    }
                }
            });
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
                <input type="text" id="departmentRole" value={departmentRole} disabled className="cursor-not-allowed"/>
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
                <button className="btn-primary-rd-shadow" onClick={() => onCreateUser(fullName, email, departmentRole, temporaryPassword)}>Create Account</button>
            </div>
        ) : <div className="create-user-button">
                <button className="btn-primary-rd-shadow" disabled>Create Account</button>
            </div>}
      </div>
      <LoadingWrapper isLoading={isInitialLoading} skeleton={<TableSkeleton />}>
        <UserManagementTable data={users} onPromote={onPromote} onDeactivate={onDeactivate} onActivate={onActivate} />
      </LoadingWrapper>
    </main>
  );
}
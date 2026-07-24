import "../table-design.css";
import { IconRestore ,IconUserCheck,IconUserCancel,IconTrash, IconUserUp } from '@tabler/icons-react';

interface UserManagementTableProps {
    data: any[];
    onPromote: (userId: number) => void;
    onDeactivate: (userId: number) => void;
    onActivate: (userId: number) => void;
}

export default function UserManagementTable({data, onPromote, onDeactivate, onActivate}: UserManagementTableProps) {

    return (
        <div className="table-container approvals">
            <div className="table-title-container">
                <div className="table-title">
                    <h2 className="table-title">Staff Accounts</h2>
                    <p>Manage and update staff account information</p>
                </div>
            </div>
            <div className="table-wrapper">
                <table className="styled-table usermanagement">
                    <thead>
                        <tr>
                        <th><h3>Full Name</h3><p>Identification of the User</p></th>
                        <th><h3>Email</h3><p>Email Address</p></th>
                        <th><h3>Role</h3><p>Access Level</p></th>
                        <th><h3>Date Created</h3><p>Account Creation Date</p></th>
                        <th><h3>Status</h3><p>Current state of activity</p></th>
                        <th colSpan={2}><h3>Action</h3><p>Available Actions</p></th>
                    </tr>
                </thead>
                <tbody> 
                    {data.map((user, index) => (
                        <tr key={index}>
                            <td>{user.fullname}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{new Date(user.dateCreated).toLocaleString("en-PH")}</td>
                            <td><div className="status-container">
                                    <div className={`status ${user.status === "Active" ? "active" : "inactive"}`}>
                                        {user.status}
                                    </div></div>
                            </td>
                            <td>
                                <div className="button-container">
                                    <button className="btn-solid gray" disabled={user.role === "Admin"}>
                                            <IconRestore size={18} /> Reset Password
                                    </button>
                                    <button className="btn-solid blue" onClick={() => onPromote(user.userId)} disabled={user.role === "Admin"}>
                                            <IconUserUp size={18} /> Promote
                                    </button>
                                    {user.status === "Active" ? (
                                        <button className="btn-solid red" onClick={() => onDeactivate(user.userId)} disabled={user.role === "Admin"}>
                                            <IconUserCancel size={18} /> Deactivate
                                        </button>
                                    ) : (
                                        <button className="btn-solid green" onClick={() => onActivate(user.userId)} disabled={user.role === "Admin"}>
                                            <IconUserCheck size={18} /> Activate
                                        </button>
                                    )}
                                    <button className="btn-secondary" disabled={user.role === "Admin"}>
                                        <IconTrash size={18} /> Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>
    );
}
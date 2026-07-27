import LeftLoginContainer from '../../components/containers/left_login_container/LeftLoginContainer';
import './login.css';
import { IconLock, IconEye, IconEyeOff, IconX, IconCheck } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import cict from '../../assets/univlogo/cict_logo.svg';
import { useNavigate } from 'react-router';
import { showCircleLoadingDialog } from '../../components/dialogs/circle_loading_dialog/CircleLoadingDialogService';
import { toast } from '../../components/toast/ToastService';
import { logoutUser } from '../../../supadb';

export default function ResetPassword(){
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);

    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');
    
    const [eightCharacter, setEightCharacter] = useState<boolean>(false);
    const [upperLowerCase, setUpperLowerCase] = useState<boolean>(false);
    const [number, setNumber] = useState<boolean>(false);
    const [specialCharacter, setSpecialCharacter] = useState<boolean>(false);
    
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    }

    const navigate = useNavigate();

   useEffect(() => {
        const hash = window.location.hash.substring(1); 
        const params = new URLSearchParams(hash);

        const extractedAccessToken = params.get('access_token');
        const extractedRefreshToken = params.get('refresh_token');
        const type = params.get('type');

        if (type === 'recovery' && extractedAccessToken && extractedRefreshToken) {
            setAccessToken(extractedAccessToken);
            setRefreshToken(extractedRefreshToken);
            console.log("Access Token:", extractedAccessToken);
            console.log("Refresh Token:", extractedRefreshToken);
        } else {
            toast.error("Invalid or expired password reset link.");
            navigate('/login');
        }
    }, [navigate]);

    function handlePasswordChange(e : React.ChangeEvent<HTMLInputElement>){
        const temp: string = e.target.value;
        setPassword("");

        setEightCharacter(temp.length >= 8);
        setUpperLowerCase(/(?=.*[a-z])(?=.*[A-Z])/.test(temp));
        setNumber(/\d/.test(temp));
        setSpecialCharacter(/[^a-zA-Z0-9]/.test(temp));

        if(temp.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])/.test(temp) && /\d/.test(temp) && /[^a-zA-Z0-9]/.test(temp)){
            setPassword(temp);
        }else{
            setPassword('');
        }
    }

    function handleConfirmPasswordChange(e : React.ChangeEvent<HTMLInputElement>){
        const temp: string = e.target.value;
        setConfirmPassword("");

        if(!temp.trim()){
            setConfirmPasswordError("Confirm password is required.");
        }else if(temp !== password){
            setConfirmPasswordError("Passwords do not match.");
        }else{
            setConfirmPasswordError("");
            setConfirmPassword(temp);
        }
    }

    async function resetPassword(e: React.FormEvent) {
        e.preventDefault();

        const closeLoading = showCircleLoadingDialog();

        const formData = new FormData();
        formData.append("password", password);
        formData.append("accessToken", accessToken || '');
        formData.append("refreshToken", refreshToken || '');

        try {
            const response = await fetch("https://test-ppmp.onrender.com/api/auth/reset_password/", {
                method: "PUT",
                body: formData
            });

            const responseData = await response.json();

            if (response.ok || responseData.status === "success") {
                toast.success("Password reset successfully! Please log in with your new password.");
                try {
                    await logoutUser();
                } catch (logoutErr) {
                    console.log("Cleanup normal:", logoutErr);
                }

                navigate("/login");
            } else {
                toast.error(responseData.message || "Failed to reset password. Please try again.");
            }
        } catch (error) {
            toast.error("Network error. Please try again later.");
            console.error("Error resetting password:", error);
        } finally {
            closeLoading();
        }
    }

    return (
        <main className="left-right-container">
            <LeftLoginContainer />
            <form action="">
                <img src={cict} alt="CICT Logo" />
                <h2>Reset Password</h2>
                <p>Secure your account by resetting your password</p>
                <div className="field-group">
                    <label htmlFor="password">New Password</label>
                    <div className="input-field">
                        <IconLock />
                        <input type={showPassword ? "text" : "password"} id="password" name="password" placeholder='Password' required onChange={handlePasswordChange} />
                        <button type="button" className="toggle-password cursor-pointer" onClick={togglePasswordVisibility}>
                            {showPassword ? <IconEyeOff className="eye-off-icon" /> : <IconEye className="eye-icon" />}
                        </button>
                    </div>
                </div>
                <div className="field-group">
                    <label htmlFor="confirm-password">Confirm New Password</label>
                    <div className="input-field">
                        <IconLock />
                        <input type={showNewPassword ? "text" : "password"} id="confirm-password" name="confirm-password" placeholder='Confirm Password' required onChange={handleConfirmPasswordChange} />
                        <button type="button" className="toggle-password cursor-pointer" onClick={toggleNewPasswordVisibility}>
                            {showNewPassword ? <IconEyeOff className="eye-off-icon" /> : <IconEye className="eye-icon" />}
                        </button>
                    </div>
                    <p id='confirmPasswordError' className='error-message'>{confirmPasswordError}</p>
                </div>
                <ul>
                    <li className={eightCharacter ? 'valid' : 'error'}>
                        {eightCharacter ? <IconCheck size={20} /> : <IconX size={20} />} Atleast 8 characters
                    </li>
                    <li className={upperLowerCase ? 'valid' : 'error'}>
                        {upperLowerCase ? <IconCheck size={20} /> : <IconX size={20} />} Include uppercase and lowercase letters
                    </li>
                    <li className={number ? 'valid' : 'error'}>
                        {number ? <IconCheck size={20} /> : <IconX size={20} />} Contain at least one number
                    </li>
                    <li className={specialCharacter ? 'valid' : 'error'}>
                        {specialCharacter ? <IconCheck size={20} /> : <IconX size={20} />} Include at least one special character
                    </li>
                </ul>
                {confirmPassword && !confirmPasswordError && eightCharacter && upperLowerCase && number && specialCharacter && password === confirmPassword ? (
                    <button type="submit" className='btn-primary-rd-shadow' onClick={resetPassword}>Reset Password</button>
                ) : (
                    <button type="submit" className='btn-primary-rd-shadow' disabled>Reset Password</button>
                )}
            </form>
        </main>
    );
}
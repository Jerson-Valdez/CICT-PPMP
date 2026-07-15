import LeftLoginContainer from '../../components/containers/left_login_container/LeftLoginContainer';
import './login.css';
import { IconLock } from '@tabler/icons-react';
import { IconEye } from '@tabler/icons-react';
import { IconEyeOff } from '@tabler/icons-react';
import { useState } from 'react';
import { IconX } from '@tabler/icons-react';
import { IconCheck } from '@tabler/icons-react';

export default function ResetPassword(){
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

    function handlePasswordChange(e : React.ChangeEvent<HTMLInputElement>){
        const temp: string = e.target.value;
        setPassword(temp);

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
        setConfirmPassword(temp);

        if(!temp.trim()){
            setConfirmPasswordError("Confirm password is required.");
        }else if(temp !== password){
            setConfirmPasswordError("Passwords do not match.");
        }else{
            setConfirmPasswordError("");
        }
    }

    return (
        <main className="login-page-container">
            <div className="left-right-container">
                <LeftLoginContainer />
                <div className='form-container reset-password'>
                    <form action="">
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
                        {confirmPassword && !confirmPasswordError && eightCharacter && upperLowerCase && number && specialCharacter ? (
                            <button type="submit" className='submit-button'>Reset Password</button>
                        ) : (
                            <button type="submit" className='submit-button' disabled>Reset Password</button>
                        )}
                    </form>
                </div>
            </div>
        </main>
    );
}
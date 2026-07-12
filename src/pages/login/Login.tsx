import './login.css';
import { IconUser } from '@tabler/icons-react';
import { IconLock } from '@tabler/icons-react';
import { IconEye } from '@tabler/icons-react';
import { IconEyeOff } from '@tabler/icons-react';
import { IconArrowNarrowRight } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import LeftLoginContainer from '../../components/containers/left_login_container/LeftLoginContainer';
import { toast } from '../../components/toast/ToastService.js';
import { supabase } from '../../../supadb';

export default function Login(){
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');

    function handleEmailChange(e : React.ChangeEvent<HTMLInputElement>){
        const temp: string = e.target.value;
        setEmail(temp);

        if(!temp.trim()){
            setEmailError("Email address is required.");
        }else if(!temp.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)){
            setEmailError("Please enter a valid email address.");
        }else{
            setEmailError("");
        }
    }

    function handlePasswordChange(e : React.ChangeEvent<HTMLInputElement>){
        const temp: string = e.target.value;
        setPassword(temp);

        if(!temp.trim()){
            setPasswordError("Password is required.");
        }else{
            setPasswordError("");
        }
    }

    async function login(){
        if(!email.trim() && !password.trim()){
            setEmailError("Email address is required.");
            setPasswordError("Password is required.");
            return;
        }

        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        const response = await fetch("http://127.0.0.1:8000/api/auth/login/", {
            method: "POST",
            body: formData
        });
        const responseData = await response.json();
        console.log(responseData);
        if(responseData.status === "success"){
            await supabase.auth.setSession({
                access_token: responseData.access_token,
                refresh_token: responseData.refresh_token,
            });
            toast.success("Logged in successfully!");
            navigate("/dashboard");
        }else if(responseData.status === "error"){
            toast.error("Login failed. Please check your credentials.");
        }
  }

    return (
        <main className="login-page-container">
            <div className="left-right-container">
                <LeftLoginContainer />
                <div className='form-container'>
                    <form action="">
                        <div className="field-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-field">
                                <IconUser />
                                <input type="email" id="email" name="email" value={email} placeholder='Email' required onChange={handleEmailChange} />
                            </div>
                            <p id='emailError' className='error-message'>{emailError}</p>
                        </div>
                        <div className="field-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-field">
                                <IconLock />
                                <input type={showPassword ? "text" : "password"} id="password" name="password" value={password} onChange={handlePasswordChange} placeholder='Password' required />
                                <button type="button" className="toggle-password cursor-pointer" onClick={togglePasswordVisibility}>
                                    {showPassword ? <IconEyeOff className="eye-off-icon" /> : <IconEye className="eye-icon" />}
                                </button>
                            </div>
                            <p id='passwordError' className='error-message'>{passwordError}</p>
                        </div>
                        <Link to="/forgot-password" className='forgot-password'>Forgot Password?</Link>
                        <button type="submit" className='btn-primary-rd-shadow' onClick={(e) => { e.preventDefault(); login(); }}>
                            <strong>Login</strong>
                            <IconArrowNarrowRight />
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
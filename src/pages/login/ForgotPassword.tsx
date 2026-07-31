import { Link } from 'react-router';
import LeftLoginContainer from '../../components/containers/left_login_container/LeftLoginContainer';
import './login.css';
import { IconUser } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import cict from '../../assets/univlogo/cict_logo.svg';
import { showCircleLoadingDialog } from '../../components/dialogs/circle_loading_dialog/CircleLoadingDialogService';
import { toast } from '../../components/toast/ToastService';

export default function ForgotPassword(){
    const [email, setEmail] = useState<string>('')
    const [emailError, setEmailError] = useState<string>('');
    const [timeLeft, setTimeLeft] = useState<number>(0);

    useEffect(() => {
        const buttonCoolDown = localStorage.getItem("buttonCoolDown");

        if(buttonCoolDown){
            const remaining = Math.ceil(Number(buttonCoolDown) - Date.now());
            if(remaining > 0){
                setTimeLeft(remaining);
            }else{
                localStorage.removeItem("buttonCoolDown");
                setTimeLeft(0);
            }
        }
    },[])

    useEffect(()=>{
        if(timeLeft <= 0){
            return;
        }

        const interval = setInterval(()=>{
            setTimeLeft(prevTime => {
                if(prevTime <= 1000){
                    clearInterval(interval);
                    localStorage.removeItem("buttonCoolDown");
                    return 0;
                }
                return prevTime - 1000;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft]);

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

    async function sendResetLink(){
        if(!email.trim()){
            if (!email.trim()) setEmailError("Email address is required.");
            return;
        }

        const closeLoading = showCircleLoadingDialog();

        try {
            const formData = new FormData();
            formData.append("email", email);

            const response = await fetch("https://test-ppmp.onrender.com/api/auth/forgot_password/", {
                method: "POST",
                body: formData
            });

            const responseData = await response.json();
            
            if(responseData.status === "success"){
                toast.success("Password reset link sent successfully to your email!");
                const endTime = Date.now() + 60 * 1000;
                localStorage.setItem("buttonCoolDown", endTime.toString());
                setTimeLeft(60 * 1000); 
            } else {
                toast.error(responseData.message || "Failed to send password reset link.");
            }
        } catch (error) {
            console.error("Error sending password reset link:", error);
            toast.error("Network error. Please try again later.");
        } finally {
            closeLoading();
        }
    }

    return (
        <main className="left-right-container">
            <LeftLoginContainer />
            <form action="">
                <img src={cict} alt="CICT Logo" />
                <h2>Forgot Password</h2>
                <p>Please enter your email address you’d like your password reset information sent to</p>
                <div className="field-group">
                    <label htmlFor="email">Email Address</label>
                    <div className="input-field">
                        <IconUser />
                        <input type="email" id="email" name="email" value={email} placeholder='Email' required onChange={handleEmailChange} />
                    </div>
                    <p id='emailError' className='error-message'>{emailError}</p>
                </div>
                {timeLeft > 0 ? (
                    <button className='btn-primary-rd-shadow' disabled>
                        <strong>Send Reset Link ({Math.ceil(timeLeft / 1000)}s)</strong>
                    </button>
                ) : (
                    <button className='btn-primary-rd-shadow' onClick={(e) => {e.preventDefault(); sendResetLink()}}>
                        <strong>Send Reset Link</strong>
                    </button>
                )}
                <Link to="/login" className='btn-secondary'>Back to Login</Link>
            </form>
        </main>
    );
}
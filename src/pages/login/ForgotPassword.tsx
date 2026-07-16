import { Link } from 'react-router';
import LeftLoginContainer from '../../components/containers/left_login_container/LeftLoginContainer';
import './login.css';
import { IconUser } from '@tabler/icons-react';
import { useState } from 'react';
import cict from '../../assets/univlogo/cict_logo.svg';

export default function ForgotPassword(){
    const [email, setEmail] = useState<string>('')
    const [emailError, setEmailError] = useState<string>('');

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
                <button type="submit" className='btn-primary-rd-shadow'>
                    <strong>Send Reset Link</strong>
                </button>
                <Link to="/login" className='btn-secondary'>Back to Login</Link>
            </form>
        </main>
    );
}
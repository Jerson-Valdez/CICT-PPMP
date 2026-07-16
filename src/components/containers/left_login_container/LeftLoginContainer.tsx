import './left-login-container.css';
import arrow_secondary from '../../../assets/designs/arrow_secondary.svg';

export default function LeftLoginContainer(){
    return (
        <div className='left-side'>
            <div className='hero-text'>
                <h1><span>CICT - </span><span>PPMP</span></h1>
                <img src={arrow_secondary} alt="Arrow Icon" />
                <h1>Management System</h1>
            <p>
                Streamline your Project Procurement Management Plan with 
                intelligent budget optimization, automated PR generation, 
                and real-time tracking.
            </p>
            </div>
        </div>
    );
}
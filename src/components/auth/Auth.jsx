import { useState } from "react";
import {supabase} from '../../supabaseClient';
import '../../styles/auth.css';

function Auth() {
    const [isSignUp,setIsSignUp]= useState(false);//toggle to swap login/signup
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    
    const handleAuth = async(e) => {
        e.preventDefault();//stop from submission page-reload
        setLoading(true);
        setEmail(null);
        setMessage(null);
        try{
            if(isSignUp){
                const { data ,error: signUpError} = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            //pass custom username picked up by db profile trigger
                            username: username ||email.split('@')[0],
                            
                        }
                    }
                });
                if (signUpError) throw signUpError;
                console.log('New user created:', data.user?.id);
                setMessage('Registration successful! Check your email for verification, or log in.');

            }else{
                //sign in flow
                const {error: signInError} = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if(signInError) throw signInError;

            }
        }catch(err){
            setError(err.message || 'An error occurred during authentication.' )
        }finally {
            setLoading(false);
        }
    };
    return(
        <div className="auth-page-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>FocusFlow</h2>
                    <p>{isSignUp ? 'Create your account' : 'Sign in to sync your progress'}</p>
                </div>
                <div className="auth-tabs">
                    <button type="button" className={`auth-tab-btn ${!isSignUp ? 'active' : ''}`}
                    onClick={() => {
                        setIsSignUp(false);
                        setError(null);
                        setMessage(null);
                    }}>
                        Sign In
                    </button>
                    <button
                        type="button"
                        className={`auth-tab-btn ${isSignUp ? 'active' : ''}`}
                        onClick={() => {
                        setIsSignUp(true);
                        setError(null);
                        setMessage(null);
                        }}
                    >
                        Sign Up
                    </button>
                </div>
                <form onSubmit={handleAuth} className="auth-form">
                    {error && <div className="auth-error-banner">{error}</div>}
                    {message && <div className="auth-success-banner">{message}</div>}
                    {isSignUp && (
                        <div className="auth-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="auth-input"
                            required={isSignUp}
                        />
                        </div>
                    )}
                    <div className="auth-group">
                        <label htmlFor="email">Email</label>
                        <input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="auth-input"
                        required
                        />
                    </div>
                    <div className="auth-group">
                        <label htmlFor="password">Password</label>
                        <input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="auth-input"
                        required
                        />
                    </div>
                    <button type="submit" disabled={loading} className="auth-btn">
                        {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    )
}
export default Auth;
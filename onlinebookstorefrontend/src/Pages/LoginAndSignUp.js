import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from "../Redux/slices/authSlice";
import '../Pages/LoginAndSignUp.css';

const LoginAndSignUp = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { error, loading } = useSelector((state) => state.auth);

    const [loginData, setLoginData] = useState({ emailId: '', userPassword: '' });
    const [signupData, setSignupData] = useState({
        fullName: '',
        emailId: '',
        phoneNumber: '',
        userPassword: '',
        securityQuestion: "What is your pet's name?",
        securityAnswer: ''
    });

    const [isLogin, setIsLogin] = useState(true);

    // Handle Login
    const handleLogin = (e) => {
        e.preventDefault();

        if (!loginData.emailId || !loginData.userPassword) {
            alert("❌ Please fill in all the required fields.");
            return;
        }

        dispatch(loginUser(loginData))
            .unwrap()
            .then((response) => {
                if (response.token && response.role) {
                    localStorage.setItem("token", response.token);
                    localStorage.setItem("role", response.role);

                    alert("✅ Login successful!");
                    navigate(response.role === "Admin" ? "/admin-dashboard" : "/home-page");
                } else {
                    alert("❌ Role or token missing in response.");
                }
            })
            .catch(() => {
                alert("❌ Invalid credentials. Please try again.");
            });
    };


    // Handle Signup
    const handleSignup = (e) => {
        e.preventDefault();
        if (!signupData.fullName || !signupData.emailId || !signupData.phoneNumber || !signupData.userPassword || !signupData.securityAnswer) {
            alert("❌ Please fill in all the required fields.");
            return;
        }
        dispatch(registerUser(signupData))
            .unwrap()
            .then(() => {
                alert("✅ Signup successful! Please login.");
                setIsLogin(true); // Switch to login tab
                setSignupData({ fullName: '', emailId: '', phoneNumber: '', userPassword: '', securityQuestion: "What is your pet's name?", securityAnswer: '' });
            })
            .catch(() => {
                alert("❌ Signup failed. Please try again.");
            });
    };

    return (
        <div className="loginsignupbody">
            <div className="login-wrap">
                <div className="login-html">
                    <input id="tab-1" type="radio" name="tab" className="sign-in" checked={isLogin} onChange={() => setIsLogin(true)} />
                    <label htmlFor="tab-1" className="tab">Log In</label>
                    <input id="tab-2" type="radio" name="tab" className="sign-up" checked={!isLogin} onChange={() => setIsLogin(false)} />
                    <label htmlFor="tab-2" className="tab">Sign Up</label>
                    <div className="login-form">
                        {isLogin ? (
                            <form className="sign-in-htm" onSubmit={handleLogin}>
                                <div className="group">
                                    <label htmlFor="email" className="label">Email Id</label>
                                    <input id="email" type="email" className="input" value={loginData.emailId} onChange={(e) => setLoginData({ ...loginData, emailId: e.target.value })} required />
                                </div>
                                <div className="group">
                                    <label htmlFor="password" className="label">Password</label>
                                    <input id="password" type="password" className="input" value={loginData.userPassword} onChange={(e) => setLoginData({ ...loginData, userPassword: e.target.value })} required />
                                </div>
                                <div className="group">
                                    <input type="submit" className="button" value="Sign In" disabled={loading} />
                                </div>
                                {error && <p className="error-message">{error}</p>}
                                <div className="foot-lnk">
                                    <Link to="/forgot-password" style={{ color: "grey" }}>Forgot Password?</Link>
                                </div>
                            </form>
                        ) : (
                            <form className="sign-up-htm" onSubmit={handleSignup}>
                                <div className="group">
                                    <label htmlFor="fullName" className="label">Full Name</label>
                                    <input id="fullName" type="text" className="input" value={signupData.fullName} onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })} required />
                                </div>
                                <div className="group">
                                    <label htmlFor="email" className="label">Email Address</label>
                                    <input id="email" type="email" className="input" value={signupData.emailId} onChange={(e) => setSignupData({ ...signupData, emailId: e.target.value })} required />
                                </div>
                                <div className="group">
                                    <label htmlFor="phoneNumber" className="label">Phone Number</label>
                                    <input id="phoneNumber" type="text" className="input" maxLength="10" value={signupData.phoneNumber} onChange={(e) => setSignupData({ ...signupData, phoneNumber: e.target.value })} required />
                                </div>
                                <div className="group">
                                    <label htmlFor="password" className="label">Password</label>
                                    <input id="password" type="password" className="input" value={signupData.userPassword} onChange={(e) => setSignupData({ ...signupData, userPassword: e.target.value })} required />
                                </div>
                                <div className="group">
                                    <label htmlFor="securityQuestion" className="label">Security Question</label>
                                    <select
                                        id="securityQuestion"
                                        className="input security-select"
                                        value={signupData.securityQuestion}
                                        onChange={(e) => setSignupData({ ...signupData, securityQuestion: e.target.value })}
                                        required
                                    >
                                        <option value="">Select a Security Question</option>
                                        <option value="What is your pet's name?">What is your pet's name?</option>
                                        <option value="What is your favorite book?">What is your favorite book?</option>
                                        <option value="What city were you born in?">What city were you born in?</option>
                                    </select>
                                </div>
                                <div className="group">
                                    <label htmlFor="securityAnswer" className="label">Answer</label>
                                    <input id="securityAnswer" type="text" className="input" value={signupData.securityAnswer} onChange={(e) => setSignupData({ ...signupData, securityAnswer: e.target.value })} required />
                                </div>
                                <div className="group">
                                    <input type="submit" className="button" value="Sign Up" disabled={loading} />
                                </div>
                                {error && <p className="error-message">{error}</p>}
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginAndSignUp;
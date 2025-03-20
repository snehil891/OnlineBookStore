import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSecurityQuestion, resetPassword } from "../Redux/slices/authSlice";
import "../Pages/ForgotPassword.css";

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const { securityQuestion, error } = useSelector((state) => state.auth);

    const [email, setEmail] = useState("");
    const [securityAnswer, setSecurityAnswer] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [step, setStep] = useState(1);

    const fetchSecurityQuestion = () => {
        dispatch(getSecurityQuestion(email))
            .unwrap()
            .then(() => setStep(2))
            .catch(() => alert("User not found"));
    };

    const handlePasswordReset = () => {
        dispatch(resetPassword({ emailId: email, securityAnswer, newPassword }))
            .unwrap()
            .then(() => {
                alert("Password reset successful!");
                window.location.href = "/";
            })
            .catch(() => alert("Incorrect security answer"));
    };

    return (
        <div className="forgot-password">
            <div className="forgot-password-wrap">
                {step === 1 ? (
                    <>
                        <h2>Forgot Password</h2>
                        <div className="forgot-password-form">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button onClick={fetchSecurityQuestion}>Next</button>
                    </>
                ) : (
                    <>
                        <h2>Security Question</h2>
                        <p>{securityQuestion}</p>
                        <input
                            type="text"
                            placeholder="Enter Answer"
                            value={securityAnswer}
                            onChange={(e) => setSecurityAnswer(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Enter New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <button onClick={handlePasswordReset}>Reset Password</button>
                    </>
                )}
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export default ForgotPassword;

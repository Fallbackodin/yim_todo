import React, { FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "@firebase/util";
import { toast } from "react-toastify";
import { auth } from "../Firebase";

const Register: FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
    };

    const handleSignInRedirect = () => {
        navigate("/");
    };

    const handleRegister = async () => {
        try {
            if (password !== confirmPassword) {
                throw "Invalid Confirm Password";
            }

            await createUserWithEmailAndPassword(auth, email, password);
            navigate("/Contact");
        } catch (err: unknown) {
            if (err instanceof FirebaseError) {
                if (err.code === "auth/invalid-email") {
                    toast.error("Please give a valid email", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                } else if (err.code === "auth/weak-password") {
                    toast.error("Password must be at least 6 characters", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                } else if (err.code === "auth/email-already-in-use") {
                    toast.error(
                        "The email is already being used. Please use a different email",
                        {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        }
                    );
                }
            } else if (typeof err === "string") {
                if (err === "Invalid Confirm Password") {
                    toast.error(
                        "Please make sure that both passwords are the same",
                        {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        }
                    );
                }
            } else {
                toast.error(
                    "There was a problem with creating a new account. Please try again later",
                    {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    }
                );
            }
        }
    };

    return (
        <div>
            <h2>Email</h2>
            <input type="email" value={email} onChange={handleEmail} />
            <h2>Password</h2>
            <input type="password" value={password} onChange={handlePassword} />
            <h2>Confirm Password</h2>
            <input
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPassword}
            />
            <div>
                <button onClick={handleRegister}>Register</button>
            </div>
            <div>
                <button onClick={handleSignInRedirect}>
                    Go back to Sign In
                </button>
            </div>
        </div>
    );
};

export default Register;

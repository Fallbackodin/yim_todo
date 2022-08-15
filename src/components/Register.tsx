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
        <div className="w-screen h-screen flex justify-center items-center text-white bg-gradient-to-b from-fuchsia-400 to-fuchsia-700">
            <div className="w-1/2 h-3/4 flex flex-col justify-around items-center rounded-2xl bg-[#301934]">
                <div className="w-3/4">
                    <h1 className="text-center text-4xl font-extrabold">
                        Todo Title
                    </h1>
                    <div className="mt-5 w-3/4 flex flex-col justify-center items-center mx-auto px-auto">
                        <div className="w-full px-auto mx-auto">
                            <h2 className="text-left ml-1 mb-1 text-lg font-bold">
                                Email
                            </h2>
                            <input
                                type="email"
                                value={email}
                                onChange={handleEmail}
                                className="w-full border-solid border-2 border-[#301934] rounded-2xl px-2 py-1 bg-[#502b57]"
                            />
                        </div>
                    </div>
                    <div className="mt-5 w-3/4 flex flex-col justify-center items-center mx-auto px-auto">
                        <div className="w-full px-auto mx-auto">
                            <h2 className="text-left ml-1 mb-1 text-lg font-bold">
                                Password
                            </h2>
                            <input
                                type="password"
                                value={password}
                                onChange={handlePassword}
                                className="w-full border-solid border-2 border-[#301934] rounded-2xl px-2 py-1 bg-[#502b57]"
                            />
                        </div>
                    </div>
                    <div className="mt-5 w-3/4 flex flex-col justify-center items-center mx-auto px-auto">
                        <div className="w-full px-auto mx-auto">
                            <h2 className="text-left ml-1 mb-1 text-lg font-bold">
                                Confirm Password
                            </h2>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={handleConfirmPassword}
                                className="w-full border-solid border-2 border-[#301934] rounded-2xl px-2 py-1 bg-[#502b57]"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-center">
                    <button
                        className="py-2 px-10 bg-fuchsia-900 rounded-2xl"
                        onClick={handleRegister}
                    >
                        Register
                    </button>
                    <button
                        className="ml-5 py-2 px-10 bg-[#502b57] rounded-2xl"
                        onClick={handleSignInRedirect}
                    >
                        Go back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;

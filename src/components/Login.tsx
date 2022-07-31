import React, { FC, useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Login: FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/Contact");
            }
        });
    }, []);

    const handleSignIn = async () => {
        try {
            const emailRegex = new RegExp(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );

            if (email.match(emailRegex)) {
            }
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/Contact");
        } catch (err) {
            toast.error("Login is incorrect. Please try again.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    const handleRegisterRedirect = () => {
        navigate("/Register");
    };

    useEffect(() => {
        console.log(email);
    }, [email]);

    useEffect(() => {
        console.log(password);
    }, [password]);

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
                </div>
                <div className="flex justify-center">
                    <button className="py-2 px-10 bg-fuchsia-700 rounded-2xl">
                        Login
                    </button>
                    <button
                        className="ml-5 py-2 px-10 bg-[#502b57] rounded-2xl"
                        onClick={handleRegisterRedirect}
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>
        // <h1>Login Yo</h1>
        // <h2>Email</h2>
        // <input
        //     type="email"
        //     value={email}
        //     onChange={handleEmail}
        //     className="border-solid border-2 border-black"
        // />
        // <h2>Password</h2>
        // <input
        //     type="password"
        //     value={password}
        //     onChange={handlePassword}
        //     className="border-solid border-2 border-black"
        // />
        // <div>
        //     <button onClick={handleSignIn}>Sign In</button>
        // </div>
        // <p onClick={handleRegisterRedirect}>Create an account</p>
    );
};

export default Login;

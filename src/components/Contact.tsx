import React, { FC, useState, useEffect } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../Firebase";
import { set, ref, onValue, remove, update } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { BsDownload } from "react-icons/bs";
import { uid } from "uid";

interface Todo {
    todo: string;
    uid: string;
    complete: boolean;
}

const Contact: FC = () => {
    const [newTask, setNewTask] = useState("");
    const [todos, setTodos] = useState<Todo[]>([]);
    const [updateTodo, setUpdateTodo] = useState<string>();
    const [userEmail, setUserEmail] = useState("");
    const [createModal, setCreateModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteTodo, setDeleteTodo] = useState<Todo>();
    const [updateModal, setUpdateModal] = useState<boolean[]>([]);
    const navigate = useNavigate();

    const handleNewTask = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewTask(e.target.value);
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate("/");
        } catch {
            toast.error("Failed to sign out. Please Try Again.", {
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

    const handlePDFDownload = () => {
        const doc = new jsPDF();
        const todoFormatPDF = [];

        for (const todo of todos) {
            let temp = [todo.complete ? "complete" : "in-progress", todo.todo];
            todoFormatPDF.push(temp);
        }

        console.log(todoFormatPDF);
        autoTable(doc, {
            head: [["Status", "Todo"]],
            body: todoFormatPDF,
        });
        doc.save("todo.pdf");
    };

    const writeToDb = () => {
        console.log("I am clicked");
        try {
            if (newTask === "") {
                throw "No Task";
            }

            const taskUid = uid();
            set(ref(db, `/${auth?.currentUser?.uid}/${taskUid}`), {
                todo: newTask,
                uid: taskUid,
                complete: false,
            });
            setCreateModal(false);
            toast.success("Todo successfully create!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (err: unknown) {
            console.log("here error");
            if (typeof err === "string") {
                console.log("I was here");
                if (err === "No Task") {
                    toast.error("Please give a todo to create", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            } else {
                toast.error(
                    "There was problem creating a new todo, please try again later",
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

    const handleDelete = () => {
        try {
            remove(ref(db, `/${auth?.currentUser?.uid}/${deleteTodo?.uid}`));
            setDeleteModal(false);
            toast.success("Todo successfully deleted!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch {
            setDeleteModal(false);
            toast.error(
                "There was problem deleting the todo, please try again later",
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
    };

    const handleDeleteButton = (todo: Todo) => {
        setDeleteModal(true);
        setDeleteTodo(todo);
    };

    const handleUpdateTodo = (todoUid: string) => {
        update(ref(db, `/${auth?.currentUser?.uid}/${todoUid}`), {
            todo: updateTodo,
        });
    };

    const handleUpdateModal = (index: number) => {
        const tempArr = new Array(todos.length).fill(false);
        tempArr[index] = !tempArr[index];
        setUpdateModal(tempArr);
        setUpdateTodo(todos[index].todo);
    };

    const handleUpdateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUpdateTodo(e.target.value);
    };

    const renderTodos = () => {
        return todos.map((todo, index) => {
            return (
                <tr className="h-[3rem] min-h-[5rem] border-t-2 border-solid border-[#72548096]">
                    <td className="">
                        <input type="checkbox" checked={todo?.complete} />
                    </td>
                    <td className="">
                        <button
                            className="py-1 px-4 mr-1 text-xl bg-fuchsia-900 rounded-2xl"
                            onClick={() => handleUpdateModal(index)}
                        >
                            Edit
                        </button>
                        <button
                            className="w-auto py-1 px-4 text-xl ml-1 bg-[#502b57] rounded-2xl"
                            onClick={() => {
                                handleDeleteButton(todo);
                            }}
                        >
                            Delete
                        </button>
                    </td>
                    {updateModal[index] ? (
                        <div>
                            <button
                                onClick={() => handleUpdateTodo(todo.uid)}
                                className="mx-1 py-1 px-2 rounded-2xl bg-fuchsia-800"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() =>
                                    setUpdateModal(
                                        new Array(todos.length).fill(false)
                                    )
                                }
                                className="mx-1 py-1 px-2 rounded-2xl bg-[#9f55ad]"
                            >
                                Cancel
                            </button>
                            <input
                                type="text"
                                value={updateTodo}
                                onChange={handleUpdateInput}
                                className="mt-2 py-1 px-2 border-[#502b57] rounded-2xl bg-[#502b57]"
                            />
                        </div>
                    ) : (
                        <td className="">{todo.todo}</td>
                    )}
                </tr>
            );
        });
    };

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate("/");
            }

            console.log(user);
            console.log(user?.email);
            setUserEmail(user?.email!);

            onValue(ref(db, `/${auth?.currentUser?.uid}`), (snapshot) => {
                const data: Todo[] = snapshot.val();

                // This needs to be here because the useEffect seems to fire off twice so we add each todo twice. In order to fix this, just set the todo array to empty before we add.
                setTodos([]);

                if (data) {
                    Object.values(data).map((todo) => {
                        setTodos((prevTodos) => [...prevTodos, todo]);
                    });
                }
            });
        });
    }, []);

    useEffect(() => {
        setUpdateModal(new Array(todos.length).fill(false));
    }, [todos]);

    useEffect(() => {
        console.log(todos);
    }, [todos]);

    return (
        <div className="w-screen h-screen relative flex justify-center items-center text-white bg-gradient-to-b from-fuchsia-400 to-fuchsia-700">
            <div className="w-4/5 h-3/4 rounded-2xl bg-[#301934] overflow-y-auto">
                <div className="w-full px-3 py-2 flex justify-between sticky">
                    <button
                        className="py-1 px-2 text-lg mr-1 bg-[#502b57] rounded-2xl"
                        onClick={handleSignOut}
                    >
                        Sign Out
                    </button>
                    <h1 className="text-4xl font-">Yim Todo</h1>
                    <h2 className="text-lg">{userEmail}</h2>
                </div>
                <div className="flex justify-between px-3 py-2">
                    <button
                        className="py-1 px-4 mr-1 text-xl bg-fuchsia-900 rounded-2xl"
                        onClick={() => setCreateModal(true)}
                    >
                        Create Todo
                    </button>
                </div>
                <table className="w-full mt-5 table-fixed border-collapse">
                    <thead className="text-center">
                        <tr className="relative">
                            <th className="w-[10%]">Status</th>
                            <th className="w-[10%]">Actions</th>
                            <th className="w-[40%]">Todo</th>
                            <th className="w-[5%]" onClick={handlePDFDownload}>
                                <BsDownload className="w-20 cursor-pointer" />
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-center">{renderTodos()}</tbody>
                </table>
            </div>
            {createModal && (
                <div className="w-4/5 h-3/4 absolute flex justify-center items-center rounded-2xl bg-black/75">
                    <div className="w-3/4 h-3/4 flex flex-col justify-center items-center rounded-2xl bg-[#301934]">
                        <h1 className="mb-5 text-3xl font-extrabold">
                            Create Todo
                        </h1>
                        <textarea
                            value={newTask}
                            onChange={handleNewTask}
                            className="w-1/3 h-1/3 my-5 py-1 px-2 border-[#502b57] rounded-2xl bg-[#502b57]"
                        />
                        <div className="w-1/4 flex justify-between">
                            <button
                                onClick={writeToDb}
                                className="py-1 px-4 mr-1 text-xl bg-fuchsia-900 rounded-2xl"
                            >
                                Create
                            </button>
                            <button
                                className="w-full py-1 px-4 text-xl ml-1 bg-[#502b57] rounded-2xl"
                                onClick={() => setCreateModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {deleteModal && (
                <div className="w-4/5 h-3/4 absolute flex justify-center items-center rounded-2xl bg-black/75">
                    <div className="w-3/4 h-3/4 flex flex-col justify-center items-center rounded-2xl bg-[#301934]">
                        <h1 className="mb-5 text-3xl font-extrabold">
                            Delete Todo
                        </h1>
                        <p className="my-10">{deleteTodo?.todo}</p>
                        <div className="w-1/4 flex justify-between">
                            <button
                                onClick={handleDelete}
                                className="py-1 px-4 mr-1 text-xl bg-fuchsia-900 rounded-2xl"
                            >
                                Delete
                            </button>
                            <button
                                className="w-full py-1 px-4 text-xl ml-1 bg-[#502b57] rounded-2xl"
                                onClick={() => setDeleteModal(false)}
                            >
                                Go back
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

        // <div>
        //     Contact is the main page
        //     <button onClick={handleSignOut}>Sign Out</button>
        //     <div>
        //         <h1>New TasK</h1>
        //         <input type="text" value={newTask} onChange={handleNewTask} />
        //         <button onClick={writeToDb}>Add</button>
        //         <h1>Update TasK</h1>
        //         <input
        //             type="text"
        //             value={updateTodo?.todo}
        //             onChange={handleGetUpdateText}
        //         />
        //         <button onClick={handleUpdateTodo}>Update</button>
        //         {renderTodos()}
        //     </div>
        // </div>
    );
};

export default Contact;

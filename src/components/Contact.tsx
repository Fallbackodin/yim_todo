import React, { FC, useState, useEffect } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../Firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { set, ref, onValue, remove, update } from "firebase/database";
import { uid } from "uid";

interface Todo {
    todo: string;
    uid: string;
    check?: boolean;
}

const Contact: FC = () => {
    const [newTask, setNewTask] = useState("");
    const [todos, setTodos] = useState<Todo[]>([]);
    const [updateTodo, setUpdateTodo] = useState<Todo>();
    const navigate = useNavigate();

    const handleNewTask = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const writeToDb = () => {
        console.log("I am clicked");
        const taskUid = uid();
        try {
            set(ref(db, `/${auth?.currentUser?.uid}/${taskUid}`), {
                todo: newTask,
                uid: taskUid,
            });
        } catch (err: any) {
            console.log(err);
        }
    };

    const handleDelete = (uid: string) => {
        remove(ref(db, `/${auth?.currentUser?.uid}/${uid}`));
    };

    const handleSetUpdateTodo = (todo: Todo) => {
        setUpdateTodo(todo);
    };

    const handleUpdateTodo = () => {
        update(ref(db, `/${auth?.currentUser?.uid}/${updateTodo?.uid}`), {
            todo: updateTodo?.todo,
        });
    };

    const handleGetUpdateText = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUpdateTodo({ ...updateTodo!, todo: e.target.value });
    };

    const renderTodos = () => {
        return todos.map((todo) => {
            return (
                <div key={todo.uid}>
                    <h2>Task</h2>
                    <p>{todo.todo}</p>
                    <button onClick={() => handleSetUpdateTodo(todo)}>
                        Update Task
                    </button>
                    <br></br>
                    <button onClick={() => handleDelete(todo.uid)}>
                        Delete Task
                    </button>
                </div>
            );
        });
    };

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate("/");
            }

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
        console.log(todos);
    }, [todos]);

    return (
        <div>
            Contact is the main page
            <button onClick={handleSignOut}>Sign Out</button>
            <div>
                <h1>New TasK</h1>
                <input type="text" value={newTask} onChange={handleNewTask} />
                <button onClick={writeToDb}>Add</button>
                <h1>Update TasK</h1>
                <input
                    type="text"
                    value={updateTodo?.todo}
                    onChange={handleGetUpdateText}
                />
                <button onClick={handleUpdateTodo}>Update</button>
                {renderTodos()}
            </div>
        </div>
    );
};

export default Contact;

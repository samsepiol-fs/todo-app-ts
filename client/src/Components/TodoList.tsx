import axios from "axios";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { authState } from "../Store/authState";
import { useNavigate } from "react-router-dom";


export interface Todo {
    _id: string;
    title: string;
    description: string;
    done: boolean
}

const TodoList = () => {

    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [ title, setTitle ] = useState<string>('');
    const [ description, setDescription ] = useState<string>('');
    const authStateValue = useRecoilValue(authState);
    const navigate = useNavigate();
    
    useEffect(() => {
        const getTodos = async () => {
            try {
                const response = await axios.get<Todo[]>('http://localhost:3000/todo/todos',{
                    headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
                });
                const data: Todo[] = response.data;
                setTodos(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching todos', error);
                setLoading(false);
            }
        };
        getTodos();
    },[]);

    const addTodo = async () => {
        try {
            const response = await axios.post<Todo>(
                'http://localhost:3000/todo/todos',
                {title, description},
                {
                    headers:{Authorization: `Bearer ${localStorage.getItem('token')}`}
                }  
            );
            const newTodo = response.data;
            setTodos([...todos, newTodo]);
            setTitle('');
            setDescription('');
        } catch (error) {
            console.error("Error while creating a Todo", error);
        }
    };

    const markDone = async (id:string) => {
        try {
            const response = await axios.patch<Todo>(
                `http://localhost:3000/todo/todos/${id}/done`,{},
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
                }
            );
            const data = response.data;
            setTodos(todos.map((todo) => (todo._id == data._id ? data: todo)));
        } catch (error) {
            console.error("Failed to update Todo", error);
        }
    };

    return (
        <div>
            <div style={{display: "flex"}}>
                <h2>Welcome {authStateValue.username}</h2>
                <div style={{marginTop: 25, marginLeft: 20}}>
                    <button onClick={() => {
                        localStorage.removeItem("token");
                        navigate('/login');
                    }}>Logout</button>
                </div>
            </div>
            <h2>Todo List</h2>
            <input type='text' value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Title' />
            <input type='text' value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Description' />
            <button onClick={addTodo}>Add Todo</button>

            {todos.map((todo) => (
                <div key={todo._id}>
                    <h3>{todo.title}</h3>
                    <p>{todo.description}</p>
                    <button onClick={() => markDone(todo._id)}>{todo.done? 'Done' : 'Mark as Done'}</button>
                </div>
            ))}
        </div>
    );
}
export default TodoList
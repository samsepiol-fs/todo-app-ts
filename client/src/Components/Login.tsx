import axios, { AxiosError } from "axios";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface LoginResponse {
    message: string;
    token?: string;
}
const Login = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post<LoginResponse>('http://localhost:3000/auth/login',{
            username, password
            });
            const data = response.data;
            if(data.token){
                localStorage.setItem('token', data.token);
                navigate('/todos');
            } else {
                setError('Error while logging in');
            }
        } catch (error: AxiosError<LoginResponse> | any) {
            console.error("Error Logging in", error);
            if(error.response) {
                const {data} = error.response;
                if(data && data.message) {
                    setError(data.message);
                } else {
                    setError("Error while logging in");
                }
            } else {
                setError("Network error");
            }
        }
    };
    return (
        <div style={{display:"flex", justifyContent:"center", width:"100%"}}>
            <div>
                <h2>Login</h2>
                {error && <div style={{color:"red"}}>{error}</div>}
                <input 
                    type="text" 
                    value={username}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                    placeholder="Username"
                />
                <input 
                    type="password" 
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                New user? <Link to='/signup'>Signup</Link>
                <button onClick={handleLogin}>Login</button>
            </div>
        </div>
    );
};
export default Login;
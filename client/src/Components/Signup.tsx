import axios, { AxiosError } from "axios";
import { ChangeEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom";

interface SignupResponse {
    message: string;
    token?: string;
}

const Signup = () => {
    const [ username ,setUsername ] = useState<string>('');
    const [ password, setPassword ] = useState<string>('');
    const [ error, setError ] = useState<string | null>(null);
    const navigate = useNavigate();
    
    const handleSignup = async () => {
        try {
            const response = await axios.post<SignupResponse>("http://localhost:3000/auth/signup",
            { username, password });
            const data = response.data;
            if(data.token) {
                localStorage.setItem("token", data.token);
                navigate("/login");
            } else {
                setError('Error while signing up');
            }
        } catch (error: AxiosError<SignupResponse> | any) {
            console.error("Error while signing up", error);
            // setError("Error while signing up");
            if(error.response) {
                const {data} = error.response;
                if(data && data.message) {
                    setError(data.message);
                } else {
                    setError('Unknown error ocurreed');
                }
            } else {
                setError('Network error ocurred');
            }
        }      
    };
    return (
        <div style={{ justifyContent: 'center', display: 'flex', width: '100%' }}>
          <div>
            <h2>Signup</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>} {/* Display error message */}
            <input
              type='text'
              value={username}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              placeholder='Username'
            />
            <input
              type='password'
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              placeholder='Password'
            />
            Already signed up? <Link to='/login'>Login</Link>
            <button onClick={handleSignup}>Signup</button>
          </div>
        </div>
    );  
};
export default Signup
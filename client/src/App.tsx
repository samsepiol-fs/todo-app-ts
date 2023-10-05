import React, { useEffect } from 'react';
import { RecoilRoot, useSetRecoilState } from 'recoil';
import { authState } from './Store/authState';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from './Components/Login';
import Signup from './Components/Signup';
import TodoList from './Components/TodoList';

const App = () => {
  return (
    <RecoilRoot>
      <Router>
        <InitState />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/todos" element={<TodoList />} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
};

const InitState = () => {
  const setAuth = useSetRecoilState(authState);
  const navigate = useNavigate();
  const init = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:3000/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.data;
      if (data.username) {
        setAuth({ token: data.token, username: data.username });
        navigate('/todos');
      } else {
        navigate('/login');
      }
    } catch (error) {
      navigate('/login');
    }
  };

  useEffect(() => {
    init();
  }, []);

  return null; // You can return null as this component doesn't render anything
};

export default App;

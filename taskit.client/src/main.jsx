import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext.jsx";
import { UserProvider } from './context/UserContext.jsx';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <UserProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </UserProvider>
        </AuthProvider>
    </React.StrictMode>
);

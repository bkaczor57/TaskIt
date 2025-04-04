import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext.jsx";
import { UserProvider } from './context/UserContext.jsx';
import { TeamProvider } from './context/TeamContext.jsx';
import { UserTeamProvider } from './context/UserTeamContext.jsx';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <UserProvider>
                <UserTeamProvider>
                    <TeamProvider>
                        <BrowserRouter>
                            <App />
                        </BrowserRouter>
                    </TeamProvider>
                </UserTeamProvider>
            </UserProvider>
        </AuthProvider>
    </React.StrictMode>
);

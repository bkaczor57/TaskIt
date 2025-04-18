import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext.jsx";
import { UserProvider } from './context/UserContext.jsx';
import { TeamProvider } from './context/TeamContext.jsx';
import { UserTeamProvider } from './context/UserTeamContext.jsx';
import { TeamInviteProvider } from './context/TeamInviteContext.jsx';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <UserProvider>
                <UserTeamProvider>
                    <TeamProvider>
                        <TeamInviteProvider>
                            <BrowserRouter>
                                <App />
                            </BrowserRouter>
                        </TeamInviteProvider>
                    </TeamProvider>
                </UserTeamProvider>
            </UserProvider>
        </AuthProvider>
    </React.StrictMode>
);

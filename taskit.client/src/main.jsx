import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext.jsx";
import { UserProvider } from './context/UserContext.jsx';
import { TeamProvider } from './context/TeamContext.jsx';
import { UserTeamProvider } from './context/UserTeamContext.jsx';
import { TeamInviteProvider } from './context/TeamInviteContext.jsx';
import { EnumProvider } from './context/EnumContext.jsx';
import { ErrorProvider } from './context/ErrorProvider';
import App from './App.jsx';
import './index.css';



ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <UserProvider>
            <UserTeamProvider>
                <TeamInviteProvider>
                    <TeamProvider>
                        <EnumProvider>
                            <BrowserRouter>
                                <ErrorProvider>
                                    <App />
                                </ErrorProvider>
                            </BrowserRouter>
                        </EnumProvider>
                    </TeamProvider>
                </TeamInviteProvider>
            </UserTeamProvider>
        </UserProvider>
    </AuthProvider>
);

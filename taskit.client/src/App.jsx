import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import ProtectedLayout from './layouts/ProtectedLayout';
import LandingPage from './pages/LandingPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import TeamPageWrapper from './pages/TeamPageWrapper.jsx';
import UserTasks from './pages/UserTasks.jsx'
import './styles/GlobalStyles.css';
import './App.css';

function App() {
    return (
        <div className="app-container">
            <Routes>
                {/* publiczne strony */}
                <Route path="/" element={<LandingPage />} />

                {/* strony dostepne po zalogowaniu dla kazdego */}
                <Route element={
                    <ProtectedRoute>
                        <ProtectedLayout />
                    </ProtectedRoute>}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/teams/:teamId" element={<TeamPageWrapper />} />
                    <Route path="/my-tasks" element={<UserTasks/>} />
                    <Route path="/my-tasks/:status" element={<UserTasks />} />

                </Route>
            </Routes>
        </div>
    );
}

// function App() {
//     return (
//         <div className="app-container">
//             <Navbar/>
//         </div>
//     );
// }


export default App;

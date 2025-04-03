import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import ProtectedLayout from './layouts/ProtectedLayout';
import LandingPage from './pages/LandingPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import GroupPage from './pages/GroupPage.jsx';
import './styles/GlobalStyles.css';
import './App.css';

function App() {
    return (
        <div className="app-container">
            <Routes>
                {/* publiczne strony */}
                <Route path="/" element={<LandingPage />} />

                {/* strony dostepne po zalogowaniu dla kazdego */}
                <Route element ={ 
                    <ProtectedRoute>
                        <ProtectedLayout/>
                    </ProtectedRoute>}>
                        
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/groups/:groupId" element={<GroupPage />} />
                    
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

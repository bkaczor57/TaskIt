import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from "./components/ProtectedRoute";
import { RegisterSuccessModal } from './components/RegisterSuccessModal';
import LandingPage from './pages/LandingPage.jsx';
import Dashboard from './pages/Dashboard.jsx';

import './App.css';

function App() {
    return (
        <div className="app-container">
            <Routes>
                <Route path="/" element={<LandingPage />} />
                
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                    } />
            </Routes>
        </div>
    );
}

// function App() {
//     return (
//       <div>
//         <RegisterSuccessModal
//           username="test_user123"
//           onClose={() => console.log("zamknij")}
//           onOpenLogin={() => console.log("przejdź do logowania")}
//         />
//       </div>
//     );
//   }

export default App;

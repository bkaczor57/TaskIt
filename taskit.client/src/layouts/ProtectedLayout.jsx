import { useState } from "react";
import Navbar from '../components/navbar/Navbar';
import SideMenu from '../components/SideMenu/SideMenu';
import { Outlet } from 'react-router-dom';
import "../components/SideMenu/SideMenu.css";
import "./ProtectedLayout.css";

// const ProtectedLayout = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="layout-root">
//       <Navbar onBellClick={() => window.innerWidth < 768 && window.location.assign("/notifications")} />
      
//       <button className="burger-button" onClick={() => setSidebarOpen(!sidebarOpen)}>
//         ☰
//       </button>

//       <div className="layout-body">
//         <aside className={`side-menu ${sidebarOpen ? "mobile-visible" : ""}`}>
//           <SideMenu closeMenu={() => setSidebarOpen(false)} />
//         </aside>
//         <main className="layout-main">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

const ProtectedLayout = () => {
  return (
    <div className="layout-root">
      <Navbar />
      <div className="layout-body">
        <SideMenu />
        <main className="layout-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};


export default ProtectedLayout;

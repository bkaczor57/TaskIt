import { useState, useEffect } from "react";
import Navbar from '../components/navbar/Navbar';
import SideMenu from '../components/SideMenu/SideMenu';
import { Outlet } from 'react-router-dom';
import "../components/SideMenu/SideMenu.css";
import "./ProtectedLayout.css";

const ProtectedLayout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="layout-root">
      <Navbar />
      <div className={`layout-body ${!isMobile && isSidebarOpen ? 'sidebar-open' : ''}`}>
        <SideMenu />
        <main className="layout-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProtectedLayout;

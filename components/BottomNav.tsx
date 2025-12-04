import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PieChart } from 'lucide-react';

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-around items-center z-40 md:hidden pb-safe">
      <NavLink 
        to="/" 
        className={({ isActive }) => 
          `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'}`
        }
      >
        <Home className="w-6 h-6" />
        <span className="text-[10px] font-medium">Home</span>
      </NavLink>
      
      <div className="w-px h-8 bg-gray-100"></div>

      <NavLink 
        to="/analytics" 
        className={({ isActive }) => 
          `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`
        }
      >
        <PieChart className="w-6 h-6" />
        <span className="text-[10px] font-medium">Analytics</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
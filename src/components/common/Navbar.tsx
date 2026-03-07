import React from 'react';
import { Menu, Bell, User } from 'lucide-react';

interface NavbarProps {
  toggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 fixed w-full z-30 top-0 h-16"> 
      <div className="px-4 h-full"> 
        <div className="flex items-center justify-between h-full"> 
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">HRMS Lite</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center gap-2 border-l pl-3 border-gray-200">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 hidden md:block">Admin User</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
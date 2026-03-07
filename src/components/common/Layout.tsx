import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = React.useState(true);

    return (
        <div className="min-h-screen bg-gray-50">

            <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            <div className="flex pt-16">

                <Sidebar isOpen={sidebarOpen} />

                <main
                    className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'
                        }`}
                >

                    <div className="p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
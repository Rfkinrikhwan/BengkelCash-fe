import { useState } from "react";
import Sidebar from "./Sidebar";
import { motion } from 'framer-motion';
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router";

export default function AdminLayout() {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleSidebar = () => setIsExpanded(!isExpanded);

    return (
        <div className="bg-gray-100 flex px-3 py-5 gap-5 min-h-screen">
            {/* Sidebar */}
            <Sidebar isExpanded={isExpanded} toggleSidebar={toggleSidebar} />

            {/* Main Content */}
            <motion.div
                initial={false}
                animate={{ marginLeft: isExpanded ? '0px' : '0px' }}
                className="flex-1 flex flex-col"
            >
                {/* <Navbar /> */}

                {/* Content Area */}
                <main className="flex-1">
                    <div className="bg-white rounded-lg shadow-sm p-6 h-full">
                        <Outlet />
                    </div>
                </main>

                {/* <Footer /> */}
            </motion.div>
        </div>
    );
};
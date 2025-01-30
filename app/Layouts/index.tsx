import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { motion } from 'framer-motion';
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet, useNavigate } from "react-router";
import Cookies from "js-cookie";

export default function AdminLayout() {
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleSidebar = () => setIsExpanded(!isExpanded);

    useEffect(() => {
        const accessToken = Cookies.get('accessToken');

        if (accessToken === undefined || !accessToken) {
            navigate('/signin');
            return;
        }
    }, [navigate]);

    return (
        <div className="bg-gray-100 flex px-3 py-5 gap-3 min-h-screen">
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
                    <Outlet />
                </main>

                {/* <Footer /> */}
            </motion.div>
        </div>
    );
};
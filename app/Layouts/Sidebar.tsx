import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Home, Users, Settings, BarChart2 } from 'lucide-react';
import { NavLink } from 'react-router';

export default function Sidebar({ isExpanded, toggleSidebar }: { isExpanded: boolean; toggleSidebar: () => void }) {
    const menuItems = [
        { icon: Home, text: 'Dashboard', path: '/' },
        { icon: BarChart2, text: 'Users', path: '/keuangan' },
        { icon: Settings, text: 'Settings', path: '/settings' },
    ];

    return (
        <motion.div
            initial={false}
            animate={{ width: isExpanded ? '250px' : '70px' }}
            className="text-gray-80 border border-gray-300 rounded-xl bg-blue-400"
        >
            <div className={`flex items-center p-4 ${isExpanded ? 'justify-between' : 'justify-center'}`}>
                {isExpanded && <h2 className="text-xl font-bold text-white">Bubut Bali</h2>}
                <button
                    onClick={toggleSidebar}
                    className="p-1 rounded-full text-gray-700 bg-white flex justify-center items-center cursor-pointer transition-colors"
                >
                    {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
            </div>

            <nav className="mt-4">
                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        className={`flex items-center mx-2 py-3 px-4 text-white hover:bg-white hover:text-gray-700 transition-colors rounded-lg ${isExpanded ? 'justify-start' : 'justify-center'}`}
                    >
                        <item.icon size={20} />
                        {isExpanded && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="ml-4"
                            >
                                {item.text}
                            </motion.span>
                        )}
                    </NavLink>
                ))}
            </nav>
        </motion.div>
    );
};
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Home, Users, Settings, BarChart2 } from 'lucide-react';
import { NavLink } from 'react-router';

export default function Sidebar({ isExpanded, toggleSidebar }: { isExpanded: boolean; toggleSidebar: () => void }) {
    const menuItems = [
        { icon: Home, text: 'Dashboard', path: '/' },
        { icon: BarChart2, text: 'Keuangan', path: '/keuangan' },
    ];

    return (
        <motion.div
            initial={false}
            animate={{ width: isExpanded ? '280px' : '70px' }}
            className="text-gray-80 border border-gray-300 rounded-xl bg-blue-400 flex flex-col justify-between"
        >
            <div>
                <div className={`flex items-center border-b border-gray-200 p-4 ${isExpanded ? 'justify-between' : 'justify-center'}`}>
                    {isExpanded && <h2 className="text-xl font-bold text-white">Bubut Bali</h2>}
                    <button
                        onClick={toggleSidebar}
                        className="p-1 rounded-full text-gray-700 bg-white flex justify-center items-center cursor-pointer transition-colors"
                    >
                        {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                    </button>
                </div>

                <nav className="mt-2">
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
            </div>

            <div className='bg-white p-6 m-2 rounded-lg'>

            </div>
        </motion.div>
    );
};
import { motion } from 'framer-motion';
import { NavLink } from 'react-router';
import { Avatar } from "antd";
import { UserOutlined } from '@ant-design/icons';
import { ChevronLeft, ChevronRight, Home, BarChart2, LogOut } from 'lucide-react';
import useAuthStore from '~/store/authStore';

export default function Sidebar({ isExpanded, toggleSidebar }: { isExpanded: boolean; toggleSidebar: () => void; }) {
    const { logout } = useAuthStore();

    const menuItems = [
        { icon: Home, text: 'Dashboard', path: '/' },
        { icon: BarChart2, text: 'Keuangan', path: '/keuangan' },
    ];

    return (
        <motion.div
            initial={false}
            animate={{ width: isExpanded ? '280px' : '70px' }}
            className="text-gray-80 rounded-xl flex flex-col justify-between"
        >
            <div>
                <div className={`flex items-center border-b border-gray-200 px-4 py-3 ${isExpanded ? 'justify-between' : 'justify-center'}`}>
                    {isExpanded && (
                        <motion.h2
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-3xl font-bold text-gray-800"
                        >
                            Bubut Bali
                        </motion.h2>
                    )}
                    <button
                        onClick={toggleSidebar}
                        className="p-1 m-1 rounded-full text-gray-700 bg-white flex justify-center items-center cursor-pointer transition-colors"
                    >
                        {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                    </button>
                </div>

                <nav className="mt-2">
                    {menuItems.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.path}
                            className={({ isActive }) => `
                                flex items-center mt-2 mx-2 py-2 px-3 transition-colors rounded-lg
                                ${isExpanded ? 'justify-start' : 'justify-center'}
                                ${isActive
                                    ? 'bg-white text-blue-600 font-medium shadow'
                                    : 'text-gray-800 hover:bg-white/10'
                                }
                            `}
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

            <div className="flex flex-col gap-2">
                <div className={`
                    mx-2 rounded-lg transition-all duration-300
                    ${isExpanded ? 'p-3' : 'p-2'}
                    ${isExpanded ? 'flex items-center gap-3' : 'flex justify-center items-center'}
                `}>
                    <Avatar
                        icon={<UserOutlined />}
                        className="flex-shrink-0"
                        size={isExpanded ? 40 : 32}
                    />
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="min-w-0 flex-1"
                        >
                            <div className="font-medium text-gray-900 truncate">Rifki</div>
                            <div className="text-sm text-gray-500 truncate">rfkinrikhwan@bubutbali.id</div>
                        </motion.div>
                    )}
                    {isExpanded && (
                        <button
                            onClick={logout}
                            className={`
                        mx-2 rounded-lg cursor-pointer transition-colors
                        ${isExpanded ? 'p-3 flex items-center' : 'p-2 flex justify-center'}
                    `}
                        >
                            <LogOut size={20} className="text-red-500" />
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
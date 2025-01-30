import { useNavigate, type MetaArgs } from "react-router";
import { useEffect, useState } from "react";
import useAuthStore from "~/store/authStore";
import Cookies from "js-cookie";

export function meta({ }: MetaArgs) {
    return [
        { title: "Bubut Bali | Sign In" },
        { name: "description", content: "Sign In" },
    ];
}

export default function SignIn() {
    const navigate = useNavigate();
    const { login, isLoading, error } = useAuthStore();
    const [rememberMe, setRememberMe] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await login(formData.email, formData.password);
            navigate('/'); // Sesuaikan dengan route yang diinginkan setelah login
        } catch (err) {
            // Error sudah di-handle di dalam login function
            console.error('Login failed:', err);
        }
    };

    // Cek token saat komponen dimuat
    useEffect(() => {
        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
            navigate('/');
        }
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-12 bg-gray-50">
            <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-xl md:shadow-lg">
                <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center">
                    Sign In
                </h1>

                {error && (
                    <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label
                            className="block text-sm font-medium text-gray-700 mb-2"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="block w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label
                            className="block text-sm font-medium text-gray-700 mb-2"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="block w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-2 text-gray-600">Remember me</span>
                        </label>
                        <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                            Forgot password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full px-4 py-3 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium
                            ${isLoading
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>

                    <p className="text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <a href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                            Sign up
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
}
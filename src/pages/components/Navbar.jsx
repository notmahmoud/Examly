import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

export function Navbar() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) return (
        <nav className="h-20 bg-white border-b border-gray-100 fixed top-0 left-0 right-0 z-50">
        </nav>
    );

    return (
        <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center">
                    <Link to="/" className="text-2xl font-black text-examly-accent tracking-tighter cursor-pointer">
                        Examly
                    </Link>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <Link to="/explore" className="text-sm font-bold text-gray-500 hover:text-examly-accent transition-colors cursor-pointer">
                        Explore
                    </Link>
                    <a
                        href="/#vision"
                        className="text-sm font-bold text-gray-500 hover:text-examly-accent transition-colors cursor-pointer"
                    >
                        Vision
                    </a>
                    <a
                        href="/#mission"
                        className="text-sm font-bold text-gray-500 hover:text-examly-accent transition-colors cursor-pointer"
                    >
                        Mission
                    </a>
                </div>

                <div className="flex items-center gap-6">
                    <Link to="/join" className="text-sm font-bold text-examly-accent hover:text-teal-800 transition-colors cursor-pointer">
                        Join Room
                    </Link>
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 hover:border-gray-300 transition-colors cursor-pointer"
                            >
                                <div className="w-7 h-7 rounded-full bg-examly-accent text-white flex items-center justify-center font-bold text-xs">
                                    {user.displayName?.[0]?.toUpperCase()}
                                </div>
                                <span className="text-sm font-bold text-gray-800 hidden md:block">{user.displayName}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                                    <p className="px-4 py-2 text-sm font-bold text-gray-800 ">{user.displayName}</p>
                                    <hr className="my-1" />
                                    <button
                                        onClick={() => signOut(auth)}
                                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 font-bold"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-sm font-bold text-gray-500 hover:text-examly-accent transition-colors cursor-pointer">
                                Log in
                            </Link>
                            <Link to="/login" className="bg-gray-800 hover:bg-gray-900 text-white text-sm font-bold py-2.5 px-6 rounded-lg transition-colors cursor-pointer">
                                Sign up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
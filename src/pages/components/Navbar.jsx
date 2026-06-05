import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

export function Navbar() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) return <div className="h-20 w-full bg-white border-b border-gray-100 animate-pulse"></div>;

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
                        <div className="flex items-center gap-4">
                            {user.displayName && <span className="text-sm font-bold text-gray-800 hidden md:block">{user.displayName}</span>}
                            <button 
                                onClick={() => signOut(auth)}
                                className="text-sm font-bold text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
                            >
                                Logout
                            </button>
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
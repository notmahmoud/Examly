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

    if (loading) return <p>Loading...</p>;

    return (
        <nav className="navbar">
            <Link to="/">Examly</Link>
            <Link to="/explore">Explore</Link>
            <Link to="/">Misson</Link>
            <Link to="/">About</Link>
            {user ? (
                <button onClick={() => signOut(auth)}>Logout</button>
            ) : (
                <Link to="/login">Login</Link>
            )}
            {user?.displayName && <span>Welcome, {user.displayName}!</span>}
        </nav>
    );
}
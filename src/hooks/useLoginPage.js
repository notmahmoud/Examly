import { useState, useEffect } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    onAuthStateChanged,
    signInWithPopup,
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import { useNavigate } from 'react-router-dom';

export function useLoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch {
            setErrorMessage('Invalid email or password');
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            navigate('/');
        } catch {
            setErrorMessage('Error signing in with Google. Please try again.');
        }
    };

    const handleRegister = async () => {
        try {
            if (password !== confirmPassword) {
                setErrorMessage('Passwords do not match');
                return;
                if (!name) {
                    setErrorMessage('Name is required');
                    return;
                }
            }
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await updateProfile(user, { displayName: name });
            setErrorMessage('');
            navigate('/');
        } catch (error) {
            setErrorMessage('Error registering. Please try again. ' + error.message);
        }
    };

    const toggleMode = () => {
        setIsLogin(prev => !prev);
        setErrorMessage('');
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) navigate('/');
        });
        return () => unsubscribe();
    }, [navigate]);

    return {
        email, setEmail,
        password, setPassword,
        name, setName,
        confirmPassword, setConfirmPassword,
        isLogin,
        errorMessage,
        handleLogin,
        handleGoogleSignIn,
        handleRegister,
        toggleMode,
    };
}

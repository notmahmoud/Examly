import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from '../firebase';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
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
    } catch  {
      setErrorMessage('Invalid email or password');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch  {
      setErrorMessage('Error signing in with Google. Please try again.');
    }
  };

  const handleRegister = async () => {
    try {
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match');
        return;
      }
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: name });
      setErrorMessage('');
      if (!name) {
        setErrorMessage('Name is required');
        return;
      }
      navigate('/');
    } catch (error) {
      setErrorMessage('Error registering. Please try again. ' + error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate('/');
    });
    return () => unsubscribe();
  }, [navigate]);

  const inputClasses = "w-full border-b-2 border-gray-200 py-3 bg-transparent text-gray-800 font-medium outline-none focus:border-examly-accent transition-colors placeholder-gray-400";
  const labelClasses = "block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1";

  return (
    <div className="min-h-screen bg-examly-base font-sans  flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-examly-accent tracking-tighter cursor-pointer" onClick={() => navigate('/')}>
            Examly
          </h1>
        </div>
        
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          {isLogin ? 'Welcome back' : 'Create an account'}
        </h2>

        <button 
          onClick={handleGoogleSignIn}
          className="w-full flex justify-center items-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-bold py-3 px-4 border border-gray-300 rounded-xl transition-all duration-300 shadow-sm cursor-pointer hover:-translate-y-0.5 mb-8"
        >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                </g>
            </svg>
            Continue with Google
        </button>

        <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with email</span>
            </div>
        </div>

        <div className="space-y-6">
          {!isLogin && (
            <div>
              <label className={labelClasses}>Name</label>
              <input type="text"
                className={inputClasses}
                placeholder='e.g. Alison Burgers'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          
          <div>
            <label className={labelClasses}>Email</label>
            <input type="email"
              className={inputClasses}
              placeholder='example@gmail.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className={labelClasses}>Password</label>
            <input type="password"
              className={inputClasses}
              placeholder='••••••••'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (isLogin ? handleLogin() : handleRegister())}
            />
          </div>

          {!isLogin && (
            <div>
              <label className={labelClasses}>Confirm Password</label>
              <input type="password"
                className={inputClasses}
                placeholder='••••••••'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
              />
            </div>
          )}
          
          {errorMessage && <p className="text-sm text-red-500 font-bold text-center">{errorMessage}</p>}
          
          <button 
            onClick={isLogin ? handleLogin : handleRegister}
            className="w-full bg-examly-accent hover:bg-teal-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-sm mt-4 cursor-pointer hover:-translate-y-0.5"
          >
            {isLogin ? 'Log In' : 'Create Account'}
          </button>
        </div>
        
        <div className="mt-8 flex flex-col items-center gap-4">
            {isLogin && <button className="text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer">Forgot password?</button>}
            <button 
                onClick={() => {
                    setIsLogin(!isLogin);
                    setErrorMessage('');
                }}
                className="text-sm font-bold text-examly-accent hover:text-teal-800 transition-colors cursor-pointer"
            >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>
            <button 
                onClick={() => navigate(-1)}
                className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors mt-2 cursor-pointer"
            >
                &larr; Back
            </button>
        </div>
      </div>
    </div>
  );
}
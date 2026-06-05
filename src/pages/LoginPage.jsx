import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Signed in 
      const user = userCredential.user;
      navigate('/'); // Redirect to home page after successful login
    } catch (errorMassage) {
      setErrorMessage('Invalid email or password');
    }
  };

  const handleRegister = async () => {
    try {
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match');
        return;
      }
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Signed in 
      const user = userCredential.user;
      await updateProfile(user, { displayName: name });
      setErrorMessage('');
      if (!name) {
        setErrorMessage('Name is required');
        return;
      }
      navigate('/'); // Redirect to home page after successful registration
    } catch (errorMassage) {
      setErrorMessage('Error registering. Please try again.' + errorMassage.message);
    }
  };
  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate('/');
    });
    return () => unsubscribe();
  }, []);

  return (


    <div className="login">

      {isLogin ? null : (
        <div>
          <p>Name: </p>
          <input type="text"
            placeholder='Alison Burgers'
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      )}
      <p>Email: </p>
      <input type="text"
        name="email"
        placeholder='example@gmail.com'
        id="login" value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <p>Password: </p>
      <input type="password"
        name="password" id="password"
        placeholder='********'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
      />

      {isLogin ? null : (
        <div>
          <p>Confirm Password: </p>
          <input type="password"
            name="confirmPassword"
            id="confirmPassword"
            placeholder='********'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
          />
        </div>
      )}
      {isLogin && <button onClick={handleLogin}>Login</button>}
      <button>Forgot password?</button>

      {!isLogin && <button onClick={handleRegister}>Register</button>}
      {errorMessage && <p>{errorMessage}</p>}
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
      </button>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>


  );
}
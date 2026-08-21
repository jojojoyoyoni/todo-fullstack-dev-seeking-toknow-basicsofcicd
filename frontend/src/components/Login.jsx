import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = isRegister 
      ? await register(username, password) 
      : await login(username, password);
    if (!result.success) setError(result.error);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">✅</div>
        <h2 className="auth-title">{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
        <p className="auth-subtitle">{isRegister ? 'Sign up to start organizing your tasks' : 'Login to manage your todos'}</p>
        
        {error && <div className="auth-error">⚠️ {error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              className="auth-input"
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="auth-input"
            />
          </div>
          <button type="submit" className="auth-button">
            {isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>
        
        <p className="auth-toggle" onClick={() => { setIsRegister(!isRegister); setError(''); }}>
          {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </p>
      </div>
    </div>
  );
}

export default Login;
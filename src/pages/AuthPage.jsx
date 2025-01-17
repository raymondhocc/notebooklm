import { useState } from 'react';
    import { useNavigate } from 'react-router-dom';

    export default function AuthPage() {
      const [isLogin, setIsLogin] = useState(true);
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [error, setError] = useState('');
      const [isLoading, setIsLoading] = useState(false);
      const navigate = useNavigate();

      const handleDemoLogin = async () => {
        setError('');
        setIsLoading(true);
        try {
          const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              email: 'demo@ai.ai',
              password: 'demo'
            })
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Login failed');
          }

          const { token } = await response.json();
          localStorage.setItem('token', token);
          navigate('/dashboard');
        } catch (error) {
          setError(error.message);
          console.error('Login error:', error);
        } finally {
          setIsLoading(false);
        }
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
          const endpoint = isLogin ? 'login' : 'register';
          const response = await fetch(`/api/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Authentication failed');
          }

          const { token } = await response.json();
          localStorage.setItem('token', token);
          navigate('/dashboard');
        } catch (error) {
          setError(error.message);
          console.error('Authentication error:', error);
        } finally {
          setIsLoading(false);
        }
      };

      return (
        <div className="auth-container">
          <h2>{isLogin ? 'Login' : 'Register'}</h2>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
            </button>
          </form>
          <div className="auth-options">
            <button onClick={() => setIsLogin(!isLogin)} disabled={isLoading}>
              {isLogin ? 'Need to register?' : 'Already have an account?'}
            </button>
            <button 
              onClick={handleDemoLogin} 
              className="demo-login-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Try Demo'}
            </button>
          </div>
        </div>
      );
    }

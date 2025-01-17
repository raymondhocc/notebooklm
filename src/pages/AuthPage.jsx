import { useState } from 'react';
    import { useNavigate } from 'react-router-dom';

    export default function AuthPage() {
      const [isLogin, setIsLogin] = useState(true);
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const navigate = useNavigate();

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch('/api/' + (isLogin ? 'login' : 'register'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });

          if (response.ok) {
            const { token } = await response.json();
            localStorage.setItem('token', token);
            navigate('/dashboard');
          }
        } catch (error) {
          console.error('Authentication error:', error);
        }
      };

      return (
        <div className="auth-container">
          <h2>{isLogin ? 'Login' : 'Register'}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
          </form>
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Need to register?' : 'Already have an account?'}
          </button>
        </div>
      );
    }

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const router = useRouter();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('candidate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        // REGISTER
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password
        });

        if (signUpError) throw signUpError;

        const user = data.user;

        if (user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              full_name: fullName,
              role
            });

          if (profileError) throw profileError;
        }
      } else {
        // LOGIN
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (loginError) throw loginError;
      }

      // Fetch role after login
      const {
        data: { user }
      } = await supabase.auth.getUser();

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile.role === 'supervisor') {
        router.push('/supervisor');
      } else {
        router.push('/assessment');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="overlay" />
      <div className="card">
        <h1>Stratavax Assessment</h1>
        <p>{isRegister ? 'Create an account' : 'Please log in to continue'}</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          {isRegister && (
            <input
              type="text"
              placeholder="Full Name"
              required
              value={fullName}
              onChange={e => setFullName(e.target.value)}
            />
          )}

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          {isRegister && (
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="candidate">Candidate</option>
              <option value="supervisor">Supervisor</option>
            </select>
          )}

          <button disabled={loading}>
            {loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
          </button>
        </form>

        <span className="toggle" onClick={() => setIsRegister(!isRegister)}>
          {isRegister
            ? 'Already have an account? Login'
            : 'No account? Register here'}
        </span>
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          background-image: url('/images/login-bg.jpg');
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
        }

        .card {
          position: relative;
          background: white;
          padding: 2.5rem;
          width: 100%;
          max-width: 400px;
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          z-index: 1;
          text-align: center;
        }

        h1 {
          margin-bottom: 0.5rem;
        }

        input, select {
          width: 100%;
          padding: 0.75rem;
          margin-top: 0.75rem;
          border-radius: 6px;
          border: 1px solid #ccc;
        }

        button {
          margin-top: 1rem;
          width: 100%;
          padding: 0.8rem;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
        }

        button:hover {
          background: #1e40af;
        }

        .toggle {
          display: block;
          margin-top: 1rem;
          color: #2563eb;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .error {
          background: #fee2e2;
          color: #991b1b;
          padding: 0.5rem;
          margin-bottom: 0.75rem;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
}

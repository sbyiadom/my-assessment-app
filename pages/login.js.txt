import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('candidate');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Fetch user by email
    const { data: user, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      alert('User not found');
      setLoading(false);
      return;
    }

    // Check password
    if (user.password !== password) {
      alert('Incorrect password');
      setLoading(false);
      return;
    }

    // Check name matches
    if (user.name !== name) {
      alert('Name does not match our records');
      setLoading(false);
      return;
    }

    // Check role matches
    if (user.role !== role) {
      alert(`Selected role does not match your assigned role (${user.role})`);
      setLoading(false);
      return;
    }

    // Redirect
    if (role === 'supervisor') {
      router.push('/supervisor');
    } else {
      router.push(`/assessment/${user.id}`);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: "url('YOUR_BACKGROUND_IMAGE_URL')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: 40,
          borderRadius: 12,
          boxShadow: '0 6px 15px rgba(0,0,0,0.25)',
          maxWidth: 400,
          width: '90%',
          textAlign: 'center',
        }}
      >
        <h1 style={{ marginBottom: 10, color: '#0070f3', fontSize: 28, fontWeight: 'bold' }}>
          Stratavax Assessment
        </h1>
        <p style={{ marginBottom: 25, fontSize: 16, color: '#555' }}>
          Please log in to continue
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: 12, marginBottom: 15, borderRadius: 6, border: '1px solid #ccc' }}
          required
        />

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: '100%', padding: 12, marginBottom: 15, borderRadius: 6, border: '1px solid #ccc' }}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: 12, marginBottom: 15, borderRadius: 6, border: '1px solid #ccc' }}
          required
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{
            width: '100%',
            padding: 12,
            marginBottom: 25,
            borderRadius: 6,
            border: '1px solid #ccc',
            backgroundColor: '#fff',
          }}
        >
          <option value="candidate">Candidate</option>
          <option value="supervisor">Supervisor</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: 12,
            background: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          {loading ? 'Logging in…' : 'Login'}
        </button>
      </form>
    </div>
  );
}


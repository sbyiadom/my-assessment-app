import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('candidate')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }
    router.push(role === 'supervisor' ? '/supervisor' : '/assessment/start')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/images/login-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.9)',
          padding: 40,
          borderRadius: 20,
          width: 400,
          boxShadow: '0 15px 35px rgba(0,0,0,0.35)',
          textAlign: 'center',
        }}
      >
        <h1 style={{ marginBottom: 25, color: '#0070f3' }}>Stratavax Assessment</h1>

        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: 14, marginBottom: 12, borderRadius: 8, border: '1px solid #ccc' }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: 14, marginBottom: 12, borderRadius: 8, border: '1px solid #ccc' }}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ width: '100%', padding: 14, marginBottom: 20, borderRadius: 8, border: '1px solid #ccc' }}
        >
          <option value="candidate">Candidate</option>
          <option value="supervisor">Supervisor</option>
        </select>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: 16,
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontWeight: 'bold',
            cursor: 'pointer',
            marginBottom: 15,
          }}
        >
          {loading ? 'Logging in…' : 'Login'}
        </button>

        <p style={{ fontSize: 14 }}>
          No account? <a href="/register" style={{ color: '#0070f3', fontWeight: 'bold' }}>Register</a>
        </p>
      </div>
    </div>
  )
}









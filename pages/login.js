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

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    // Redirect based on role
    if (role === 'supervisor') {
      router.push('/supervisor')
    } else {
      router.push('/assessment/start')
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/images/login-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.95)',
          padding: 40,
          borderRadius: 16,
          width: 400,
          boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
          textAlign: 'center',
        }}
      >
        <h1 style={{ marginBottom: 25, color: '#222', fontFamily: 'Arial, sans-serif' }}>
          Stratavax Assessment
        </h1>

        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: 12, marginBottom: 12, borderRadius: 6 }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: 12, marginBottom: 12, borderRadius: 6 }}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ width: '100%', padding: 12, marginBottom: 20, borderRadius: 6 }}
        >
          <option value="candidate">Candidate</option>
          <option value="supervisor">Supervisor</option>
        </select>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: 14,
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          {loading ? 'Logging in…' : 'Login'}
        </button>

        <p style={{ marginTop: 20, fontSize: 14 }}>
          No account? <a href="/register" style={{ color: '#0070f3' }}>Register</a>
        </p>
      </div>
    </div>
  )
}








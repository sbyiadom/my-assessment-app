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

    // redirect based on role
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
        backgroundImage: "url('/login-bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div style={{ background: 'rgba(255,255,255,0.9)', padding: 30, borderRadius: 10, width: 360 }}>
        <h1 style={{ textAlign: 'center' }}>Stratavax Assessment</h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: 10, marginBottom: 10 }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: 10, marginBottom: 10 }}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ width: '100%', padding: 10, marginBottom: 15 }}
        >
          <option value="candidate">Candidate</option>
          <option value="supervisor">Supervisor</option>
        </select>

        <button onClick={handleLogin} disabled={loading} style={{ width: '100%', padding: 12 }}>
          {loading ? 'Logging in…' : 'Login'}
        </button>

        <p style={{ textAlign: 'center', marginTop: 15 }}>
          No account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  )
}



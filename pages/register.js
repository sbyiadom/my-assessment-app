import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('candidate')
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert('Please fill all fields')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, role } },
    })
    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }
    alert('Account created! Check your email to confirm.')
    router.push('/login')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSA5CqtFGh4hCt-hwZnJakbH4cxvlmF8DhZcQ&s')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.9)',
          padding: 38,
          borderRadius: 18,
          width: 400,
          boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
          textAlign: 'center',
        }}
      >
        <h1 style={{ marginBottom: 22, color: '#0070f3' }}>Stratavax Register</h1>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: '100%', padding: 14, marginBottom: 12, borderRadius: 8, border: '1px solid #ccc' }}
        />

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
          onClick={handleRegister}
          disabled={loading}
          style={{
            width: '100%',
            padding: 16,
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          {loading ? 'Registering…' : 'Register'}
        </button>

        <p style={{ fontSize: 14, marginTop: 15 }}>
          Already have an account? <a href="/login" style={{ color: '#0070f3', fontWeight: 'bold' }}>Login</a>
        </p>
      </div>
    </div>
  )
}


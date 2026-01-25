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
      alert('Please fill in all fields')
      return
    }

    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role,
        },
      },
    })

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    alert('Account created! Please check your email to confirm.')
    router.push('/login')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('https://images.unsplash.com/photo-1581091215368-75c5f8f92b18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzA2MHwwfDF8c2VhcmNofDR8fHVuaXZlcnNpdHklMjBzdHVkZW50fGVufDB8fHx8MTY5OTMwMjI3MA&ixlib=rb-4.0.3&q=80&w=1080')",
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
          Stratavax Register
        </h1>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: '100%', padding: 12, marginBottom: 12, borderRadius: 6 }}
        />

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
          onClick={handleRegister}
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
          {loading ? 'Registering…' : 'Register'}
        </button>

        <p style={{ marginTop: 20, fontSize: 14 }}>
          Already have an account? <a href="/login" style={{ color: '#0070f3' }}>Login</a>
        </p>
      </div>
    </div>
  )
}


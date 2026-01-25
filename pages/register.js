import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('candidate')

  const handleRegister = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role
        }
      }
    })

    if (error) {
      alert(error.message)
      return
    }

    alert('Account created. You can now log in.')
    router.push('/login')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ padding: 30, border: '1px solid #ccc', borderRadius: 8, width: 360 }}>
        <h2>Create Account</h2>

        <input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: '100%', padding: 10, marginBottom: 10 }}
        />

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

        <button onClick={handleRegister} style={{ width: '100%', padding: 12 }}>
          Register
        </button>
      </div>
    </div>
  )
}

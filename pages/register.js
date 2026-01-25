import { useState } from 'react';
import { useRouter } from 'next/router';
import AppLayout from '../components/AppLayout';
import { supabase } from '../supabase/client';

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate'
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async e => {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          name: form.name,
          role: form.role
        }
      }
    });

    if (error) {
      alert(error.message);
    } else {
      // NO email confirmation → redirect straight to login
      router.push('/login');
    }
  };

  return (
    <AppLayout background="https://media.istockphoto.com/id/1757344400/photo/smiling-college-student-writing-during-a-class-at-the-university.jpg">
      <div
        style={{
          maxWidth: 480,
          margin: 'auto',
          background: 'rgba(255,255,255,0.92)',
          padding: 35,
          borderRadius: 18,
          boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
        }}
      >
        <h1 style={{ textAlign: 'center', marginBottom: 20 }}>
          Create Your Account
        </h1>

        <form onSubmit={handleRegister}>
          <input
            name="name"
            placeholder="Full Name"
            required
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            onChange={handleChange}
            style={inputStyle}
          />

          <select
            name="role"
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="candidate">Candidate</option>
            <option value="supervisor">Supervisor</option>
          </select>

          <button style={buttonStyle}>
            Register
          </button>
        </form>
      </div>
    </AppLayout>
  );
}

const inputStyle = {
  width: '100%',
  padding: 12,
  marginBottom: 15,
  borderRadius: 8,
  border: '1px solid #ccc',
  fontSize: 15
};

const buttonStyle = {
  width: '100%',
  padding: 14,
  borderRadius: 10,
  border: 'none',
  background: 'linear-gradient(135deg, #2563eb, #1e3a8a)',
  color: '#fff',
  fontSize: 16,
  cursor: 'pointer'
};


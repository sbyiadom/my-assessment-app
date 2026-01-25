import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../supabase/client";
import AppLayout from "../components/AppLayout";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("candidate");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role, name } },
    });

    setLoading(false);

    if (error) return setError(error.message);

    router.push("/login");
  };

  return (
    <AppLayout background="/images/register-bg.jpg">
      <form
        onSubmit={handleRegister}
        style={{
          maxWidth: 400,
          margin: "auto",
          backgroundColor: "rgba(255,255,255,0.9)",
          padding: 30,
          borderRadius: 16,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Create Account</h2>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={inputStyle}
        >
          <option value="candidate">Candidate</option>
          <option value="supervisor">Supervisor</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          style={buttonStyle}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p style={{ textAlign: "center" }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#2563eb", fontWeight: "bold" }}>
            Login
          </a>
        </p>
      </form>
    </AppLayout>
  );
}

const inputStyle = {
  padding: 12,
  borderRadius: 10,
  border: "1px solid #ccc",
  fontSize: 15,
};

const buttonStyle = {
  padding: 12,
  backgroundColor: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: "bold",
};


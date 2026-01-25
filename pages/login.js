import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../supabase/client";
import AppLayout from "../components/AppLayout";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("candidate");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      setError("User not found or incorrect password");
      return;
    }

    const userRole = data.user.user_metadata.role || role; // fallback if role metadata missing

    if (userRole === "supervisor") {
      router.push("/supervisor");
    } else {
      router.push("/assessment/active"); // redirect to assessment page
    }
  };

  return (
    <AppLayout background="/images/login-bg.jpg">
      <form
        onSubmit={handleLogin}
        style={{
          backgroundColor: "rgba(255,255,255,0.9)",
          padding: 30,
          borderRadius: 12,
          width: 350,
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 15,
        }}
      >
        <h2 style={{ textAlign: "center" }}>Stratavax Assessment</h2>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        >
          <option value="candidate">Candidate</option>
          <option value="supervisor">Supervisor</option>
        </select>

        <button
          type="submit"
          style={{
            padding: 12,
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Login
        </button>

        <p style={{ textAlign: "center" }}>
          Don't have an account? <a href="/register">Register</a>
        </p>
      </form>
    </AppLayout>
  );
}











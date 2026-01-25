import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../supabase/client";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    const role = data.user.user_metadata.role;

    // 🔐 Route strictly by stored role
    if (role === "supervisor") {
      router.push("/supervisor");
    } else {
      router.push("/assessment/active");
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url('/images/login-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          backgroundColor: "rgba(255,255,255,0.92)",
          padding: 35,
          borderRadius: 16,
          width: 360,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          boxShadow: "0 30px 60px rgba(0,0,0,0.35)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 10 }}>
          Stratavax Assessment
        </h2>

        {error && (
          <p style={{ color: "red", textAlign: "center" }}>{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          style={input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          style={input}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 12,
            backgroundColor: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        <p style={{ textAlign: "center", marginTop: 10 }}>
          Don&apos;t have an account?{" "}
          <a href="/register" style={{ color: "#2563eb", fontWeight: "bold" }}>
            Register
          </a>
        </p>
      </form>
    </div>
  );
}

const input = {
  padding: 12,
  borderRadius: 10,
  border: "1px solid #ccc",
  fontSize: 15,
};












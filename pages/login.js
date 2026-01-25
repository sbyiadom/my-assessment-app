import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../supabase/client";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("candidate");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    // Check role
    const userRole = data.user.user_metadata.role;
    if (userRole !== role) {
      alert(`Selected role "${role}" does not match your registered role "${userRole}"`);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push(role === "candidate" ? "/assessment" : "/supervisor");
  };

  return (
    <div
      style={{
        backgroundImage:
          "url('https://media.istockphoto.com/id/507009337/photo/students-helping-each-other.jpg')",
        backgroundSize: "cover",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          backgroundColor: "rgba(255,255,255,0.9)",
          padding: 30,
          borderRadius: 10,
          display: "flex",
          flexDirection: "column",
          gap: 15,
          width: 350,
        }}
      >
        <h2 style={{ textAlign: "center" }}>Stratavax Assessment - Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="candidate">Candidate</option>
          <option value="supervisor">Supervisor</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}










import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../supabase/client";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("candidate");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUser) {
      setError("Email already registered");
      return;
    }

    const { error: insertError } = await supabase.from("users").insert([
      {
        name,
        email,
        password,
        role,
      },
    ]);

    if (insertError) {
      setError("Failed to register. Try again.");
      return;
    }

    alert("Registration successful! Please login.");
    router.push("/login");
  };

  return (
    <div
      style={{
        backgroundImage:
          "url('https://media.istockphoto.com/id/1757344400/photo/smiling-college-student-writing-during-a-class-at-the-university.jpg')",
        backgroundSize: "cover",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <form
        onSubmit={handleRegister}
        style={{
          backgroundColor: "rgba(255,255,255,0.9)",
          padding: 30,
          borderRadius: 12,
          width: 400,
          display: "flex",
          flexDirection: "column",
          gap: 15,
        }}
      >
        <h2 style={{ textAlign: "center" }}>Create Account</h2>

        {error && (
          <p style={{ color: "red", textAlign: "center" }}>{error}</p>
        )}

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        />

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
            backgroundColor: "#2196F3",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Register
        </button>

        <p style={{ textAlign: "center" }}>
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
}


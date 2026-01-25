import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../supabase/client";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("candidate");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Sign up user and store role in metadata
    const { data, error } = await supabase.auth.signUp(
      {
        email,
        password,
        options: {
          data: { full_name: name, role },
        },
      }
    );

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    // Auto-confirm user for instant login
    await supabase.auth.updateUser({ email_confirm: true });

    setLoading(false);
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
      }}
    >
      <form
        onSubmit={handleRegister}
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
        <h2 style={{ textAlign: "center" }}>Stratavax Assessment - Register</h2>

        <input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}


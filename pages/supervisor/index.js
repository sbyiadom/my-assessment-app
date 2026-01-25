import { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";

export default function SupervisorDashboard() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      // Fetch candidate results
      const { data, error } = await supabase
        .from("responses")
        .select(`
          id,
          assessment_id,
          question_id,
          answer_id,
          candidates (
            id,
            name,
            email
          ),
          answers (
            id,
            score,
            answer_text
          )
        `);

      if (error) {
        alert("Failed to load results");
        setLoading(false);
        return;
      }

      setResults(data || []);
      setLoading(false);
    };

    loadResults();
  }, []);

  const groupedByCandidate = results.reduce((acc, r) => {
    if (!r.candidates) return acc;
    const key = r.candidates.id;
    if (!acc[key]) acc[key] = { candidate: r.candidates, totalScore: 0, answers: [] };
    acc[key].totalScore += r.answers?.score || 0;
    acc[key].answers.push(r);
    return acc;
  }, {});

  const candidateList = Object.values(groupedByCandidate);

  if (loading) return <p style={{ textAlign: "center" }}>Loading results…</p>;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://media.istockphoto.com/id/507009337/photo/students-helping-each-other.jpg')",
        backgroundSize: "cover",
        padding: 20,
        color: "#fff",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 30 }}>
        Supervisor Dashboard
      </h1>

      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.6)",
          padding: 20,
          borderRadius: 12,
          overflowX: "auto",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #fff" }}>
              <th style={{ padding: 10 }}>Candidate Name</th>
              <th>Email</th>
              <th>Total Score</th>
              <th>Questions Answered</th>
            </tr>
          </thead>
          <tbody>
            {candidateList.map((c) => (
              <tr key={c.candidate.id} style={{ borderBottom: "1px solid #ccc" }}>
                <td style={{ padding: 10 }}>{c.candidate.name}</td>
                <td>{c.candidate.email}</td>
                <td>{c.totalScore}</td>
                <td>{c.answers.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


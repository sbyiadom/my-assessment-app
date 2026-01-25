import { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";
import AppLayout from "../../components/AppLayout";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function SupervisorDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    "emotional_intelligence",
    "learning_agility",
    "drive_for_results",
    "adaptability",
    "strategic_thinking",
    "numeracy",
    "effective_communication",
    "decision_making",
  ];

  // Fetch all candidates
  useEffect(() => {
    const fetchCandidates = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name")
        .eq("role", "candidate");
      if (error) console.error(error);
      setCandidates(data || []);
      setLoading(false);
    };
    fetchCandidates();
  }, []);

  // Fetch responses for selected candidates
  useEffect(() => {
    if (!selected.length) return setResponses([]);

    const fetchResponses = async () => {
      // Fetch answers linked to questions
      const { data, error } = await supabase
        .from("responses")
        .select(`
          candidate_id,
          question_id,
          answers!inner(score),
          questions!inner(section)
        `)
        .in("candidate_id", selected);

      if (error) console.error(error);

      setResponses(data || []);
    };

    fetchResponses();
  }, [selected]);

  // Compute category averages
  const categoryAverages = categories.map((cat) => {
    const catResponses = responses.filter((r) => r.questions.section === cat);
    if (!catResponses.length) return 0;
    const total = catResponses.reduce((sum, r) => sum + r.answers.score, 0);
    return (total / catResponses.length).toFixed(2);
  });

  const chartData = {
    labels: categories.map((c) => c.replace(/_/g, " ").toUpperCase()),
    datasets: [
      {
        label: selected.length === 1 ? "Candidate Score" : "Group Average",
        data: categoryAverages,
        backgroundColor: "rgba(54, 162, 235, 0.7)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
      title: { display: true, text: "Assessment Performance by Category" },
    },
    scales: {
      y: { min: 0, max: 5 }, // Assuming answers scored 1-5
    },
  };

  return (
    <AppLayout background="/images/supervisor-bg.jpg">
      <div style={{ maxWidth: 900, margin: "auto", color: "#fff" }}>
        <h1 style={{ textAlign: "center", marginBottom: 30 }}>Supervisor Dashboard</h1>

        {loading ? (
          <p>Loading candidates...</p>
        ) : (
          <>
            <div style={{ marginBottom: 20 }}>
              <label>Select candidates:</label>
              <select
                multiple
                value={selected}
                onChange={(e) =>
                  setSelected(Array.from(e.target.selectedOptions, (o) => o.value))
                }
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 10,
                  marginTop: 5,
                }}
              >
                {candidates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {responses.length ? (
              <div style={{ marginTop: 30 }}>
                <Bar data={chartData} options={chartOptions} />
              </div>
            ) : selected.length ? (
              <p>No responses yet for selected candidate(s).</p>
            ) : (
              <p>Select one or more candidates to view analysis.</p>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}



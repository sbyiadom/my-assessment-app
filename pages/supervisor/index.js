import { useEffect, useState } from "react";
import AppLayout from "../../components/AppLayout";
import { supabase } from "../../supabase/client";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

export default function SupervisorDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [data, setData] = useState({});

  useEffect(() => {
    const loadCandidates = async () => {
      const { data, error } = await supabase.from("users").select("*");
      if (error) return;
      setCandidates(data);
    };
    loadCandidates();
  }, []);

  useEffect(() => {
    // Here you would calculate stats/averages based on selectedCandidates
    // This is a placeholder chart
    setData({
      labels: ["Emotional Intelligence", "Learning Agility", "Drive for Results"],
      datasets: [
        {
          label: "Average Scores",
          data: [80, 70, 90],
          backgroundColor: ["#4CAF50", "#2196F3", "#FFC107"],
        },
      ],
    });
  }, [selectedCandidates]);

  return (
    <AppLayout background="/images/supervisor-bg.jpg">
      <div style={{ maxWidth: 900, margin: "auto", color: "#fff" }}>
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>Supervisor Dashboard</h2>

        <select
          multiple
          value={selectedCandidates}
          onChange={(e) => setSelectedCandidates(Array.from(e.target.selectedOptions, (o) => o.value))}
          style={{ width: "100%", padding: 10, borderRadius: 8, marginBottom: 20 }}
        >
          {candidates.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name || c.email}
            </option>
          ))}
        </select>

        <Bar data={data} />
      </div>
    </AppLayout>
  );
}





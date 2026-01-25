import { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function SupervisorDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    loadCandidates();
  }, []);

  useEffect(() => {
    if (selectedCandidates.length > 0) {
      loadAnalysis();
    } else {
      setChartData(null);
    }
  }, [selectedCandidates]);

  // Load all candidates
  const loadCandidates = async () => {
    const { data, error } = await supabase
      .from("candidates")
      .select("id, name, email");

    if (!error) setCandidates(data || []);
  };

  // Select / unselect candidates
  const toggleCandidate = (id) => {
    setSelectedCandidates((prev) =>
      prev.includes(id)
        ? prev.filter((c) => c !== id)
        : [...prev, id]
    );
  };

  // Load analysis (single or group)
  const loadAnalysis = async () => {
    const { data, error } = await supabase
      .from("responses")
      .select(`
        candidate_id,
        answers ( score ),
        questions ( section )
      `)
      .in("candidate_id", selectedCandidates);

    if (error) {
      alert("Unable to load analysis");
      return;
    }

    const sectionScores = {};

    data.forEach((row) => {
      const section = row.questions?.section;
      const score = row.answers?.score;

      if (!section || score == null) return;

      if (!sectionScores[section]) {
        sectionScores[section] = [];
      }

      sectionScores[section].push(score);
    });

    const labels = Object.keys(sectionScores).map((s) =>
      s.replace(/_/g, " ").toUpperCase()
    );

    const averages = Object.values(sectionScores).map((scores) =>
      (
        scores.reduce((sum, val) => sum + val, 0) / scores.length
      ).toFixed(2)
    );

    setChartData({
      labels,
      datasets: [
        {
          label:
            selectedCandidates.length === 1
              ? "Candidate Competency Profile"
              : "Group Average Competency Profile",
          data: averages,
          backgroundColor: "#4CAF50",
        },
      ],
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 30,
        backgroundImage:
          "url('https://media.istockphoto.com/id/1757344400/photo/smiling-college-student-writing-during-a-class-at-the-university.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 style={{ color: "#fff", textAlign: "center", marginBottom: 20 }}>
        Supervisor Assessment Dashboard
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: 20,
        }}
      >
        {/* Candidate List */}
        <div
          style={{
            background: "rgba(0,0,0,0.7)",
            padding: 15,
            borderRadius: 10,
            color: "#fff",
          }}
        >
          <h3>Select Candidates</h3>

          {candidates.map((c) => (
            <label
              key={c.id}
              style={{
                display: "block",
                marginBottom: 8,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={selectedCandidates.includes(c.id)}
                onChange={() => toggleCandidate(c.id)}
              />{" "}
              {c.name}
            </label>
          ))}
        </div>

        {/* Chart Area */}
        <div
          style={{
            background: "rgba(0,0,0,0.65)",
            padding: 20,
            borderRadius: 10,
            color: "#fff",
          }}
        >
          {!chartData ? (
            <p>
              Select one or more candidates to view individual or group
              analysis.
            </p>
          ) : (
            <Bar
              data={chartData}
              options={{
                responsive: true,
                scales: {
                  y: {
                    min: 0,
                    max: 5,
                    ticks: { color: "#fff" },
                  },
                  x: {
                    ticks: { color: "#fff" },
                  },
                },
                plugins: {
                  legend: {
                    labels: { color: "#fff" },
                  },
                },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}



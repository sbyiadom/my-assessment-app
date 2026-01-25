import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../supabase/client";
import AppLayout from "../../components/AppLayout";
import QuestionCard from "../../components/questioncard";
import Timer from "../../components/timer";

export default function AssessmentPage() {
  const router = useRouter();
  const { id } = router.query;

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!id) return;

    const loadQuestions = async () => {
      const { data, error } = await supabase
        .from("questions")
        .select("id, text, answers(id, text)")
        .order("id");

      if (error) {
        alert("Failed to load questions");
        return;
      }

      setQuestions((data || []).map((q) => ({
        ...q,
        options: q.answers || []
      })));

      setLoading(false);
    };

    loadQuestions();
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => setElapsed(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSelect = (questionId, answerId) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerId }));
  };

  const handleSubmit = async () => {
    const payload = Object.entries(answers).map(([question_id, answer_id]) => ({
      assessment_id: id,
      question_id,
      answer_id
    }));

    const { error } = await supabase.from("responses").upsert(payload);
    if (error) return alert("Failed to submit assessment");

    alert("Assessment submitted successfully");
  };

  if (loading) return <p style={{ color: "white", textAlign: "center" }}>Loading assessment…</p>;

  return (
    <AppLayout background="/images/assessment-bg.jpg">
      <div style={{ maxWidth: 800, margin: "auto" }}>
        <h1 style={{ color: "#fff", textAlign: "center" }}>Assessment</h1>

        <Timer elapsed={elapsed} totalSeconds={10800} /> {/* 3 hours */}

        {questions.map((q, idx) => (
          <QuestionCard
            key={q.id}
            number={idx + 1}
            question={q}
            selected={answers[q.id]}
            onSelect={answerId => handleSelect(q.id, answerId)}
          />
        ))}

        <button
          onClick={handleSubmit}
          style={{
            marginTop: 20,
            padding: 12,
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Submit Assessment
        </button>
      </div>
    </AppLayout>
  );
}






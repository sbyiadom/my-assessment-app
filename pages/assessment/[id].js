import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../supabase/client";

import QuestionCard from "../../component/questioncard";
import Timer from "../../component/timer";

// Shuffle function
const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

export default function AssessmentPage() {
  const router = useRouter();
  const { id } = router.query;

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!id) return;

    const loadQuestions = async () => {
      const { data, error } = await supabase
        .from("questions")
        .select(`
          id,
          section,
          question_text,
          answers (
            id,
            answer_text,
            score,
            interpretation
          )
        `)
        .order("id");

      if (error) {
        console.error("Failed to load questions:", error);
        alert("Failed to load questions: " + error.message);
        return;
      }

      setQuestions(
        (data || []).map((q, index) => ({
          ...q,
          options: shuffleArray(q.answers || []), // 🔥 shuffle answers
          number: index + 1,
        }))
      );
      setLoading(false);
    };

    loadQuestions();
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => setElapsed((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSelect = (questionId, answerId) =>
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }));

  const handleNext = () =>
    setCurrentIndex((i) => Math.min(i + 1, questions.length - 1));
  const handlePrev = () => setCurrentIndex((i) => Math.max(i - 1, 0));

  const handleSubmit = async () => {
    const payload = Object.entries(answers).map(([question_id, answer_id]) => ({
      assessment_id: id,
      question_id,
      answer_id,
    }));

    const { error } = await supabase.from("responses").upsert(payload);
    if (error) return alert("Failed to submit: " + error.message);
    alert("Assessment submitted successfully!");
    router.push("/login");
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading assessment…</p>;
  if (!questions.length) return <p>No questions available.</p>;

  const currentQuestion = questions[currentIndex];

  const sectionColors = {
    emotional_intelligence: "#FDE68A",
    learning_agility: "#A7F3D0",
    drive_for_results: "#BFDBFE",
    adaptability: "#FECACA",
    strategic_thinking: "#E0E7FF",
  };
  const bgColor = sectionColors[currentQuestion.section] || "#F3F4F6";

  return (
    <div
      style={{
        padding: 30,
        maxWidth: 700,
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
        backgroundColor: bgColor,
        minHeight: "100vh",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#1D4ED8" }}>Candidate Assessment</h1>
      <Timer elapsed={elapsed} totalSeconds={10800} />

      <QuestionCard
        key={currentQuestion.id}
        question={currentQuestion}
        number={currentQuestion.number}
        selected={answers[currentQuestion.id]}
        onSelect={(answerId) => handleSelect(currentQuestion.id, answerId)}
      />

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          style={{
            padding: "10px 20px",
            borderRadius: 6,
            border: "none",
            backgroundColor: currentIndex === 0 ? "#9CA3AF" : "#3B82F6",
            color: "#fff",
            cursor: currentIndex === 0 ? "not-allowed" : "pointer",
          }}
        >
          Previous
        </button>

        {currentIndex === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            style={{
              padding: "10px 20px",
              borderRadius: 6,
              border: "none",
              backgroundColor: "#10B981",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
        ) : (
          <button
            onClick={handleNext}
            style={{
              padding: "10px 20px",
              borderRadius: 6,
              border: "none",
              backgroundColor: "#3B82F6",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Next
          </button>
        )}
      </div>

      <p style={{ marginTop: 20, textAlign: "center", color: "#374151" }}>
        Question {currentIndex + 1} of {questions.length}
      </p>
    </div>
  );
}


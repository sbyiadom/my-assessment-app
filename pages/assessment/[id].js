import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../supabase/client";
import AppLayout from "../../components/AppLayout";
import Timer from "../../components/timer";
import QuestionCard from "../../components/questioncard";

export default function AssessmentPage() {
  const router = useRouter();
  const { id } = router.query;

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [elapsed, setElapsed] = useState(0);

  // Array of background images for assessment pages
  const backgrounds = [
    "/images/assessment-bg1.jpg",
    "/images/assessment-bg2.jpg",
    "/images/assessment-bg3.jpg",
  ];

  // Load questions from Supabase
  useEffect(() => {
    if (!id) return;

    const loadQuestions = async () => {
      const { data, error } = await supabase
        .from("questions")
        .select(`
          id,
          question_text,
          answers(id, answer_text)
        `)
        .order("id");

      if (error) {
        alert("Failed to load questions");
        setLoading(false);
        return;
      }

      // Map questions safely
      setQuestions(
        (data || []).map((q) => ({
          ...q,
          options: q.answers || [],
        }))
      );
      setLoading(false);
    };

    loadQuestions();
  }, [id]);

  // Timer for elapsed seconds
  useEffect(() => {
    const interval = setInterval(() => setElapsed((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSelect = (questionId, answerId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const handleNext = () => setCurrentIndex((i) => Math.min(i + 1, questions.length - 1));
  const handleBack = () => setCurrentIndex((i) => Math.max(i - 1, 0));

  const handleSubmit = async () => {
    if (!Object.keys(answers).length) {
      alert("Please select at least one answer before submitting!");
      return;
    }

    const payload = Object.entries(answers).map(([question_id, answer_id]) => ({
      assessment_id: id,
      question_id,
      answer_id,
    }));

    const { error } = await supabase.from("responses").upsert(payload);

    if (error) {
      alert("Failed to submit assessment");
      return;
    }

    alert("Assessment submitted successfully!");
    router.push("/"); // redirect after submission
  };

  // Safety checks
  if (loading) return <p style={{ textAlign: "center" }}>Loading assessment...</p>;
  if (!questions.length) return <p style={{ textAlign: "center" }}>No questions found.</p>;

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return <p style={{ textAlign: "center" }}>Question not found.</p>;

  const bg = backgrounds[currentIndex % backgrounds.length];

  return (
    <AppLayout background={bg}>
      <div style={{ maxWidth: 800, margin: "auto", color: "#fff" }}>
        <Timer elapsed={elapsed} totalSeconds={10800} />

        <h2 style={{ textAlign: "center", marginBottom: 20 }}>
          Question {currentIndex + 1} of {questions.length}
        </h2>

        <QuestionCard
          question={currentQuestion}
          selected={answers[currentQuestion.id]}
          onSelect={(answerId) => handleSelect(currentQuestion.id, answerId)}
        />

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 30 }}>
          <button
            onClick={handleBack}
            disabled={currentIndex === 0}
            style={{
              padding: 12,
              borderRadius: 8,
              cursor: currentIndex === 0 ? "not-allowed" : "pointer",
            }}
          >
            Back
          </button>

          {currentIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              style={{
                padding: 12,
                borderRadius: 8,
                cursor: "pointer",
                backgroundColor: "#4CAF50",
                color: "#fff",
              }}
            >
              Submit Assessment
            </button>
          ) : (
            <button
              onClick={handleNext}
              style={{
                padding: 12,
                borderRadius: 8,
                cursor: "pointer",
                backgroundColor: "#2196F3",
                color: "#fff",
              }}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}






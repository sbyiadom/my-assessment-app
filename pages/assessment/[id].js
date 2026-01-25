import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../supabase/client";
import QuestionCard from "../../component/questioncard";
import Timer from "../../component/timer";

export default function AssessmentPage() {
  const router = useRouter();
  const { id } = router.query;

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [elapsed, setElapsed] = useState(0);

  // Load questions from Supabase
  useEffect(() => {
    if (!id) return;

    const loadQuestions = async () => {
      const { data, error } = await supabase
        .from("questions")
        .select(`
          id,
          question_text,
          answers (
            id,
            answer_text
          )
        `)
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

  // Timer: increments every second
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSelect = (questionId, answerId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleSubmit = async () => {
    const payload = Object.entries(answers).map(([question_id, answer_id]) => ({
      assessment_id: id,
      question_id,
      answer_id
    }));

    const { error } = await supabase.from("responses").upsert(payload);

    if (error) {
      alert("Failed to submit assessment");
      return;
    }

    alert("Assessment submitted successfully!");
    router.push("/"); // redirect after submission
  };

  const goNext = () => setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1));
  const goPrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  if (loading) return <p style={{ textAlign: "center", marginTop: 50 }}>Loading assessment…</p>;
  if (questions.length === 0) return <p style={{ textAlign: "center", marginTop: 50 }}>No questions found.</p>;

  const currentQuestion = questions[currentIndex];

  return (
    <div
      style={{
        backgroundImage: "url('https://media.istockphoto.com/id/1757344400/photo/smiling-college-student-writing-during-a-class-at-the-university.jpg')",
        backgroundSize: "cover",
        minHeight: "100vh",
        padding: 20,
      }}
    >
      <div style={{
        backgroundColor: "rgba(255,255,255,0.9)",
        maxWidth: 700,
        margin: "0 auto",
        padding: 20,
        borderRadius: 10,
      }}>
        <h1 style={{ textAlign: "center" }}>Stratavax Assessment</h1>
        <Timer elapsed={elapsed} totalSeconds={3 * 60 * 60} />

        <p><strong>Question {currentIndex + 1} of {questions.length}:</strong></p>

        <QuestionCard
          question={currentQuestion}
          selected={answers[currentQuestion.id]}
          onSelect={(answerId) => handleSelect(currentQuestion.id, answerId)}
        />

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
          <button onClick={goPrev} disabled={currentIndex === 0}>
            Previous
          </button>
          {currentIndex < questions.length - 1 ? (
            <button onClick={goNext}>Next</button>
          ) : (
            <button onClick={handleSubmit}>Submit Assessment</button>
          )}
        </div>
      </div>
    </div>
  );
}




import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AppLayout from '../../components/AppLayout';
import { supabase } from '../../supabase/client';

export default function AssessmentPage() {
  const router = useRouter();
  const { id } = router.query;

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadQuestions = async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('id, question_text, answers(*)')
        .eq('assessment_id', id);

      if (error) {
        console.error(error);
      } else {
        setQuestions(data);
      }
      setLoading(false);
    };

    loadQuestions();
  }, [id]);

  const handleSelect = (questionId, answerId) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerId }));
  };

  const handleSubmit = async () => {
    // Save responses logic here
    alert('Assessment submitted successfully');
    router.push('/thank-you');
  };

  if (loading) return <p>Loading assessment...</p>;

  return (
    <AppLayout background="https://media.istockphoto.com/id/507009337/photo/students-helping-each-other.jpg">
      <div
        style={{
          maxWidth: 900,
          margin: 'auto',
          background: 'rgba(255,255,255,0.95)',
          padding: 30,
          borderRadius: 16,
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        }}
      >
        <h1 style={{ marginBottom: 20 }}>Assessment</h1>

        {questions.map((q, index) => (
          <div key={q.id} style={{ marginBottom: 25 }}>
            <p><strong>{index + 1}. {q.question_text}</strong></p>

            {q.answers.map(a => (
              <label key={a.id} style={{ display: 'block', marginTop: 8 }}>
                <input
                  type="radio"
                  name={q.id}
                  checked={answers[q.id] === a.id}
                  onChange={() => handleSelect(q.id, a.id)}
                />{' '}
                {a.answer_text}
              </label>
            ))}
          </div>
        ))}

        <button
          onClick={handleSubmit}
          style={{
            marginTop: 20,
            padding: '12px 24px',
            borderRadius: 8,
            border: 'none',
            background: '#1e40af',
            color: '#fff',
            fontSize: 16,
            cursor: 'pointer'
          }}
        >
          Submit Assessment
        </button>
      </div>
    </AppLayout>
  );
}





import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../supabase/client'

export default function AssessmentPage() {
  const router = useRouter()
  const { id } = router.query

  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const loadQuestions = async () => {
      const { data } = await supabase
        .from('questions')
        .select(`
          id,
          question_text,
          answers (
            id,
            answer_text
          )
        `)
        .order('id')

      setQuestions(data || [])
      setLoading(false)
    }
    loadQuestions()
  }, [id])

  if (loading) return <p style={{ textAlign: 'center' }}>Loading assessment…</p>
  if (!questions.length) return <p>No questions found.</p>

  const q = questions[current]

  const handleNext = () => {
    if (current < questions.length - 1) setCurrent(current + 1)
  }
  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1)
  }

  const selectAnswer = (qid, aid) => {
    setAnswers(prev => ({ ...prev, [qid]: aid }))
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url('https://media.istockphoto.com/id/507009337/photo/students-helping-each-other.jpg?s=612x612&w=0&k=20&c=993wW_Qvl_LW27TaeXJy2KHYd5tUix3n1dFZXPSkEBU=')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: 20,
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: 15 }}>Assessment</h2>

      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: 22,
          margin: 'auto',
          maxWidth: 720,
          boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
        }}
      >
        <p style={{ fontSize: 16, marginBottom: 10 }}>
          Question {current + 1} of {questions.length}
        </p>

        <h3 style={{ marginBottom: 15 }}>{q.question_text}</h3>

        {q.answers.map(o => (
          <div key={o.id} style={{ marginBottom: 12 }}>
            <label style={{ cursor: 'pointer' }}>
              <input
                type="radio"
                name={q.id}
                onChange={() => selectAnswer(q.id, o.id)}
                checked={answers[q.id] === o.id}
              />
              {' '}
              {o.answer_text}
            </label>
          </div>
        ))}

        <div style={{ marginTop: 25, display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={handlePrev}
            disabled={current === 0}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              background: '#6c757d',
              color: '#fff',
              border: 'none',
            }}
          >
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={current === questions.length - 1}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              background: '#0070f3',
              color: '#fff',
              border: 'none',
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}



import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../supabase/client'

export default function AssessmentPage() {
  const router = useRouter()
  const { id } = router.query
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const load = async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('id, text, answers(id, text)')
        .order('id')

      if (error) {
        alert('Failed to load questions')
        return
      }

      setQuestions(
        (data || []).map(q => ({
          ...q,
          options: q.answers || []
        }))
      )

      setLoading(false)
    }

    load()
  }, [id])

  if (loading) return <p>Loading…</p>

  return (
    <div style={{ padding: 30 }}>
      <h1>Assessment</h1>

      {questions.map((q, index) => (
        <div key={q.id} style={{ marginBottom: 25 }}>
          <h3>{index + 1}. {q.text}</h3>

          {q.options.map(o => (
            <label key={o.id} style={{ display: 'block' }}>
              <input
                type="radio"
                name={q.id}
                onChange={() =>
                  setAnswers(prev => ({ ...prev, [q.id]: o.id }))
                }
              />
              {o.text}
            </label>
          ))}
        </div>
      ))}
    </div>
  )
}

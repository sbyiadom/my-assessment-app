import { useEffect, useState } from 'react';
import { supabase } from '../../supabase/client';

export default function SupervisorDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      const { data, error } = await supabase
        .from('responses')
        .select(`
          assessment_id,
          question_id,
          answer_id,
          assessments (
            id,
            candidate_id,
            candidates (
              name
            )
          ),
          questions (
            section,
            question_text
          ),
          answers (
            answer_text,
            score,
            interpretation
          )
        `)
        .order('assessment_id', { ascending: true });

      if (error) {
        console.error('Failed to fetch reports:', error);
        alert('Failed to load supervisor reports');
        return;
      }

      setReports(data);
      setLoading(false);
    };

    fetchReports();
  }, []);

  if (loading) return <p>Loading supervisor reports…</p>;

  // Group by candidate
  const grouped = reports.reduce((acc, r) => {
    const candidateId = r.assessments.candidate_id;
    if (!acc[candidateId]) {
      acc[candidateId] = {
        name: r.assessments.candidates.name,
        assessments: []
      };
    }
    acc[candidateId].assessments.push({
      assessmentId: r.assessment_id,
      section: r.questions.section,
      question: r.questions.question_text,
      answer: r.answers.answer_text,
      score: r.answers.score,
      interpretation: r.answers.interpretation
    });
    return acc;
  }, {});

  return (
    <div style={{ padding: 20 }}>
      <h1>Supervisor Dashboard</h1>
      {Object.values(grouped).map((c) => (
        <div key={c.name} style={{ marginBottom: 30, border: '1px solid #ccc', padding: 15, borderRadius: 8, background: '#f2f2f2' }}>
          <h2>{c.name}</h2>
          {c.assessments.map((a, idx) => (
            <div key={idx} style={{ marginBottom: 10, padding: 10, background: '#fff', borderRadius: 5, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <strong>{a.section.toUpperCase()}</strong>: {a.question} <br/>
              <em>Answer:</em> {a.answer} <br/>
              <em>Score:</em> {a.score} <br/>
              <em>Interpretation:</em> {a.interpretation}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

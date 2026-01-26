import { supabase } from './client';

export async function getAssessmentQuestions() {
  const { data, error } = await supabase
    .from('questions')
    .select('id, question_text, answers(id, answer_text)')
    .order('id');

  if (error) throw error;

  return (data || []).map(q => ({ ...q, options: q.answers || [] }));
}

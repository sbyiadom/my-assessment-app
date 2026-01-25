import { supabase } from './client';

export async function saveResponse(assessment_id, question_id, answer_id) {
  const { data, error } = await supabase.from('responses').upsert({
    assessment_id,
    question_id,
    answer_id
  });
  if (error) throw error;
  return data;
}

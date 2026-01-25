import { supabase } from './client';

export async function getAssessmentQuestions() {
  const { data, error } = await supabase.from('questions').select('*');
  if (error) throw error;
  return data;
}

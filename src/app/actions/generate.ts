'use server';

import { generateSpec, GeneratedSpec } from '@/utils/ai';

export async function generateSpecAction(prompt: string): Promise<{ success: boolean; data?: GeneratedSpec; error?: string }> {
  try {
    if (!prompt) {
      return { success: false, error: 'Prompt is required' };
    }

    const data = await generateSpec(prompt);
    return { success: true, data };
  } catch (error) {
    console.error('AI Generation Error:', error);
    return { success: false, error: 'Failed to generate specification. Please try again.' };
  }
}

import type { NextApiRequest, NextApiResponse } from 'next';
import generateResponse from '../../utils/generateResponse';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { query, context } = req.body

  if (!query || !context) {
    return res.status(400).json({ error: 'Query and context are required' })
  }

  try {
    // هنا يتم توليد الاستجابة باستخدام query و context
    // استبدل هذا بمنطق توليد الاستجابة الفعلي الخاص بك
    const generatedResponse = await generateResponse(query,context);

    res.status(200).json({ generatedResponse })
  } catch (error) {
    console.error('Error generating response:', error)
    res.status(500).json({ error: 'Failed to generate response' })
  }
}
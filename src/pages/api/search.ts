import type { NextApiRequest, NextApiResponse } from 'next';
import search from '../../utils/search';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { query } = req.body;

    // التحقق من صحة الاستعلام
    if (!query || typeof query !== 'string' || query.trim() === '') {
      return res.status(400).json({ error: 'Search query cannot be empty.' });
    }

    try {
      const results = await search(query);
      res.status(200).json(results);
    } catch (error) {
      console.error('Error during search:', error);
      res.status(500).json({ error: 'Internal server error occurred. Please try again later.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
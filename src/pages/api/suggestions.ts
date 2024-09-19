import type { NextApiRequest, NextApiResponse } from 'next'

// هذه قائمة مؤقتة للاقتراحات. في التطبيق الفعلي، قد ترغب في جلبها من قاعدة بيانات أو API.
const sampleSuggestions = [
  'كيف أتعلم البرمجة؟',
  'ما هي لغة JavaScript؟',
  'كيفية إنشاء تطبيق ويب؟',
  'ما هو React.js؟',
  'كيف أستخدم Git؟',
  'ما هي قواعد البيانات؟',
  'كيف أصبح مطور ويب؟',
  'ما هو الذكاء الاصطناعي؟',
  'كيف أتعلم تطوير تطبيقات الموبايل؟',
  'ما هي البرمجة الموجهة للكائنات؟'
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query;
  
  if (typeof query !== 'string') {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  const filteredSuggestions = sampleSuggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(query.toLowerCase())
  );

  res.status(200).json(filteredSuggestions.slice(0, 5));
}
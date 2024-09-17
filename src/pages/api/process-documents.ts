import { NextApiRequest, NextApiResponse } from 'next'
import processDocuments from '../../utils/processDocuments'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      await processDocuments()
      res.status(200).json({ message: 'Documents processed successfully' })
    } catch (error) {
      console.error('Error processing documents:', error)
      res.status(500).json({ error: 'Error processing documents', details: error.message })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
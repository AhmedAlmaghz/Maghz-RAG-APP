import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'

interface ResponseCardProps {
  response: string
}

export default function ResponseCard({ response }: ResponseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 bg-opacity-50 rounded-lg p-6 shadow-lg"
    >
      <h2 className="text-2xl font-semibold mb-4 text-primary-300">الإستجابة :</h2>
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown>{response}</ReactMarkdown>
      </div>
    </motion.div>
  )
}
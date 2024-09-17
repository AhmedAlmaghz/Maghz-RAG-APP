import { motion } from 'framer-motion'
import { XCircleIcon } from '@heroicons/react/solid'

interface ErrorMessageProps {
  message: string
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-red-500 text-white p-4 rounded-lg shadow-lg flex items-center"
    >
      <XCircleIcon className="h-6 w-6 mr-2" />
      <span>{message}</span>
    </motion.div>
  )
}
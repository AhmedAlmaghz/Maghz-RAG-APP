import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface ProcessingStatusProps {
  isProcessing: boolean
}

export default function ProcessingStatus({ isProcessing }: ProcessingStatusProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10))
      }, 500)
      return () => clearInterval(interval)
    } else {
      setProgress(0)
    }
  }, [isProcessing])

  if (!isProcessing) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed bottom-4 right-4 bg-gray-800 p-4 rounded-lg shadow-lg"
    >
      <h3 className="text-lg font-semibold mb-2">Processing Documents</h3>
      <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  )
}
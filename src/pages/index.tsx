import { useState } from 'react'
import Head from 'next/head'
import '../styles/globals.css'
import { motion, AnimatePresence } from 'framer-motion'
import SearchBox from '../components/SearchBox'
import ProcessingStatus from '../components/ProcessingStatus'
import ErrorMessage from '../components/ErrorMessage'
import ResponseCard from '../components/ResponseCard'
import search from '../utils/search'
import generateResponse from '../utils/generateResponse'
// import ParticleBackground from '../components/ParticleBackground'
import dynamic from 'next/dynamic'

import axios from 'axios'

const ParticleBackground = dynamic(() => import('../components/ParticleBackground'), {
  ssr: false,
})

export default function Home() {
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (query: string) => {
    setLoading(true)
    setError('')
    try {
      // const searchResults = await search(query)
      const response = await axios.post('http://localhost:3001/search', { query })
      const searchResults = response.data

      const context = searchResults.map(r => r.pageContent).join('\n\n')
      const generatedResponse = await generateResponse(query, context)
      setResponse(generatedResponse)
    } catch (error) {
      console.error('Error during search:', error)
      setError('An error occurred while processing your request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleProcessDocuments = async () => {
    setProcessing(true)
    setError('')
    try {
      const res = await fetch('/api/process-documents', { method: 'POST' })
      if (!res.ok) throw new Error('Failed to process documents')
      alert('Documents processed successfully')
    } catch (error) {
      console.error('Error processing documents:', error)
      setError('Error processing documents. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
    <ParticleBackground />
    <div className="relative z-10">
      <Head>
        <title>Futuristic RAG Search</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-16">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-secondary-400"
        >
          Futuristic RAG Search
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <SearchBox onSearch={handleSearch} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center mb-8"
        >
          <button
            onClick={handleProcessDocuments}
            disabled={processing}
            className="px-6 py-3 bg-secondary-500 text-white rounded-full font-semibold hover:bg-secondary-600 transition-colors duration-300 disabled:opacity-50"
          >
            {processing ? 'Processing...' : 'Process Documents'}
          </button>
        </motion.div>

        <AnimatePresence>
          {loading && (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center"
            >
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <ErrorMessage message={error} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {response && !loading && (
            <ResponseCard key="response" response={response} />
          )}
        </AnimatePresence>

        <ProcessingStatus isProcessing={processing} />
      </main>
    </div>
    </div>
  )
}
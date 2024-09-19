import { useState } from 'react';
import Head from 'next/head';
import '../styles/globals.css';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBox from '../components/SearchBox';
import ProcessingStatus from '../components/ProcessingStatus';
import ErrorMessage from '../components/ErrorMessage';
import ResponseCard from '../components/ResponseCard';
import ParticleBackground from '../components/ParticleBackground';
import SearchResults from '../components/SearchResults';


export default function Home() {
  const [response, setResponse] = useState('');
  const [listSearchResults, setListSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (query: string, context: string) => {
    try {
      if (!query.trim() || !context.trim()) {
        throw new Error('Query or context cannot be empty');
      }

      const res = await fetch('/api/generate-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, context }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to generate response');
      }

      const results = await res.json();
      // console.log(results.generatedResponse);
      setResponse(results.generatedResponse);
    } catch (error) {
      console.error('Error generating response:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while generating the response');
    }
  };

  const handleSearch = async (query: string) => {
    // تحقق من أن الاستعلام ليس فارغًا
    if (!query.trim()) {
      setError('Search query cannot be empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        const errorDetails = await res.json();
        throw new Error(`Failed to search: ${errorDetails.error}`);
      }

      const results = await res.json();
      setListSearchResults(results);
      const context = results.map((r: any) => r.pageContent).join('\n\n');
      
      if (context.trim()) {
        await handleGenerate(query, context);
      } else {
        setError('No relevant context found for the query');
      }
    } catch (error) {
      console.error('Error during search:', error);
      setError(
        error instanceof Error ? error.message : 'An error occurred while processing your request. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleProcessDocuments = async () => {
    setProcessing(true);
    setError('');

    try {
      const res = await fetch('/api/process-documents', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to process documents');
      alert('Documents processed successfully');
    } catch (error) {
      console.error('Error processing documents:', error);
      setError('Error processing documents. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden" dir='rtl'>
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
          
          <AnimatePresence>
            {listSearchResults.length > 0 && (
              <SearchResults results={listSearchResults} />
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="absolute top-4 end-4 flex justify-center mb-8"
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
  );
}
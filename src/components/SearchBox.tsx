import { useState } from 'react'
import { SearchIcon } from '@heroicons/react/solid'
import { motion } from 'framer-motion'

interface SearchBoxProps {
  onSearch: (query: string) => void
}

export default function SearchBox({ onSearch }: SearchBoxProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-4 pr-12 text-lg bg-black bg-opacity-20 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        placeholder="Ask me anything..."
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="absolute right-3 top-3 p-2 bg-primary-500 rounded-full text-white"
      >
        <SearchIcon className="h-6 w-6" />
      </motion.button>
    </form>
  )
}
import React from 'react';
import { motion } from 'framer-motion';

interface SearchResult {
  pageContent: string;
  metadata: {
    filename: string;
  };
}

interface SearchResultsProps {
  results: SearchResult[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mt-8 bg-gray-800 rounded-lg shadow-lg overflow-hidden opacity"
    >
      <table className="w-full text-sm text-right text-gray-300">
        <thead className="text-xs uppercase bg-gray-700 text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">المحتوى</th>
            <th scope="col" className="px-6 py-3">المصدر</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index} className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
              <td className="px-6 py-4 font-medium whitespace-nowrap">
                {result.pageContent.substring(0, 100)}...
              </td>
              <td className="px-6 py-4">{result.metadata.filename}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default SearchResults;
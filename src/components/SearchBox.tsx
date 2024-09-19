import React, { useState, useCallback, useEffect } from 'react';
import Autosuggest from 'react-autosuggest';
import { debounce } from 'lodash';
import { SearchIcon } from '@heroicons/react/solid';
import { motion } from 'framer-motion';

interface SearchBoxProps {
  onSearch: (query: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [defaultSuggestions, setDefaultSuggestions] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    // جلب الاقتراحات الافتراضية عند تحميل المكون
    fetch('/api/suggestions')
      .then(res => res.json())
      .then(setDefaultSuggestions)
      .catch(console.error);
  }, []);

  const getSuggestions = async (value: string) => {
    if (value.length < 2) return defaultSuggestions;
    
    try {
      const response = await fetch(`/api/suggestions?query=${encodeURIComponent(value)}`);
      if (!response.ok) throw new Error('فشل في جلب الاقتراحات');
      return await response.json();
    } catch (error) {
      console.error('خطأ في جلب الاقتراحات:', error);
      return [];
    }
  };

  const debouncedGetSuggestions = useCallback(
    debounce((value: string) => {
      getSuggestions(value).then(setSuggestions);
    }, 300),
    []
  );

  const onChange = (event: React.FormEvent<HTMLElement>, { newValue }: Autosuggest.ChangeEvent) => {
    setValue(newValue);
  };

  const onSuggestionsFetchRequested = ({ value }: Autosuggest.SuggestionsFetchRequestedParams) => {
    debouncedGetSuggestions(value);
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onSuggestionSelected = (event: React.FormEvent<HTMLElement>, { suggestion }: Autosuggest.SuggestionSelectedEventData<string>) => {
    onSearch(suggestion);
  };

  const inputProps = {
    placeholder: 'ابحث هنا...',
    value,
    onChange: onChange,
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    className:'w-full p-4 pr-12 text-lg bg-black bg-opacity-20 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSearch(value); }} className="mb-8 relative">
      <Autosuggest
        suggestions={value === '' && isFocused ? defaultSuggestions : suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        onSuggestionSelected={onSuggestionSelected}
        getSuggestionValue={(suggestion) => suggestion}
        renderSuggestion={(suggestion) => <div className="p-2 hover:bg-gray-700">{suggestion}</div>}
        inputProps={inputProps}
        theme={{
          container: 'relative',
          suggestionsContainer: 'absolute w-full bg-gray-800 rounded-b-lg shadow-lg z-10 mt-1',
          suggestionsList: 'list-none m-0 p-0',
          suggestion: 'cursor-pointer',
        }}
      />
      <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      type="submit"
      className="absolute end-3 top-3 p-2 bg-primary-500 rounded-full text-white"
    >
      <SearchIcon className="h-6 w-6" />
    </motion.button>
    </form>
  );
};

export default SearchBox;
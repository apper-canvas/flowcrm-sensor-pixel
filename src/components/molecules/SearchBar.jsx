import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  className = '',
  debounceMs = 300 
}) => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  // Debounce search
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (onSearch) {
      clearTimeout(window.searchTimeout);
      window.searchTimeout = setTimeout(() => {
        onSearch(value);
      }, debounceMs);
    }
  };

  const clearSearch = () => {
    setQuery('');
    if (onSearch) onSearch('');
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" 
        />
        
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className={`
            w-full pl-10 pr-10 py-2.5 border rounded-lg
            transition-all duration-200 focus:outline-none focus:ring-2
            ${focused 
              ? 'border-primary focus:ring-primary/20' 
              : 'border-gray-300 hover:border-gray-400'
            }
            bg-white
          `}
        />
        
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100"
          >
            <ApperIcon name="X" className="w-3 h-3 text-gray-400" />
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
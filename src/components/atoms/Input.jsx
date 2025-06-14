import { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = ({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  icon,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  const hasValue = value && value.length > 0;
  const shouldFloat = focused || hasValue;

  return (
    <div className={`relative ${className}`}>
      {/* Floating label */}
      {label && (
        <label
          className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
            shouldFloat
              ? 'text-xs text-primary -translate-y-2.5 bg-white px-1'
              : 'text-gray-500 translate-y-2.5'
          }`}
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            <ApperIcon name={icon} className="w-4 h-4 text-gray-400" />
          </div>
        )}
        
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={focused ? placeholder : ''}
          disabled={disabled}
          className={`
            w-full px-3 py-3 ${icon ? 'pl-10' : ''} border rounded-lg
            transition-all duration-200 focus:outline-none focus:ring-2
            ${error 
              ? 'border-error focus:ring-error/20 focus:border-error' 
              : 'border-gray-300 focus:ring-primary/20 focus:border-primary'
            }
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
          `}
          {...props}
        />
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-error flex items-center">
          <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
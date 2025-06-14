import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorState = ({ 
  title = "Something went wrong", 
  message, 
  onRetry,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`text-center py-12 ${className}`}
    >
      <div className="mb-6">
        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="AlertTriangle" className="w-8 h-8 text-error" />
        </div>
        
        <h3 className="text-lg font-heading font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        
        {message && (
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            {message}
          </p>
        )}
      </div>
      
      {onRetry && (
        <Button onClick={onRetry} variant="outline" icon="RefreshCw">
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default ErrorState;
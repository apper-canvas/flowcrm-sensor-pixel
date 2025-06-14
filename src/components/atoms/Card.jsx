import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = false,
  onClick,
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-sm border border-gray-200';
  const hoverClasses = hover ? 'hover:shadow-md cursor-pointer' : '';

  const CardComponent = onClick || hover ? motion.div : 'div';
  const motionProps = onClick || hover ? {
    whileHover: { scale: 1.02, y: -2 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <CardComponent
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
      {...(onClick || hover ? motionProps : {})}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

export default Card;
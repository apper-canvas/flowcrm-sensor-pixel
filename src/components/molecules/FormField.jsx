import Input from '@/components/atoms/Input';

const FormField = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  required = false,
  placeholder,
  icon,
  className = '',
  ...props 
}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(name, e.target.value);
    }
  };

  return (
    <div className={className}>
      <Input
        type={type}
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        error={error}
        icon={icon}
        required={required}
        {...props}
      />
    </div>
  );
};

export default FormField;
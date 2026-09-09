import React from 'react';
import './Button.css';

/**
 * Reusable Button Component
 * Supports variants: 'primary', 'secondary', 'outline', 'danger'
 * Sizes: 'sm', 'md', 'lg'
 */
const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  icon: Icon = null,
  className = ''
}) => {
  const buttonClasses = `btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${className}`;

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && <Icon className="btn-icon" size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} />}
      <span>{children}</span>
    </button>
  );
};

export default Button;

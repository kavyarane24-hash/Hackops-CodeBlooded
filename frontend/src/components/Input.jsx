import React from 'react';
import './Input.css';

/**
 * Reusable Accessible Input Component
 * Supports labels, placeholders, errors, icons, helper text, and HTML input types
 */
const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error = '',
  helperText = '',
  required = false,
  options = [],
  icon: Icon = null,
  className = ''
}) => {
  return (
    <div className={`input-field-wrapper ${className}`}>
      {label && (
        <label htmlFor={name} className="input-label">
          {label} {required && <span className="required-star">*</span>}
        </label>
      )}

      <div className={`input-container ${error ? 'input-error' : ''}`}>
        {Icon && <Icon className="input-icon" size={18} />}
        {type === 'select' ? (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="custom-input custom-select"
          >
            {options && options.map((opt) => (
              <option key={opt.value || opt} value={opt.value || opt}>
                {opt.label || opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="custom-input"
          />
        )}
      </div>

      {error ? (
        <span className="input-error-msg">{error}</span>
      ) : (
        helperText && <span className="input-helper-msg">{helperText}</span>
      )}
    </div>
  );
};

export default Input;

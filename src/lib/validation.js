import React from 'react';

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateMinLength = (value, min) => {
  return value && value.length >= min;
};

export const validateMaxLength = (value, max) => {
  return value && value.length <= max;
};

export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateURL = validateUrl;

export const validatePhone = (phone) => {
  if (!phone) return false;
  const normalized = phone.replace(/[^\d]/g, '');
  if (normalized.length < 10 || normalized.length > 15) {
    return false;
  }
  return /^\+?[\d\s\-()]+$/.test(phone);
};

export const validateNumber = (value) => {
  return !isNaN(value) && value !== '';
};

export const useFormValidation = (initialValues = {}) => {
  const [values, setValues] = React.useState(initialValues);
  const [errors, setErrors] = React.useState({});

  const validate = (name, value, validators = []) => {
    if (!validators || validators.length === 0) return true;
    for (const rule of validators) {
      const error = rule(value);
      if (error) {
        setErrors((prev) => ({ ...prev, [name]: error }));
        return false;
      }
    }
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
    return true;
  };

  const validateAll = (validatorsByField = {}, currentValues = values) => {
    let isValid = true;
    Object.entries(validatorsByField).forEach(([field, validators]) => {
      const ok = validate(field, currentValues[field], validators);
      if (!ok) isValid = false;
    });
    return isValid;
  };

  const clearError = (name) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const setError = (name, message) => {
    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  return {
    values,
    setValues,
    errors,
    validate,
    validateAll,
    clearError,
    setError,
  };
};

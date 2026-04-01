/**
 * Validation utilities for forms
 */

// Full Name validation
export const validateFullName = (fullName: string): { valid: boolean; error?: string } => {
  const trimmed = fullName.trim();

  // Check if empty
  if (!trimmed) {
    return { valid: false, error: 'Họ tên không được để trống' };
  }

  // Check length (2-50 characters)
  if (trimmed.length < 2) {
    return { valid: false, error: 'Họ tên phải có ít nhất 2 ký tự' };
  }

  if (trimmed.length > 50) {
    return { valid: false, error: 'Họ tên không được vượt quá 50 ký tự' };
  }

  // Check if all whitespace
  if (trimmed === '') {
    return { valid: false, error: 'Họ tên không được toàn khoảng trắng' };
  }

  // Regex: Allow letters (including Vietnamese), spaces, and hyphens
  // Pattern: ^[A-Za-zÀ-ỹ\s\-]+$
  const nameRegex = /^[A-Za-zÀ-ỹ\s\-]+$/;
  if (!nameRegex.test(trimmed)) {
    return {
      valid: false,
      error: 'Họ tên không được chứa số hoặc ký tự đặc biệt (trừ dấu cách và gạch nối)',
    };
  }

  return { valid: true };
};

// Email validation
export const validateEmail = (email: string): { valid: boolean; error?: string } => {
  const trimmed = email.trim();

  // Check if empty
  if (!trimmed) {
    return { valid: false, error: 'Email không được để trống' };
  }

  // Email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Email không hợp lệ' };
  }

  return { valid: true };
};

// Phone number validation (Vietnam)
export const validatePhoneNumber = (phone: string): { valid: boolean; error?: string } => {
  const trimmed = phone.trim();

  // Check if empty
  if (!trimmed) {
    return { valid: false, error: 'Số điện thoại không được để trống' };
  }

  // Check if only numbers
  if (!/^\d+$/.test(trimmed)) {
    return { valid: false, error: 'Số điện thoại chỉ được chứa chữ số' };
  }

  // Check length (10 numbers for Vietnam)
  if (trimmed.length !== 10) {
    return { valid: false, error: 'Số điện thoại phải có đúng 10 chữ số' };
  }

  // Check Vietnamese phone number format (03, 05, 07, 08, 09)
  const vietnamPhoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;
  if (!vietnamPhoneRegex.test(trimmed)) {
    return {
      valid: false,
      error: 'Số điện thoại không hợp lệ. Vui lòng kiểm tra đầu số (03, 05, 07, 08, 09)',
    };
  }

  return { valid: true };
};

// Password validation
export const validatePassword = (password: string): { valid: boolean; error?: string } => {
  const trimmed = password.trim();

  // Check if empty
  if (!trimmed) {
    return { valid: false, error: 'Mật khẩu không được để trống' };
  }

  // Check minimum length (8 characters)
  if (trimmed.length < 8) {
    return { valid: false, error: 'Mật khẩu phải có ít nhất 8 ký tự' };
  }

  // Check for whitespace
  if (/\s/.test(password)) {
    return { valid: false, error: 'Mật khẩu không được chứa khoảng trắng' };
  }

  return { valid: true };
};

// Confirm password validation
export const validateConfirmPassword = (
  password: string,
  confirmPassword: string,
): { valid: boolean; error?: string } => {
  if (!confirmPassword) {
    return { valid: false, error: 'Xác nhận mật khẩu không được để trống' };
  }

  if (password !== confirmPassword) {
    return { valid: false, error: 'Mật khẩu xác nhận không khớp' };
  }

  return { valid: true };
};

// Address validation
export const validateAddress = (address: string): { valid: boolean; error?: string } => {
  const trimmed = address.trim();

  if (!trimmed) {
    return { valid: false, error: 'Địa chỉ không được để trống' };
  }

  if (trimmed.length < 5) {
    return { valid: false, error: 'Địa chỉ phải có ít nhất 5 ký tự' };
  }

  if (trimmed.length > 200) {
    return { valid: false, error: 'Địa chỉ không được vượt quá 200 ký tự' };
  }

  return { valid: true };
};

// Trim input values
export const trimInput = (value: string): string => {
  return value.trim();
};

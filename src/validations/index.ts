// src/validations/index.ts
import * as yup from 'yup';

export const loginValidationSchema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});


export const signUpValidationSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match') // Removed `null`
    .required('Confirm password is required'),
  avatar: yup
    .mixed()
    .test('fileSize', 'File size too large', (value) => {
      if (!value || !Array.isArray(value) || value.length === 0) {
        return true;
      }

      return value[0].size <= 2000000; 
    }),
});

export const blogValidationSchema = (isUpdate: boolean = false) => {
  return yup.object().shape({
    title: yup
      .string()
      .required('Title is required')
      .min(5, 'Title should be at least 5 characters'),

    body: yup
      .string()
      .required('Body is required')
      .min(20, 'Body should be at least 20 characters'),

    image: isUpdate
      ? yup.mixed().nullable() // Optional for update
      : yup.mixed().required('Image is required'), // Required for create
  });
};

// src/app/auth/signup/page.tsx

"use client";

import { FormProvider, Resolver, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signUpValidationSchema } from '../../../validations';
import InputController from '../../../components/common/InputController';
import { SignupInput, User, signup } from '../../../queries/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export interface SignupFormInputs {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  confirmPassword: string;
  avatar: File | null;
}

export default function Signup() {
  const methods = useForm<SignupFormInputs>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(signUpValidationSchema) as unknown as Resolver<SignupFormInputs, any> | undefined,
  });
  const router = useRouter();
  const [error, setError] = useState('');
  const queryClient = useQueryClient();
  
  // Use the signup mutation with React Query
  const mutation = useMutation<User, Error, SignupInput>({
    mutationFn: signup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sign-up'] });
      router.push('/auth/signin')
    },
    onError: ()=> {
      setError('Failed to register!')
    }
  });

  const onSubmit = (data: SignupFormInputs) => {
    const { email, password, firstName, lastName, avatar } = data;
    mutation.mutate({ email, password, firstName, lastName, avatar });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">

        <h2 className="text-2xl font-bold mb-2 text-center">Create an Account</h2>
        <p className="text-center mb-6 text-gray-600">Sign up to get started</p>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <InputController name="firstName" label="First Name" type="text" placeholder="Enter first name" />
            <InputController name="lastName" label="Last Lane" type="text" placeholder="Enter last name" />
            <InputController name="email" label="Email" type="email" placeholder="Enter your email" />
            <InputController name="password" label="Password" type="password" placeholder="Enter your password" />
            <InputController name="confirmPassword" label="Confirm Password" type="password" placeholder="Confirm your password" />
            <InputController name="avatar" label="Avatar" type="file" />

            <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
              Sign Up
            </button>
          </form>
        </FormProvider>

        {/* Sign in link */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/auth/signin" className="font-semibold text-blue-500 hover:text-blue-600">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

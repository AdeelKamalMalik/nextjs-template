  // src/app/auth/signin/page.tsx
  "use client";

  import { FormProvider, Resolver, useForm } from 'react-hook-form';
  import { yupResolver } from '@hookform/resolvers/yup';
  import { loginValidationSchema } from '../../../validations';
  import InputController from '../../../components/common/InputController';
  import { LoginInput, LoginResponse, login } from '../../../queries/auth';
  import { useMutation } from '@tanstack/react-query';
  import { useRouter } from 'next/navigation';
  import { useState } from 'react';
  import Link from 'next/link';

  export default function SignIn() {
    const methods = useForm<LoginInput>({
      resolver: yupResolver(loginValidationSchema) as unknown as Resolver<LoginInput, any> | undefined,
    });
    const router = useRouter();
    const [error, setError] = useState('');

    // Use the login mutation with React Query
    const mutation = useMutation<LoginResponse, Error, LoginInput>({
      mutationFn: login,
      onSuccess: (data) => {
        localStorage.setItem('jwt', data.jwt);
        window.location.href = '/blogs'
      },
      onError: () => {
        setError('Invalid email or password.');
      },
    });

    const onSubmit = (data: LoginInput) => {
      mutation.mutate(data);
    };

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-2 text-center">Welcome Back</h2>
          <p className="text-center mb-6 text-gray-600">Please sign in to continue</p>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
              <InputController name="email" label="Email" type="email" placeholder="Enter your email" />
              <InputController name="password" label="Password" type="password" placeholder="Enter your password" />
              <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                Sign In
              </button>
            </form>
          </FormProvider>

          {/* Sign up link */}
          <p className="mt-4 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="font-semibold text-blue-500 hover:text-blue-600">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    );
  }

// src/components/InputController.tsx
"use client";

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

interface InputControllerProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'file';
  placeholder?: string;
}

export default function InputController({
  name,
  label,
  type = 'text',
  placeholder,
}: InputControllerProps) {
  const { register, formState: { errors } } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col mb-4">
      <label htmlFor={name} className="text-sm font-medium mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          placeholder={placeholder}
          {...register(name)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-2 text-gray-600"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name]?.message as string}</p>
      )}
    </div>
  );
}

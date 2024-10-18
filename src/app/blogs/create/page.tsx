"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBlog } from '../../../queries/blog';
import { useForm, FormProvider, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { blogValidationSchema } from '../../../validations';
import InputController from '../../../components/common/InputController';
import dynamic from 'next/dynamic';

// Dynamically import ReactQuill as it does not support SSR
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { useRouter } from 'next/navigation';
import { Blog, CreateBlogInput } from '@/types';

export interface BlogFormInputs {
  title: string;
  body: string;
  image: FileList | null;
}

export default function CreateBlog() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const methods = useForm<BlogFormInputs>({
    resolver: yupResolver(blogValidationSchema()) as unknown as Resolver<BlogFormInputs, any> | undefined,
  });

  const mutation = useMutation<Blog, Error, CreateBlogInput>({
    mutationFn: createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      router.push('/auth/login')
    },
  });

  const onSubmit = (data: BlogFormInputs) => {
    mutation.mutate(data); // Image is now part of form data
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Create New Blog</h2>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <InputController name="title" label="Title" placeholder="Enter blog title" />

            {/* Body - Rich Text Editor */}
            <div>
              <label className="block font-medium mb-2">Body</label>
              <ReactQuill
                value={methods.getValues('body')}
                onChange={(value) => methods.setValue('body', value)}
                className="bg-white"
              />
              {methods.formState.errors.body && (
                <p className="text-red-500 text-sm mt-1">
                  {methods.formState.errors.body?.message as string}
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block font-medium mb-2">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                {...methods.register("image")}
                className="border p-2 rounded w-full"
              />
              {methods.formState.errors.image && (
                <p className="text-red-500 text-sm mt-1">
                  {methods.formState.errors.image?.message as string}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
              Create Blog
            </button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

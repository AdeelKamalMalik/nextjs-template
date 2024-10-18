"use client";

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { updateBlog, fetchBlogBySlug } from '../../../../queries/blog';
import { useForm, FormProvider, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { blogValidationSchema } from '../../../../validations';
import InputController from '../../../../components/common/InputController';
import dynamic from 'next/dynamic';
import { useRouter, useParams } from 'next/navigation'; // Using useParams to get blog ID

// Dynamically import ReactQuill as it does not support SSR
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import { Blog } from '@/types';
import Image from 'next/image';
import { BlogFormInputs } from '../../create/page';

export default function UpdateBlog() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const methods = useForm<BlogFormInputs>({
    resolver: yupResolver(blogValidationSchema(true)) as unknown as Resolver<BlogFormInputs, any> | undefined,
  });

  const { reset } = methods
  const { data, isLoading } = useQuery<Blog, Error>({
    queryKey: ['blog', slug],
    queryFn: () => fetchBlogBySlug(slug as string),
    enabled: !!slug,
    // onSuccess: (data) => {
    //   methods.reset({
    //     title: data.title,
    //     body: data.body,
    //     image: null,
    //   });
    //   // Set the existing image URL as the preview

    // },
  });

  useEffect(() => {
    if (!isLoading && data) {
      reset({
        title: data.title,
        body: data.body,
        image: null,
      });

      setImagePreview(data.image as string);
    }
  }, [data, isLoading, reset])

  const mutation = useMutation<Blog, Error, BlogFormInputs>({
    mutationFn: (data) => updateBlog({slug, ...data  }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      router.push('/blogs');
    },
  });

  const onSubmit = (data: BlogFormInputs) => {
    mutation.mutate(data);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      methods.setValue('image', e.target.files);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };

      reader.readAsDataURL(e.target.files[0]);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* {JSON.stringify(data)} */}
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Update Blog</h2>
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

            {/* Image Upload and Preview */}
            <div>
              <label className="block font-medium mb-2">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border p-2 rounded w-full"
              />
              {imagePreview && (
                <div className="mt-2">
                  <p className="text-gray-600">Image Preview:</p>
                  <Image
                    src={imagePreview}
                    alt="Image Preview"
                    width={100}
                    height={100}
                    className="w-48 h-48 object-cover mt-2"
                  />
                </div>
              )}
              {methods.formState.errors.image && (
                <p className="text-red-500 text-sm mt-1">
                  {methods.formState.errors.image?.message as string}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
              Update Blog
            </button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

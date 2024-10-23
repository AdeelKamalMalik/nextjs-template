import Image from 'next/image';
import React, { useState } from 'react';

interface CommentInputProps {
  onSubmit: (commentBody: string, image: File | null) => void;
}

const CommentInput: React.FC<CommentInputProps> = ({ onSubmit }) => {
  const [commentBody, setCommentBody] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleSubmit = () => {
    if (commentBody.trim() || image) {
      onSubmit(commentBody, image);
      setCommentBody('');
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Generate a URL for image preview
    }
  };

  return (
    <div className="flex items-center my-12 border border-gray-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-blue-500">
      {/* Comment Input */}
      <input
        type="text"
        placeholder="Write a comment..."
        value={commentBody}
        onChange={(e) => setCommentBody(e.target.value)}
        className="flex-1 px-4 py-2 focus:outline-none"
      />

      {/* File Upload Icon */}
      <label className="cursor-pointer">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        <svg
          className="w-6 h-6 text-gray-500 hover:text-gray-700 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </label>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 ml-2"
      >
        Comment
      </button>

      {/* Image Preview */}
      {imagePreview && (
        <div className="ml-4">
          <Image
            src={imagePreview}
            alt="Preview"
            width={100}
            height={100}
            className="w-24 h-24 object-cover rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default CommentInput;

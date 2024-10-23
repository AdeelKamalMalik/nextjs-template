"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { CommentBoxProps } from '@/types';
import ReplyInput from './ReplyInput';
import { FaTrash } from 'react-icons/fa';

const CommentBox: React.FC<CommentBoxProps & { onReplySubmit: (replyBody: string, commentId: string, image: File | null) => void; onDelete: (commentId: string) => void }> = ({
  comment,
  isReply,
  onReplyClick,
  onReplySubmit,
  onDelete,
}) => {
  const { id, body, image, user, replies, createdAt } = comment || {};
  const { avatar, username } = user || {};

  const [isReplying, setIsReplying] = useState(false);

  const handleReplyClick = () => {
    setIsReplying((prev) => !prev);
  };

  return (
    <div className="flex space-x-4 mb-4">
      <Image
        src={avatar}
        alt={username}
        className="w-10 h-10 rounded-full"
        width={50}
        height={50}
      />

      <div className="flex-1 bg-gray-100 rounded-lg p-3">
        <div className="flex justify-between">
          <div>
            <div className="font-semibold text-sm">{username}</div>
            <div className="text-xs text-gray-500">
              Posted at {new Date(createdAt).toLocaleString()} {/* Format the date */}
            </div>
          </div>
          <div>
            <FaTrash 
              className="text-red-500 cursor-pointer" 
              onClick={() => onDelete(id)} // Call onDelete when the icon is clicked
              title="Delete comment"
            />
          </div>
        </div>

        <p className="text-gray-700 text-sm">{body}</p>

        {image && (
          <div className="mt-2">
            <Image
              src={image}
              alt="Comment image"
              className="rounded-lg"
              width={200}
              height={200}
            />
          </div>
        )}

        {!isReply && (
          <div className="mt-2 text-sm text-blue-500 cursor-pointer" onClick={handleReplyClick}>
            Reply
          </div>
        )}

        {isReplying && (
          <div className="mt-2">
            <ReplyInput onSubmit={(replyBody, image) => {
              onReplySubmit(id, replyBody, image);
              setIsReplying(false);
            }} />
          </div>
        )}

        {replies && replies.length > 0 && (
          <div className="ml-10 mt-4 space-y-3">
            {replies.map((reply, index) => (
              <CommentBox
                isReply={true}
                key={index}
                comment={reply}
                onReplyClick={onReplyClick}
                onReplySubmit={onReplySubmit}
                onDelete={onDelete} // Pass onDelete to reply comments
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentBox;

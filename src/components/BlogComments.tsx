"use client";
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { FC, useState } from 'react';
import CommentBox from './CommentBox';
import CommentInput from './CommentInput';
import { Comment, PostCommentPayload, PostReplyPayload } from '@/types';
import { deleteReply, fetchComments, postComment, postReply } from '@/queries/comment';
import { queryClient } from '@/app/layout';

const BlogPostComments: FC<{ slug: string }> = ({ slug }) => {
  const [activeReplyBox, setActiveReplyBox] = useState<string | null>(null);

  const { data, isLoading, refetch } = useQuery<Comment[], Error>({
    queryKey: ['comments', slug],
    queryFn: () => fetchComments(slug),
    enabled: !!slug,
  });

  const mutation = useMutation<Comment, Error, PostCommentPayload>({
    mutationFn: postComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      refetch();
    },
  });

  const replyMutation = useMutation<Comment, Error, PostReplyPayload>({
    mutationFn: postReply,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['replies'] });
      refetch();
    },
  });

  const deleteMutation = useMutation<Comment, Error, >({
    mutationFn: deleteReply,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delete-comment'] });
      refetch();
    },
  });

  const addComment = (commentBody: string, image: File | null) => {
    if (commentBody.trim() || image) {
      mutation.mutate({ body: commentBody.trim(), slug, image });
    }
  };

  const addReply = (commentId: string, body: string, image: File | null) => {
    if (body.trim() || image) {
      replyMutation.mutate({ body: body.trim(), commentId, image });
    }
  };

  const handleDelete = (id: string) => {
    if (id) {
      deleteMutation.mutate(id)
    }
  };

  const toggleReplyBox = (commentId: string) => {
    setActiveReplyBox(activeReplyBox === commentId ? null : commentId);
  };

  if (isLoading) return <>Loading....</>;

  return (
    <div>
      {(data as Comment[]).map((comment) => comment && (
        <div key={comment.id} className="mb-4">
          {/* Comment box */}
          <CommentBox
            key={comment.id}
            onReplySubmit={addReply}
            comment={comment}
            onReplyClick={() => toggleReplyBox(comment.id)}
            onDelete={(id) => handleDelete(id) }
          />

        </div>
      ))}

      <CommentInput onSubmit={addComment} />
    </div>
  );
};

export default BlogPostComments;

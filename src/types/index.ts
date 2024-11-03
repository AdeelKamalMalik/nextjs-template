
export type User = {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

export type AuthContextProps = {
  isAuthenticated: boolean;
  currentUser: User | null
}

export type Blog = {
  image: string | undefined;
  id: string;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
  views: number;
  comments: number;
  user: User
  slug: string
}

export type CreateBlogInput = {
  title: string;
  body: string;
  image: FileList | null;
}

export type UpdateBlogInput = Partial<CreateBlogInput> & { slug: string }

export type BlogCardProps = {
  blog: Blog;
}

export type Comment = {
  id: string
  image: string
  body: string
  user: User
  replies?: Comment[]
  createdAt: string
}

export type CommentBoxProps = {
  comment: Comment
  isReply?: boolean
  onReplyClick: () => void;
}

export type PostCommentPayload = {
  body: string
  slug: string
  image: File | null
}

export type PostReplyPayload = Omit<PostCommentPayload, 'slug'> & { commentId: string }

export type Notification = {
  id: string
  sender: User
  blog: Blog
  read: boolean
  type: 'comment' | 'reply'
}
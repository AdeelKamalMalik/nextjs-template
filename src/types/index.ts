
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
  user: User
  slug: string
}

export type CreateBlogInput = {
  title: string;
  body: string;
  image: FileList | null;
}

export type UpdateBlogInput = Partial<CreateBlogInput> & { slug: string }

export type BlogCardProps =  {
  blog: Blog;
}
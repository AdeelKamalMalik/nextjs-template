
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
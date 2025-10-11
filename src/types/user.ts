export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
    createdAt: Date;
  }
  
  export interface UserProfile extends User {
    avatar?: string;
    bio?: string;
  }
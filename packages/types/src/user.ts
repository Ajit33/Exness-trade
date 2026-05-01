// what you store in DB (has password hash)
export interface UserRecord {
  id: number;
  name: string;
  email: string;
  password: string;  
  createdAt: Date;
}


export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}


export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}


export interface AuthResponse {
  user: User;
  token: string;      // JWT token
}
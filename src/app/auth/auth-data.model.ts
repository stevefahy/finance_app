export interface AuthData {
  email: string;
  password: string;
}

export interface User {
  message: string;
  result: {
    conversation: string;
    email: string;
    password: string;
    _id: string;
  };
}

export interface AuthUser {
  token: string;
  expiresIn: number;
  userId: string;
  conversation: string;
}

export interface AuthUserCreate {
  token: string;
  expirationDate: Date;
  userId: string;
  conversation: string;

}

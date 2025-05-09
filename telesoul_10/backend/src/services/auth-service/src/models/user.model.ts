export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  status: 'active' | 'inactive' | 'banned';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserOAuthLink {
  id: string;
  userId: string;
  type: 'google' | 'telegram';
  oauthId: string;
  linkedAt: Date;
}

export interface UserCreateInput {
  username: string;
  email: string;
  password: string;
  status?: 'active' | 'inactive' | 'banned';
}

export interface UserOAuthLinkCreateInput {
  userId: string;
  type: 'google' | 'telegram';
  oauthId: string;
} 
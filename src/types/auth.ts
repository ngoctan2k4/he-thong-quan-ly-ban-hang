export interface Role {
  id: number;
  code: string;
  name: string;
}

export interface Permission {
  id: number;
  code: string;
  name: string;
}

export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  roles: Role[];
  permissions: string[];
}

import { Role, Privilege, Department } from './types';

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
  phoneNumber: string;
  createDate: Date;
  lastLogin: Date;
  image: string;
  is2FAEnabled: boolean;
  profileId?: string;  // Reference to Profile
  applications?: string[];  // References to Applications
  interviews?: string[];  // References to Interviews
  jobPosts?: string[];  // References to JobPosts
}

export interface Admin extends IUser {
  // Admin specific methods would be implemented in services
}

export interface DepartmentManager extends IUser {
  department: Department;
}

export interface HRManager extends IUser {
  // HR Manager specific methods would be implemented in services
}

export interface Candidate extends IUser {
  currency: number;
  startJobDate: Date;
}

export type AuthProvider = 'local' | 'google' | 'linkedin';

// Input types for creating/updating
export interface UserInput extends Omit<IUser, 'id' | 'createDate' | 'lastLogin'> {}
export interface AdminInput extends Omit<Admin, 'id' | 'createDate' | 'lastLogin'> {}
export interface DepartmentManagerInput extends Omit<DepartmentManager, 'id' | 'createDate' | 'lastLogin'> {}
export interface HRManagerInput extends Omit<HRManager, 'id' | 'createDate' | 'lastLogin'> {}
export interface CandidateInput extends Omit<Candidate, 'id' | 'createDate' | 'lastLogin'> {} 
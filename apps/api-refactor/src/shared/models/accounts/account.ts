import { Roles } from './roles';
import { Pseudonym } from './pseudonym';

export interface Account {
  readonly _id: string;
  email: string;
  password: string;
  pseudonyms: string[] | Pseudonym[];
  roles: Roles[];
  termsAgree: boolean;
  emailConfirmed: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

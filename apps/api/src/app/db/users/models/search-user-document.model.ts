import { Document } from 'mongoose';

import { SearchUser } from '@dragonfish/shared/models/users';

export interface SearchUserDocument extends SearchUser, Document {}

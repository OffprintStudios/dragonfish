import {Document} from "mongoose";

import { SearchUser } from 'shared/models/users';

export interface SearchUserDocument extends SearchUser, Document { }

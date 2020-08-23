import {Document} from "mongoose";

import { SearchUser } from '@pulp-fiction/models/users';

export interface SearchUserDocument extends SearchUser, Document { }

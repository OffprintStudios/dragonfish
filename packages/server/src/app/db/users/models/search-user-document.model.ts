import {Document} from "mongoose";

import { SearchUser } from '@dragonfish/models/users';

export interface SearchUserDocument extends SearchUser, Document { }

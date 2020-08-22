import { Schema, HookNextFunction } from 'mongoose';
import * as MongooseAutopopulate from 'mongoose-autopopulate';
import * as MongoosePaginate from 'mongoose-paginate-v2';
import { generate } from 'shortid';

export const CommentsSchema = new Schema({
    _id: {type: String, default: generate()},
    
})
import { Schema, HookNextFunction } from 'mongoose';
import * as MongooseAutopopulate from 'mongoose-autopopulate';
import * as MongoosePaginate from 'mongoose-paginate-v2';
import { generate } from 'shortid';

export const NewsSchema = new Schema({
    _id: {type: String, default: generate()},
    contributor: {type: String, ref: 'User', required: true, autopopulate: {
        select: '_id username profile.avatar audit.roles'
    }},
    title: {type: String, trim: true, required: true},
    desc: {type: String, trim: true, required: true},
    body: {type: String, trim: true, required: true},
    audit: {
        featured: {type: Boolean, default: false},
        publishedOn: {type: Date, default: null},
    }
});

NewsSchema.plugin(MongooseAutopopulate);
NewsSchema.plugin(MongoosePaginate);
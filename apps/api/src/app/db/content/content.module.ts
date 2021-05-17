import { Module } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Schema } from 'mongoose';
import { ContentStore } from './content.store';
import { BrowseStore } from './browse.store';
import { NewsStore } from './news/news.store';
import { BlogsStore } from './blogs/blogs.store';
import { SectionsModule } from '../sections/sections.module';
import { ContentSchema } from './content.schema';
import { Genres, NewsCategory, PoetryForm, WorkKind, WorkStatus } from '@dragonfish/shared/models/content';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ProseStore } from './prose/prose.store';
import { PoetryStore } from './poetry/poetry.store';
import { ApprovalQueueModule } from '../approval-queue/approval-queue.module';
import { ReadingHistoryModule } from '../reading-history/reading-history.module';
import { FandomTagStore } from './prose/fandom-tag.store';

@Module({
    imports: [
        UsersModule,
        NotificationsModule,
        SectionsModule,
        ApprovalQueueModule,
        ReadingHistoryModule,
        MongooseModule.forFeatureAsync([
            {
                name: 'Content',
                useFactory: () => {
                    const schema = ContentSchema;
                    schema.index({ title: 'text' });
                    schema.plugin(require('mongoose-autopopulate'));
                    schema.plugin(require('mongoose-paginate-v2'));
                    return schema;
                },
            },
        ]),
    ],
    providers: [
        ContentStore,
        BrowseStore,
        NewsStore,
        BlogsStore,
        ProseStore,
        PoetryStore,
        FandomTagStore,
        {
            provide: getModelToken('NewsContent'),
            useFactory: (contentModel) =>
                contentModel.discriminator(
                    'NewsContent',
                    new Schema({
                        meta: {
                            category: { type: String, enum: Object.keys(NewsCategory), required: true, index: true },
                            coverPic: { type: String, trim: true, default: null },
                        },
                        audit: {
                            featured: { type: Boolean, default: false },
                        },
                    })
                ),
            inject: [getModelToken('Content')],
        },
        {
            provide: getModelToken('BlogContent'),
            useFactory: (contentModel) =>
                contentModel.discriminator(
                    'BlogContent',
                    new Schema({
                        audit: {
                            releaseOn: { type: Date, default: null },
                        },
                    })
                ),
            inject: [getModelToken('Content')],
        },
        {
            provide: getModelToken('ProseContent'),
            useFactory: (contentModel) =>
                contentModel.discriminator(
                    'ProseContent',
                    new Schema({
                        sections: {
                            type: [String],
                            ref: 'Section',
                            default: null,
                            autopopulate: {
                                select: '_id title published stats.words audit.publishedOn createdAt updatedAt',
                                match: { 'audit.isDeleted': false },
                            },
                        },
                        meta: {
                            category: { type: String, enum: Object.keys(WorkKind), required: true },
                            fandoms: { type: [String], default: null },
                            genres: { type: [String], enum: Object.keys(Genres), required: true },
                            status: { type: String, enum: Object.keys(WorkStatus), required: true },
                            coverArt: { type: String, trim: true, default: null },
                        },
                    })
                ),
            inject: [getModelToken('Content')],
        },
        {
            provide: getModelToken('PoetryContent'),
            useFactory: (contentModel) =>
                contentModel.discriminator(
                    'PoetryContent',
                    new Schema({
                        sections: {
                            type: [String],
                            ref: 'Section',
                            default: null,
                            autopopulate: {
                                select: '_id title published stats.words audit.publishedOn createdAt updatedAt',
                                match: { 'audit.isDeleted': false },
                            },
                        },
                        meta: {
                            category: { type: String, enum: Object.keys(WorkKind), required: true },
                            form: { type: String, enum: Object.keys(PoetryForm), required: true },
                            collection: { type: Boolean, default: false },
                            fandoms: { type: [String], default: null },
                            genres: { type: [String], enum: Object.keys(Genres), required: true },
                            status: { type: String, enum: Object.keys(WorkStatus), required: true },
                            coverArt: { type: String, trim: true, default: null },
                        },
                    })
                ),
            inject: [getModelToken('Content')],
        },
    ],
    exports: [ContentStore, BrowseStore, NewsStore, BlogsStore, ProseStore, PoetryStore, FandomTagStore],
})
export class ContentModule {}

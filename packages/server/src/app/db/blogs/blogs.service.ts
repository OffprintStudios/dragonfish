import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';

import * as models from '@dragonfish/models/blogs';
import * as documents from './models/blog-document.model';
import { UsersStore } from '../users/users.store';

@Injectable()
export class OldBlogsService {
    constructor(
        @InjectModel('Blog') private readonly blogModel: PaginateModel<documents.BlogDocument>,
        private readonly usersService: UsersStore,
    ) {}

    /**
     * Finds a blog by a given ID and returns it in a promise.
     *
     * @param blogId The incoming blog ID.
     */
    async findOneById(user: any, blogId: string): Promise<models.Blog> {
        return await this.blogModel.findById(blogId).where('author', user.sub).where('audit.isDeleted', false);
    }

    /**
     * Fetches a user's blogs based on their user ID. Returns the array
     * as a promise.
     *
     * @param user The user whose blogs are being requested.
     */
    async fetchUserBlogs(user: any): Promise<documents.BlogDocument[]> {
        return await this.blogModel.find({ author: user.sub, 'audit.isDeleted': false }).sort({ createdAt: -1 });
    }

    /**
     * FOR MIGRATION PURPOSES ONLY: Completely removes a blog from the database. For use only
     * after a blog has been migrated.
     *
     * @param user The author of the blog
     * @param blogId The blog's ID
     */
    async deleteBlog(user: any, blogId: string): Promise<void> {
        await this.blogModel.deleteOne({ _id: blogId, author: user.sub });
    }

    /**
     * Finds the first six matches given the provided search parameters.
     * For use with the initial page of search results.
     *
     * @param query The relevant search parameters
     */
    async findInitialRelatedBlogs(query: string): Promise<documents.BlogDocument[]> {
        return await this.blogModel
            .find({ $text: { $search: query }, published: true, 'audit.isDeleted': false })
            .limit(6);
    }

    /**
     * Returns blogs matching the full text search parameter given and obeys the pagination associated with it.
     *
     * @param query The relevant search parameters
     */
    async findRelatedBlogs(query: string, pageNum: number) {
        return await this.blogModel.paginate(
            { $text: { $search: query }, published: true, 'audit.isDeleted': false },
            {
                page: pageNum,
                limit: 15,
            },
        );
    }
}

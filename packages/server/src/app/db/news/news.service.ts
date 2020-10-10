import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult } from 'mongoose';
import * as lodash from 'lodash';

import { NewsDocument } from './news.schema';

import { sanitizeHtml } from '@pulp-fiction/html_sanitizer';
import { countPlaintextWords } from '@pulp-fiction/word_counter';
import { PostForm } from '@pulp-fiction/models/news';
import { JwtPayload } from '@pulp-fiction/models/auth';
import { Roles } from '@pulp-fiction/models/users';

@Injectable()
export class NewsService {
    constructor(@InjectModel('Newspost') private readonly newsModel: PaginateModel<NewsDocument>) {}

    /**
     * Creates a new newspost and saves it to the database.
     * 
     * @param user The user creating the post
     * @param postInfo The post's info
     */
    async createNewPost(user: JwtPayload, postInfo: PostForm): Promise<NewsDocument> {
        if (this.checkRoles(user)) {
            const newPost = new this.newsModel({
                'user': user.sub,
                'title': await sanitizeHtml(postInfo.title),
                'desc': await sanitizeHtml(postInfo.desc),
                'body': await sanitizeHtml(postInfo.body),
                'category': postInfo.category,
                'stats.words': await countPlaintextWords(postInfo.body),
            });
    
            return await newPost.save();
        } else {
            throw new UnauthorizedException(`You don't have permission to create news posts.`);
        }
    }

    /**
     * Edits a post belonging to a user, unless the user requesting to edit is an admin or moderator.
     * 
     * @param user The user requesting to edit
     * @param postId The post to edit
     * @param postInfo The new info to add
     */
    async editPost(user: JwtPayload, postId: string, postInfo: PostForm): Promise<NewsDocument> {
        const postToEdit = await this.newsModel.findById(postId);
        if (this.checkRoles(user)) {
            if (this.checkRoles(user, [Roles.Admin, Roles.Moderator])) {
                postToEdit.title = await sanitizeHtml(postInfo.title);
                postToEdit.desc = await sanitizeHtml(postInfo.desc);
                postToEdit.body = await sanitizeHtml(postInfo.body);
                postToEdit.category = postInfo.category;
                postToEdit.stats.words = await countPlaintextWords(postInfo.body);

                return await postToEdit.save();
            } else {
                if (postToEdit._id === user.sub) {
                    postToEdit.title = await sanitizeHtml(postInfo.title);
                    postToEdit.desc = await sanitizeHtml(postInfo.desc);
                    postToEdit.body = await sanitizeHtml(postInfo.body);
                    postToEdit.category = postInfo.category;
                    postToEdit.stats.words = await countPlaintextWords(postInfo.body);
    
                    return await postToEdit.save();
                } else {
                    throw new UnauthorizedException(`You don't own this post.`);
                }
            }
        } else {
            throw new UnauthorizedException(`You don't have permission to edit this post.`);
        }
    }

    /**
     * Fetches all newsposts for the dashboard.
     * 
     * @param pageNum The current page of results.
     */
    async fetchAllForDashboard(pageNum: number): Promise<PaginateResult<NewsDocument>> {
        return await this.newsModel.paginate({}, {
            sort: {'createdAt': -1},
            page: pageNum,
            limit: 15
        });
    }

    /**
     * Verifies that a user has a specific set of roles.
     * 
     * @param user The user to verify
     * @param roles The roles required for this action
     */
    private checkRoles(user: JwtPayload, roles?: Roles[]): boolean {
        if (roles) {
            const hasRoles = lodash.intersection(user.roles, roles);
            if (hasRoles.length > 0) {
                return true;
            } else {
                return false;
            }
        } else {
            const hasRoles = lodash.intersection(user.roles, [Roles.Admin, Roles.Moderator, Roles.Contributor]);
            if (hasRoles.length > 0) {
                return true;
            } else {
                return false;
            }
        }
    }
}

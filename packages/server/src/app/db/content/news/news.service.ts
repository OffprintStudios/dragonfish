import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { sanitizeHtml, stripAllHtml } from '@pulp-fiction/html_sanitizer';
import { JwtPayload } from '@pulp-fiction/models/auth';
import { NewsForm, PubStatus } from '@pulp-fiction/models/content';
import { Roles, UserInfo } from '@pulp-fiction/models/users';
import { countPlaintextWords } from '@pulp-fiction/word_counter';
import { PaginateModel, PaginateResult } from 'mongoose';
import { NewsContentDocument } from './news-content.document';
import * as lodash from 'lodash';

@Injectable()
export class NewsService {
    constructor(@InjectModel('NewsContent') private readonly newsModel: PaginateModel<NewsContentDocument>) {}

    /**
     * Creates a new newspost and saves it to the database.
     * 
     * @param user The user creating the post
     * @param postInfo The post's info
     */
    async createNewPost(user: JwtPayload, postInfo: NewsForm): Promise<NewsContentDocument> {
        if (this.checkRoles(user)) {
            const newPost = new this.newsModel({
                'author': user.sub,
                'title': await sanitizeHtml(postInfo.title),
                'desc': await sanitizeHtml(postInfo.desc),
                'body': await sanitizeHtml(postInfo.body),
                'meta.category': postInfo.category,
                'stats.words': await countPlaintextWords(await stripAllHtml(postInfo.body)),
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
    async editPost(user: JwtPayload, postId: string, postInfo: NewsForm): Promise<NewsContentDocument> {
        const postToEdit = await this.newsModel.findById(postId);
        if (this.checkRoles(user)) {
            if (this.checkRoles(user, [Roles.Admin, Roles.Moderator])) {
                return await this.newsModel.findByIdAndUpdate(postId, {
                    'title': await sanitizeHtml(postInfo.title),
                    'desc': await sanitizeHtml(postInfo.desc),
                    'body': await sanitizeHtml(postInfo.body),
                    'meta.category': postInfo.category,
                    'stats.words': await countPlaintextWords(await stripAllHtml(postInfo.body)),
                }, {new: true});
            } else {
                if (postToEdit._id === user.sub) {
                    return await this.newsModel.findByIdAndUpdate(postId, {
                        'title': await sanitizeHtml(postInfo.title),
                        'desc': await sanitizeHtml(postInfo.desc),
                        'body': await sanitizeHtml(postInfo.body),
                        'meta.category': postInfo.category,
                        'stats.words': await countPlaintextWords(await stripAllHtml(postInfo.body)),
                    }, {new: true});
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
    async fetchAllForDashboard(pageNum: number): Promise<PaginateResult<NewsContentDocument>> {
        return await this.newsModel.paginate({}, {
            sort: {'createdAt': -1},
            page: pageNum,
            limit: 15
        });
    }

    /**
     * Fetches a post for editing.
     * 
     * @param user The user requesting to edit
     * @param postId The post to edit
     */
    async fetchForEdit(user: JwtPayload, postId: string): Promise<NewsContentDocument> {
        const postToFetch = await this.newsModel.findById(postId);
        if (this.checkRoles(user, [Roles.Admin, Roles.Moderator])) {
            return postToFetch;
        } else if (postToFetch._id === user.sub && this.checkRoles(user, [Roles.Contributor])) {
            return postToFetch;
        } else {
            throw new UnauthorizedException(`You don't have permission to edit this post.`);
        }
    }

    /**
     * Changes the publish status of a post. If isPublished is true, it
     * sets a new publishedOn date.
     * 
     * @param user The user in charge of this post
     * @param postId The post itself
     * @param isPublished The publish flag
     */
    async setPublishStatus(user: JwtPayload, postId: string, isPublished: PubStatus): Promise<NewsContentDocument> {
        const postToPublish = await this.newsModel.findById(postId);
        const authorInfo = postToPublish.author as UserInfo;
        if (authorInfo._id === user.sub) {
            return await this.newsModel.findOneAndUpdate({'_id': postId, 'author': user.sub}, {
                'audit.published': isPublished,
                'audit.publishedOn': new Date()
            });
        } else {
            throw new UnauthorizedException(`You don't have permission to publish this.`);
        }
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

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, Types } from 'mongoose';

import { JwtPayload } from '@pulp-fiction/models/auth';
import { FolderForm } from '@pulp-fiction/models/content';
import { sanitizeHtml } from '@pulp-fiction/html_sanitizer';
import { ContentFolderDocument } from './content-folders.schema';
import { ContentService } from '../content';

@Injectable()
export class ContentFoldersService {
    constructor(@InjectModel('ContentFolder') private readonly folderModel: PaginateModel<ContentFolderDocument>,
        private readonly contentService: ContentService) {}

    /**
     * Creates a new folder and adds it to the database.
     * 
     * @param user The user creating the folder
     * @param folderInfo The folder's info
     */
    async createFolder(user: JwtPayload, folderInfo: FolderForm, parentId?: Types.ObjectId): Promise<ContentFolderDocument> {
        if (parentId) {
            const newFolder = await new this.folderModel({
                owner: user.sub,
                name: await sanitizeHtml(folderInfo.name),
                parents: [parentId],
            }).save();
            
            await this.addChildFolder(user, parentId, newFolder._id);
            return newFolder;
        } else {
            const newFolder = new this.folderModel({
                owner: user.sub,
                name: await sanitizeHtml(folderInfo.name)
            });
    
            return await newFolder.save();
        }
    }

    /**
     * Updates a folder belonging to a user. Returns the newly updated document.
     * 
     * @param user The user who owns the folder
     * @param folderId The folder's ID
     * @param folderInfo The newest folder info
     */
    async editFolder(user: JwtPayload, folderId: Types.ObjectId, folderInfo: FolderForm): Promise<ContentFolderDocument> {
        return await this.folderModel.findOneAndUpdate({'_id': folderId, 'owner': user.sub}, {
            'name': await sanitizeHtml(folderInfo.name)
        }, {new: true});
    }

    /**
     * Appends a child folder ID to the children array of the parent.
     * 
     * @param user The owner of the parent folder
     * @param parentId The parent folder
     * @param childId The child folder
     */
    private async addChildFolder(user: JwtPayload, parentId: Types.ObjectId, childId: Types.ObjectId) {
        return await this.folderModel.updateOne({'_id': parentId, 'owner': user.sub}, {
            $push: {'children': childId}
        });
    }

    /**
     * Adds some content to the specified folder.
     * 
     * @param user The owner of the folder
     * @param folderId The folder ID
     * @param contentId The content ID to be added
     */
    async addToFolder(user: JwtPayload, folderId: Types.ObjectId, contentId: string): Promise<ContentFolderDocument> {
        const doc = await this.folderModel.findOneAndUpdate({'_id': folderId, 'owner': user.sub}, {
            $push: {'contents': contentId}
        });

        await this.contentService.setIsChild(user, contentId, folderId);
        return doc;
    }

    /**
     * Removes some content from the specified folder.
     * 
     * @param user The owner of the folder
     * @param folderId The folder ID
     * @param contentId The content ID to be removed
     */
    async removeFromFolder(user: JwtPayload, folderId: Types.ObjectId, contentId: string): Promise<ContentFolderDocument> {
        const doc = await this.folderModel.findOneAndUpdate({'_id': folderId, 'owner': user.sub}, {
            $pull: {'contents': contentId}
        });

        await this.contentService.setIsChild(user, contentId, folderId);
        return doc;
    }

    /**
     * Fetches a bunch of folders belonging to the specified user.
     * 
     * @param user The owner of these folders
     */
    async fetchAll(user: JwtPayload): Promise<ContentFolderDocument[]> {
        return await this.folderModel.find({'owner': user.sub}, {autopopulate: false});
    }

    /**
     * Fetches one folder owned by the specified user.
     * 
     * @param user The owner of this folder
     * @param folderId The folder ID
     */
    async fetchOne(user: JwtPayload, folderId: Types.ObjectId): Promise<ContentFolderDocument> {
        return await this.folderModel.findOne({'_id': folderId, 'owner': user.sub});
    }
}

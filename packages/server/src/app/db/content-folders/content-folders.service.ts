import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, Types } from 'mongoose';

import { JwtPayload } from '@pulp-fiction/models/auth';
import { FolderForm } from '@pulp-fiction/models/content';
import { sanitizeHtml } from '@pulp-fiction/html_sanitizer';
import { ContentFolderDocument } from './content-folders.schema';

@Injectable()
export class ContentFoldersService {
    constructor(@InjectModel('ContentFolder') private readonly folderModel: PaginateModel<ContentFolderDocument>) {}

    /**
     * Creates a new folder and adds it to the database.
     * 
     * @param user The user creating the folder
     * @param folderInfo The folder's info
     */
    async createFolder(user: JwtPayload, folderInfo: FolderForm): Promise<ContentFolderDocument> {
        const newFolder = new this.folderModel({
            owner: user.sub,
            name: await sanitizeHtml(folderInfo.name)
        });

        return await newFolder.save();
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
     * Adds some content to the specified folder.
     * 
     * @param user The owner of the folder
     * @param folderId The folder ID
     * @param contentId The content ID to be added
     */
    async addToFolder(user: JwtPayload, folderId: Types.ObjectId, contentId: string) {
        return await this.folderModel.findOneAndUpdate({'_id': folderId, 'owner': user.sub}, {
            $push: {'contents': contentId}
        });
    }

    /**
     * Removes some content from the specified folder.
     * 
     * @param user The owner of the folder
     * @param folderId The folder ID
     * @param contentId The content ID to be removed
     */
    async removeFromFolder(user: JwtPayload, folderId: Types.ObjectId, contentId: string) {
        return await this.folderModel.findOneAndUpdate({'_id': folderId, 'owner': user.sub}, {
            $pull: {'contents': contentId}
        });
    }
}

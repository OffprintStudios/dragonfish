import { PaginateResult } from 'mongoose';
import { Collection, CollectionForm } from '@dragonfish/shared/models/collections';
import { JwtPayload } from '@dragonfish/shared/models/auth';

export interface ICollections {
    /**
     * Grabs a single collection from the database belonging to the specified user.
     *
     * @param userId The owner of the portfolio
     * @param collId The collection to fetch
     */
    getCollection(user: JwtPayload, collectionId: string): Promise<Collection>;

    /**
     * Gets all undeleted collections belonging to a single user.
     *
     * @param user The owner of these collections
     * @param pageNum The page of results to fetch
     */
    getAllCollections(user: JwtPayload, pageNum: number): Promise<PaginateResult<Collection>>;

    /**
     * Grabs a single public collection from the database belonging to the specified user.
     *
     * @param userId The owner of the portfolio
     * @param collId The collection to fetch
     */
    getPublicCollection(userId: string, collectionId: string): Promise<Collection>;

    /**
     * Fetches all public collections that a user has.
     *
     * @param user The owner of the portfolio
     */
    getAllPublicCollections(userId: string, pageNum: number): Promise<PaginateResult<Collection>>;

    /**
     * Gets all undeleted collections belonging to a single user.
     *
     * @param user The owner of these collections
     */
    getUserCollectionsNoPaginate(user: JwtPayload): Promise<Collection[]>;

    /**
     * Creates a collection and saves it to the database.
     *
     * @param userId The owner of the collection
     * @param collForm The collection's information
     */
    create(user: JwtPayload, collectionInfo: CollectionForm): Promise<Collection>;

    /**
     * Edits a collection given the newest collection info.
     *
     * @param user The owner of the collection
     * @param collId The collection ID
     * @param collInfo The new collection info
     */
    edit(user: JwtPayload, collectionId: string, collectionInfo: CollectionForm): Promise<Collection>;

    /**
     * Soft deletes a collection associated with the provided user.
     *
     * @param user The owner of the collection
     * @param collId The collection to delete
     */
    delete(user: JwtPayload, collectionId: string): Promise<void>;

    /**
     * Adds a piece of content to a collection.
     *
     * @param user The owner of the collection
     * @param collId The collection's ID
     * @param contentId The content being added to it
     */
    addTo(user: JwtPayload, collectionId: string, contentId: string): Promise<Collection>;

    /**
     * Removes a piece of content from a collection. Also deletes the `collItem` document associated with it.
     *
     * @param user The owner of the collection
     * @param collId The collection ID
     * @param collItemId The item ID to delete
     * @param contentId The content being removed
     */
    removeFrom(user: JwtPayload, collectionId: string, contentId: string): Promise<Collection>;

    /**
     * Sets a collection's isPublic flag to true.
     *
     * @param user The owner of the collection
     * @param collId The collection to make public
     */
    setPublic(user: JwtPayload, collectionId: string): Promise<void>;

    /**
     * Sets a collection's isPublic flag to false.
     *
     * @param user The owner of the collection
     * @param collId The collection to make private
     */
    setPrivate(user: JwtPayload, collectionId: string): Promise<void>;
}

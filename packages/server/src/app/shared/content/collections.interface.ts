import { PaginateResult } from 'mongoose';
import { Collection } from "@dragonfish/models/collections";

export interface ICollections {

    /**
     * Grabs a single collection from the database belonging to the specified user.
     *
     * @param userId The owner of the portfolio
     * @param collId The collection to fetch
     */
    getCollection(): Promise<Collection>;

    /**
     * Gets all undeleted collections belonging to a single user.
     *
     * @param user The owner of these collections
     * @param pageNum The page of results to fetch
     */
    getAllCollections(): Promise<PaginateResult<Collection>>;

    /**
     * Grabs a single public collection from the database belonging to the specified user.
     *
     * @param userId The owner of the portfolio
     * @param collId The collection to fetch
     */
    getPublicCollection(): Promise<Collection>;

    /**
     * Fetches all public collections that a user has.
     *
     * @param user The owner of the portfolio
     */
    getAllPublicCollections(): Promise<PaginateResult<Collection>>;

    /**
     * Gets all undeleted collections belonging to a single user.
     *
     * @param user The owner of these collections
     */
    getUserCollectionsNoPaginate(): Promise<Collection[]>

    /**
     * Creates a collection and saves it to the database.
     *
     * @param userId The owner of the collection
     * @param collForm The collection's information
     */
    create(): Promise<Collection>;

    /**
     * Edits a collection given the newest collection info.
     *
     * @param user The owner of the collection
     * @param collId The collection ID
     * @param collInfo The new collection info
     */
    edit(): Promise<Collection>;

    /**
     * Soft deletes a collection associated with the provided user.
     *
     * @param user The owner of the collection
     * @param collId The collection to delete
     */
    delete(): Promise<void>;

    /**
     * Adds a piece of content to a collection.
     *
     * @param user The owner of the collection
     * @param collId The collection's ID
     * @param contentId The content being added to it
     */
    addTo(): Promise<Collection>;

    /**
     * Removes a piece of content from a collection. Also deletes the `collItem` document associated with it.
     *
     * @param user The owner of the collection
     * @param collId The collection ID
     * @param collItemId The item ID to delete
     * @param contentId The content being removed
     */
    removeFrom(): Promise<Collection>;

    /**
     * Sets a collection's isPublic flag to true.
     *
     * @param user The owner of the collection
     * @param collId The collection to make public
     */
    setPublic(): Promise<void>;

    /**
     * Sets a collection's isPublic flag to false.
     *
     * @param user The owner of the collection
     * @param collId The collection to make private
     */
    setPrivate(): Promise<void>;
}
declare module 'mongoose-fuzzy-searching' {
    import { Document, DocumentQuery, HookAsyncCallback, HookSyncCallback, Model, Schema } from 'mongoose'

    export type FuzzyFieldStringOptions<T> = (keyof T & string)[];

    export interface FuzzyFieldOptions<T> {
        /**
         * Collection key name. If unspecified, defualts to **null**.
         */
        name?: string | null;

        /**
         * N-grams min size. If unspecified, defaults to **2**.
         */
        minSize?: number;

        /**
         * Denotes the significance of the field relative to the other indexed fields in terms of the text search score.
         * If unspecified, defaults to **1**.
         */
        weight?: number;

        /**
         * Only return ngrams from start of word. (It gives more precise results).
         * If unspecified, defaults to **false**.
         */
        prefixOnly?: boolean;

        /**
         * Remove special characters from N-grams.
         * If unspecified, defaults to **true**.
         */
        escapeSpecialCharacters?: boolean;

        /**
         * Defines which attributes on this object to be used for fuzzy searching.
         * If unspecified, defaults to **null**.
         */
        keys: FuzzyFieldStringOptions<T>;
    }

    export interface MongooseFuzzyOptions<T> {
        /**
         * Defines the fields to fuzzy search. Can either be an array of strings
         * (in which case defaults will be used), or an array of objects,
         * that define the options for each field.
         */
        fields: FuzzyFieldStringOptions<T> | FuzzyFieldOptions<T>;
        middlewares?: {
            preSave?: HookSyncCallback<T> | HookAsyncCallback<T>;
            preInsertMany?: HookSyncCallback<T> | HookAsyncCallback<T>;
            preUpdate?: HookSyncCallback<T> | HookAsyncCallback<T>;
            preUpdateOne?: HookSyncCallback<T> | HookAsyncCallback<T>;
            preFindOneAndUpdate?: HookSyncCallback<T> | HookAsyncCallback<T>;
            preUpdateMany?: HookSyncCallback<T> | HookAsyncCallback<T>;
        }
    }

    export interface MongooseFuzzyModel<T extends Document, QueryHelpers = Record<string, unknown>>
        extends Model<T, QueryHelpers> {
        fuzzySearch(
            search: string,
            callBack?: (err: any, data: Model<T, QueryHelpers>[]) => void
        ): DocumentQuery<T[], T, QueryHelpers>
    }

    export default function registerFuzzySearch<T>(schema: Schema<T>, options: MongooseFuzzyOptions<T>): void
}

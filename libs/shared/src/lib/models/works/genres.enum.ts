/**
 * @deprecated
 */
export type Genres = GenresPoetry | GenresFiction;

export enum GenresFiction {
    ActionAdventure = 'Action/Adventure',
    Drama = 'Drama',
    SliceOfLife = 'Slice of Life',
    Comedy = 'Comedy',
    Romance = 'Romance',
    ScienceFiction = 'Science Fiction',
    SpeculativeFiction = 'Speculative Fiction',
    Fantasy = 'Fantasy',
    Horror = 'Horror',
    Thriller = 'Thriller',
    Mystery = 'Mystery',
    Erotica = 'Erotica',
    // Essay = 'Essay',
    // Journalism = 'Journalism',
    // Biography = 'Biography',
    // Memoir = 'Memoir',
}
export enum GenresPoetry {
    Limerick = 'Limerick',
    Haiku = 'Haiku',
    Sonnet = 'Sonnet',
    Ballad = 'Ballad',
    Ode = 'Ode',
    FreeVerse = 'Free Verse',
    FixedVerse = 'Fixed Verse',
}

export const MAX_GENRES_PER_FICTION: number = 3;
export const MAX_GENRES_PER_POEM: number = 1;

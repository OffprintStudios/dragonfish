import { BadRequestException } from '@nestjs/common';
import {
    CreateWork,
    EditWork,
    MAX_GENRES_PER_FICTION,
    MAX_GENRES_PER_POEM,
    Categories,
    CreateSection,
    EditSection,
} from '@dragonfish/shared/models/works';

/**
 * Validates the given work for errors. Throws a BadRequestException if any are found.
 * Does nothing if the work is valid.
 */
export function validateWork(work: CreateWork | EditWork): void {
    if (work.title.length < 3 || work.title.length > 100) {
        throw new BadRequestException('Titles must be between 3 and 100 characters.');
    }
    if (work.shortDesc.length < 3 || work.shortDesc.length > 250) {
        throw new BadRequestException('Short descriptions must be between 3 and 250 characters.');
    }
    if (work.longDesc.length < 5) {
        throw new BadRequestException('Long descriptions must be at least 5 characters long.');
    }
    if (!work.category) {
        throw new BadRequestException('You must select a category.');
    }
    if (!work.rating) {
        throw new BadRequestException('You must select a content rating.');
    }
    if (!work.status) {
        throw new BadRequestException('You must select a status.');
    }

    // Category-specific validation
    if (work.category === Categories.Fanfiction) {
        if (work.genres.length < 1 || work.genres.length > MAX_GENRES_PER_FICTION) {
            throw new BadRequestException(`You must select between 1 and ${MAX_GENRES_PER_FICTION} genres.`);
        }
    }
    if (work.category === Categories.OriginalFiction) {
        if (work.genres.length < 1 || work.genres.length > MAX_GENRES_PER_FICTION) {
            throw new BadRequestException(`You must select between 1 and ${MAX_GENRES_PER_FICTION} genres.`);
        }
    }
    if (work.category === Categories.Poetry) {
        if (work.genres.length < 1 || work.genres.length > MAX_GENRES_PER_POEM) {
            throw new BadRequestException(`You must select between 1 and ${MAX_GENRES_PER_POEM} genres.`);
        }
    }
}

/**
 * Validates the given section for errors. Throws a BadRequestException if any are found.
 * Does nothing if the section is valid.
 */
export function validateSection(section: CreateSection | EditSection): void {
    if (section.title.length < 3 || section.title.length > 100) {
        throw new BadRequestException('Section titles must be between 3 and 100 characters.');
    }
    if (section.body.length < 5) {
        throw new BadRequestException('Section bodies must be at least 5 characters long.');
    }
    if (section.authorsNote && section.authorsNote.length < 3) {
        throw new BadRequestException("Author's notes must be at least 3 characters long.");
    }
}

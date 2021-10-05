import { SlugifyPipe } from './slugify.pipe';
import { PluralizePipe } from './pluralize.pipe';
import { SeparateGenresPipe } from './separate-genres.pipe';
import { JoinStringsPipe } from './join-strings.pipe';
import { FixCategoriesPipe } from './fix-categories.pipe';
import { ToLocaleStringPipe } from './to-locale-string.pipe';
import { AbbreviateNumbersPipe } from './abbreviate-numbers.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';
import { TruncatePipe } from './truncate-text.pipe';
import { LocaleDatePipe } from './locale-date.pipe';
import { DisplayTagsPipe } from './display-tags.pipe';

export const Pipes = [
    SlugifyPipe,
    PluralizePipe,
    SeparateGenresPipe,
    JoinStringsPipe,
    FixCategoriesPipe,
    ToLocaleStringPipe,
    AbbreviateNumbersPipe,
    SafeHtmlPipe,
    TruncatePipe,
    LocaleDatePipe,
    DisplayTagsPipe
];

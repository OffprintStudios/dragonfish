import { Validators } from '@angular/forms';

export class ContentConstants {
    public static VAL_MIN_TEXT_LENGTH = Validators.minLength(3);
    public static VAL_MAX_TITLE_LENGTH = Validators.maxLength(100);
    public static VAL_MAX_DESC_LENGTH = Validators.maxLength(250);

    public static MIN_GENRES = 1;
    public static VAL_MIN_GENRES = Validators.minLength(ContentConstants.MIN_GENRES);
    public static MAX_GENRES = 3;
    public static VAL_MAX_GENRES = Validators.maxLength(ContentConstants.MAX_GENRES);

    public static MAX_TAGS = 5;
    public static VAL_MAX_TAGS = Validators.maxLength(ContentConstants.MAX_TAGS);
}
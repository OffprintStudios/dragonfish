export enum ReportReason {
    /* General Reasons */
    AttackingAnotherUser = 'Attacking Another User',
    RacismDiscrimination = 'Racism/Discrimination',
    Spam = 'Spam',
    NSFWContent = 'NSFW Content',
    Other = 'Other',

    /* User-specific */
    BotAccount = 'Bot Account',
    BanEvasion = 'Ban Evasion',

    /* Content-specific */
    NSFWArt = 'NSFW Art',
    IncorrectContentRating = 'Incorrect Content Rating',
    Plagiarism = 'Plagiarism',
    IncorrectTags = 'Incorrect Tags',
}

export enum GeneralReportReason {
    AttackingAnotherUser = 'Attacking Another User',
    RacismDiscrimination = 'Racism/Discrimination',
    Spam = 'Spam',
    NSFWContent = 'NSFW Content',
    Other = 'Other',
}

export enum UserReportReason {
    BotAccount = 'Bot Account',
    BanEvasion = 'Ban Evasion',
}

export enum ContentReportReason {
    NSFWArt = 'NSFW Art',
    IncorrectContentRating = 'Incorrect Content Rating',
    Plagiarism = 'Plagiarism',
    IncorrectTags = 'Incorrect Tags',
    OtherViolation = 'Other Violation',
}

export type ReportReason = GeneralReportReason | UserReportReason | ContentReportReason;

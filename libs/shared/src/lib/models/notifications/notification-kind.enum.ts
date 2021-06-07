export enum NotificationKind {
    // For posting new content (watchers/watching)
    ContentNotification = 'ContentNotification',

    // For new sections getting added (collections)
    SectionNotification = 'SectionNotification',

    // For comments posted on content (for authors)
    NewCommentNotification = 'NewCommentNotification',

    // For replies to someone's comment
    ReplyCommentNotification = 'ReplyCommentNotification',
}

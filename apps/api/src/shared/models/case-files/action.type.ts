export enum ActionType {
    // No Action Taken
    None = 'None',

    // Item was marked Hidden By Default (applicable only to comments)
    Hidden = 'Hidden',

    // Item was removed
    Removed = 'Removed',

    // Item was issued a warning
    Warning = 'Warning',

    // Item was issued/resulted in a temporary ban
    TemporaryBan = 'Temporary Ban',

    // Item was issued/resulted in a permanent ban
    PermanentBan = 'Permanent Ban',
}

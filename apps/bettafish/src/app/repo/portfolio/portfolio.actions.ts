export class FetchCurrentPortfolio {
    static readonly type = '[Portfolio] Fetch Current Portfolio';
    constructor(public userId: string) {}
}

export class WatchUser {
    static readonly type = '[Portfolio] Watch User';
}

export class AddFriend {
    static readonly type = '[Portfolio] Add Friend';
}

export class SendMessage {
    static readonly type = '[Portfolio] Send Message';
}

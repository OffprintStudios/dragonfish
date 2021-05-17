export interface CreateFandomTag {
    readonly name: string;
    readonly desc: string;
    readonly parent: string;
    readonly children: string[];
}
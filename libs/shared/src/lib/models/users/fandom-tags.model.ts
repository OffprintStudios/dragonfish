export interface FandomTags {
    _id: string;
    name: string;
    desc: string;
    parent: {
        _id: string;
        name: string;
    };
    children: [{
        _id: string;
        name: string;
    }];
}